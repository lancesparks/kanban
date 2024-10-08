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
    Columns []Column `json:"columns" gorm:"foreignKey:BoardID"`
}

type Column struct {
   gorm.Model
   Title string `json:"title"`
   Tasks []Task `json:"tasks" gorm:"foreignKey:ColumnID"`
   BoardID int `json:"board_id" gorm:"foreignKey:BoardID"`

}


type Task struct {
   gorm.Model
   Title        string `json:"title"`
   Description  string `json:"description"`
   ColumnID 	int `json:"column_id" gorm:"foreignKey:ColumnID"`
   Subtasks 	[]Subtask `json:"subtasks" gorm:"foreignKey:TaskID"`
}

type Subtask struct {
   gorm.Model
   TaskID 		int `json:"task_id" gorm:"foreignKey:TaskID"`
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
   db.AutoMigrate(Board{}, Column{}, Task{}, Subtask{})
}


func GetBoards() ([]*Board, error) {
   var board []*Board
   err := db.Model(&Board{}).Preload("Columns").Find(&board).Error
   return board, err
}


func UpdateBoard(board *Board) (*Board, []*Column, error) {
    
    err := db.Save(&board).Error
    var existingColumns []Column
    db.Model(board).Association("Columns").Find(&existingColumns)

    // Get the IDs of the columns in the payload
    var columnIDsInPayload []uint
    for _, column := range board.Columns {
        columnIDsInPayload = append(columnIDsInPayload, column.ID)
    }

    // Get the IDs of the columns that exist in the database but are not in the payload
    var columnIDsToDelete []uint
    for _, column := range existingColumns {
        found := false
        for _, id := range columnIDsInPayload {
            if column.ID == id {
                found = true
                break
            }
        }
        if !found {
            columnIDsToDelete = append(columnIDsToDelete, column.ID)
        }
    }

    // Delete the columns that exist in the database but are not in the payload
    if len(columnIDsToDelete) > 0 {
        db.Unscoped().Model(&Column{}).Where("id IN (?)", columnIDsToDelete).Delete(&Column{})
    }

    columns, _ := GetColumns(board.ID)
    
    return board, columns, err
}


func GetTasks(BoardID any) ([]*Task, error) {
    var tasks []*Task
    db.Where("board_id = ?", BoardID).Preload("Subtasks").Find(&tasks)

    return tasks, nil
}


func GetColumns(BoardID any) ([]*Column, error) {
    var columns []*Column

     err := db.Model(&Column{}).
        Where("board_id = ?", BoardID).  
        Preload("Tasks").
        Preload("Tasks.Subtasks").
        Find(&columns).Error

    // db.Where("board_id = ?", BoardID).Preload("Tasks").Find(&columns)

    return columns, err
}



func CreateBoard(board *Board) (*Board, error) {
    fmt.Println(board)
   res := db.Create(&board)
   if res.Error != nil {
       return nil, errors.New("no boards found")
   }
   return board, nil
}

func CreateColumn(column *Column) (*Column, error) {
   res := db.Create(&column)
   if res.Error != nil {
       return nil, errors.New("no boards found")
   }
   return column, nil
}





func CreateTask(task *Task) (*Task, error) {
   res := db.Create(&task)
   if res.Error != nil {
       return nil, errors.New("no tasks found")
   }
   return task, nil
}

func GetTask(id any) (*Task, error) {
    fmt.Println(id)
  var task Task
  res := db.First(&task, "id = ?", id)
  if res.RowsAffected == 0 {
    return nil, fmt.Errorf(fmt.Sprintf("task of id %s not found", id))
  }
 return &task, nil
}

