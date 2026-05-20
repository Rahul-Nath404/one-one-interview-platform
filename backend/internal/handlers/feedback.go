package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"interviewos/internal/db"
	"interviewos/internal/models"
)

type SubmitFeedbackRequest struct {
	Rating  int    `json:"rating"`
	Comment string `json:"comment"`
}

// SubmitFeedback creates or updates feedback for an interview
func SubmitFeedback(c *fiber.Ctx) error {
	interviewId := c.Params("id")
	claims := c.Locals("user").(map[string]interface{})
	userId := claims["id"].(string)

	// Verify interview exists and user is authorized (host/interviewer of interview)
	var interview models.Interview
	if err := db.DB.First(&interview, "id = ?", interviewId).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "interview not found",
		})
	}

	if interview.HostID != userId {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "not authorized to submit feedback for this interview",
		})
	}

	var req SubmitFeedbackRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid request body",
		})
	}

	if req.Rating < 1 || req.Rating > 5 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "rating must be between 1 and 5",
		})
	}

	// Check if feedback already exists
	var feedback models.Feedback
	err := db.DB.Where("interview_id = ?", interviewId).First(&feedback).Error
	if err == nil {
		// Update existing
		feedback.Rating = req.Rating
		feedback.Comment = req.Comment
		if err := db.DB.Save(&feedback).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "failed to update feedback",
			})
		}
	} else {
		// Create new
		feedback = models.Feedback{
			ID:          uuid.New().String(),
			InterviewID: interviewId,
			Rating:      req.Rating,
			Comment:     req.Comment,
		}
		if err := db.DB.Create(&feedback).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "failed to create feedback",
			})
		}
	}

	return c.JSON(feedback)
}

// GetFeedback retrieves feedback for an interview
func GetFeedback(c *fiber.Ctx) error {
	interviewId := c.Params("id")
	claims := c.Locals("user").(map[string]interface{})
	userId := claims["id"].(string)

	// Verify interview exists and user has access
	var interview models.Interview
	if err := db.DB.First(&interview, "id = ?", interviewId).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "interview not found",
		})
	}

	if interview.HostID != userId && interview.CandidateID != userId {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "not authorized to view feedback for this interview",
		})
	}

	// In typical setups, candidates shouldn't see raw feedback/notes unless they are shared.
	// But let's check roles: if applicant role is candidate, restrict details if required.
	// We'll allow it for now or check if it's host.
	if claims["role"].(string) == "candidate" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "candidates cannot access interviewer feedback",
		})
	}

	var feedback models.Feedback
	if err := db.DB.Where("interview_id = ?", interviewId).First(&feedback).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "feedback not found",
		})
	}

	return c.JSON(feedback)
}
