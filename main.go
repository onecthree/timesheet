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
	controllersEmployeeCreate "github.com/onecthree/timesheet/controllers/employee/create"
	controllersEmployeeEdit "github.com/onecthree/timesheet/controllers/employee/edit"
	controllersEmployeeList "github.com/onecthree/timesheet/controllers/employee/list"
	controllersEmployeeDelete "github.com/onecthree/timesheet/controllers/employee/delete"

	controllersProjectIndex "github.com/onecthree/timesheet/controllers/project/index"
	controllersProjectCreate "github.com/onecthree/timesheet/controllers/project/create"
	controllersProjectEdit "github.com/onecthree/timesheet/controllers/project/edit"
	controllersProjectList "github.com/onecthree/timesheet/controllers/project/list"
	controllersProjectDelete "github.com/onecthree/timesheet/controllers/project/delete"
	controllersProjectSearch "github.com/onecthree/timesheet/controllers/project/search"

	controllersActivityIndex "github.com/onecthree/timesheet/controllers/activity/index"
	controllersActivityCreate "github.com/onecthree/timesheet/controllers/activity/create"
	controllersActivityEdit "github.com/onecthree/timesheet/controllers/activity/edit"
	controllersActivityList "github.com/onecthree/timesheet/controllers/activity/list"
	controllersActivityDelete "github.com/onecthree/timesheet/controllers/activity/delete"

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

	if os.Getenv("APP_ENV") == "production" {
		gin.SetMode(gin.ReleaseMode)	
	}

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
  		c.Redirect(http.StatusFound, "/employee?page=1&limit=10&order_by=default&sort_by=asc")
  		// c.HTML(http.StatusOK, "activity.html", gin.H{
  		// 	"appName": appName,
  		// })
  	})

	app.POST("/employee/create", func( c *gin.Context ) {
  		httpStatusCode, message, _ := controllersEmployeeCreate.PostResponse(c, database)

  		c.JSON(httpStatusCode, gin.H{
			"success": false,
			"message": message,
		})	
  	})

	app.POST("/employee/edit", func( c *gin.Context ) {
  		httpStatusCode, message, _ := controllersEmployeeEdit.PostResponse(c, database)

  		c.JSON(httpStatusCode, gin.H{
			"success": false,
			"message": message,
		})	
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

  	app.GET("/project", func( c *gin.Context ) {
  		data, httpStatusCode, _, isControllersFailed := controllersProjectIndex.GetResponse(c, database)

  		if isControllersFailed {
			c.Redirect(httpStatusCode, "/project?page=1&limit=10&order_by=default&sort_by=asc")
  		} else {
  			querySearch, ok := c.GetQuery("search")
  			if ok == false {
  				querySearch = ""
  			}

	  		c.HTML(http.StatusOK, "project.html", gin.H{
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

	app.POST("/project/create", func( c *gin.Context ) {
  		httpStatusCode, message, _ := controllersProjectCreate.PostResponse(c, database)

  		c.JSON(httpStatusCode, gin.H{
			"success": false,
			"message": message,
		})	
  	})

	app.POST("/project/edit", func( c *gin.Context ) {
  		httpStatusCode, message, _ := controllersProjectEdit.PostResponse(c, database)

  		c.JSON(httpStatusCode, gin.H{
			"success": false,
			"message": message,
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

  	app.POST("/project/delete", func( c *gin.Context ) {
  		httpStatusCode, message, _ := controllersProjectDelete.PostResponse(c, database)

  		c.JSON(httpStatusCode, gin.H{
			"success": false,
			"message": message,
		})	
  	})

  	app.POST("/project/search", func( c *gin.Context ) {
		data, httpStatusCode, message, isControllersFailed := controllersProjectSearch.PostResponse(c, database)

  		if isControllersFailed {
	  		c.JSON(httpStatusCode, gin.H{
				"success": false,
				"message": message,
			})	
  		} else {
	  		c.JSON(httpStatusCode, gin.H{
	  			"success": true,
	  			"message": message,
				"data": data["data"],
			})	
  		}
  	})


  	app.GET("/activity/:slug", func( c *gin.Context ) {
  		data, httpStatusCode, _, isControllersFailed := controllersActivityIndex.GetResponse(c, database)

  		if isControllersFailed {
			c.Redirect(httpStatusCode, "/employee?page=1&limit=10&order_by=default&sort_by=asc")
  		} else {
  			querySearch, ok := c.GetQuery("search")
  			if ok == false {
  				querySearch = ""
  			}

	  		c.HTML(http.StatusOK, "activity.html", gin.H{
	  			"appName": appName,
	  			"maxPage": data[0]["maxPage"],
	  			"currentPage": c.Query("page"),
	  			"currentLimit": c.Query("limit"),
	  			"currentSearch": querySearch,
	  			"currentOrderBy": c.Query("order_by"),
	  			"currentSortBy": c.Query("sort_by"),
	  			"employeeName": data[0]["name"],
	  			"employeeRate": data[0]["rate"],
	  			"employeeId": data[0]["id"],
	  		})
  		}
  	})

  	app.POST("/activity/list/:slug", func( c *gin.Context ) {
  		data, httpStatusCode, message, isControllersFailed := controllersActivityList.PostResponse(c, database)

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

  	app.POST("/activity/delete", func( c *gin.Context ) {
  		httpStatusCode, message, _ := controllersActivityDelete.PostResponse(c, database)

  		c.JSON(httpStatusCode, gin.H{
			"success": false,
			"message": message,
		})	
  	})

	app.POST("/activity/create", func( c *gin.Context ) {
  		httpStatusCode, message, _ := controllersActivityCreate.PostResponse(c, database)

  		c.JSON(httpStatusCode, gin.H{
			"success": false,
			"message": message,
		})	
  	})

  	app.POST("/activity/edit", func( c *gin.Context ) {
  		httpStatusCode, message, _ := controllersActivityEdit.PostResponse(c, database)

  		c.JSON(httpStatusCode, gin.H{
			"success": false,
			"message": message,
		})	
  	})
  	/** Application Route }} **/

	app.Run(os.Getenv("APP_HOST"))
}