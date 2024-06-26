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
    Name 	string `json:"name" form:"name"` 
    Rate    string `json:"rate" form:"rate"`
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

	if len(employee.Rate) == 0 {
		return false
	}

	if len(employee.Name) == 0 {
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
    nameRegex, err := regexp.Compile(`[^a-zA-Z0-9\s+]`)
    if err != nil {
    	return false
    }

    // fmt.Printf("das7 -%v-\n", employee.Name)
    if len(nameRegex.FindAllString(employee.Name, 1)) > 0 {
    	return false
    }

    if len(employee.Name) < 6 || len(employee.Name) > 30 {
    	return false
    }

    // fmt.Printf("das8\n")
    rateRegex, err := regexp.Compile(`^(0|[1-9][0-9]*)$`)
    if err != nil {
    	return false
    }

    // fmt.Printf("das9 -%v-\n", employee.Rate)
    if len(rateRegex.FindAllString(employee.Rate, 1)) < 1 {
    	return false
    }

    if len(employee.Rate) > 13 {
    	return false
    }

    // fmt.Printf("das10\n")

	return true
}

func PostResponse( ginContext *gin.Context, db *sql.DB ) ( int, string, bool ) {
	if isPostQueryValid(ginContext) == false {
		return http.StatusBadRequest, "Request body are invalid [0]", true
	}

	var dataCheckQuery string
	dataCheckQuery += database.Query(`SELECT COUNT(employee.id) as total`);
	dataCheckQuery += database.Query(`FROM employee`);
	dataCheckQuery += database.Query(`WHERE employee.id = `+ ginContext.PostForm("id"));

	dataExists := database.QueryExec(db, dataCheckQuery)

	if dataExists[0]["total"] == "0" {
		return http.StatusNotFound, "Employee id is not exists [0]", true
	}

	var updateQuery string
	updateQuery += database.Query(`UPDATE employee`);
	updateQuery += database.Query(`SET employee.name = '`+ ginContext.PostForm("name") +`', employee.rate = `+ ginContext.PostForm("rate") +``);
	updateQuery += database.Query(`WHERE employee.id = `+ ginContext.PostForm("id"));

	database.QueryExec(db, updateQuery)

	return http.StatusOK, "OK", false
}