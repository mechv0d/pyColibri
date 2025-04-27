import '@material/web/all.js'
import './TopAppBar.css'

function TopAppBar(props) {
    return <>
        <div className="top-app-bar">
        <h1 className="headline">
            <span className="md-typescale-headline-medium">{props.title_text}</span>
        </h1>
        </div>
    </>
}

export default TopAppBar