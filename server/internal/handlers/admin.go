package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/Sourav01112/server/internal/config"
	"github.com/Sourav01112/server/internal/models"
	"github.com/Sourav01112/server/internal/utils"
	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Register_employee(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	if user.Role != "admin" {
		utils.ErrorResponse(c, http.StatusForbidden, "Access denied")
		return
	}

	var req struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
		Name     string `json:"name" binding:"required"`
		Role     string `json:"role" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request")
		return
	}

	var existingUser models.User
	err := config.DB.Collection("users").FindOne(context.TODO(), bson.M{"email": req.Email}).Decode(&existingUser)

	if err == nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "User already exists")
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	newUser := models.User{
		Email:     req.Email,
		Password:  string(hashedPassword),
		Name:      req.Name,
		Role:      req.Role,
		CreatedAt: time.Now(),
	}

	_, err = config.DB.Collection("users").InsertOne(context.TODO(), newUser)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create user")
		return
	}

	utils.SuccessResponse(c, gin.H{"message": "Employee registered successfully"})
}

func Get_team_attendance(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	if user.Role != "admin" {
		utils.ErrorResponse(c, http.StatusForbidden, "Access denied")
		return
	}

	opts := options.Find().SetSort(bson.D{{Key: "date", Value: -1}})
	cursor, err := config.DB.Collection("attendance").Find(context.TODO(), bson.M{}, opts)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch attendance")
		return
	}
	defer cursor.Close(context.TODO())

	var attendances []models.Attendance
	if err = cursor.All(context.TODO(), &attendances); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to decode attendance")
		return
	}

	utils.SuccessResponse(c, attendances)
}

func Get_pending_corrections(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	if user.Role != "admin" {
		utils.ErrorResponse(c, http.StatusForbidden, "Access denied")
		return
	}

	cursor, err := config.DB.Collection("corrections").Find(context.TODO(), bson.M{"status": "pending"})
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch corrections")
		return
	}
	defer cursor.Close(context.TODO())

	var corrections []models.Correction
	if err = cursor.All(context.TODO(), &corrections); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to decode corrections")
		return
	}

	utils.SuccessResponse(c, corrections)
}

func Approve_correction(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	if user.Role != "admin" {
		utils.ErrorResponse(c, http.StatusForbidden, "Access denied")
		return
	}

	correctionID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid correction ID")
		return
	}

	var correction models.Correction
	err = config.DB.Collection("corrections").FindOne(context.TODO(), bson.M{"_id": correctionID}).Decode(&correction)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Correction not found")
		return
	}

	if correction.Status != "pending" {
		utils.ErrorResponse(c, http.StatusBadRequest, "Correction already processed")
		return
	}

	now := time.Now()

	_, err = config.DB.Collection("corrections").UpdateOne(
		context.TODO(),
		bson.M{"_id": correctionID},
		bson.M{"$set": bson.M{
			"status":      "approved",
			"reviewed_at": &now,
			"reviewed_by": &user.ID,
		}},
	)

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to approve correction")
		return
	}

	updateFields := bson.M{
		"updated_at": now,
		"status":     "valid",
	}

	if correction.RequestedCheckIn != nil {
		updateFields["check_in"] = correction.RequestedCheckIn
	}
	if correction.RequestedCheckOut != nil {
		updateFields["check_out"] = correction.RequestedCheckOut
	}

	// will be checking here if both times are present, if yes, then add up and push to new attendance time, employee will see new added up date
	if correction.RequestedCheckIn != nil && correction.RequestedCheckOut != nil {
		totalHours := correction.RequestedCheckOut.Sub(*correction.RequestedCheckIn).Hours()
		updateFields["total_hours"] = totalHours
	}

	_, err = config.DB.Collection("attendance").UpdateOne(
		context.TODO(),
		bson.M{"_id": correction.AttendanceID},
		bson.M{"$set": updateFields},
	)

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update attendance")
		return
	}

	utils.SuccessResponse(c, gin.H{"message": "Correction approved successfully"})
}

func Reject_correction(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	if user.Role != "admin" {
		utils.ErrorResponse(c, http.StatusForbidden, "Access denied")
		return
	}

	correctionID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid correction ID")
		return
	}

	var reqBody struct {
		Comments string `json:"comments" binding:"required"`
	}

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Comments are required for rejection")
		return
	}

	var correction models.Correction

	err = config.DB.Collection("corrections").FindOne(context.TODO(), bson.M{"_id": correctionID}).Decode(&correction)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Correction not found")
		return
	}

	if correction.Status != "pending" {
		utils.ErrorResponse(c, http.StatusBadRequest, "Correction already processed")
		return
	}

	now := time.Now()

	_, err = config.DB.Collection("corrections").UpdateOne(
		context.TODO(),
		bson.M{"_id": correctionID},
		bson.M{"$set": bson.M{
			"status":      "rejected",
			"comments":    reqBody.Comments,
			"reviewed_at": &now,
			"reviewed_by": &user.ID,
		}},
	)

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to reject correction")
		return
	}

	utils.SuccessResponse(c, gin.H{"message": "Correction rejected successfully"})
}
