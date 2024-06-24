package edit

import(
	"fmt"
	// "strconv"
	"regexp"
	"net/http"
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/onecthree/timesheet/database"
	// "github.com/onecthree/timesheet/functions"
)

type Employee struct {
	Id      string `json:"id" form:"id"` 
    Title 	string `json:"title" form:"title"` 
}

func isPostQueryValid( ginContext *gin.Context ) bool {
	_, err := ginContext.MultipartForm()

	if err != nil {
		panic(err)
		return false
	}

	var employee Employee
	if err := ginContext.Bind(&employee); err != nil {
		return false
	}

	fmt.Printf("BODYYYY %s", employee);

	if len(employee.Id) == 0 {
		return false
	}

	if len(employee.Title) == 0 {
		return false
	}

	idRegex, err := regexp.Compile(`[^0-9]+`)
	if err != nil {
		return false
	}

	if len(idRegex.FindAllString(employee.Id, 1)) > 0 {
		return false
	}

    // fmt.Printf("das6\n")
    titleRegex, err := regexp.Compile(`[^a-zA-Z0-9\s+]`)
    if err != nil {
    	return false
    }

    // fmt.Printf("das7 -%v-\n", employee.Title)
    if len(titleRegex.FindAllString(employee.Title, 1)) > 0 {
    	return false
    }

    if len(employee.Title) < 6 || len(employee.Title) > 30 {
    	return false
    }

	return true
}

func PostResponse( ginContext *gin.Context, db *sql.DB ) ( int, string, bool ) {
	if isPostQueryValid(ginContext) == false {
		return http.StatusBadRequest, "Request body are invalid [0]", true
	}

	var dataCheckQuery string
	dataCheckQuery += database.Query(`SELECT COUNT(project.id) as total`);
	dataCheckQuery += database.Query(`FROM project`);
	dataCheckQuery += database.Query(`WHERE project.id = `+ ginContext.PostForm("id"));

	dataExists := database.QueryExec(db, dataCheckQuery)

	if dataExists[0]["total"] == "0" {
		return http.StatusNotFound, "Project id is not exists [0]", true
	}

	var updateQuery string
	updateQuery += database.Query(`UPDATE project`);
	updateQuery += database.Query(`SET project.title = '`+ ginContext.PostForm("title") +`'`);
	updateQuery += database.Query(`WHERE project.id = `+ ginContext.PostForm("id"));

	database.QueryExec(db, updateQuery)

	fmt.Printf("DAPET QUERY INI: %v", updateQuery)

	return http.StatusOK, "OK", false
}