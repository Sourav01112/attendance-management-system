package services

import (
	"context"
	"log"
	"time"

	"github.com/Sourav01112/server/internal/config"

	"github.com/robfig/cron/v3"
	"go.mongodb.org/mongo-driver/bson"
)

func StartScheduler() {
	c := cron.New()

	// c.AddFunc("0 * * * *", checkInvalidEntries)
	c.AddFunc("*/1 * * * *", checkInvalidEntries)

	c.Start()
	log.Println("Scheduler will run every hr")
}

func checkInvalidEntries() {
	log.Println("Checking>>>...")

	twelveHoursAgo := time.Now().Add(-12 * time.Hour)

	filter := bson.M{
		"status":    "pending",
		"check_in":  bson.M{"$lt": twelveHoursAgo},
		"check_out": nil,
	}

	update := bson.M{
		"$set": bson.M{
			"status":     "invalid",
			"updated_at": time.Now(),
		},
	}

	result, err := config.DB.Collection("attendance").UpdateMany(context.TODO(), filter, update)
	if err != nil {
		log.Printf("Error updating entries: %v", err)
		return
	}

	if result.ModifiedCount > 0 {
		log.Printf("Marked %d entries invalid", result.ModifiedCount)
	}
}
