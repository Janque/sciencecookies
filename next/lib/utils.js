import { NavLinks } from "../components/layoutAttr";
import { getRecommended } from '../firebase/firestore';

export function formatDate(d) {
    return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
}

export function cookieCardBody(locale, title, description, authors, published, lineJump = true) {
    return (
        <>
            <h5 class="card-title">{title}</h5>
            <p class="card-text">{description}</p>
            <p class="card-text">
                {`${formatDate(new Date(published.seconds * 1000))}`}
                {lineJump ? <br /> : <span>&emsp;</span>}
                {`${locale == 'es' ? 'Autor(es)' : 'Author(s)'}: ${authors}`}
            </p>
        </>
    )
}

export function formatCalUrl(date, locale) {
    date = new Date(date.seconds * 1000);
    return NavLinks[locale].cal + date.getFullYear() + '/' + date.toLocaleString('es', { month: 'long' }) + '/';
}

export function formatCookieUrl(file, locale) {
    return NavLinks[locale].cook + file + '/';
}

export function getFullUrl(req) {
    //console.log(req);
    //TODO fix
    return {
        fullUrl: 'https://' + req.headers.host + req.originalUrl
    }
}

export function isMobile(userAgent) {
    return {
        isMobile: Boolean(userAgent.match(
            /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        ))
    };
}

export async function getGlobalData(context) {
    return {
        ...(await getRecommended(context.locale)),
        ...(getFullUrl(context.req)),
        ...(isMobile(context.req.headers['user-agent']))
    }
}