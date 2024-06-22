package list

import(
	"fmt"
	"strconv"
	"net/http"
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/onecthree/timesheet/database"
	"github.com/onecthree/timesheet/functions"
)

func isPostQueryValid( ginContext *gin.Context ) bool {
	page, exists := ginContext.GetQuery("page")
	if exists == false || len(page) == 0 || functions.IsNumeric(page) == false {
		return false
	}

	limit, exists := ginContext.GetQuery("limit")
	if exists == false || len(limit) == 0 || functions.IsNumeric(limit) == false {
		return false
	}

	order_by, exists := ginContext.GetQuery("order_by")
	if exists == false || len(order_by) == 0 || (order_by != "default" && order_by != "name" && order_by != "rate" && order_by != "total_activity") {
		return false
	}

	sort_by, exists := ginContext.GetQuery("sort_by")
	if exists == false || len(sort_by) == 0 || (sort_by != "asc" && sort_by != "desc") {
		return false
	}

	return true
}

func getQuerySearch( ginContext *gin.Context ) string {
	querySearch, ok := ginContext.GetQuery("search")
	if ok == false {
		return ""
	}

	return querySearch
}

func getTotalActivitySearch( ginContext *gin.Context ) (string, bool) {
	totalActivitySearch, ok := ginContext.GetQuery("total_activity")
	if ok == false || functions.IsNumeric(totalActivitySearch) == false {
		return "", false
	}

	return totalActivitySearch, true
}

func getPageQueryAsPage( newPage string, limit string ) (string, bool) {
	page, err := strconv.ParseUint(newPage, 10, 64)
	if err != nil {
		return "", false
	}

	if page < 2 {
		return "0", true
	}

	limitCast, err := strconv.ParseUint(limit, 10, 64)
	if err != nil {
		return "", false
	}

	return strconv.Itoa(int((page - 1) * limitCast)), true
}

func getLimitQueryAsLimit( ginContext *gin.Context ) (string, bool) {
	limit := ginContext.Query("limit")

	if limit != "10" && limit != "25" && limit != "50" {
		return "", false
	}

	return limit, true
}

func getMaxPage( totalData string, limitData string ) (string, bool) {
	totalDataCast, err := strconv.ParseUint(totalData, 10, 64)
	if err != nil {
		return "", false
	}

	if totalDataCast == 0 {
		return "1", true
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

func currentTargetPageCompare( total string, ginContext *gin.Context ) (string, bool) {
	totalCast, err := strconv.ParseUint(total, 10, 64)
	if err != nil {
		return "", false
	} // 	

	if totalCast == 0 {
		return "1", true
	}

	pageCast, err := strconv.ParseUint(ginContext.Query("page"), 10, 64)
	if err != nil {
		return "", false
	} // 22

	limitCast, err := strconv.ParseUint(ginContext.Query("limit"), 10, 64)
	if err != nil {
		return "", false
	}

	for true {
		if ((pageCast-1) * limitCast) <= totalCast {
			return strconv.Itoa(int(pageCast)), true
		}

		pageCast -= 1
	} // p2, 25, 22; 25 | 22 -- p1, 25, 22; 0 | 22

	return "", false
}

func PostResponse( ginContext *gin.Context, db *sql.DB ) (map[string][]map[string]string, int, string, bool) {
	var emptyData map[string][]map[string]string
	result := make(map[string][]map[string]string, 3)

	if isPostQueryValid(ginContext) == false {
		return emptyData, http.StatusBadRequest, "Request query are invalid [0]", true
	}

	limit, ok := getLimitQueryAsLimit(ginContext)
	if ok == false {
		return emptyData, http.StatusInternalServerError, "Internal server error [0]", true
	}

	querySearch := getQuerySearch(ginContext)
	totalActivitySearch, totalActivitySearchOk := getTotalActivitySearch(ginContext)

	var totalQuery string
	totalQuery += database.Query(`SELECT COUNT(employee.id) AS total`)
	totalQuery += database.Query(`, ( SELECT COUNT(*)`)
	totalQuery += database.Query(`FROM activity`)
	totalQuery += database.Query(`WHERE activity.employee_id = employee.id )`)
	totalQuery += database.Query(`AS total_activity`)
	totalQuery += database.Query(`FROM employee`)
	totalQuery += database.Query(`WHERE employee.expired != 1`)
	totalQuery += database.Query(`AND ( LOWER(name) LIKE LOWER('%`+ querySearch +`%')`)
	totalQuery += database.Query(`OR LOWER(rate) LIKE LOWER('%`+ querySearch +`%') )`)
	if totalActivitySearchOk {
		totalQuery += database.Query(`HAVING total_activity = `+ totalActivitySearch)	
	}

	result["total"] = database.QueryExec(db, totalQuery)

	totalData := "0"
	if len((result["total"])) > 0 {
		totalData = (result["total"])[0]["total"]
		fmt.Printf("totalData: %v\n", totalData)
	}

	newPage, ok := currentTargetPageCompare(totalData, ginContext);
	if ok == false {
		return emptyData, http.StatusInternalServerError, "Internal server error [1]", true
	}

	fmt.Printf("newPage, %v\n", newPage);

	maxPage, ok := getMaxPage(totalData, limit)
	if ok == false {
		return emptyData, http.StatusInternalServerError, "Internal server error [2]", true
	}

	pageLimit, ok := getPageQueryAsPage(newPage, limit)
	if ok == false {
		return emptyData, http.StatusInternalServerError, "Internal server error [3]", true
	}

	fmt.Printf("newLimit, %v\n", pageLimit);

	sortBy := ginContext.Query("sort_by")
	orderBy := ginContext.Query("order_by")

	var dataQuery string
	dataQuery += database.Query(`SELECT employee.id, employee.name, employee.rate,`)
	dataQuery += database.Query(`( SELECT COUNT(activity.id)`)
	dataQuery += database.Query(`FROM activity`)
	dataQuery += database.Query(`WHERE activity.employee_id = employee.id )`)
	dataQuery += database.Query(`AS total_activity`)
	// dataQuery += database.Query(`GROUP BY employee.id`)
	dataQuery += database.Query(`FROM employee`)
	// if querySearch == "" && orderBy == "default" {
	// 	dataQuery += database.Query(`WHERE id > `+ pageLimit)
	// 	dataQuery += database.Query(`AND employee.expired != 1`)
	// } else {
		dataQuery += database.Query(`WHERE employee.expired != 1`)
	// }
	dataQuery += database.Query(`AND ( LOWER(name) LIKE LOWER('%`+ querySearch +`%')`)
	dataQuery += database.Query(`OR LOWER(rate) LIKE LOWER('%`+ querySearch +`%') )`)

	if orderBy != "default" {
		dataQuery += database.Query("ORDER BY "+ orderBy +" "+ sortBy);	
	}

	if totalActivitySearchOk {
		fmt.Printf("ADAAAAA1122\n")
		dataQuery += database.Query(`GROUP BY employee.id`)
		dataQuery += database.Query(`HAVING total_activity = `+ totalActivitySearch)	
	}

	dataQuery += database.Query(`LIMIT `+ limit)
	// if querySearch != "" || orderBy != "default" {
		dataQuery += database.Query(`OFFSET `+ pageLimit)
	// }

	fmt.Printf("Query: %v\n", dataQuery)

	result["data"] = database.QueryExec(db, dataQuery)

	tmp := make([]map[string]string, 1)
	tmp[0] = make(map[string]string, 1)
	tmp[0]["maxPage"] = maxPage
	result["maxPage"] = tmp;

	return result, http.StatusOK, "OK", false
}