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

	limit, exists := ginContext.GetQuery("limit")
	if exists == false || len(limit) == 0 || isNumeric(limit) == false {
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

func getLimitQueryAsLimit( ginContext *gin.Context ) (string, bool) {
	limit := ginContext.Query("limit")

	if limit != "10" && limit != "25" && limit != "50" {
		return "", false
	}

	return limit, true
}

func PostResponse( ginContext *gin.Context, db *sql.DB ) (map[string][]map[string]string, int, string, bool) {
	var emptyData map[string][]map[string]string

	if isPostQueryValid(ginContext) == false {
		return emptyData, http.StatusBadRequest, "Request query are invalid", true
	}

	page, ok := getPageQueryAsPage(ginContext)
	if ok == false {
		return emptyData, http.StatusInternalServerError, "Internal server error", true
	}

	limit, ok := getLimitQueryAsLimit(ginContext)
	if ok == false {
		return emptyData, http.StatusInternalServerError, "Internal server error", true
	}

	result := make(map[string][]map[string]string, 2)

	var dataQuery string
	dataQuery += database.Query(`SELECT employee.id, employee.name, employee.rate,`)
	dataQuery += database.Query(`( SELECT COUNT(activity.id)`)
	dataQuery += database.Query(`FROM activity`)
	dataQuery += database.Query(`WHERE activity.employee_id = employee.id )`)
	dataQuery += database.Query(`AS total_activity`)
	dataQuery += database.Query(`FROM employee`)
	dataQuery += database.Query(`WHERE id > `+ page)
	dataQuery += database.Query("AND employee.expired != 1")
	dataQuery += database.Query(`LIMIT `+ limit)

	result["data"] = database.QueryExec(db, dataQuery)

	var totalQuery string
	totalQuery += database.Query(`SELECT COUNT(employee.id) as total`)
	totalQuery += database.Query(`FROM employee`)
	totalQuery += database.Query("WHERE employee.expired != 1")

	result["total"] = database.QueryExec(db, totalQuery)

	return result, http.StatusOK, "OK", false
}