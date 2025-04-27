import './AddDishButton.css'
import Icon from '@mdi/react';
import {mdiPlus} from '@mdi/js';

export default function AddDishButton() {
    return <>
        <div className="dish add-dish">
            <div className="dish-content">
                <div className="ccal-text">
                    <md-icon className="plus-icon">
                        <Icon path={mdiPlus} size={1}/>
                    </md-icon>
                </div>
                <div className="text">
                    <span className="header">Добавьте приём пищи</span>
                </div>
            </div>
            <div className="media transparent"></div>
        </div>
    </>
}
