import './BaseWrapper.css'
import TopAppBar from "../Headers/TopAppBar.jsx";
import NavRail from "../NavRail/NavRail.jsx";

function BaseWrapper(props) {
    return <>
        <div className="base-wrapper">
            <NavRail/>
            <div className="content">
                <TopAppBar title_text={props.top_bar_title}/>
                {props.children}
            </div>
        </div>
    </>
}

export default BaseWrapper