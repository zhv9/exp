package main

import (
	"context"
	"fmt"
	"log"
)

func checkConnection() {
	db := SqliteDb()
	ctx := context.Background()
	err := db.PingContext(ctx)
	if err != nil {
		log.Fatalln(err.Error())
	}
	fmt.Println("Connected!")
}

func tableCrud() {
	first := app{name: "first", status: 1, order: 2}
	second := app{name: "second", status: 3, order: 4}

	first.createTable()
	first.Insert()
	result, _ := getOne(1)
	fmt.Println("First result: ", result)

	second.Insert()
	result, _ = getOne(2)
	fmt.Println("Second result: ", result)

	result.name = result.name + " plus"
	result.Update()

	results, _ := getMany(0)
	fmt.Println("All updated result: ", results)
}

func main() {
	checkConnection()
	tableCrud()
}
