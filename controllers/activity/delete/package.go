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
	dataCheckQuery += database.Query(`SELECT COUNT(activity.id) as total`);
	dataCheckQuery += database.Query(`FROM activity`);
	dataCheckQuery += database.Query(`WHERE activity.id = `+ ginContext.Query("id"));

	dataExists := database.QueryExec(db, dataCheckQuery)

	if dataExists[0]["total"] == "0" {
		return http.StatusNotFound, "Activity id is not exists [0]", true
	}

	var deleteQuery string
	deleteQuery += database.Query(`UPDATE activity`);
	deleteQuery += database.Query(`SET activity.expired = 1`);
	deleteQuery += database.Query(`WHERE activity.id = `+ ginContext.Query("id"));

	database.QueryExec(db, deleteQuery)

	return http.StatusOK, "OK", false
}