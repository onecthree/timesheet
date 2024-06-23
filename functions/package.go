package functions

import(
    "regexp"
)

func IsNumeric(s string) bool {
    sNumber, err := regexp.Compile(`[^0-9]+`)
    if err != nil {
        panic(err)
        return false
    }

    if len(sNumber.FindAllString(s, 1)) > 0 {
        return false
    }

    return true;
}