package search

import(
	// "fmt"
	// "strconv"
	// "regexp"
	"net/http"
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/onecthree/timesheet/database"
	// "github.com/onecthree/timesheet/functions"
)

func isPostQueryValid( ginContext *gin.Context ) bool {
	_, ok := ginContext.GetQuery("k")
	if ok == false {
		return false
	}

	return true
}

func PostResponse( ginContext *gin.Context, db *sql.DB ) ( map[string][]map[string]string, int, string, bool ) {
	var emptyData map[string][]map[string]string
	result := make(map[string][]map[string]string, 1)

	if isPostQueryValid(ginContext) == false {
		return emptyData, http.StatusBadRequest, "Request query are invalid [0]", true
	}

	var searchQuery string
	searchQuery += database.Query(`SELECT project.id, project.title`);
	searchQuery += database.Query(`FROM project`);
	searchQuery += database.Query(`WHERE LOWER(project.title) LIKE LOWER('%`+ ginContext.Query("k") +`%')`)
	searchQuery += database.Query(`LIMIT 3`)

	result["data"] = database.QueryExec(db, searchQuery)

	return result, http.StatusOK, "OK", false
}