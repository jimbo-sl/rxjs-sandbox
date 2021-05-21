import { Button, makeStyles } from "@material-ui/core";
import ProgressBar from "./ProgressBar";

const useStyles = makeStyles((theme) => ({
    btn: {
        marginRight: theme.spacing(2)
    }
}));

const FlatteningStrategyDisplay = ({ obj, onTrigger, onComplete }) => {
    const classes = useStyles();

    const onTriggerClick = () => {
        onTrigger();
    };

    const onCompleteClick = () => {
        onComplete();
    };

    return (
        <>
            {
                Object.keys(obj).map(key => (
                    <ProgressBar key={key} value={obj[key]} />
                ))
            }
            <Button className={classes.btn} variant="contained" color="primary" onClick={onTriggerClick}>Trigger Outer Observable!</Button>
            <Button className={classes.btn} variant="contained" color="secondary" onClick={onCompleteClick}>Complete Outer Observable!</Button>
        </>
    )
}

export default FlatteningStrategyDisplay;