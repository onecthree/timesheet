package delete

import(
	// "fmt"
	// "strconv"
	"net/http"
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/onecthree/timesheet/database"
	"github.com/onecthree/timesheet/functions"
)

func isPostQueryValid( ginContext *gin.Context ) bool {
	id, exists := ginContext.GetQuery("id")
	if exists == false || len(id) == 0 || functions.IsNumeric(id) == false {
		return false
	}

	return true
}

func PostResponse( ginContext *gin.Context, db *sql.DB ) ( int, string, bool ) {
	if isPostQueryValid(ginContext) == false {
		return http.StatusBadRequest, "Request query are invalid [0]", true
	}

	var dataCheckQuery string
	dataCheckQuery += database.Query(`SELECT COUNT(employee.id) as total`);
	dataCheckQuery += database.Query(`FROM employee`);
	dataCheckQuery += database.Query(`WHERE employee.id = `+ ginContext.Query("id"));

	dataExists := database.QueryExec(db, dataCheckQuery)

	if dataExists[0]["total"] == "0" {
		return http.StatusNotFound, "Employee id is not exists [0]", true
	}

	var deleteEmployeeQuery string
	deleteEmployeeQuery += database.Query(`UPDATE employee`);
	deleteEmployeeQuery += database.Query(`SET employee.expired = 1`);
	deleteEmployeeQuery += database.Query(`WHERE employee.id = `+ ginContext.Query("id") +`;`);

	database.QueryExec(db, deleteEmployeeQuery)

	var deleteActivityQuery string
	deleteActivityQuery += database.Query(`UPDATE activity`);
	deleteActivityQuery += database.Query(`SET activity.expired = 1`);
	deleteActivityQuery += database.Query(`WHERE activity.employee_id = `+ ginContext.Query("id") +`;`);

	database.QueryExec(db, deleteActivityQuery)

	return http.StatusOK, "OK", false
}