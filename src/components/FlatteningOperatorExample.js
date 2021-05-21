import { Button, makeStyles } from "@material-ui/core";
import ProgressBars from "./ProgressBars";

const useStyles = makeStyles((theme) => ({
    btn: {
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2)
    }
}));


const FlatteningOperatorExample = ({ bars, onTrigger, onComplete }) => {
    const classes = useStyles();

    return (
        <>
            <Button className={classes.btn} variant="contained" color="primary" onClick={onTrigger}>Trigger Outer Observable!</Button>
            <Button className={classes.btn} variant="contained" color="secondary" onClick={onComplete}>Complete Outer Observable!</Button>

            <ProgressBars bars={bars} />
        </>
    )
}

export default FlatteningOperatorExample
