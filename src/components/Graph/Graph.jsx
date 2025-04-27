import './Graph.css'

function create_innerHtml(innerHtml) {
    return {__html: innerHtml};
}


function Graph(props) {
    let values = props.values
    let s = []
    values.forEach(v => {
        s.push(`${v*100}%`)
    })
    let log = ''
    for (const v of s) {
        log += "<div class=\"month-group\">\n" +
            `            <div class="bar" style='height: ${v}'></div>\n` +
            "            <p class=\"month\"></p>\n" +
            "        </div>"
    }

    return <>
        <div className="graph-container">
            <div className="year-stats" dangerouslySetInnerHTML={create_innerHtml(log)}>

            </div>
        </div>
    </>
}

export default Graph;