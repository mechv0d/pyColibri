import {useForm} from 'react-hook-form';
import TitleHeader from "../components/Headers/TitleHeader.jsx";
import BaseWrapper from "../components/BaseWrapper/BaseWrapper.jsx";
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/filled-button.js';
import '/src/css/forms.css'
import {useUser} from "../context/UserContext.jsx";
import {useNavigate, useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';

export default function Feedback() {
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

    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toISOString();
    };

    const onSubmit = async (data) => {
        if (!isAuth) return;

        try {
            setIsSubmitting(true);
            setSubmitError(null);

            const response = await fetch('http://127.0.0.1:8000/feedback/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${user.token}`
                },
                body: JSON.stringify({
                    email: data.email.trim(),
                    message: data.message.trim(),
                    status: 1,
                    send_time: getCurrentDateTime(),
                    uid: user.id
                })
            });

            if (!response.ok) {
                throw new Error(`Ошибка отправки: ${response.status}`);
            }

            setSubmitSuccess(true);
            // Можно сбросить форму после успешной отправки
        } catch (error) {
            console.error('Ошибка при отправке:', error);
            setSubmitError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuth) {
        return null; // Будет перенаправление через useEffect
    }

    return (
        <BaseWrapper top_bar_title='Обратная связь'>
            <TitleHeader text="Отправить сообщение"/>
            <form className='base-form feedback' onSubmit={handleSubmit(onSubmit)}>
                <md-outlined-text-field
                    label="Ваша почта"
                    type="email"
                    {...register('email', {
                        required: 'Email обязателен',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Введите корректный email'
                        }
                    })}
                    errorText={errors.email?.message}
                />

                <md-outlined-text-field
                    type="textarea"
                    label="Сообщение"
                    placeholder="Что вам понравилось, а что нет? Расскажите нам!"
                    rows="6"
                    {...register('message', {
                        required: 'Сообщение обязательно',
                        minLength: {
                            value: 10,
                            message: 'Минимум 10 символов'
                        },
                        maxLength: {
                            value: 1000,
                            message: 'Максимум 1000 символов'
                        }
                    })}
                    errorText={errors.message?.message}
                />

                {submitError && (
                    <p style={{color: 'var(--md-sys-color-error)'}}>
                        {submitError}
                    </p>
                )}

                {submitSuccess ? (
                    <p style={{color: 'var(--md-sys-color-primary)'}}>
                        Сообщение успешно отправлено!
                    </p>
                ) : (
                    <md-filled-button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Отправка...' : 'Отправить'}
                    </md-filled-button>
                )}
            </form>
        </BaseWrapper>
    );
}