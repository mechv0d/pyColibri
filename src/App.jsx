import {useEffect, useState} from 'react'
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

function App() {
    const {user, isAuth} = useUser();
    const navigate = useNavigate();
    const [portions, setPortions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuth) {
            navigate("/auth");
            return;
        }

        const fetchPortions = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/portions/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${user.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Ошибка загрузки данных');
                }
                const data = await response.json();
                setPortions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPortions();
    }, [isAuth, navigate, user?.id]);

    // Фильтруем порции по пользователю и сегодняшней дате
    const filteredPortions = portions.filter(portion => {
        if (!user) return false;

        // Проверяем что порция принадлежит текущему пользователю
        const isUserPortion = portion.dish_details?.uid === user.id;

        // Проверяем что дата приема пищи - сегодня
        const mealDate = new Date(portion.meal_details?.meal_datetime);
        const today = new Date();
        const isToday = mealDate.getDate() === today.getDate() &&
            mealDate.getMonth() === today.getMonth() &&
            mealDate.getFullYear() === today.getFullYear();

        return isUserPortion && isToday;
    });


    // Форматируем время для отображения
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    if (loading) {
        return (
            <BaseWrapper top_bar_title='Загрузка...'>
                <p>Загрузка данных...</p>
            </BaseWrapper>
        );
    }

    if (error) {
        return (
            <BaseWrapper top_bar_title='Ошибка'>
                <p>Ошибка: {error}</p>
            </BaseWrapper>
        );
    }

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
                        <md-filled-button className="interr-button" href="/create-result">Записать промежуточный
                            результат
                        </md-filled-button>
                    </div>
                </div>

                <TitleHeader
                    text={`Сегодня, ${new Date().toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'})}`}/>
                <DishList>
                    {filteredPortions.map(portion => (
                        <DishFrame
                            key={portion.id}
                            time={formatTime(portion.meal_details.meal_datetime)}
                        >
                            <Dish
                                cal={portion.dish_details.ev_cal * portion.weight / 100}
                                name={portion.dish_details.name}
                                desc={portion.dish_details.descr}
                                img={portion.dish_details.photo.trim() || null}
                            />
                        </DishFrame>
                    ))}
                    <DishFrame time=""><AddDishButton/></DishFrame>
                </DishList>

                <TitleHeader text="Блог"/>
            </BaseWrapper>
        </>
    )
}

export default App