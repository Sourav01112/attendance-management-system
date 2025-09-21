package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/Sourav01112/server/internal/config"
	"github.com/Sourav01112/server/internal/models"
	"github.com/Sourav01112/server/internal/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Check_In(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var req models.CheckInRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request")
		return
	}

	today := time.Now().Format("2006-01-02")

	// ------- if already in today
	var existingAttendance models.Attendance
	err := config.DB.Collection("attendance").FindOne(context.TODO(), bson.M{
		"user_id": user.ID,
		"date":    today,
	}).Decode(&existingAttendance)

	if err == nil && existingAttendance.CheckIn != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Already checked in today")
		return
	}

	now := time.Now()
	attendance := models.Attendance{
		UserID:     user.ID,
		Date:       today,
		CheckIn:    &now,
		CheckInLoc: &req.Location,
		Status:     "pending",
		CreatedAt:  now,
		UpdatedAt:  now,
	}

	if err == nil {
		_, err = config.DB.Collection("attendance").UpdateOne(
			context.TODO(),
			bson.M{"_id": existingAttendance.ID},
			bson.M{"$set": bson.M{
				"check_in":          attendance.CheckIn,
				"check_in_location": attendance.CheckInLoc,
				"status":            "pending",
				"updated_at":        now,
			}},
		)
	} else {
		_, err = config.DB.Collection("attendance").InsertOne(context.TODO(), attendance)
	}

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to record check-in")
		return
	}

	utils.SuccessResponse(c, gin.H{"message": "Check-in recorded successfully"})
}

func Check_out(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var req models.CheckOutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request")
		return
	}

	today := time.Now().Format("2006-01-02")

	var attendance models.Attendance
	err := config.DB.Collection("attendance").FindOne(context.TODO(), bson.M{
		"user_id": user.ID,
		"date":    today,
	}).Decode(&attendance)

	if err != nil || attendance.CheckIn == nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "No active check-in found")
		return
	}

	if attendance.CheckOut != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Already checked out today")
		return
	}

	now := time.Now()
	totalHours := now.Sub(*attendance.CheckIn).Hours()

	_, err = config.DB.Collection("attendance").UpdateOne(
		context.TODO(),
		bson.M{"_id": attendance.ID},
		bson.M{"$set": bson.M{
			"check_out":          &now,
			"check_out_location": &req.Location,
			"total_hours":        totalHours,
			"status":             "valid",
			"updated_at":         now,
		}},
	)

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to record check-out")
		return
	}

	utils.SuccessResponse(c, gin.H{"message": "Check-out recorded successfully"})
}

func Get_individual_attendance(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	opts := options.Find().SetSort(bson.D{{Key: "date", Value: -1}})
	cursor, err := config.DB.Collection("attendance").Find(context.TODO(), bson.M{"user_id": user.ID}, opts)
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

func Request_correction(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var req models.CorrectionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request")
		return
	}

	attendanceID, err := primitive.ObjectIDFromHex(req.AttendanceID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid attendance ID")
		return
	}

	// ----------- attendance exists and maps to user ~ valid user with valid attendance
	var attendance models.Attendance
	err = config.DB.Collection("attendance").FindOne(context.TODO(), bson.M{
		"_id":     attendanceID,
		"user_id": user.ID,
	}).Decode(&attendance)

	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Attendance record not found")
		return
	}

	var existingCorrection models.Correction
	err = config.DB.Collection("corrections").FindOne(context.TODO(), bson.M{
		"attendance_id": attendanceID,
		"status":        "pending",
	}).Decode(&existingCorrection)

	if err == nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Correction request already pending")
		return
	}

	now := time.Now()

	// ------- as per requirement from sheet...the correction window will be time bound, take 48hr, later change
	correction := models.Correction{
		AttendanceID:      attendanceID,
		UserID:            user.ID,
		RequestedCheckIn:  req.RequestedCheckIn,
		RequestedCheckOut: req.RequestedCheckOut,
		Reason:            req.Reason,
		Status:            "pending",
		CreatedAt:         now,
		ExpiresAt:         now.Add(48 * time.Hour),
	}

	_, err = config.DB.Collection("corrections").InsertOne(context.TODO(), correction)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create correction request")
		return
	}

	utils.SuccessResponse(c, gin.H{"message": "Correction request submitted successfully"})
}
