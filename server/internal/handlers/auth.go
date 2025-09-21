package handlers

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/Sourav01112/server/internal/config"
	"github.com/Sourav01112/server/internal/models"
	"github.com/Sourav01112/server/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

func Login(c *gin.Context) {

	// ---------------- one time admin pass -------------
	// password := "password123"
	// 	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	// 	if err != nil {
	// 		fmt.Println("something wrong", err)
	// 	}
	// 	fmt.Printf("Password", password)
	// 	fmt.Printf("Hash: %s\n", string(hash))

	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request")
		return
	}

	fmt.Println("reqqq", req)

	var user models.User
	err := config.DB.Collection("users").FindOne(context.TODO(), bson.M{"email": req.Email}).Decode(&user)
	if err != nil {
		fmt.Println("two")

		utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		fmt.Println("three")

		utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID.Hex(),
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	utils.SuccessResponse(c, models.LoginResponse{
		Token: tokenString,
		User:  user,
	})
}
