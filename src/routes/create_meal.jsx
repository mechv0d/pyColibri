import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TitleHeader from "../components/Headers/TitleHeader.jsx";
import BaseWrapper from "../components/BaseWrapper/BaseWrapper.jsx";
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/filled-button.js';
import '@material/web/checkbox/checkbox.js';
import '/src/css/forms.css';
import '/src/css/create_meal.css';
import { useUser } from "../context/UserContext.jsx";
import { useNavigate, useLocation } from 'react-router-dom';

export default function CreateMeal() {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const { user, isAuth } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [dishes, setDishes] = useState([]);
    const [selectedDishes, setSelectedDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Получаем блюда пользователя
    useEffect(() => {
        if (!isAuth) {
            navigate('/auth', { state: { from: location.pathname } });
            return;
        }

        const fetchDishes = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/dishes/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${user.token}`
                    },
                });
                if (!response.ok) throw new Error('Ошибка загрузки блюд');
                const data = await response.json();
                setDishes(data.filter(dish => dish.uid === user.id));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDishes();
    }, [isAuth, navigate, location, user?.id]);

    // Обработчик выбора блюда
    const handleDishSelect = (dishId) => {
        setSelectedDishes(prev => {
            if (prev.includes(dishId)) {
                return prev.filter(id => id !== dishId);
            } else {
                return [...prev, dishId];
            }
        });
    };

    // Отправка формы
    const onSubmit = async (data) => {
        if (!isAuth || selectedDishes.length === 0) return;

        try {
            setIsSubmitting(true);
            setError(null);

            // Получаем временную зону пользователя (может храниться в user.timezone)
            const userTimezone = user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

            // Создаем дату в локальной зоне пользователя
            const localDate = new Date(
                `${data.date}T${data.hour}:${data.minute}:00`
            );

            // Конвертируем в ISO строку с указанием временной зоны
            const mealDateTime = new Date(
                localDate.getTime()
            ).toISOString(); //  - localDate.getTimezoneOffset() * 60000

            console.log(mealDateTime)

            // Или альтернативный вариант с библиотекой date-fns-tz:
            // import { zonedTimeToUtc } from 'date-fns-tz';
            // const mealDateTime = zonedTimeToUtc(
            //     `${data.date} ${data.hour}:${data.minute}`,
            //     userTimezone
            // ).toISOString();

            const mealData = {
                meal_datetime: mealDateTime,
                extra_name: data.extra_name || "",
                extra_weight: data.extra_weight || 0,
                uid: user.id
            };

            const mealResponse = await fetch('http://127.0.0.1:8000/meals/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${user.token}`
                },
                body: JSON.stringify(mealData)
            });

            if (!mealResponse.ok) throw new Error('Ошибка создания приема пищи');

            const meal = await mealResponse.json();

            // Создаем порции для выбранных блюд
            for (const dishId of selectedDishes) {
                const portionData = {
                    meal: meal.id,
                    dish: dishId,
                    weight: data[`weight_${dishId}`] || 100
                };

                const portionResponse = await fetch('http://127.0.0.1:8000/portions/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${user.token}`
                    },
                    body: JSON.stringify(portionData)
                });

                if (!portionResponse.ok) throw new Error('Ошибка создания порции');
            }

            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuth || loading) {
        return null;
    }

    return (
        <BaseWrapper top_bar_title='Добавить приём пищи'>
            <form className='base-form' onSubmit={handleSubmit(onSubmit)}>
                <TitleHeader text="Дата и время"/>

                <div className="time-inputs">
                    <div>
                        <label>Час</label>
                        <md-outlined-text-field
                            type="number"
                            min="0"
                            max="23"
                            {...register('hour', { required: 'Укажите час' })}
                            errorText={errors.hour?.message}
                        />
                    </div>

                    <div>
                        <label>Минута</label>
                        <md-outlined-text-field
                            type="number"
                            min="0"
                            max="59"
                            {...register('minute', { required: 'Укажите минуты' })}
                            errorText={errors.minute?.message}
                        />
                    </div>
                </div>

                <div className="date-input">
                    <label>Дата</label>
                    <md-outlined-text-field
                        type="date"
                        {...register('date', { required: 'Укажите дату' })}
                        errorText={errors.date?.message}
                    />
                </div>

                <TitleHeader text="Выбрать блюда"/>

                {error && <p className="error-message">{error}</p>}

                <div className="dishes-list">
                    {dishes.length > 0 ? (
                        dishes.map(dish => (
                            <div key={dish.id} className="dish-item">
                                <md-checkbox
                                    checked={selectedDishes.includes(dish.id)}
                                    onClick={() => handleDishSelect(dish.id)}
                                />

                                <div className="dish-info">
                                    <span className="dish-name">{dish.name}</span>
                                    <span className="dish-calories">+{dish.ev_cal} ккал/100г</span>
                                    <span className="dish-descr">{dish.descr}</span>
                                </div>

                                {selectedDishes.includes(dish.id) && (
                                    <div className="dish-weight">
                                        <md-outlined-text-field
                                            label="Грамм"
                                            type="number"
                                            min="1"
                                            {...register(`weight_${dish.id}`, {
                                                required: 'Укажите вес',
                                                min: { value: 1, message: 'Минимум 1 грамм' }
                                            })}
                                            errorText={errors[`weight_${dish.id}`]?.message}
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>У вас пока нет блюд. Создайте сначала блюдо.</p>
                    )}
                </div>

                <TitleHeader text="Доп. информация"/>

                <md-outlined-text-field
                    label="Название (если не входит в основные блюда)"
                    {...register('extra_name')}
                />

                <md-outlined-text-field
                    label="Вес (грамм)"
                    type="number"
                    min="0"
                    {...register('extra_weight')}
                />

                <md-filled-button type="submit" disabled={isSubmitting || selectedDishes.length === 0}>
                    {isSubmitting ? 'Сохранение...' : 'Создать приём пищи'}
                </md-filled-button>
            </form>
        </BaseWrapper>
    );
}