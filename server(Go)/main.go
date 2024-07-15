package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)


var collection *mongo.Collection

// mongoDB initialization
func init() {
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

	fmt.Print("Connection Success\n")

	collection = client.Database("audiX").Collection("audi")
	fmt.Print("Instance is Ready\n")
}

type Audi struct {
	Name string `json:"name"`
	Email string `json:"email"`
	ImageUrl string `json:"imageUrl"`
	Audio string `json:"audio"`
}


func main(){
	err := godotenv.Load(".env.local")
	if err != nil{
		log.Fatal("ERROr")
	}

	// gin app setup
	r := gin.Default()

	// Apply CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"POST", "GET", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
	r.MaxMultipartMemory = 8 << 20

	//s3 Uploader setup
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Printf("error: %v", err)
	return
	}
	client := s3.NewFromConfig(cfg)
	uploader := manager.NewUploader(client)


//------------------ Routes -----------------------------------------------
	r.GET("/", func(c *gin.Context){
		c.JSON(http.StatusOK, gin.H{
			"update":"WOrking",
		})
	})

	r.POST("/upload", func(c *gin.Context){
		name := c.PostForm("name")
		if name == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Name is not there",
			})
			return
		}

		email := c.PostForm("email")
		if email == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "email is not there",
			})
			return
		}

		imageUrl := c.PostForm("imageUrl")
		if imageUrl == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "image is not there",
			})
			return
		}



		//---------get the file------------------
		file, err:= c.FormFile("audio")
		if err != nil {
			c.JSON(http.StatusOK, gin.H{
				"error":"Failed to get the audio",
			})
			return
		} 

		//----------save the file---------------
		// save to s3-- (open file)
		f, openErr := file.Open() 
		if openErr != nil {
			c.JSON(http.StatusOK, gin.H{
				"error":"Failed to open audio file",
			})
			return
		} 

		//--------- upload file -----------------
		result, UploadErr := uploader.Upload(context.TODO(), &s3.PutObjectInput{
			Bucket: aws.String("go-file"),
			Key:    aws.String(file.Filename),
			Body:   f,
			ACL: "public-read",
		})
		if UploadErr != nil {
			c.JSON(http.StatusOK, gin.H{
				"error":"Failed to Upload audio",
			})
			return
		} 


		audi := Audi{
			Name:  name,
			Email: email,
			ImageUrl: imageUrl,
			Audio: result.Location,
		}
		addOneAudi(audi)


		//--------- render  the file --------------
		c.JSON(http.StatusOK, gin.H{
			"name" : name,
			"email" : email,
			"imageUrl": imageUrl,
			"audio": result.Location,
		})
	})

	r.Run()
}

func addOneAudi(audi Audi) {
	added, err := collection.InsertOne(context.Background(), audi)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Added audi with id:", added.InsertedID)
}