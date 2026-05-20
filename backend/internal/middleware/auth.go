package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"interviewos/internal/utils"
)

func AuthMiddleware(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "missing authorization header",
		})
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "invalid authorization header",
		})
	}

	token := parts[1]
	claims, err := utils.VerifyToken(token)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "invalid token",
		})
	}

	c.Locals("user", map[string]interface{}(claims))
	return c.Next()
}

func CORSMiddleware(c *fiber.Ctx) error {
	c.Set("Access-Control-Allow-Origin", "*")
	c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if c.Method() == "OPTIONS" {
		return c.SendStatus(fiber.StatusOK)
	}

	return c.Next()
}
