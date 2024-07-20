FROM golang:1.22.3

WORKDIR /app

COPY . .


RUN go mod tidy
RUN go build main.go

EXPOSE 8080

CMD ["./main"]