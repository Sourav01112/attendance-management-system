package main

import (
	"log"
	"os"

	"github.com/Sourav01112/server/internal/config"
	"github.com/Sourav01112/server/internal/handlers"
	"github.com/Sourav01112/server/internal/middleware"
	"github.com/Sourav01112/server/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// ********** change here the config as per Docker deployment, make sure to finish this by Monday Afternoon ***********

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println(".env not present")
	}

	config.InitDatabase()

	services.StartScheduler()

	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Public --------------
	auth := r.Group("/api/auth")
	{
		// managing here both logins of admin and employee
		auth.POST("/login", handlers.Login)
	}

	// Protected --------------------
	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())
	{
		api.POST("/checkin", handlers.Check_In)
		api.POST("/checkout", handlers.Check_out)
		api.GET("/attendance", handlers.Get_individual_attendance)
		api.POST("/correction", handlers.Request_correction)

		api.POST("/register-employee", handlers.Register_employee)
		api.GET("/team-attendance", handlers.Get_team_attendance)
		api.GET("/pending-corrections", handlers.Get_pending_corrections)
		api.PUT("/correction/:id/approve", handlers.Approve_correction)
		api.PUT("/correction/:id/reject", handlers.Reject_correction)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8010"
	}

	log.Printf("Server starting on port %s", port)
	r.Run(":" + port)
}
