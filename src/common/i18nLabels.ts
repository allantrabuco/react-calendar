export const i18nPreviousLabel = (layout: string) => {
    switch (layout) {
        case "day":
            return "navigation.previousDay"
        case "week":
            return "navigation.previousWeek"
        case "month":
            return "navigation.previousMonth"
        default:
            return "navigation.previous"
    }
}

export const i18nNextLabel = (layout: string) => {
    switch (layout) {
        case "day":
            return "navigation.nextDay"
        case "week":
            return "navigation.nextWeek"
        case "month":
            return "navigation.nextMonth"
        default:
            return "navigation.next"
    }
}
