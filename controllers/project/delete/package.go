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
	dataCheckQuery += database.Query(`SELECT COUNT(project.id) as total`);
	dataCheckQuery += database.Query(`FROM project`);
	dataCheckQuery += database.Query(`WHERE project.id = `+ ginContext.Query("id"));

	dataExists := database.QueryExec(db, dataCheckQuery)

	if dataExists[0]["total"] == "0" {
		return http.StatusNotFound, "Employee id is not exists [0]", true
	}

	var deleteProjectQuery string
	deleteProjectQuery += database.Query(`UPDATE project`);
	deleteProjectQuery += database.Query(`SET project.expired = 1`);
	deleteProjectQuery += database.Query(`WHERE project.id = `+ ginContext.Query("id"));

	database.QueryExec(db, deleteProjectQuery)

	var deleteActivityQuery string
	deleteActivityQuery += database.Query(`UPDATE activity`);
	deleteActivityQuery += database.Query(`SET activity.expired = 1`);
	deleteActivityQuery += database.Query(`WHERE activity.project_id = `+ ginContext.Query("id"));

	database.QueryExec(db, deleteActivityQuery)

	return http.StatusOK, "OK", false
}