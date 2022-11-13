import Image from 'next/image';
import styles from '../styles/components/footer.module.scss';
import NavLink from './navLinks.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook, faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function Footer(props) {
    return (
        <>
            <div className={styles.share}>
                <a href="#shareBtns" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="shareBtns">
                    <FontAwesomeIcon icon={faShare} />
                </a>
                <div id='shareBtns' className='collapse'>
                    <a id="ttShare" target="_blank" rel="external"><FontAwesomeIcon icon={faTwitter} /></a>
                    <a id="fbShare" target="_blank" rel="external"><FontAwesomeIcon icon={faFacebook} /></a>
                    <a id="waShare" target="_blank" rel="external"><FontAwesomeIcon icon={faWhatsapp} /></a>
                </div>
            </div>

            <div className={styles['follow-us'] + ' bg-blue'}>
                <div className="row">
                    <a href="//twitter.com/intent/follow?screen_name=_sciencecookies" target="_blank" rel="external">
                        <FontAwesomeIcon icon={faTwitter} color='#1da1f2' />
                    </a>
                    <a href="http://instagram.com/sciencecookies" target="_blank" rel="external">
                        <FontAwesomeIcon icon={faInstagram} color='#e03566' />
                    </a>
                    <a href="http://www.facebook.com/Science-Cookies-106549557818780/" target="_blank" rel="external">
                        <FontAwesomeIcon icon={faFacebook} color='#3b5998' />
                    </a>
                </div>
            </div>

            <footer className={styles.footer + ' bg-blue'}>
                <div className={`row align-items-end ${styles.row}`}>
                    <div className="col-md-auto">
                        <Image src='/img/wlogoT.svg' width={70} height={70} alt='Science Cookies Logo' />
                        <ul className={styles['no-list']}>
                            <li>
                                <NavLink type='index' className={`text-decoration-none ${(props.site == 'index' ? styles['text-black'] : 'text-dark')} mx-2 my-1`} />
                            </li>
                            <li>
                                <NavLink type='cook' className={`text-decoration-none ${(props.site == 'cook' ? styles['text-black'] : 'text-dark')} mx-2 my-1`} />
                            </li>
                            <li>
                                <NavLink type='cal' className={`text-decoration-none ${(props.site == 'cal' ? styles['text-black'] : 'text-dark')} mx-2 my-1`} />
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-auto">
                        <ul className={styles['no-list']}>
                            <li>
                                <NavLink type='who' className={`text-decoration-none ${(props.site == 'who' ? styles['text-black'] : 'text-dark')} mx-2 my-1`} />
                            </li>
                            <li>
                                <NavLink type='contact' className={`text-decoration-none ${(props.site == 'contact' ? styles['text-black'] : 'text-dark')} mx-2 my-1`} />
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-auto">
                        <ul className={styles['no-list']}>
                            <li>
                                <NavLink type='priv' className={`text-decoration-none ${(props.site == 'priv' ? styles['text-black'] : 'text-dark')} mx-2 my-1`} />
                            </li>
                            <li>
                                <NavLink type='tos' className={`text-decoration-none ${(props.site == 'tos' ? styles['text-black'] : 'text-dark')} mx-2 my-1`} />
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
};