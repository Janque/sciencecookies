import { useRouter } from 'next/router';
import styles from '../styles/components/sidebar.module.scss';
import NavLink from './navLinks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';
import { cookieCardBody } from '../lib/utils';

export default function Sidebar(props) {
    const router = useRouter();
    const latestCookieBody = cookieCardBody(router.locale, props.latestCookie.title, props.latestCookie.description, props.latestCookie.authors, props.latestCookie.published);
    return (
        <div className={`col-md-3 col-xl-2 my-0 ml-lg-3 mr-0 ml-md-2 py-md-1 pl-md-3 text-dark ${styles.sidebar}`}>
            <div className="row">
                <h5 className="text-center my-auto mr-auto ml-3 ml-md-auto mt-md-2 d-md-none">{router.locale == 'es' ? 'Galletas recomendadas' : 'Recommended Cookies'}</h5>
                <button className="btn d-md-none p-0 pr-2 mr-4" type="button" data-toggle="collapse" data-target="#sdbarL" aria-controls="sdbarL" aria-expanded="false" style={{ fontSize: '1.8rem' }}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
            <nav id="sdbarL" className={`collapse ${styles.sdbarCnt}`}>
                <div className="col justify-content-center px-3 px-md-0 px-lg-3 px-xl-2">
                    <h5 className="text-center">{router.locale == 'es' ? 'Calendario Astronómico' : 'Astronomic Calendar'}</h5>
                    <Link href={props.latestCalendar.url} className='text-decoration-none text-dark d-none d-md-inline'>
                        <div className="card mb-2">
                            <div className='card-img-top' style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
                                <Image fill src={props.latestCalendar.picUrl} alt={props.latestCalendar.title} sizes="(max-width: 1200px) 25vw, 17vw" style={{ objectFit: 'cover' }} />
                            </div>
                            <div className="card-body">
                                <h5 class="card-title">{props.latestCalendar.title}</h5>
                                <p class="card-text">{props.latestCalendar.descriptionShort}</p>
                            </div>
                        </div>
                    </Link>
                    <Link href={props.latestCalendar.url} className='text-decoration-none text-dark d-md-none'>
                        <div className="media mb-3">
                            <div className='align-self-center mr-3' style={{ position: 'relative', width: '64px', height: '64px' }}>
                                <Image fill src={props.latestCalendar.picUrl} alt={props.latestCalendar.title} sizes="(max-width: 1200px) 25vw, 17vw" style={{ objectFit: 'cover' }} />
                            </div>
                            <div className="media-body">
                                <h5 class="card-title">{props.latestCalendar.title}</h5>
                                <p class="card-text">{props.latestCalendar.descriptionShort}</p>
                            </div>
                        </div>
                    </Link>

                    <div className="dropdown-divider d-md-none"></div>

                    <h5 className="text-center">{router.locale == 'es' ? 'La Galleta más nueva' : 'Latest Cookie'}</h5>
                    <Link href={props.latestCookie.url} className='text-decoration-none text-dark d-none d-md-inline'>
                        <div className="card mb-2">
                            <div className='card-img-top' style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
                                <Image fill src={props.latestCookie.picUrl} alt={props.latestCookie.title} sizes="(max-width: 1200px) 25vw, 17vw" style={{ objectFit: 'cover' }} />
                            </div>
                            <div className="card-body">
                                {latestCookieBody}
                            </div>
                        </div>
                    </Link>
                    <Link href={props.latestCookie.url} className='text-decoration-none text-dark d-md-none'>
                        <div className="media mb-3">
                            <div className='align-self-center mr-3' style={{ position: 'relative', width: '64px', height: '64px' }}>
                                <Image fill src={props.latestCookie.picUrl} alt={props.latestCookie.title} sizes="(max-width: 1200px) 25vw, 17vw" style={{ objectFit: 'cover' }} />
                            </div>
                            <div className="media-body">
                                {latestCookieBody}
                            </div>
                        </div>
                    </Link>

                    <div className="dropdown-divider d-md-none"></div>

                    <h5 className="text-center">{router.locale == 'es' ? 'Las Galletas más populares' : 'Most popular'}</h5>
                    {
                        props.mostPopularCookies.map(cookie => {
                            const popularCookieBody = cookieCardBody(router.locale, cookie.title, cookie.description, cookie.authors, cookie.published);
                            return (<>
                                <Link href={cookie.url} className='text-decoration-none text-dark d-none d-md-inline'>
                                    <div className="card mb-2">
                                        <div className="card-img-top" style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
                                            <Image fill src={cookie.picUrl} alt={cookie.title} sizes="(max-width: 1200px) 25vw, 17vw" style={{ objectFit: 'cover' }} />
                                        </div>
                                        <div className="card-body">
                                            {popularCookieBody}
                                        </div>
                                    </div>
                                </Link>
                                <Link href={props.latestCookie.url} className='text-decoration-none text-dark d-md-none'>
                                    <div className="media mb-3">
                                        <div className='align-self-center mr-3' style={{ position: 'relative', width: '64px', height: '64px' }}>
                                            <Image fill src={cookie.picUrl} alt={cookie.title} sizes="(max-width: 1200px) 25vw, 17vw" style={{ objectFit: 'cover' }} />
                                        </div>
                                        <div className="media-body">
                                            {popularCookieBody}
                                        </div>
                                    </div>
                                </Link>
                            </>)
                        })
                    }

                </div>
                <div className="col justify-content-center d-flex">
                    <NavLink type='cook' text={router.locale == 'es' ? 'Ver más' : 'More'} className='btn btn-link-science mt-md-2' />
                </div>
            </nav>
        </div>
    );
}