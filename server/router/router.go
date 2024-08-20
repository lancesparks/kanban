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
 
func InitRouter() *gin.Engine {
   r := gin.Default()
   	r.Use(cors.Default())
   r.GET("/boards", getBoards)
   r.POST("/boards", createBoard)
   r.POST("/boards/task", createTask)
   r.GET("/boards/task/:boardID", getTasks)
   r.POST("/boards/task/subtask", createSubtask)
//    r.GET("/movies/:id", getMovie)
//    r.POST("/movies", postMovie)
//    r.PUT("/movies/:id", putMovie)
//    r.DELETE("/movies/:id", deleteMovie)
   return r
}


func getBoards(ctx *gin.Context) {
   res, err := db.GetBoards()

   fmt.Println(res)
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

    newBoard := db.Board{
        Name: board.Name,
    }

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

