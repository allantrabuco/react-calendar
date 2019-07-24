import React from "react"
import { format, differenceInHours, addHours, addMinutes, getTime, addSeconds } from "date-fns"

const duration = 60

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const fakeEvents = (weekBegin: Date, weekEnd: Date) => {
    const totalOfHours = differenceInHours(weekEnd, weekBegin)

    return Array.from(Array(totalOfHours).keys()).reduce((event: any[], hour: number) => {
        const datetime = addHours(weekBegin, hour)

        event.push({
            id: getTime(datetime),
            title: `test ${hour} #1`,
            begin: format(datetime, "YYYY/MM/DD H:mm:00"),
            end: format(addMinutes(datetime, duration), "YYYY/MM/DD H:mm:00"),
            description: `description: test ${hour}`,
        })

        let begin = addMinutes(datetime, getRandomInt(0, 10) % 2 === 0 ? 0 : 30)
        let end = addMinutes(begin, duration)

        event.push({
            id: getTime(addSeconds(datetime, 1)),
            title: `test ${hour} #2`,
            begin: format(begin, "YYYY/MM/DD H:mm:00"),
            end: format(end, "YYYY/MM/DD H:mm:00"),
            description: `description: test ${hour}`,
        })

        begin = addMinutes(datetime, getRandomInt(0, 10) % 2 === 0 ? 15 : 45)
        end = addMinutes(begin, duration)

        event.push({
            id: getTime(addSeconds(datetime, 2)),
            title: `test ${hour} #3`,
            begin: format(begin, "YYYY/MM/DD H:mm:00"),
            end: format(end, "YYYY/MM/DD H:mm:00"),
            description: `description: test ${hour}`,
        })

        return event
    }, [])
}

// const fakeEvents = [
//     {
//         id: 1559768394349,
//         title: "teste",
//         begin: "2019/06/05 14:00:00",
//         end: "2019/06/05 15:00:00",
//         description: "teste",
//     },
// ]
export default fakeEvents
