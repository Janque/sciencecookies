import { NavLinks, Buttons } from './layoutAttr.js';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/components/navbar.module.scss';
import NavLink from './navLinks.js';
import { useAuth } from '../firebase/auth.js';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { AlertComponent } from './alert.js';

export default function Navbar(props) {
    const router = useRouter();
    const { authUser, isLoading, signOut } = useAuth();

    useEffect(() => {
        if (!isLoading && authUser) {
            if ((props.site == "drafts" || props.site == "edit" || props.site == "draftsCal" || props.site == "editCal" || props.site == "mailPrev") && !authUser.mod) {
                router.push('https://sciencecookies.net');
            }
        } else {
            if (props.site == "mailPrev") {
                router.push('https://sciencecookies.net');
            }
            if (props.site == "drafts" || props.site == "edit" || props.site == "draftsCal" || props.site == "editCal") {
                //$('#mdlRgstr').modal('show');
            }
        }
    }, [authUser, isLoading])

    //Translate link
    let transLinkHref, transLinkAs;
    let otLang = router.locale == 'es' ? 'en' : 'es';
    if (props.transLink) {
        transLinkAs = props.transLink;
        transLinkHref = router.pathname;
    } else {
        if (props.site == "index") {
            transLinkHref = '/';
            transLinkAs = '/';
        }
        else {
            if (props.site == "allCalsY") {
                transLinkHref = NavLinks['es']["cal"];
                transLinkAs = NavLinks[otLang]["cal"];
            }
            else if (props.site == "allCalsM") {
                transLinkHref = NavLinks['es']["cal"];
                transLinkAs = NavLinks[otLang]["cal"] + props.year + '/';
            }
            else if (props.site == "cookTri") {
                transLinkHref = NavLinks['es']["cook"];
                transLinkAs = NavLinks[otLang]["cook"] + props.year + '/' + props.sTri + '/';
            }
            else {
                transLinkHref = NavLinks['es'][props.site];
                transLinkAs = NavLinks[otLang][props.site];
            }
        }
    }
    return (
        <>
            <nav className={styles.navbar + ' navbar sticky-top navbar-expand-lg navbar-dark bg-science'}>
                <Image className='d-inline-block align-center mr-2' src='/img/wlogoT.svg' width={30} height={30} alt='Science Cookies Logo' />
                <Link href='/' className='navbar-brand'>Science Cookies</Link>

                <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarMenu' aria-controls='navbarMenu' aria-expanded='false' aria-label='Toggle navigation'><span className='navbar-toggler-icon'></span></button>

                <div className='collapse navbar-collapse' id='navbarMenu'>
                    <ul className='navbar-nav mr-auto py-0'>
                        <NavLink type='index' className={`btn btn-dark mx-2 my-1${(props.site == 'index' ? ' active' : '')}`} />
                        <NavLink type='cook' className={`btn btn-dark mx-2 my-1${(props.site == 'cook' ? ' active' : '')}`} />
                        <NavLink type='cal' className={`btn btn-dark mx-2 my-1${(props.site == 'allCalsY' ? ' active' : '')}`} />
                        <div className='dropdown d-flex flex-column'>
                            <button className='btn btn-dark mx-2 my-1 flex-fill' id='usBtnsDrpdwn' type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{router.locale == 'es' ? 'Nosotros' : 'Us'}</button>
                            <div className="dropdown-menu bg-science px-0 mb-2 py-1" aria-labelledby="usBtnsDrpdwn" style={{ minWidth: 'max-content' }}>
                                <div className='col-12 px-0 d-flex'>
                                    <NavLink type='who' className={`btn btn-dark mx-2 my-1 flex-fill${(props.site == 'who' ? ' active' : '')}`} />
                                </div>
                                <div className='col-12 px-0 d-flex'>
                                    <NavLink type='contact' className={`btn btn-dark mx-2 my-1 flex-fill${(props.site == 'contact' ? ' active' : '')}`} />
                                </div>
                            </div>
                        </div>
                        {(props.site == 'edit' || props.site == 'editCal') ? <i id='tagLstSave' className='text-light mx-3 my-auto'></i> : null}
                    </ul>

                    <div className={`row justify-content-end ${styles['w-nsm-100']}`}>
                        <Link className={styles['lang-switch'] + ' btn btn-link text-light text-decoration-none'} locale={otLang} href={transLinkHref} as={transLinkAs}>
                            {otLang == 'es' ? 'Español' : 'English'} <FontAwesomeIcon icon={faGlobe} />
                        </Link>

                        {authUser ?
                            <div className='dropdown mr-2 dropleft'>
                                <button className='btn btn-dark dropdown-toggle p-2' id='usrDrpdwn' type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                    <FontAwesomeIcon icon={faUser} />
                                    <Image id='picUsr' className='d-inline-block align-center ml-2 rounded-circle' src={authUser.photoURL} width={30} height={30} alt='' />
                                </button>
                                <div className='dropdown-menu dropdown-menu-right bg-dark pl-1' aria-labelledby='usrDrpdwn'>
                                    <Link id='btnPrfl' href={`/${NavLinks['es']['profile']}`} as={`/${NavLinks[router.locale]['profile']}`} locale={false} className='btn btn-link text-decoration-none text-light'>{Buttons[router.locale]["profile"]}</Link>
                                    <Link id='btnPref' href={`/${NavLinks['es']['profile']}?tab=pref`} as={`/${NavLinks[router.locale]['profile']}?tab=pref`} locale={false} className='btn btn-link text-decoration-none text-light'>{Buttons[router.locale]["prefs"]}</Link>
                                    {authUser.mod ? <Link id='btnDraft' href={`/${NavLinks['es']['drafts']}`} as={`/${NavLinks[router.locale]['drafts']}`} locale={false} className='btn btn-link text-decoration-none text-light'>{Buttons[router.locale]["drafts"]}</Link> : null}
                                    {authUser.mod ? <Link id='btnCals' href={`/${NavLinks['es']['draftsCal']}`} as={`/${NavLinks[router.locale]['draftsCal']}`} locale={false} className='btn btn-link text-decoration-none text-light'>{Buttons[router.locale]["draftsCal"]}</Link> : null}
                                    <div className='dropdown-divider ml-1 mr-2'></div>
                                    <button onClick={signOut} className='btn btn-link text-decoration-none text-light'>{Buttons[router.locale]["logOut"]}</button>
                                </div>
                            </div> :
                            <button className='btn btn-dark mr-2' data-toggle='modal' data-target='#mdlRgstr'>
                                <FontAwesomeIcon icon={faRightToBracket} />
                            </button>
                        }
                    </div>
                </div>
            </nav>
            <AlertComponent id='defaultAlert' />
        </>
    )
}