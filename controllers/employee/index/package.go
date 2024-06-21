package index

import(
	"strconv"
	"net/http"
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/onecthree/timesheet/database"
)

func getMaxPage( totalData string, limitData string ) (string, bool) {
	totalDataCast, err := strconv.ParseUint(totalData, 10, 64)
	if err != nil {
		return "", false
	}

	limitDataCast, err := strconv.ParseUint(limitData, 10, 64)
	if err != nil {
		return "", false
	}

	leftover := 0
	if totalDataCast % limitDataCast > 0 {
		leftover = 1
	}

	divide := int(totalDataCast / limitDataCast)

	return strconv.Itoa(int(divide + leftover)), true
}

func GetResponse( ginContext *gin.Context, db *sql.DB ) ([]map[string]string, int, string, bool) {
	var emptyData []map[string]string

	var query string
	query += database.Query(`SELECT COUNT(employee.id) AS totalData`)
	query += database.Query(`FROM employee`)
	query += database.Query("WHERE employee.expired != 1")

	result := database.QueryExec(db, query)

	maxPage, ok := getMaxPage(result[0]["totalData"], ginContext.Query("limit"))
	if ok == false {
		return emptyData, http.StatusInternalServerError, "Internal server error", true
	}

	retval := make([]map[string]string, 1)
	retval[0] = make(map[string]string)
	retval[0]["maxPage"] = maxPage

	return retval, http.StatusOK, "OK", false
}