import '@material/web/progress/circular-progress.js'
import './CircularProgress.css'

function CircularProgress(props) {
    return <>
        <div className="circular-progress">
            <md-circular-progress className="progress-bar" value={props.value}/>
            <span className="md-typescale-title-medium">
                {props.inner_text ?? ''}
            </span>
        </div>

    </>
}

export default CircularProgress;