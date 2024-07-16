// model/model.go
package model

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Audi struct {
	ID primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	ImageUrl string `json:"imageUrl"`
	Audio    string `json:"audio"`
}

type Ccmt struct{
	Cmt string `json:"cmt"`
	Image string `json:"image"`
	Name string `json:"name"`
	AudiId string `json:"audiId"`
}


// MongoDB initialization
var Collection *mongo.Collection
var Collection2 *mongo.Collection


func InitDB() {
	err := godotenv.Load(".env.local")
	if err != nil {
		log.Fatalf("Error loading .env file")
	}
	Link := os.Getenv("Link")
	fmt.Println(Link)

	clientOption := options.Client().ApplyURI(Link)

	client, err := mongo.Connect(context.TODO(), clientOption)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connection Success")

	Collection = client.Database("audiX").Collection("audi")
	Collection2 = client.Database("audiX").Collection("cmts")

	fmt.Println("Instance is Ready")
}




// Initialize the S3 uploader
var Uploader *manager.Uploader

func InitUploader() {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatalf("error: %v", err)
	}
	client := s3.NewFromConfig(cfg)
	Uploader = manager.NewUploader(client)
}