import { NavLinks, Buttons } from './layoutAttr.js';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavLink(props) {
    const router = useRouter();
    switch (props.type) {
        case 'cook':
            return (
                <Link href={`/${NavLinks['es']['cook']}`} as={`/${NavLinks[router.locale]['cook']}`} locale={false} className={props.className}>{Buttons[router.locale]['cook']}</Link>
            );
        case 'cal':
            return (
                <Link href={`/${NavLinks['es']['cal']}`} as={`/${NavLinks[router.locale]['cal']}`} locale={false} className={props.className}>{Buttons[router.locale]['cal']}</Link>
            );
        case 'who':
            return (
                <Link href={`/${NavLinks['es']['who']}`} as={`/${NavLinks[router.locale]['who']}`} locale={false} className={props.className}>{Buttons[router.locale]['who']}</Link>
            );
        case 'contact':
            return (
                <Link href={`/${NavLinks['es']['contact']}`} as={`/${NavLinks[router.locale]['contact']}`} locale={false} className={props.className}>{Buttons[router.locale]['contact']}</Link>
            );
        default:
            return (
                <Link href='/' className={props.className}>{Buttons[router.locale]["index"]}</Link>
            );
    }

}