import { useRouter } from 'next/router';
import styles from '../styles/components/sidebar.module.scss';
import NavLink from './navLinks';

export default function Sidebar() {
    const router = useRouter();
    return (
        <div className={`col-md-3 col-xl-2 my-0 ml-lg-3 mr-0 ml-md-2 py-md-1 pl-md-3 text-dark ${styles.sidebar}`}>
            <div className="row">
                <h5 className="text-center my-auto mr-auto ml-3 ml-md-auto mt-md-2 d-md-none">{router.locale == 'es' ? 'Galletas recomendadas' : 'Recommended Cookies'}</h5>
                <button className="btn d-md-none p-0 pr-2 mr-4" type="button" data-toggle="collapse" data-target="#sdbarL" aria-controls="sdbarL" aria-expanded="false" style={{ fontSize: '1.8rem' }}>
                    <i className="fas fa-bars"></i>
                </button>
            </div>
            <nav id="sdbarL" className={`collapse ${styles.sdbarCnt}`}>
                <div className="col justify-content-center px-3 px-md-0 px-lg-3 px-xl-2">
                    <div id="calRecom" className="d-none">
                        <h5 className="text-center">{router.locale == 'es' ? 'Calendario Astronómico' : 'Astronomic Calendar'}</h5>
                        <div id="calCnt"></div>
                        <h5 className="text-center">{router.locale == 'es' ? 'La Galleta más nueva' : 'Latest Cookie'}</h5>
                    </div>
                    <div id="newCook"></div>
                    <div className="dropdown-divider d-md-none">
                        <h5 className="text-center">{router.locale == 'es' ? 'Las Galletas más populares' : 'Most popular'}</h5>
                    </div>
                    <div id="popCook"></div>
                </div>
                <div className="col justify-content-center d-flex">
                    <NavLink type='cook' text={router.locale == 'es' ? 'Ver más' : 'More'} className='btn btn-link-science mt-md-2' />
                </div>
            </nav>
        </div>
    );
}