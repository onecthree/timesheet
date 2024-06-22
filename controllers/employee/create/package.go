package create

import(
	"fmt"
	// "strconv"
	"regexp"
	"net/http"
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/onecthree/timesheet/database"
	"github.com/onecthree/timesheet/functions"
)

type Employee struct {
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

	if len(employee.Rate) == 0 || functions.IsNumeric(employee.Rate) == false {
		return false
	}

	if len(employee.Name) == 0 {
		return false
	}

    fmt.Printf("das6\n")
    nameRegex, err := regexp.Compile(`[^a-zA-Z0-9\s+]`)
    if err != nil {
    	return false
    }

    fmt.Printf("das7 -%v-\n", employee.Name)
    if len(nameRegex.FindAllString(employee.Name, 1)) > 0 {
    	return false
    }

    fmt.Printf("das8\n")
    rateRegex, err := regexp.Compile(`^(0|[1-9][0-9]*)$`)
    if err != nil {
    	return false
    }

    fmt.Printf("das9 -%v-\n", employee.Rate)
    if len(rateRegex.FindAllString(employee.Rate, 1)) < 1 {
    	return false
    }

    fmt.Printf("das10\n")

	return true
}

func PostResponse( ginContext *gin.Context, db *sql.DB ) ( int, string, bool ) {
	if isPostQueryValid(ginContext) == false {
		return http.StatusBadRequest, "Request body are invalid [0]", true
	}

	var insertQuery string
	insertQuery += database.Query(`INSERT INTO employee`);
	insertQuery += database.Query(`(name, rate)`);
	insertQuery += database.Query(`VALUES`);
	insertQuery += database.Query(`('`+ ginContext.PostForm("name") +`', `+ ginContext.PostForm("rate") +`)`);

	database.QueryExec(db, insertQuery)

	return http.StatusOK, "OK", false
}