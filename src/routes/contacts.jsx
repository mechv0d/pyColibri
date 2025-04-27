import BaseWrapper from "../components/BaseWrapper/BaseWrapper.jsx";
import TitleHeader from "../components/Headers/TitleHeader.jsx";
import {Twitch, Twitter, Youtube} from 'lucide-react';
import "/src/components/Contacts/Contacts.css"
import MediaWrapper from "../components/Contacts/MediaWrapper/MediaWrapper.jsx";

export default function Contacts() {
    return <>
        <BaseWrapper top_bar_title='Контакты'>
            <TitleHeader text="Социальные сети"/>
            <div className="media-body">
                <MediaWrapper href={"https://google.com"}> <Youtube width={40} height={40}/></MediaWrapper>
                <MediaWrapper href={"https://x.com"}> <Twitter width={40} height={40}/></MediaWrapper>
                <MediaWrapper href={"https://twitch.com"}> <Twitch width={40} height={40}/></MediaWrapper>

            </div>
            <TitleHeader text="Контакты"/>
            <div className="media-body contacts">
                <span>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Tempor urna urna ut per cursus nostra aliquam dignissim. Lectus ad torquent potenti malesuada nisl dui magna. Platea cubilia sem amet a risus ligula ex. Mattis dictum vehicula eleifend et nulla donec nullam pretium. Pharetra hendrerit lorem mi nibh scelerisque auctor. Auctor consectetur arcu netus torquent scelerisque curae mi imperdiet. Senectus convallis porta at enim augue.
                </span>
                <span>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Tempor urna urna ut per cursus nostra aliquam dignissim. Lectus ad torquent potenti malesuada nisl dui magna. Platea cubilia sem amet a risus ligula ex. Mattis dictum vehicula eleifend et nulla donec nullam pretium. Pharetra hendrerit lorem mi nibh scelerisque auctor. Auctor consectetur arcu netus torquent scelerisque curae mi imperdiet. Senectus convallis porta at enim augue.
                </span>
                <div>
                    <span>
                Lorem ipsum odor amet, consectetuer adipiscing elit.<br/>In taciti neque aliquet arcu nisi ipsum semper faucibus.
                    </span>
                    <span>
                        Lorem ipsum odor amet.
                    </span>
                </div>
            </div>

        </BaseWrapper>
    </>
}