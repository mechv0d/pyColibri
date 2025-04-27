import './DishList.css'

function DishList(props) {
    return <>
        <div className={"dish-list"}>
            {props.children}
        </div>
    </>
}

export default DishList