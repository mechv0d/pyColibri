import TitleHeader from "../components/Headers/TitleHeader.jsx";
import BaseWrapper from "../components/BaseWrapper/BaseWrapper.jsx";
import '@material/web/textfield/outlined-text-field.js'
import {useUser} from "../context/UserContext.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import '/src/css/forms.css';
import '/src/components/Headers/TitleHeader.css';
import '/src/components/Contacts/Contacts.css';

export default function Profile() {
    const {user, isAuth} = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    const calculateAge = (birthdate) => {
        if (!birthdate) return null;
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`http://127.0.0.1:8000/profiles/${user.id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${user.token}`
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    navigate("/fill-profile");
                    return;
                }
                throw new Error(`Ошибка: ${response.status}`);
            }

            const profileData = await response.json();
            setProfile(profileData);

        } catch (err) {
            console.error('Ошибка загрузки профиля:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuth) {
            navigate("/auth");
            return;
        }
        fetchProfile();
    }, [isAuth, navigate, user.id]);

    if (isLoading) {
        return (
            <BaseWrapper top_bar_title='Профиль'>
                <p>Загрузка профиля...</p>
            </BaseWrapper>
        );
    }

    if (error) {
        return (
            <BaseWrapper top_bar_title='Ошибка'>
                <p>Произошла ошибка: {error}</p>
                <md-filled-button onClick={fetchProfile}>
                    Повторить попытку
                </md-filled-button>
            </BaseWrapper>
        );
    }

    if (!profile) {
        return null; // Перенаправление уже произошло в fetchProfile
    }

    const age = calculateAge(profile.birthdate);
    const genderText = profile.gender ? 'Мужской' : 'Женский';

    return (
        <BaseWrapper top_bar_title='Профиль'>
            <div className="title-header" style={{display: 'flex', gap: '20px', height: '26px', alignItems: 'center'}}>
                <TitleHeader
                    text={user.name}
                    style={{width: 'fit-content', display: 'block', padding: '0', minHeight: '26px'}}
                />
                <md-filled-button>
                    Изменить
                </md-filled-button>
            </div>

            <div className="media-body" style={{marginTop: '20px'}}>
                {age && (
                    <div style={{marginBottom: '10px'}}>
                        <span style={{fontWeight: 'bold'}}>Возраст: </span>
                        <span>{age} г.</span>
                    </div>
                )}
                <div style={{marginBottom: '10px'}}>
                    <span style={{fontWeight: 'bold'}}>Рост: </span>
                    <span>{profile.height} см</span>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <span style={{fontWeight: 'bold'}}>Вес: </span>
                    <span>{profile.weight} кг</span>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <span style={{fontWeight: 'bold'}}>Пол: </span>
                    <span>{genderText}</span>
                </div>
            </div>
        </BaseWrapper>
    );
}