func UpdateTask(task *Task, boardID any) (*Task, []*Column, error) {
    var taskToUpdate Task
    result := db.Model(&taskToUpdate).Where("id = ?", task.ID).Save(task)
    if result.RowsAffected == 0 {
        return &taskToUpdate, nil, errors.New("task not updated")
    }

    columns, err := GetColumns(boardID)
    if err != nil {
        return task, nil, err
    }

    // Get the existing subtasks for the task
    var existingSubtasks []Subtask
    db.Model(&Subtask{}).Where("task_id = ?", task.ID).Find(&existingSubtasks)

    // Get the IDs of the subtasks in the payload
    var subtaskIDsInPayload []uint
    for _, subtask := range task.Subtasks {
        subtaskIDsInPayload = append(subtaskIDsInPayload, subtask.ID)
    }

    // Get the IDs of the subtasks that exist in the database but are not in the payload
    var subtaskIDsToDelete []uint
    for _, subtask := range existingSubtasks {
        found := false
        for _, id := range subtaskIDsInPayload {
            if subtask.ID == id {
                found = true
                break
            }
        }
        if !found {
            subtaskIDsToDelete = append(subtaskIDsToDelete, subtask.ID)
        }
    }



    // Delete the subtasks that exist in the database but are not in the payload
   if len(subtaskIDsToDelete) > 0 {
    for _, id := range subtaskIDsToDelete {
        db.Unscoped().Where("id = ?", id).Delete(&Subtask{})
    }
}

    return task, columns, nil
}

func UpdateSubTask(subtask *Subtask) (*[]Subtask, error) {
    var subtaskToUpdate Subtask
    result := db.Model(&subtaskToUpdate).Where("id = ?", subtask.ID).Save(subtask)
    if result.RowsAffected == 0 {
        return nil, errors.New("subtask not updated")
    }

    var subtasks []Subtask
    db.Model(&subtaskToUpdate).Where("task_id = ?", subtask.TaskID).Find(&subtasks)
    return &subtasks, nil
}


func UpdateSubTasks(subtasks []Subtask) (*[]Subtask, error) {
    var updatedSubtasks []Subtask
    for _, subtask := range subtasks {
        result := db.Model(&Subtask{}).Where("id = ?", subtask.ID).Save(subtask)
        if result.RowsAffected == 0 {
            return nil, errors.New("subtask not updated")
        }
        updatedSubtasks = append(updatedSubtasks, subtask)
    }
    return &updatedSubtasks, nil
}


func DeleteBoard(ID *string) ([]Board, error) {
    // Delete the task
    result := db.Unscoped().Delete(&Board{}, *ID)

    if result.RowsAffected == 0 {
        return nil, errors.New("board not deleted")
    }

    // Delete associated subtasks
    db.Unscoped().Where("board_id = ?", *ID).Delete(&Column{})

    // Find and return remaining tasks
    var remainingBoards []Board
    db.Where("id != ?", ID).Find(&remainingBoards)

    return remainingBoards, nil
}




func DeleteTask(ID *string) ([]Task, error) {
    // Delete the task
    result := db.Unscoped().Delete(&Task{}, *ID)

    if result.RowsAffected == 0 {
        return nil, errors.New("task not deleted")
    }

    // Delete associated subtasks
    db.Unscoped().Where("task_id = ?", *ID).Delete(&Subtask{})

    // Find and return remaining tasks
    var remainingTasks []Task
    db.Where("id != ?", ID).Find(&remainingTasks)

    return remainingTasks, nil
}


func CreateSubtask(subtask *Subtask) (*Subtask, error)  {
   res := db.Create(&subtask)
   if res.Error != nil {
       return nil, res.Error
   }
   return subtask, nil
}


func GetSubTask(id any) (*Subtask, error) {
  var subtask Subtask
  res := db.First(&subtask, "id = ?", id)
  if res.RowsAffected == 0 {
    return nil, fmt.Errorf(fmt.Sprintf("subtask of id %s not found", id))
  }
 return &subtask, nil
}

func GetSubTasks(id string) (*[]Subtask, error) {
  var subtasks []Subtask
  res := db.Where("task_id = ?", id).Find(&subtasks)
//   res := db.First(&subtask, "id = ?", id)
  if res.RowsAffected == 0 {
    return nil, fmt.Errorf(fmt.Sprintf("subtask of id %s not found", id))
  }
 return &subtasks, nil
}



func DeleteSubTask(subtask *Subtask) ([]Subtask, error) {
    result := db.Unscoped().Where("id = ?", subtask.ID).Delete(&subtask)
    if result.RowsAffected == 0 {
        return nil, errors.New("subtask not deleted")
    }
    
    var remainingSubtasks []Subtask
    db.Where("task_id = ?", subtask.TaskID).Find(&remainingSubtasks)
    
    return remainingSubtasks, nil
}

func GetStatus() ([]string, error) {
    var statuses []string
    res := db.Model(&Task{}).Group("status").Pluck("status", &statuses)
    if res.Error != nil {
        return nil, errors.New("no statuses found")
    }
    return statuses, nil
}
