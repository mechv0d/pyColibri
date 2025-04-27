import TitleHeader from "../components/Headers/TitleHeader.jsx";
import BaseWrapper from "../components/BaseWrapper/BaseWrapper.jsx";
import '@material/web/textfield/outlined-text-field.js'
import {useForm} from 'react-hook-form';
import '/src/css/forms.css'
import {useUser} from "../context/UserContext.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export default function Auth() {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const { login, isAuth } = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isAuth) navigate("/");
    }, [isAuth, navigate]);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            setError(null);
            // Ищем пользователя по номеру телефона через GET запрос
            const response = await fetch(`http://127.0.0.1:8000/auth/${data.phone}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Пользователь с таким номером не найден');
            }

            const userData = await response.json();

            console.log(userData)

            // Логиним пользователя
            login({
                id: userData.id,
                phone: data.phone,
                name: userData.name.trim()
            });

            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return <>
        <BaseWrapper top_bar_title='Вход'>
            <TitleHeader text="Вход в аккаунт"/>
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

                <md-filled-button name="send-code" type="button">
                    Отправить код
                </md-filled-button>

                <md-outlined-text-field
                    label="Код"
                    type="number"
                    {...register('code', {required: 'Код обязателен'})}
                    errorText={errors.code?.message}
                />

                <md-filled-button type="submit" name="create">
                    Войти
                </md-filled-button>

                <md-filled-button name="send-again" disabled>
                    Отправить снова (59)
                </md-filled-button>

            </form>
        </BaseWrapper>
    </>
}
