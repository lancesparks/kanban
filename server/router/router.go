package router

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	db "kanban.com/kanban-app/db"
	// "github.com/gin-gonic/gin"
	// "kanban.com/kanban-app/db"
)


type UpdateBoardRequest struct {
    UpdatedBoard db.Board `json:"board"`
} 

type UpdateTaskRequest struct {
    UpdatedTask db.Task `json:"updatedTask"`
    BoardID     int     `json:"boardID"`
}
 
func InitRouter() *gin.Engine {
   r := gin.Default()
   r.Use(cors.Default())
   r.GET("/status", getStatusTypes)
   r.GET("/boards", getBoards)
   r.POST("/boards", createBoard)
   r.POST("/columns", createColumn)
   r.GET("/columns/:id", getColumns)
   r.POST("/boards/tasks", createTask)
   r.POST("/boards/tasks/:id", updateTask)
   r.POST("/boards/update", updateBoard)
   r.PATCH("/boards/tasks/subtask", updateSubTask)
   r.GET("/boards/tasks/:boardID", getTasks)
   r.POST("/boards/tasks/subtask", createSubtask)
//    r.GET("/movies/:id", getMovie)
//    r.POST("/movies", postMovie)
//    r.PUT("/movies/:id", putMovie)
   r.DELETE("/boards/tasks/subtask/", deleteSubtask)
   return r
}


func getBoards(ctx *gin.Context) {
   res, err := db.GetBoards()


   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }
   ctx.JSON(http.StatusOK, gin.H{
       "boards": res,
   })
}

func getColumns(ctx *gin.Context) {

   
  var boardID = ctx.Param("id")

   res, err := db.GetColumns(boardID)

   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }
   ctx.JSON(http.StatusOK, gin.H{
       "columns": res,
   })
}


func getStatusTypes(ctx *gin.Context) {    
      

    res, err := db.GetStatus()

   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }

    ctx.JSON(http.StatusOK, gin.H{
       "types": res,
   })    

}


func getTasks(ctx *gin.Context){

    var boardID = ctx.Param("boardID")

    res, err := db.GetTasks(boardID)

   fmt.Println(boardID)
   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }

    ctx.JSON(http.StatusOK, gin.H{
       "tasks": res,
   })
}
 
func createBoard(ctx *gin.Context) {
    var board db.Board

    err := ctx.Bind(&board)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{
            "error": err.Error(),
        })
        return
    }

    newBoard := board

    res, err := db.CreateBoard(&newBoard)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{
            "error": err.Error(),
        })
        return
    }

    ctx.JSON(http.StatusCreated, gin.H{
        "board": res,
    })
}



func createColumn(ctx *gin.Context) {
    var column db.Column

    err := ctx.Bind(&column)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{
            "error": err.Error(),
        })
        return
    }

    newColumn := column

    res, err := db.CreateColumn(&newColumn)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{
            "error": err.Error(),
        })
        return
    }

    ctx.JSON(http.StatusCreated, gin.H{
        "column": res,
    })
}



func createTask(ctx *gin.Context) {
   var task db.Task
   err := ctx.Bind(&task)
   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }
   res, err := db.CreateTask(&task)
   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }
   ctx.JSON(http.StatusCreated, gin.H{
       "boards": res,
   })
}

func createSubtask(ctx *gin.Context) {
   var subtask db.Subtask
   err := ctx.Bind(&subtask)
   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }
   res, err := db.CreateSubtask(&subtask)
   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }
   ctx.JSON(http.StatusCreated, gin.H{
       "boards": res,
   })
}


func updateBoard(ctx *gin.Context){
    var req UpdateBoardRequest
    err := ctx.Bind(&req)   

    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{
            "error": err.Error(),
        })
        return
    }

    updatedBoard :=  req.UpdatedBoard
   
   res,cols, err := db.UpdateBoard(&updatedBoard)
   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }
   ctx.JSON(http.StatusCreated, gin.H{
       "board": res,
       "columns": cols,
   })   

}

func updateTask(ctx *gin.Context) {
    var req UpdateTaskRequest
    err := ctx.Bind(&req)

    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{
            "error": err.Error(),
        })
        return
    }

    updatedTask := req.UpdatedTask
    boardID := req.BoardID
   
   res,cols, err := db.UpdateTask(&updatedTask, boardID)
   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }
   ctx.JSON(http.StatusCreated, gin.H{
       "task": res,
       "columns": cols,
   })   
}


func updateSubTask(ctx *gin.Context) {
    fmt.Println("updating subtask")
   var subtask db.Subtask 
   err := ctx.Bind(&subtask)
   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }
   res, err := db.UpdateSubTask(&subtask)
   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }
   ctx.JSON(http.StatusCreated, gin.H{
       "subtasks": res,
   })   
}

func deleteSubtask(ctx *gin.Context) {
  fmt.Println("deleting subtask")
   var subtask db.Subtask 
   err := ctx.Bind(&subtask)
   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }
   res, err2 := db.DeleteSubTask(&subtask)
   if err2 != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err2.Error(),
       })
       return
   }
   ctx.JSON(http.StatusAccepted, gin.H{
       "subtasks": res,
   })   
}
