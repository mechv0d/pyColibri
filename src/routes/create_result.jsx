import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import TitleHeader from "../components/Headers/TitleHeader.jsx";
import BaseWrapper from "../components/BaseWrapper/BaseWrapper.jsx";
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/filled-button.js';
import '/src/css/forms.css';
import '/src/css/create_result.css';
import {useUser} from "../context/UserContext.jsx";
import {useLocation, useNavigate} from 'react-router-dom';

export default function CreateResult() {
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const {user, isAuth} = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [profile, setProfile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Получаем профиль пользователя
    useEffect(() => {
        if (!isAuth) {
            navigate('/auth', {state: {from: location.pathname}});
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/profiles/${user.id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${user.token}`
                    }
                });
                if (!response.ok) throw new Error('Ошибка загрузки профиля');
                const data = await response.json();
                setProfile(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProfile();
    }, [isAuth, navigate, location, user?.id]);

    // Отправка формы
    const onSubmit = async (data) => {
        if (!isAuth || !profile) return;

        try {
            setIsSubmitting(true);
            setError(null);

            const resultData = {
                date: new Date().toISOString().split('T')[0], // Текущая дата в формате YYYY-MM-DD
                weight: parseFloat(data.weight),
                uid: user.id
            };

            // Отправляем результат
            const resultResponse = await fetch('http://127.0.0.1:8000/results/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${user.token}`
                },
                body: JSON.stringify(resultData)
            });

            if (!resultResponse.ok) throw new Error('Ошибка сохранения результата');

            // Обновляем профиль с новым весом
            const profileResponse = await fetch(`http://127.0.0.1:8000/profiles/${user.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${user.token}`
                },
                body: JSON.stringify({weight: data.weight})
            });

            if (!profileResponse.ok) throw new Error('Ошибка обновления профиля');

            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Рассчитываем изменение веса
    const calculateWeightChange = () => {
        if (!profile || !watch('weight')) return null;

        const currentWeight = parseFloat(profile.weight);
        const newWeight = parseFloat(watch('weight'));
        const delta = newWeight - currentWeight;

        return {
            value: delta.toFixed(1),
            isPositive: delta > 0,
            isZero: delta === 0
        };
    };

    const weightChange = calculateWeightChange();

    if (!isAuth || !profile) {
        return null;
    }

    return (
        <BaseWrapper top_bar_title='Промежуточный результат'>
            <form className='base-form' onSubmit={handleSubmit(onSubmit)}>
                <TitleHeader text={`Ваш промежуточный результат на ${new Date().toLocaleDateString('ru-RU')}`}/>

                <md-outlined-text-field
                    label="Ваш вес (кг)"
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    {...register('weight', {
                        required: 'Укажите вес',
                        min: {value: 20, message: 'Минимум 20 кг'},
                        max: {value: 300, message: 'Максимум 300 кг'}
                    })}
                    errorText={errors.weight?.message}
                />

                {weightChange && (
                    <div
                        className={`weight-change ${weightChange.isZero ? 'neutral' : weightChange.isPositive ? 'positive' : 'negative'}`}>
                        Изменения: {weightChange.isPositive ? '+' : ''}{weightChange.value} кг.
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Результат успешно сохранен!</div>}

                <md-filled-button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </md-filled-button>
            </form>
        </BaseWrapper>
    );
}