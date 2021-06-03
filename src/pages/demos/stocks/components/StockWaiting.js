import { CircularProgress } from "@material-ui/core"
import { memo } from "react"

function StockWaiting() {

    return (
        <>
            Waiting for a trade... { <CircularProgress size="1rem" />}
        </>
    )
}

export default memo(StockWaiting)
