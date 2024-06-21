package list

import(
	"strconv"
	"net/http"
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/onecthree/timesheet/database"
)

func isNumeric(s string) bool {
    _, err := strconv.ParseUint(s, 10, 64)
    return err == nil
}

func isPostQueryValid( ginContext *gin.Context ) bool {
	page, exists := ginContext.GetQuery("page")
	if exists == false || len(page) == 0 || isNumeric(page) == false {
		return false
	}

	return true
}

func getPageQueryAsPage( ginContext *gin.Context ) (string, bool) {
	page, err := strconv.ParseUint(ginContext.Query("page"), 10, 64)
	if err != nil {
		return "", false
	}

	if page < 2 {
		return "0", true
	}

	return strconv.Itoa(int((page - 1) * 10)), true
}

func PostResponse( ginContext *gin.Context, db *sql.DB ) ([]map[string]string, int, string, bool) {
	var emptyData []map[string]string

	if isPostQueryValid(ginContext) == false {
		return emptyData, http.StatusBadRequest, "Request query are invalid", true
	}

	page, ok := getPageQueryAsPage(ginContext)
	if ok == false {
		return emptyData, http.StatusInternalServerError, "Internal server error", true
	}

	var query string
	query += database.Query(`SELECT project.id, project.title`)
	query += database.Query(`FROM project`)
	query += database.Query("WHERE id > "+ page)
	query += database.Query("AND project.expired != 1")
	query += database.Query(`LIMIT 10`)

	result := database.QueryExec(db, query)

	return result, http.StatusOK, "OK", false
}