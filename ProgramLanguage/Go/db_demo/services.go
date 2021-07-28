package main

import (
	"database/sql"
	"log"
)

func (a *app) createTable() {
	statement, _ := db.Prepare(`CREATE TABLE IF NOT EXISTS App
		(Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		Name TEXT,
		Status INTEGER,
		[Order] INTEGER)
	`)
	statement.Exec()
}

func (a *app) Insert() (err error) {
	statement, _ := db.Prepare(`INSERT INTO App
		(Name, Status, [Order])
		VALUES
		(?,?,?)
	`)
	_, err = statement.Exec(a.name, a.status, a.order)
	if err != nil {
		log.Fatalln(err.Error())
	}
	return
}

func (a *app) Update() (err error) {
	// 执行 sql 可以通过下面两种方式来做："=@xxx" 或 "=?"
	statement, _ := db.Prepare(`UPDATE App SET Name=@Name, Status=@Status, [Order]=@Order WHERE Id=@Id`)
	_, err = statement.Exec(sql.Named("Name", a.name), sql.Named("Status", a.status), sql.Named("Order", a.order), sql.Named("Id", a.id))
	// statement, _ := db.Prepare(`UPDATE app SET Name=?, Status=?, [Order]=? WHERE Id=?`)
	// _, err = statement.Exec(a.name, a.status, a.order, a.id)
	if err != nil {
		log.Fatalln(err.Error())
	}
	return
}

func (a *app) Delete() (err error) {
	statement, _ := db.Prepare(`DELETE FROM App WHERE Id=?`)
	_, err = statement.Exec(a.id)
	if err != nil {
		log.Fatalln(err.Error())
	}
	return
}

func getOne(id int) (a app, err error) {
	a = app{}
	err = db.QueryRow("SELECT Id, Name, Status, [Order] FROM App WHERE Id=?", id).Scan(
		&a.id, &a.name, &a.status, &a.order)
	if err != nil {
		log.Fatalln(err.Error())
	}
	return
}

func getMany(id int) (apps []app, err error) {
	rows, err := db.Query("SELECT Id, Name, Status, [Order] FROM App WHERE Id>?", id)
	for rows.Next() {
		a := app{}
		err = rows.Scan(&a.id, &a.name, &a.status, &a.order)
		if err != nil {
			log.Fatalln(err.Error())
		}
		apps = append(apps, a)
	}
	return
}
