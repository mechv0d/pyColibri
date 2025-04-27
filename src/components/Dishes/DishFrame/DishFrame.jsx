import './DishFrame.css'

function DishFrame(props) {
    return <>
    <div className="dish-frame">
        <span className="time is_running_out">{props.time}</span>
        {props.children}
    </div>
    </>
}

export default DishFrame;