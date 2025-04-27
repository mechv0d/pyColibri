import TitleHeader from "../components/Headers/TitleHeader.jsx";
import BaseWrapper from "../components/BaseWrapper/BaseWrapper.jsx";
import '@material/web/textfield/outlined-text-field.js'
import {useForm} from 'react-hook-form';
import '/src/css/forms.css'
import {useUser} from "../context/UserContext.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export default function Registration() {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const { login, isAuth } = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phonecode: '7', // Префикс для России
                    phonenum: data.phone,
                    name: data.name
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка регистрации');
            }

            const userData = await response.json();

            login({
                id: userData.id,
                phone: userData.phonenum,
                name: userData.name
            });

            navigate('/');
        } catch (err) {
            setError(err.message || 'Произошла ошибка при регистрации');
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuth) navigate("/");
    }, [isAuth, navigate]);

    return <>
        <BaseWrapper top_bar_title='Регистрация'>
            <TitleHeader text="Нет аккаунта? Создайте его!"/>
            <form className="base-form" onSubmit={handleSubmit(onSubmit)}>
                <md-outlined-text-field
                    label="Телефон"
                    type="tel"
                    {...register('phone', {
                        required: 'Телефон обязателен',
                        pattern: {
                            value: /^\d{10}$/,
                            message: 'Формат: +7XXXXXXXXXX'
                        }
                    })}
                    errorText={errors.phone?.message}
                    prefix-text="+7"
                />

                <md-outlined-text-field
                    label="Код"
                    type="number"
                    {...register('code', {required: 'Код обязателен'})}
                    errorText={errors.code?.message}
                />

                <md-outlined-text-field
                    label="Имя"
                    type="text"
                    placeholder="Как вас зовут?"
                    {...register('name', {required: 'Имя обязательно'})}
                    errorText={errors.name?.message}
                />

                <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <md-checkbox required
                        {...register('privacy', {required: 'Необходимо согласие'})}
                        touch-target="wrapper"
                    />
                    <span>Я ознакомлен(а) с условиями</span>
                </label>
                {errors.privacy && <p style={{color: 'red'}}>{errors.privacy.message}</p>}

                <md-filled-button type="submit" name="create">
                    Создать аккаунт
                </md-filled-button>
                <md-filled-button name="send-code" type="button">
                    Отправить код
                </md-filled-button>
                <md-filled-button name="send-again" disabled>
                    Отправить снова (59)
                </md-filled-button>
            </form>
        </BaseWrapper>
    </>
}
