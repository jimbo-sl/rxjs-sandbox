import { memo } from 'react'
import PropTypes from 'prop-types'
import LinearProgressWithLabel from './LinearProgressWithLabel';

function ProgressBar({ value }) {
    return (
        <>
            <LinearProgressWithLabel value={value} />
        </>
    )
}

ProgressBar.propTypes = {
    value: PropTypes.number.isRequired
};

ProgressBar.defaultProps = {
    value: 0
};

export default memo(ProgressBar)
