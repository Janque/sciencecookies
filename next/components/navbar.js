import { NavLinks, Buttons } from './layoutAttr.js';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar(props) {
    const router = useRouter();
    return (
        <nav className='navbar sticky-top navbar-expand-lg navbar-dark bg-science'>
            <Image className='d-inline-block align-center mr-2' src='/img/wlogoT.svg' width={30} height={30} alt='Science Cookies Logo' />
            <Link href='/' className='navbar-brand'>Science Cookies</Link>
            <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarM' aria-controls='navbarM' aria-expanded='false' aria-label='Toggle navigation'><span className='navbar-toggler-icon'></span></button>
            <div className='collapse navbar-collapse' id='navbarM'>
                <ul className='navbar-nav mr-auto py-0'>
                    <Link href='/' className={`btn btn-dark mx-2 my-1${(props.site == 'index' ? ' active' : '')}`}>{Buttons[router.locale]['index']}</Link>
                    <Link href={`/${NavLinks['es']['cook']}`} as={`/${NavLinks[router.locale]['cook']}`} locale='false' className={`btn btn-dark mx-2 my-1${(props.site == 'cook' ? ' active' : '')}`}>{Buttons[router.locale]['cook']}</Link>
                    <Link href={`/${NavLinks['es']['cal']}`} as={`/${NavLinks[router.locale]['cal']}`} locale='false' className={`btn btn-dark mx-2 my-1${(props.site == 'cal' ? ' active' : '')}`}>{Buttons[router.locale]['cal']}</Link>
                    <div className='dropdown d-flex flex-column'>
                        <button className='btn btn-dark mx-2 my-1 flex-fill' id='usBtnsDrpdwn' type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{router.locale == 'es' ? 'Nosotros' : 'Us'}</button>
                        <div className="dropdown-menu bg-science px-0 mb-2 py-1" aria-labelledby="usBtnsDrpdwn" style={{ minWidth: 'max-content' }}>
                            <div className='col-12 px-0 d-flex'>
                                <Link href={`/${NavLinks['es']['who']}`} as={`/${NavLinks[router.locale]['who']}`} locale='false' className={`btn btn-dark mx-2 my-1 flex-fill${(props.site == 'who' ? ' active' : '')}`}>{Buttons[router.locale]['who']}</Link>
                            </div>
                            <div className='col-12 px-0 d-flex'>
                                <Link href={`/${NavLinks['es']['contact']}`} as={`/${NavLinks[router.locale]['contact']}`} locale='false' className={`btn btn-dark mx-2 my-1 flex-fill${(props.site == 'contact' ? ' active' : '')}`}>{Buttons[router.locale]['contact']}</Link>
                            </div>
                        </div>
                    </div>
                </ul>
            </div>
        </nav>
    )
}