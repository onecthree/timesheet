package main

import(
	"os"
	"log"
	// "fmt"
	"time"
	"net/http"
	"database/sql"
	// "github.com/onecthree/timesheet/database"
	controllersEmployeeIndex "github.com/onecthree/timesheet/controllers/employee/index"
	controllersEmployeeList "github.com/onecthree/timesheet/controllers/employee/list"
	controllersEmployeeDelete "github.com/onecthree/timesheet/controllers/employee/delete"

	controllersProjectList "github.com/onecthree/timesheet/controllers/project/list"
	"github.com/joho/godotenv"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

func main() {

	if godotenv.Load() != nil {
		log.Fatal("Error loading .env file")
	}

	database, err := sql.Open("mysql", os.Getenv("MYSQL_PREV"))
	if err != nil {
		panic(err)
	}
	defer database.Close()

	database.SetConnMaxLifetime(time.Minute * 1)
	database.SetMaxOpenConns(10)
	database.SetMaxIdleConns(10)

	appName := os.Getenv("APP_NAME")
	app := gin.Default()	

	app.Static("/static", "./static");
	app.LoadHTMLGlob("templates/*")

	/** {{ Application Route **/
 	app.GET("/", func( c *gin.Context ) {
		c.Redirect(http.StatusFound, "/employee?page=1&limit=10&order_by=default&sort_by=asc")
  	})

  	app.POST("/", func( c *gin.Context ) {
  		c.JSON(http.StatusOK, gin.H{
		  "message": os.Getenv("hello"),
		})
  	})

  	app.GET("/employee", func( c *gin.Context ) {
  		data, httpStatusCode, _, isControllersFailed := controllersEmployeeIndex.GetResponse(c, database)

  		if isControllersFailed {
			c.Redirect(httpStatusCode, "/employee?page=1&limit=10&order_by=default&sort_by=asc")
  		} else {
  			querySearch, ok := c.GetQuery("search")
  			if ok == false {
  				querySearch = ""
  			}

	  		c.HTML(http.StatusOK, "employee.html", gin.H{
	  			"appName": appName,
	  			"maxPage": data[0]["maxPage"],
	  			"currentPage": c.Query("page"),
	  			"currentLimit": c.Query("limit"),
	  			"currentSearch": querySearch,
	  			"currentOrderBy": c.Query("order_by"),
	  			"currentSortBy": c.Query("sort_by"),
	  		})
  		}
  	})

  	app.GET("/activity", func( c *gin.Context ) {
  		c.HTML(http.StatusOK, "activity.html", gin.H{
  			"appName": appName,
  		})
  	})

	app.POST("/project/list", func( c *gin.Context ) {
  		data, httpStatusCode, message, isControllersFailed := controllersProjectList.PostResponse(c, database)

  		if isControllersFailed {
	  		c.JSON(httpStatusCode, gin.H{
				"success": false,
				"message": message,
			})	
  		} else {
	  		c.JSON(httpStatusCode, gin.H{
	  			"success": true,
	  			"message": message,
				"data": data,
			})	
  		}
  	})

  	app.POST("/employee/list", func( c *gin.Context ) {
  		data, httpStatusCode, message, isControllersFailed := controllersEmployeeList.PostResponse(c, database)

  		if isControllersFailed {
	  		c.JSON(httpStatusCode, gin.H{
				"success": false,
				"message": message,
			})	
  		} else {
  			total := "0"
  			if len(data["total"]) > 0 {
  				total = data["total"][0]["total"]
  			}

  			maxPage := "0"
  			if len(data["maxPage"]) > 0 {
  				maxPage = data["maxPage"][0]["maxPage"]
  			}

	  		c.JSON(httpStatusCode, gin.H{
	  			"success": true,
	  			"message": message,
				"data": data["data"],
				"total": total,
				"maxPage": maxPage,
			})	
  		}
  	})

  	app.POST("/employee/delete", func( c *gin.Context ) {
  		httpStatusCode, message, _ := controllersEmployeeDelete.PostResponse(c, database)

  		c.JSON(httpStatusCode, gin.H{
			"success": false,
			"message": message,
		})	
  	})
  	/** Application Route }} **/

	app.Run()
}