import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        lineDivisorContainer: {
            borderTop: "1px solid #dadce0",
            // minWidth: '100%',
        },
        lineDivisor: {
            height: 60,
            "&:after": {
                content: "''",
                borderBottom: "1px solid #dadce0",
                position: "absolute",
                width: "100%",
                marginTop: -1,
                zIndex: 3,
                pointerEvents: "none",
            },
        },
        columnDivisor: {
            height: "100%",
            paddingLeft: 8,
            borderRight: "1px solid #dadce0",
        },
    }),
)

function LineDivisor(props: any) {
    const classes = useStyles()

    return (
        <div className={classes.lineDivisorContainer}>
            {Array.from(Array(24).keys()).map((_: any, ix: number) => (
                <div key={`time-line-divisor-${ix}`} className={classes.lineDivisor} data-group='time-line' />
            ))}
        </div>
    )
    // ....
    // ....
    // eslint-disable-next-line react-hooks/exhaustive-deps
}

export default LineDivisor
