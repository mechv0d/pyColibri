// import {useState} from 'react'
import './App.css'
import '@material/web/all.js'
import BaseWrapper from "./components/BaseWrapper/BaseWrapper.jsx";
import TitleHeader from "./components/Headers/TitleHeader.jsx";
import CircularProgress from "./components/CircularProgress/CircularProgress.jsx";
import Graph from "./components/Graph/Graph.jsx";
import DishList from "./components/Dishes/DishList/DishList.jsx";
import Dish from "./components/Dishes/Dish/Dish.jsx";
import DishFrame from "./components/Dishes/DishFrame/DishFrame.jsx";
import AddDishButton from "./components/Dishes/AddDishButton/AddDishButton.jsx";
import {useUser} from "./context/UserContext.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

function App() {
    const { user, isAuth } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuth) navigate("/auth");
    }, [isAuth, navigate, user]);

    return (
        <>
            <BaseWrapper top_bar_title='Домашняя страница'>
                <TitleHeader text="Статистика"/>
                <div className="activity-progress">
                    <div className="circles">
                        <CircularProgress value={0.75} inner_text="1521 ккал."></CircularProgress>
                        <CircularProgress value={0.41} inner_text="11 дней"></CircularProgress>
                    </div>
                    <Graph values={[.2, .4, .7, .8, .4, .95, .6, 1, .6, 1, .8, 1].reverse()}/>
                    <div className="activity-subhead">
                        <span className="subhead">Subhead Text</span>
                        <md-filled-button className="interr-button">Записать промежуточный результат</md-filled-button>
                    </div>
                </div>

                <TitleHeader text="Сегодня, 12 января"/>
                <DishList>
                    <DishFrame time="9:30"><Dish cal={123} name="Блюдо" desc="Описание" img={null}/></DishFrame>
                    <DishFrame time="9:30"><Dish cal={123} name="Блюдо" desc="Описание" img={null}/></DishFrame>
                    <DishFrame time="9:30"><Dish cal={123} name="Блюдо" desc="Описание" img={null}/></DishFrame>
                    <DishFrame time=""><AddDishButton/></DishFrame>
                </DishList>

                <TitleHeader text="Блог"/>

            </BaseWrapper>
        </>
    )
}

export default App
