package main

import (
	"kanban.com/kanban-app/db"
	"kanban.com/kanban-app/router"
)
 
func main() {
   db.InitPostgresDB()
   router.InitRouter().Run()
}
