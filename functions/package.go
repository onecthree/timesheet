package functions

import(
	"strconv"
)

func IsNumeric(s string) bool {
    _, err := strconv.ParseUint(s, 10, 64)
    return err == nil
}