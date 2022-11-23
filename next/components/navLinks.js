import { NavLinks, Buttons } from './layoutAttr.js';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavLink(props) {
    const router = useRouter();
    switch (props.type) {
        case 'cookie':
            return (
                <Link href={NavLinks.es.cook + props.file + '/'} as={NavLinks[router.locale].cook + props.file + '/'} locale={false} className={props.className}>{props.children}</Link>
            );
        case 'calendar':
            let date = new Date(props.date.seconds * 1000);
            return (
                <Link href={NavLinks.es.cal + date.getFullYear() + '/' + date.toLocaleString('es', { month: 'long' }) + '/'} as={NavLinks[router.locale].cal + date.getFullYear() + '/' + (date.toLocaleString(router.locale, { month: 'long' })).toLowerCase() + '/'} locale={false} className={props.className}>{props.children}</Link>
            );
        case 'cook':
            return (
                <Link href={`/${NavLinks['es']['cook']}`} as={`/${NavLinks[router.locale]['cook']}`} locale={false} className={props.className}>{props.text || Buttons[router.locale]['cook']}</Link>
            );
        case 'cal':
            return (
                <Link href={`/${NavLinks['es']['cal']}`} as={`/${NavLinks[router.locale]['cal']}`} locale={false} className={props.className}>{props.text || Buttons[router.locale]['cal']}</Link>
            );
        case 'who':
            return (
                <Link href={`/${NavLinks['es']['who']}`} as={`/${NavLinks[router.locale]['who']}`} locale={false} className={props.className}>{props.text || Buttons[router.locale]['who']}</Link>
            );
        case 'contact':
            return (
                <Link href={`/${NavLinks['es']['contact']}`} as={`/${NavLinks[router.locale]['contact']}`} locale={false} className={props.className}>{props.text || Buttons[router.locale]['contact']}</Link>
            );
        case 'priv':
            return (
                <Link href={`/${NavLinks['es']['priv']}`} as={`/${NavLinks[router.locale]['priv']}`} locale={false} className={props.className}>{props.text || Buttons[router.locale]['priv']}</Link>
            );
        case 'tos':
            return (
                <Link href={`/${NavLinks['es']['tos']}`} as={`/${NavLinks[router.locale]['tos']}`} locale={false} className={props.className}>{props.text || Buttons[router.locale]['tos']}</Link>
            );
        default:
            return (
                <Link href='/' className={props.className}>{props.text || Buttons[router.locale]["index"]}</Link>
            );
    }

}