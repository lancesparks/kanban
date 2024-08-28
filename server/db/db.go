package db

import (
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
)

var db *gorm.DB
var err error

type Board struct {
   gorm.Model
   Name    string `json:"name"`
   Tasks    []Task `gorm:"foreignkey:BoardID"`
}


type Task struct {
   gorm.Model
   BoardID      uint `json:"boardId"`
   Title        string `json:"title"`
   Description  string `json:"description"`
   Status 		string `json:"status"`
   Subtasks []*Subtask `gorm:"foreignkey:TaskID" json:"subtasks"`
}

type Subtask struct {
   gorm.Model
   TaskID 		uint `json:"taskId"`
   Title        string `json:"title"`
   IsCompleted  bool `json:"isCompleted"`
}





func InitPostgresDB() {
	   err = godotenv.Load(".env")
   if err != nil {
       log.Fatal("Error loading .env file", err)
   }
   var (
       host     = os.Getenv("DB_HOST")
       port     = os.Getenv("DB_PORT")
       dbUser   = os.Getenv("DB_USER")
       dbName   = os.Getenv("DB_NAME")
       password = os.Getenv("DB_PASSWORD")
   )
   dsn := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable",
       host,
       port,
       dbUser,
       dbName,
       password,
   )
 
   db, err = gorm.Open("postgres", dsn)
   if err != nil {
       log.Fatal(err)
   }
   db.AutoMigrate(Board{}, Task{}, Subtask{})
}


func GetBoards() ([]*Board, error) {
   var board []*Board
   res := db.Find(&board)
   if res.Error != nil {
       return nil, errors.New("no boards found")
   }

   return board, nil
}

func GetTasks(BoardID any) ([]*Task, error) {
    var tasks []*Task
    db.Where("board_id = ?", BoardID).Preload("Subtasks").Find(&tasks)

    return tasks, nil
}



func CreateBoard(board *Board) (*Board, error) {
   res := db.Create(&board)
   if res.Error != nil {
       return nil, errors.New("no boards found")
   }
   return board, nil
}




func CreateTask(task *Task) (*Task, error) {
   res := db.Create(&task)
   if res.Error != nil {
       return nil, errors.New("no tasks found")
   }
   return task, nil
}

func GetTask(id string) (*Task, error) {
  var task Task
  res := db.First(&task, "id = ?", id)
  if res.RowsAffected == 0 {
    return nil, fmt.Errorf(fmt.Sprintf("task of id %s not found", id))
  }
 return &task, nil
}

func UpdateTask(task *Task) (*Task, error) {
   var taskToUpdate Task
   result := db.Model(&taskToUpdate).Where("id = ?", task.ID).Updates(task)
   if result.RowsAffected == 0 {
       return &taskToUpdate, errors.New("subtask not updated")
   }
   return task, nil
}


func UpdateSubTask(subtask *Subtask) (*[]Subtask, error) {
    var subtaskToUpdate Subtask
    result := db.Model(&subtaskToUpdate).Where("id = ?", subtask.ID).Update("IsCompleted", subtask.IsCompleted)
    if result.RowsAffected == 0 {
        return nil, errors.New("subtask not updated")
    }

    var subtasks []Subtask
    db.Model(&subtaskToUpdate).Where("task_id = ?", subtask.TaskID).Find(&subtasks)
    return &subtasks, nil
}
func DeleteTask(id *string) error {
   var taskToDelete Task
   result := db.Where("id = ?", id).Delete(&taskToDelete)
   if result.RowsAffected == 0 {
       return errors.New("task not deleted")
   }
   return nil
}


func CreateSubtask(subtask *Subtask) (*Subtask, error)  {
   res := db.Create(&subtask)
   if res.Error != nil {
       return nil, res.Error
   }
   return subtask, nil
}


func GetSubTask(id string) (*Subtask, error) {
  var subtask Subtask
  res := db.First(&subtask, "id = ?", id)
  if res.RowsAffected == 0 {
    return nil, fmt.Errorf(fmt.Sprintf("subtask of id %s not found", id))
  }
 return &subtask, nil
}


func DeleteSubTask(id *string) error {
   var subtaskToDelete Subtask
   result := db.Where("id = ?", id).Delete(&subtaskToDelete)
   if result.RowsAffected == 0 {
       return errors.New("subtask not deleted")
   }
   return nil
}
