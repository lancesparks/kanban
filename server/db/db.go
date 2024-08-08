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
   Epics       []Epic `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type Epic struct {
   gorm.Model
   BoardID     uint
   Name        string `json:"name"`
   Columns 	   []Story  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type Story struct {
   gorm.Model
   EpicID 	    uint
   Name        string `json:"name"`
   Tasks  	   []Task `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type Task struct {
   gorm.Model
   StoryID  	uint
   Title        string `json:"title"`
   Description  string `json:"description"`
   Status 		string `json:"status"`
   Subtask 		[]Subtask `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type Subtask struct {
   gorm.Model
   TaskID 		 uint
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
   db.AutoMigrate(Board{},Epic{}, Story{}, Task{}, Subtask{})
}


func GetBoards() ([]*Board, error) {
   var board []*Board
   res := db.Find(&board)
   if res.Error != nil {
       return nil, errors.New("no boards found")
   }
   return board, nil
}


func CreateBoard(board *Board) (*Board, error) {
   res := db.Create(&board)
   if res.Error != nil {
       return nil, errors.New("no boards found")
   }
   return board, nil
}

func CreateEpic(epic *Epic)(*Epic, error){
	res := db.Create(&epic)
   if res.Error != nil {
       return nil, errors.New("no epics found")
   }
   return epic, nil
}


func CreateStory(story *Story)(*Story, error){
	res := db.Create(&story)
   if res.Error != nil {
       return nil, errors.New("no stories found")
   }
   return story, nil
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

func UpdateSubTask(subtask *Subtask) (*Subtask, error) {
   var subtaskToUpdate Subtask
   result := db.Model(&subtaskToUpdate).Where("id = ?", subtask.ID).Updates(subtask)
   if result.RowsAffected == 0 {
       return &subtaskToUpdate, errors.New("subtask not updated")
   }
   return subtask, nil
}


func DeleteSubTask(id *string) error {
   var subtaskToDelete Subtask
   result := db.Where("id = ?", id).Delete(&subtaskToDelete)
   if result.RowsAffected == 0 {
       return errors.New("subtask not deleted")
   }
   return nil
}
