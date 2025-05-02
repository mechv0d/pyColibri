import {useForm} from 'react-hook-form';
import TitleHeader from "../components/Headers/TitleHeader.jsx";
import BaseWrapper from "../components/BaseWrapper/BaseWrapper.jsx";
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/filled-button.js';
import '/src/css/forms.css'
import '/src/css/create_dish.css'
import {useUser} from "../context/UserContext.jsx";
import {useNavigate, useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';

export default function CreateDish() {
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm();

    const {user, isAuth} = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Перенаправление если пользователь не авторизован
    useEffect(() => {
        if (!isAuth) {
            navigate('/auth', {state: {from: location.pathname}});
        }
    }, [isAuth, navigate, location]);

    const onSubmit = async (data) => {
        if (!isAuth) return;

        try {
            setIsSubmitting(true);
            setSubmitError(null);

            const dishData = {
                name: data.name.trim(),
                photo: " ", // Пустая строка для фото
                descr: data.composition.trim(),
                ev_cal: parseFloat(data.calories) || 0,
                ev_fats: parseFloat(data.fats) || 0,
                ev_proteins: parseFloat(data.proteins) || 0,
                ev_carbohydrates: parseFloat(data.carbs) || 0,
                uid: user.id
            };

            const response = await fetch('http://127.0.0.1:8000/dishes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${user.token}`
                },
                body: JSON.stringify(dishData)
            });

            if (!response.ok) {
                throw new Error(`Ошибка создания блюда: ${response.status}`);
            }

            setSubmitSuccess(true);
            // Можно сбросить форму после успешной отправки
        } catch (error) {
            console.error('Ошибка при создании блюда:', error);
            setSubmitError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuth) {
        return null; // Будет перенаправление через useEffect
    }

    return (
        <BaseWrapper top_bar_title='Добавить блюдо'>
            <form className='base-form' onSubmit={handleSubmit(onSubmit)}>
                <div className="form-section">
                    <h3>Основная информация</h3>
                    <md-outlined-text-field
                        label="Название блюда"
                        type="text"
                        {...register('name', {
                            required: 'Название обязательно',
                            maxLength: {
                                value: 100,
                                message: 'Максимум 100 символов'
                            }
                        })}
                        errorText={errors.name?.message}
                    />

                    <md-outlined-text-field
                        type="textarea"
                        label="Состав"
                        placeholder="Ингредиенты, способ приготовления..."
                        rows="4"
                        {...register('composition', {
                            required: 'Состав обязателен',
                            minLength: {
                                value: 5,
                                message: 'Минимум 5 символов'
                            },
                            maxLength: {
                                value: 1000,
                                message: 'Максимум 1000 символов'
                            }
                        })}
                        errorText={errors.composition?.message}
                    />
                </div>

                <div className="form-section">
                    <h3>Пищевая ценность (на 100 грамм)</h3>
                    <div className="nutrition-grid">
                        <md-outlined-text-field
                            label="Калории (ккал)"
                            type="number"
                            step="0.1"
                            {...register('calories', {
                                min: {
                                    value: 0,
                                    message: 'Не может быть отрицательным'
                                }
                            })}
                            errorText={errors.calories?.message}
                        />

                        <md-outlined-text-field
                            label="Белки (г)"
                            type="number"
                            step="0.1"
                            {...register('proteins', {
                                min: {
                                    value: 0,
                                    message: 'Не может быть отрицательным'
                                }
                            })}
                            errorText={errors.proteins?.message}
                        />

                        <md-outlined-text-field
                            label="Жиры (г)"
                            type="number"
                            step="0.1"
                            {...register('fats', {
                                min: {
                                    value: 0,
                                    message: 'Не может быть отрицательным'
                                }
                            })}
                            errorText={errors.fats?.message}
                        />

                        <md-outlined-text-field
                            label="Углеводы (г)"
                            type="number"
                            step="0.1"
                            {...register('carbs', {
                                min: {
                                    value: 0,
                                    message: 'Не может быть отрицательным'
                                }
                            })}
                            errorText={errors.carbs?.message}
                        />
                    </div>
                </div>

                {submitError && (
                    <p style={{color: 'var(--md-sys-color-error)'}}>
                        {submitError}
                    </p>
                )}

                {submitSuccess ? (
                    <p style={{color: 'var(--md-sys-color-primary)'}}>
                        Блюдо успешно создано!
                    </p>
                ) : (
                    <md-filled-button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Создание...' : 'Создать блюдо'}
                    </md-filled-button>
                )}
            </form>
        </BaseWrapper>
    );
}