package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Location struct {
	Latitude  float64 `bson:"latitude" json:"latitude"`
	Longitude float64 `bson:"longitude" json:"longitude"`
}

type Attendance struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID      primitive.ObjectID `bson:"user_id" json:"user_id"`
	Date        string             `bson:"date" json:"date"`
	CheckIn     *time.Time         `bson:"check_in" json:"check_in"`
	CheckOut    *time.Time         `bson:"check_out" json:"check_out"`
	CheckInLoc  *Location          `bson:"check_in_location" json:"check_in_location"`
	CheckOutLoc *Location          `bson:"check_out_location" json:"check_out_location"`
	TotalHours  float64            `bson:"total_hours" json:"total_hours"`
	Status      string             `bson:"status" json:"status"` // ---------------- valid-invalid-pending
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updated_at"`
}

type CheckInRequest struct {
	Location Location `json:"location" binding:"required"`
}

type CheckOutRequest struct {
	Location Location `json:"location" binding:"required"`
}
