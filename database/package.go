package database

import(
	"fmt"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

func Query( query string ) string {
	return query + " "
}

func QueryExec( db *sql.DB, query string ) []map[string]string {
	rows, err := db.Query(query)
	if err != nil {
		panic(err.Error())
	}

	// Get column names
	columns, err := rows.Columns()
	if err != nil {
		panic(err.Error())
	}

	values := make([]sql.RawBytes, len(columns))

	scanArgs := make([]interface{}, len(values))
	for i := range values {
		scanArgs[i] = &values[i]
	}

	data := make([]map[string]string, 0)

	for rows.Next() {
		err = rows.Scan(scanArgs...)
		if err != nil {
			panic(err.Error())
		}

		pair := make(map[string]string, 0)
		var value string
		for i, col := range values {
			if col == nil {
				value = "NULL"
			} else {
				value = string(col)
			}
			fmt.Println(columns[i], ": ", value)

			// result = append(result, columns[i])
			// result = append(result, value)

			pair[columns[i]] = value;
		}

		data = append(data, pair)
	}
	if err = rows.Err(); err != nil {
		panic(err.Error())
	}

	return data
}