package create

import(
	"fmt"
	// "strconv"
	"time"
	"regexp"
	"net/http"
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/onecthree/timesheet/database"
	"github.com/onecthree/timesheet/functions"
)

type Activity struct {
    Title 	string `json:"title" form:"title"` 
    DateStart 	string `json:"date_start" form:"date_start"` 
    DateEnd 	string `json:"date_end" form:"date_end"` 
    TimeStart 	string `json:"time_start" form:"time_start"` 
    TimeEnd 	string `json:"time_end" form:"time_end"` 
    ProjectId 	string `json:"project_id" form:"project_id"` 
    EmployeeId 	string `json:"employee_id" form:"employee_id"` 
}

func isPostQueryValid( ginContext *gin.Context ) (string, string, bool) {
	_, err := ginContext.MultipartForm()

	if err != nil {
		panic(err)
		return "", "", false
	}

	var activity Activity
	if err := ginContext.Bind(&activity); err != nil {
		return "", "", false
	}

	fmt.Printf("OKOK %v\n", activity)

	titleRegex, err := regexp.Compile(`[^a-zA-Z0-9\s+]`)
    if err != nil {
    	return "", "", false
    }

	if len(activity.Title) == 0 {
		return "", "", false
	}

    if len(titleRegex.FindAllString(activity.Title, 1)) > 0 {
    	return "", "", false
    }

    if len(activity.Title) < 6 || len(activity.Title) > 30 {
    	return "", "", false
    }

    if len(activity.DateStart) != 10 {
    	return "", "", false;
    }

	dateStart, err := time.Parse("02/01/2006", activity.DateStart)
	if err != nil {
		// panic(err)
		return "", "", false;
	}

	if len(activity.DateEnd) != 10 {
    	return "", "", false;
    }

	dateEnd, err := time.Parse("02/01/2006", activity.DateEnd)
	if err != nil {
		// panic(err)
		return "", "", false;
	}

	timeRegex, err := regexp.Compile("^([01][0-9]|2[0-3]):([0-5][0-9])$");

	if len(timeRegex.FindAllString(activity.TimeStart, 1)) < 1 {
		return "", "", false;
	}


	if len(timeRegex.FindAllString(activity.TimeEnd, 1)) < 1 {
		return "", "", false;
	}

	if len(activity.ProjectId) == 0 {
		return "", "", false;
	}

	if functions.IsNumeric(activity.ProjectId) == false {
		return "", "", false;
	}

	if len(activity.EmployeeId) == 0 {
		return "", "", false;
	}

	if functions.IsNumeric(activity.EmployeeId) == false {
		return "", "", false;
	}

	return dateStart.Format("2006-01-02 15:04:05"), dateEnd.Format("2006-01-02 15:04:05"), true
}

func PostResponse( ginContext *gin.Context, db *sql.DB ) ( int, string, bool ) {
	dateStart, dateEnd, ok :=isPostQueryValid(ginContext)
	if ok == false {
		return http.StatusBadRequest, "Request body are invalid [0]", true
	}

	var insertQuery string
	insertQuery += database.Query(`INSERT INTO activity`);
	insertQuery += database.Query(`(project_id, employee_id, date_start, date_end, time_start, time_end, title)`);
	insertQuery += database.Query(`VALUES`);
	insertQuery += database.Query(`(`+ ginContext.PostForm("project_id") +`, `+ ginContext.PostForm("employee_id") +`, '`+ dateStart +`', '`+dateEnd+`', '`+ ginContext.PostForm("time_start") +`',`)
	insertQuery += database.Query(`'`+ ginContext.PostForm("time_end") +`', '`+ ginContext.PostForm("title") +`')`);

	database.QueryExec(db, insertQuery)

	return http.StatusOK, "OK", false
}