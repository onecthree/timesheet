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

func getPageQueryAsPage( newPage string ) (string, bool) {
	page, err := strconv.ParseUint(newPage, 10, 64)
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
		return emptyData, http.StatusBadRequest, "Request query are invalid", true
	}

	limit, ok := getLimitQueryAsLimit(ginContext)
	if ok == false {
		return emptyData, http.StatusInternalServerError, "Internal server error", true
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
		return emptyData, http.StatusInternalServerError, "Internal server error", true
	}

	maxPage, ok := getMaxPage(totalData, limit)
	if ok == false {
		return emptyData, http.StatusInternalServerError, "Internal server error", true
	}

	pageLimit, ok := getPageQueryAsPage(newPage)
	if ok == false {
		return emptyData, http.StatusInternalServerError, "Internal server error", true
	}

	var dataQuery string
	dataQuery += database.Query(`SELECT employee.id, employee.name, employee.rate,`)
	dataQuery += database.Query(`( SELECT COUNT(activity.id)`)
	dataQuery += database.Query(`FROM activity`)
	dataQuery += database.Query(`WHERE activity.employee_id = employee.id )`)
	dataQuery += database.Query(`AS total_activity`)
	// dataQuery += database.Query(`GROUP BY employee.id`)
	dataQuery += database.Query(`FROM employee`)
	if querySearch == "" {
		dataQuery += database.Query(`WHERE id > `+ pageLimit)
		dataQuery += database.Query(`AND employee.expired != 1`)
	} else {
		dataQuery += database.Query(`WHERE employee.expired != 1`)
	}
	dataQuery += database.Query(`AND ( LOWER(name) LIKE LOWER('%`+ querySearch +`%')`)
	dataQuery += database.Query(`OR LOWER(rate) LIKE LOWER('%`+ querySearch +`%') )`)

	if totalActivitySearchOk {
		dataQuery += database.Query(`GROUP BY employee.id`)
		dataQuery += database.Query(`HAVING total_activity = `+ totalActivitySearch)	
	}

	dataQuery += database.Query(`LIMIT `+ limit)
	if querySearch != "" {
		dataQuery += database.Query(`OFFSET `+ pageLimit)
	}

	result["data"] = database.QueryExec(db, dataQuery)

	tmp := make([]map[string]string, 1)
	tmp[0] = make(map[string]string, 1)
	tmp[0]["maxPage"] = maxPage
	result["maxPage"] = tmp;

	return result, http.StatusOK, "OK", false
}