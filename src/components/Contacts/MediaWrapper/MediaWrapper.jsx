import "./MediaWrapper.css"

export default function MediaWrapper(props) {
    return <>
    <a className="media-wrapper" href={props.href} target="_blank" rel="noopener noreferrer">

        {props.children}
    </a>
    </>
}