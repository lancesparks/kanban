package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	db "kanban.com/kanban-app/db"
	// "github.com/gin-gonic/gin"
	// "kanban.com/kanban-app/db"
)
 
func InitRouter() *gin.Engine {
   r := gin.Default()
   r.GET("/boards", getBoards)
   r.POST("/boards", createBoard)
   r.POST("/boards/epic", createEpic)
   r.POST("/boards/epic/story", createStory)
   r.POST("/boards/epic/story/task", createTask)
   r.POST("/boards/epic/story/task/subtask", createSubtask)
//    r.GET("/movies/:id", getMovie)
//    r.POST("/movies", postMovie)
//    r.PUT("/movies/:id", putMovie)
//    r.DELETE("/movies/:id", deleteMovie)
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
 
func createBoard(ctx *gin.Context) {
   var board db.Board
   err := ctx.Bind(&board)
   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }
   res, err := db.CreateBoard(&board)
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

func createEpic(ctx *gin.Context) {
   var epic db.Epic
   err := ctx.Bind(&epic)
   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }
   res, err := db.CreateEpic(&epic)
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


func createStory(ctx *gin.Context) {
   var story db.Story
   err := ctx.Bind(&story)
   if err != nil {
       ctx.JSON(http.StatusBadRequest, gin.H{
           "error": err.Error(),
       })
       return
   }
   res, err := db.CreateStory(&story)
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
