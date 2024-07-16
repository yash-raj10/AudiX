package controller

import (
	"context"
	"fmt"
	"net/http"

	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
	model "github.com/yash-raj10/AudiX-Backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)



func UploadHandler(c *gin.Context) {
	name := c.PostForm("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Name is not provided",
		})
		return
	}

	email := c.PostForm("email")
	if email == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Email is not provided",
		})
		return
	}

	imageUrl := c.PostForm("imageUrl")
	if imageUrl == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Image URL is not provided",
		})
		return
	}

	// Get the file
	file, err := c.FormFile("audio")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"error": "Failed to get the audio",
		})
		return
	}

	// Open the file
	f, openErr := file.Open()
	if openErr != nil {
		c.JSON(http.StatusOK, gin.H{
			"error": "Failed to open audio file",
		})
		return
	}

	// Upload the file
	result, uploadErr := model.Uploader.Upload(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String("go-file"),
		Key:    aws.String(file.Filename),
		Body:   f,
		ACL:    "public-read",
	})
	if uploadErr != nil {
		c.JSON(http.StatusOK, gin.H{
			"error": "Failed to upload audio",
		})
		return
	}

	audi := model.Audi{
		Name:     name,
		Email:    email,
		ImageUrl: imageUrl,
		Audio:    result.Location,
	}
	InsertedID := addOneAudi(audi)

	// Render the response
	c.JSON(http.StatusOK, gin.H{
		"_id":  InsertedID,
		"name":     name,
		"email":    email,
		"imageUrl": imageUrl,
		"audio":    result.Location,
	})
}

func addOneAudi(audi model.Audi) string {
	added, err := model.Collection.InsertOne(context.Background(), audi)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Added audi with id:", added.InsertedID)
	id := added.InsertedID.(primitive.ObjectID).Hex()
	
	return  id
}


func GetAudis(c *gin.Context) {
	var audis []model.Audi

	cursor, err := model.Collection.Find(context.Background(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching users"})
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var audi model.Audi
		if err := cursor.Decode(&audi); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding user"})
			return
		}
		audis = append(audis, audi)
	}

	if err := cursor.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cursor error"})
		return
	}

	c.JSON(http.StatusOK, audis)
}

func CreateCmt(c *gin.Context){
	var ccmt model.Ccmt

	if err := c.ShouldBindJSON(&ccmt); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	addOneCmt(ccmt)

	c.JSON(http.StatusOK, ccmt )
}

func addOneCmt(ccmt model.Ccmt){
	added, err := model.Collection2.InsertOne(context.Background(), ccmt)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Added comment with id:", added.InsertedID)
}


func GetCmts( c *gin.Context){
	 id := c.Param("id")
	
	 var cmts []model.Ccmt

	cursor, err := model.Collection2.Find(context.Background(), bson.M{"audiid" : id})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching users"})
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var cmt model.Ccmt
		if err := cursor.Decode(&cmt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding user"})
			return
		}
		cmts = append(cmts, cmt)
	}

	if err := cursor.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cursor error"})
		return
	}

	c.JSON(http.StatusOK, cmts)
}