import ProgressBar from "./ProgressBar";

const ProgressBars = ({ bars }) => {
    return (
        <>
            {
                bars.map(bar => (
                    <ProgressBar key={bar.id} value={bar.progress} />
                ))
            }
        </>
    )
}

export default ProgressBars;