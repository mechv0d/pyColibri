import TitleHeader from "../components/Headers/TitleHeader.jsx";
import BaseWrapper from "../components/BaseWrapper/BaseWrapper.jsx";
import '@material/web/textfield/outlined-text-field.js'
import { useForm } from 'react-hook-form';
import '/src/css/forms.css'
import {useEffect, useState} from "react";
import {useUser} from "../context/UserContext.jsx";
import {useNavigate} from "react-router-dom";

export default function FillProfile() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user, isAuth } = useUser();
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);
    const [profileExists, setProfileExists] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Проверяем существование профиля при загрузке
    useEffect(() => {
        if (!isAuth) {
            navigate("/auth");
            return;
        }

        const checkProfile = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/profiles/${user.id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${user.token}`}});

                if (response.ok) {
                    setProfileExists(true);
                    navigate("/"); // Перенаправляем если профиль существует
                } else if (response.status === 404) {
                    setProfileExists(false);
                } else {
                    throw new Error('Ошибка при проверке профиля');
                }
            } catch (error) {
                console.error('Profile check error:', error);
                setSubmitError('Ошибка при проверке профиля');
            } finally {
                setIsChecking(false);
            }
        };

        checkProfile().then(r => {});
    }, [isAuth, navigate, user.id]);

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/profiles/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${user.token}`,
                },
                body: JSON.stringify({
                    uid: user.id,
                    birthdate: data.birthday,
                    height: data.height,
                    weight: data.weight,
                    gender: data.gender === 'male' // преобразуем в boolean
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при сохранении профиля');
            }

            navigate("/"); // Перенаправляем после успешного сохранения
        } catch (error) {
            console.error('Submit error:', error);
            setSubmitError('Ошибка при сохранении профиля');
        }
    };

    if (isChecking) {
        return <BaseWrapper top_bar_title='Проверка профиля'>
            <p>Проверяем ваш профиль...</p>
        </BaseWrapper>;
    }

    if (profileExists) {
        return null; // Будет перенаправление через useEffect
    }

    return <>
        <BaseWrapper top_bar_title='Регистрация'>
            <TitleHeader text={`Здравствуйте, ${user.name}! Заполните профиль, чтобы продолжить`}/>
            <form className='base-form' onSubmit={handleSubmit(onSubmit)}>
                <md-outlined-text-field
                    label="День рождения"
                    type="date"
                    {...register('birthday', {required: 'Укажите дату рождения'})}
                    errorText={errors.birthday?.message}
                />

                <md-outlined-text-field
                    label="Рост"
                    type="number"
                    placeholder="В сантиметрах"
                    {...register('height', {
                        required: 'Укажите рост',
                        min: {value: 50, message: 'Минимальный рост 50 см'},
                        max: {value: 250, message: 'Максимальный рост 250 см'}
                    })}
                    errorText={errors.height?.message}
                />

                <md-outlined-text-field
                    label="Вес"
                    type="number"
                    placeholder="В килограммах"
                    {...register('weight', {
                        required: 'Укажите вес',
                        min: {value: 20, message: 'Минимальный вес 20 кг'},
                        max: {value: 300, message: 'Максимальный вес 300 кг'}
                    })}
                    errorText={errors.weight?.message}
                />

                <div style={{display: 'flex', alignItems: 'center', gap: '16px', margin: '16px 0'}}>
                    <md-radio
                        id="male-radio"
                        value="male"
                        {...register('gender', {required: 'Выберите пол'})}
                    ></md-radio>
                    <label htmlFor="male-radio">Мужской</label>

                    <md-radio
                        id="female-radio"
                        value="female"
                        {...register('gender')}
                    ></md-radio>
                    <label htmlFor="female-radio">Женский</label>
                </div>
                {errors.gender &&
                    <p style={{color: 'var(--md-sys-color-error)', marginTop: '-8px'}}>{errors.gender.message}</p>}

                <md-filled-button type="submit">
                    Перейти в профиль
                </md-filled-button>
            </form>
        </BaseWrapper>
    </>
}