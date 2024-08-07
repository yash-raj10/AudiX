// main.go
package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	controller "github.com/yash-raj10/AudiX-Backend/controllers"
	model "github.com/yash-raj10/AudiX-Backend/models"
)

func main() {
	// err := godotenv.Load(".env.local")
	// if err != nil {
	// 	log.Fatal("Error loading .env file in main")
	// }

	// Initialize the database
	model.InitDB()

	// Initialize the S3 uploader
	model.InitUploader()

	// Gin app setup
	r := gin.Default()

	// Apply CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://audi-x.vercel.app"},
		AllowMethods:     []string{"POST", "GET", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
	r.MaxMultipartMemory = 8 << 20

	// Routes
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"update": "Working",
		})
	})
	r.POST("/upload", controller.UploadHandler)
	r.GET("/getAudis", controller.GetAudis)
	r.POST("/cmt", controller.CreateCmt)
	r.GET("/cmts/:id", controller.GetCmts)

	// Run the server
	r.Run()
}
