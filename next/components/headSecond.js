import { NavLinks, Buttons } from './layoutAttr.js';
export default function HeadSecond(props) {
    return (<>
        <link rel="alterante" hreflang="es" href={props.host + '/' + NavLinks["es"][props.site]} />
        <link rel="alterante" hreflang="en" href={props.host + '/' + NavLinks["en"][props.site]} />
        <link rel="alterante" hreflang="x-default" href={props.host + '/' + NavLinks["es"][props.site]} />
        <link rel="canonical" href={props.host + '/' + NavLinks[props.locale][props.site]} />
        <meta property="og:url" content={props.host + '/' + NavLinks[props.locale][props.site]} />
        <meta key="ogtitle" property="og:title" content={Buttons[props.locale][props.site] + ' - Science Cookies'} />
        {props.site != 'index' ? <title key="title">{Buttons[props.locale][props.site] + ' - Science Cookies'}</title> : null}
    </>
    );
};