import '../NavRail.css'
import Icon from '@mdi/react';
import "@mdi/js";

function DestinationButton(props) {
    return <>
    <md-filled-tonal-icon-button title={props.title ?? ''} href={props.href}>
            <Icon path={props.icon} size={1} />
        </md-filled-tonal-icon-button>
    </>
}

export default DestinationButton;