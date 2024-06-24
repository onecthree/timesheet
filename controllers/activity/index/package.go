package index

import(
	"fmt"
	"strings"
	"strconv"
	"net/http"
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/onecthree/timesheet/database"
	"github.com/onecthree/timesheet/functions"
)

func isGetQueryValid( ginContext *gin.Context ) (string, bool) {
	slug := strings.Split(ginContext.Param("slug"), "-")

	if len(slug) < 1 {
		return "", false
	}

	if functions.IsNumeric(slug[0]) == false {
		return "", false
	}

	page, exists := ginContext.GetQuery("page")
	if exists == false || len(page) == 0 || functions.IsNumeric(page) == false {
		return "", false
	}

	pageCast, err := strconv.ParseUint(page, 10, 64)
	if err != nil {
		return "", false
	}

	if pageCast < 1 {
		return "", false
	}


	limit, exists := ginContext.GetQuery("limit")
	if exists == false || len(limit) == 0 || functions.IsNumeric(limit) == false {
		return "", false
	}

	if limit != "10" && limit != "25" && limit != "50" {
		return "", false
	}

	order_by, exists := ginContext.GetQuery("order_by")
	if exists == false || len(order_by) == 0 || (order_by != "default" && order_by != "name" && order_by != "rate" && order_by != "total_activity") {
		return "", false
	}

	sort_by, exists := ginContext.GetQuery("sort_by")
	if exists == false || len(sort_by) == 0 || (sort_by != "asc" && sort_by != "desc") {
		return "", false
	}

	return slug[0], true
}

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

	id, isGetQueryAreValid := isGetQueryValid(ginContext)
	if isGetQueryAreValid == false {
		return emptyData, http.StatusFound, "Request query are invalid", true
	}

	var query string
	query += database.Query(`SELECT COUNT(activity.id) AS totalData, employee.name, employee.rate`)
	query += database.Query(`FROM activity`)
	query += database.Query(`INNER JOIN employee ON employee.id = activity.employee_id`)
	query += database.Query("WHERE activity.expired != 1")
	query += database.Query(`AND activity.employee_id = `+ id)

	result := database.QueryExec(db, query)

	fmt.Printf("DATA HARI %v\n", result)

	if result[0]["totalData"] == "0" {
		return emptyData, http.StatusFound, "Employee is not exists", true	
	}

	maxPage, ok := getMaxPage(result[0]["totalData"], ginContext.Query("limit"))
	if ok == false {
		return emptyData, http.StatusInternalServerError, "Internal server error", true
	}

	retval := make([]map[string]string, 1)
	retval[0] = make(map[string]string, 3)
	retval[0]["maxPage"] = maxPage
	retval[0]["name"] = result[0]["name"]
	retval[0]["rate"] = result[0]["rate"]

	return retval, http.StatusOK, "OK", false
}