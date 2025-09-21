package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Correction struct {
	ID                primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	AttendanceID      primitive.ObjectID  `bson:"attendance_id" json:"attendance_id"`
	UserID            primitive.ObjectID  `bson:"user_id" json:"user_id"`
	RequestedCheckIn  *time.Time          `bson:"requested_check_in" json:"requested_check_in"`
	RequestedCheckOut *time.Time          `bson:"requested_check_out" json:"requested_check_out"`
	Reason            string              `bson:"reason" json:"reason"`
	Status            string              `bson:"status" json:"status"` // ---------------- pending-approved-rejected
	CreatedAt         time.Time           `bson:"created_at" json:"created_at"`
	ExpiresAt         time.Time           `bson:"expires_at" json:"expires_at"`
	ReviewedAt        *time.Time          `bson:"reviewed_at" json:"reviewed_at"`
	ReviewedBy        *primitive.ObjectID `bson:"reviewed_by" json:"reviewed_by"`
}

type CorrectionRequest struct {
	AttendanceID      string     `json:"attendance_id" binding:"required"`
	RequestedCheckIn  *time.Time `json:"requested_check_in"`
	RequestedCheckOut *time.Time `json:"requested_check_out"`
	Reason            string     `json:"reason" binding:"required"`
}
