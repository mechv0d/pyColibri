import './Dish.css'

function Dish(props) {
    return <>
        <div className="dish">
            <div className="dish-content">
                <div className="ccal-text">
                    <span className="text">+{props.cal}</span>
                    <label className="text small">ккал</label>
                </div>
                <div className="text">
                    <span className="header">{props.name}</span>
                    <span className="subhead">{props.desc}</span>
                </div>
            </div>
            <img alt="Media" className="media" src={props.img}/>
        </div>
    </>
}

export default Dish;