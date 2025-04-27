import TitleHeader from "../components/Headers/TitleHeader.jsx";
import BaseWrapper from "../components/BaseWrapper/BaseWrapper.jsx";

export default function AboutUs() {
    return <>
        <BaseWrapper top_bar_title='О нас'>
            <TitleHeader text=""/>
            <div className="media-body" style={{'justify-content': 'center'}}>
                <span>Работаем с 2017 года</span>
                <span>Команда из 20 человек</span>
                <span>Топ #9 в AppStore*</span>

            </div>
            <TitleHeader text="Колибри" style={{'padding': '56px 24px 6px 24px', 'width': '90px', 'text-align': 'center'}}/>
            <div className="media-body contacts" style={{'padding':'26px 144px 6px 144px'}}>
                <span>Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit gravida per malesuada, quis magna gravida ultrices. Neque nec tempus fringilla mi mi amet aliquet. Nibh curabitur ad elementum a; habitant lobortis lobortis. Maximus nibh praesent consequat aliquet congue ridiculus per. Nam vulputate volutpat morbi lobortis tellus congue fermentum. Nulla senectus elementum id tristique lacus; sociosqu litora sodales. Tristique class sodales amet finibus at mattis dictumst. Suscipit erat phasellus elit, quisque eget dignissim a.</span>
                <span>Lorem ipsum odor amet, consectetuer adipiscing elit. Finibus lacinia platea diam luctus fusce. Senectus fusce magna iaculis nisi eleifend aliquet donec. Nulla duis elit gravida; praesent curabitur mauris porttitor elit. Elit parturient nullam enim dolor varius senectus velit nulla. Tortor at tellus maximus volutpat mattis porttitor. Sociosqu aptent natoque enim habitasse sodales finibus. Fames suscipit dictum primis enim; mus aenean tortor at. Pretium nibh convallis blandit venenatis per ac bibendum. Sit mus habitant a et laoreet litora purus nostra.</span>
                <span>Lorem ipsum odor amet, consectetuer adipiscing elit. Tempor urna urna ut per cursus nostra aliquam dignissim. Lectus ad torquent potenti malesuada nisl dui magna. Platea cubilia sem amet a risus ligula ex. Mattis dictum vehicula eleifend et nulla donec nullam pretium. Pharetra hendrerit lorem mi nibh scelerisque auctor. Auctor consectetur arcu netus torquent scelerisque curae mi imperdiet. Senectus convallis porta at enim augue.</span>
            </div>

        </BaseWrapper>
    </>
}
