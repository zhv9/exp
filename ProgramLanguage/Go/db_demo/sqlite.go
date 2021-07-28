package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

const (
	file  = ":memory:"
	cache = "shared"
	mode  = "memory"
)

var db *sql.DB

func SqliteDb() *sql.DB {
	connStr := fmt.Sprintf("file:%s?cache=%s&mode=%s",
		file, cache, mode)
	var err error
	db, err = sql.Open("sqlite3", connStr)
	if err != nil {
		log.Fatalln(err.Error())
	}
	return db
}

func GetSqliteDb() *sql.DB {
	if db != nil {
		return db
	}
	return SqliteDb()
}
