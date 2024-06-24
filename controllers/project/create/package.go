package create

import(
	// "fmt"
	// "strconv"
	"regexp"
	"net/http"
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/onecthree/timesheet/database"
	// "github.com/onecthree/timesheet/functions"
)

type Project struct {
    Title 	string `json:"title" form:"title"` 
}

func isPostQueryValid( ginContext *gin.Context ) bool {
	_, err := ginContext.MultipartForm()

	if err != nil {
		panic(err)
		return false
	}

	var project Project
	if err := ginContext.Bind(&project); err != nil {
		return false
	}

	if len(project.Title) == 0 {
		return false
	}

    // fmt.Printf("das6\n")
    titleRegex, err := regexp.Compile(`[^a-zA-Z0-9\s+]`)
    if err != nil {
    	return false
    }

    // fmt.Printf("das7 -%v-\n", project.Title)
    if len(titleRegex.FindAllString(project.Title, 1)) > 0 {
    	return false
    }

    if len(project.Title) < 6 || len(project.Title) > 30 {
    	return false
    }
    // fmt.Printf("das10\n")

	return true
}

func PostResponse( ginContext *gin.Context, db *sql.DB ) ( int, string, bool ) {
	if isPostQueryValid(ginContext) == false {
		return http.StatusBadRequest, "Request body are invalid [0]", true
	}

	var insertQuery string
	insertQuery += database.Query(`INSERT INTO project`);
	insertQuery += database.Query(`(title)`);
	insertQuery += database.Query(`VALUES`);
	insertQuery += database.Query(`('`+ ginContext.PostForm("title") +`')`);

	database.QueryExec(db, insertQuery)

	return http.StatusOK, "OK", false
}