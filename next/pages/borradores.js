import { getGlobalData, formatDate, ultraClean } from '../lib/utils';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faPlusSquare, faEllipsisH, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { cookieExists, createCookie, draftsPreviewLim, getConfigLanguages, getDraftsSearch } from '../firebase/firestore';
import { useAuth } from '../firebase/auth';
import { Buttons, NavLinks } from '../components/layoutAttr';
import { useEffect, useState } from 'react';
import { useAlert, AlertComponent } from '../components/alert';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import { getTodaysID } from '../firebase/database';

export default function Borradores(props) {
    const router = useRouter();
    const { authUser } = useAuth();
    const { showAlert, hideAlert } = useAlert();

    //Plus modal
    const [mdlOpenPlus, setMdlOpenPlus] = useState(false);
    const [frmPlusTitle, setFrmPlusTitle] = useState('');
    const [frmPlusFile, setFrmPlusFile] = useState('');
    const [frmPlusFileChanged, setFrmPlusFileChanged] = useState(false);
    const [submitingPlus, setSubmitingPlus] = useState(false);
    const [progressPlus, setProgressPlus] = useState(0);
    const [progressPlusVar, setProgressPlusVar] = useState('primary');
    function handleTitleChange(e) {
        setFrmPlusTitle(e.target.value);
        let newFile = frmPlusFile;
        if (!frmPlusFileChanged) {
            newFile = ultraClean(e.target.value.trim(), '-', true);
        }
        setFrmPlusFile(newFile);
    }
    function handleFileChange(e) {
        let newFile = e.target.value;
        newFile = ultraClean(newFile, '-', true, true);
        setFrmPlusFile(newFile);
        setFrmPlusFileChanged(true);
    }
    function handleTitleBlur(e) {
        let newTitle = e.target.value.trim();
        setFrmPlusTitle(newTitle);
    }
    function handleFileBlur(e) {
        let newFile = e.target.value;
        newFile = ultraClean(newFile, '-', true);
        setFrmPlusFile(newFile);
    }
    useEffect(() => {
        if (!mdlOpenPlus) {
            setFrmPlusTitle('');
            setFrmPlusFile('');
            setFrmPlusFileChanged(false);
        }
    }, [mdlOpenPlus]);
    async function handleSubmitPlus(e) {
        e.preventDefault();
        if (await cookieExists(router.locale, frmPlusFile)) {
            showAlert(router.locale == 'es' ? 'Ese nombre de archivo ya esta en uso.' : 'That file name is already in use.', 'danger', 'alrtPlus');
        } else {
            setSubmitingPlus(true);

            let id = await getTodaysID();
            setProgressPlus(3);

            const promises = [];
            props.langsList.forEach((l, i) => {
                setProgressPlus(3 + 30 / props.langsList.length * i);
                promises.push(createCookie(l, id, ' ' + authUser.displayName, frmPlusTitle, frmPlusFile, authUser.uid));
            });
            Promise.all(promises).then(() => {
                setProgressPlus(90);
                setTimeout(function () {
                    setProgressPlus(100);
                    setProgressPlusVar('success');
                    showAlert(router.locale == 'es' ? `Creado con exito. Redirigiendo...<br>Si no te redirige automáticamente, haz <a class="btn-link-science" href="../editar?id=${id}">click aqui</a>.` : `Successfully created. Redirigiendo...<br>If you aren't automatically redirected, <a class="btn-link-science" href="../edit?id=${id}">click here</a>.`, 'success', 'alrtPlus');
                }, 700);
                setTimeout(function () {
                    router.push(`/${router.locale}/${NavLinks['es']['edit']}?id=${id}`, `/${NavLinks[router.locale]['edit']}?id=${id}`, { locale: false });
                }, 3000);
            }).catch(err => console.log(err));
        }
    }

    //Page controls
    const [searchRes, setSearchRes] = useState(props.searchResults.docs);
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(props.searchResults.resultCount / draftsPreviewLim);
    var paglast = [null];
    async function handlePageChange(np) {
        if (page <= 1 && np == -1) return;
        if (page == totalPages && np == 1) return;
        setSearchRes((await getDraftsSearch(router.locale, props.searchParams.kywords, props.searchParams.order, props.searchParams.desc, page + np == 1 ? 1 : 0, true, paglast[page])).docs);
        setPage(page + np);
    }

    //Card dropdowns
    const [dropdowns, setDropdowns] = useState([])
    useEffect(() => {
        const dd = dropdowns.slice();
        searchRes.forEach(cookie => {
            dd[cookie.id] = false;
        });
        setDropdowns(dd);
    }, [searchRes])
    function handleDropdownClick(cook) {
        const dd = dropdowns.slice();
        dd[cook] = !dd[cook];
        setDropdowns(dd);
    }
    function handleDropdownBlur(cook) {
        const dd = dropdowns.slice();
        dd[cook] = false;
        setDropdowns(dd);
    }

    return (
        <>
            <Head>
                <meta name="description" content={router.locale == 'es' ? 'Revisa y administra tus borradores' : 'Review and manage your drafts'} />
                <meta property="og:description" content={router.locale == 'es' ? 'Revisa y administra tus borradores' : 'Review and manage your drafts'} />
            </Head>

            {/* Plus modal */}
            <Modal className='text-dark' show={mdlOpenPlus} onHide={() => setMdlOpenPlus(false)} centered>
                <AlertComponent id='alrtPlus' />
                <Modal.Header>
                    <Modal.Title>{router.locale == 'es' ? 'Crear una nueva Galleta' : 'Create a new Cookie'}</Modal.Title>
                    <button className="close" type="button" onClick={() => setMdlOpenPlus(false)} disabled={submitingPlus}>
                        <span aria-hidden="true">×</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmitPlus}>
                        <div className="form-group">
                            <label htmlFor="inTitle">{router.locale == 'es' ? 'Título de la Galleta' : 'Cookie title'}</label>
                            <input className="form-control" id="inTitle" name='title' type="text" placeholder={router.locale == 'es' ? 'Nueva Galleta' : 'New Cookie'} value={frmPlusTitle} required onBlur={handleTitleBlur} onChange={handleTitleChange} onFocus={hideAlert} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inFile">{router.locale == 'es' ? 'Nombre del archivo' : 'File name'}</label>
                            <input className="form-control" id="inFile" name='file' type="text" placeholder={router.locale == 'es' ? 'nueva-galleta' : 'new-cookie'} value={frmPlusFile} required onBlur={handleFileBlur} onChange={handleFileChange} onFocus={hideAlert} />
                        </div>
                        <div className="dropdown-divider">
                        </div>
                        {submitingPlus ?
                            <ProgressBar variant={progressPlusVar} animated now={progressPlus} label={`${progressPlus}%`} />
                            :
                            <div className="d-grid">
                                <Button variant="primary" type="submit">{router.locale == 'es' ? 'Crear' : 'Create'}</Button>
                            </div>
                        }
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-grid w-100">
                        <Button disabled={submitingPlus} variant="secondary" type="button" onClick={() => setMdlOpenPlus(false)}>{Buttons[router.locale]["cancel"]}</Button>
                    </div>
                </Modal.Footer>
            </Modal>

            {/* Side toolbar */}
            <div className="tbar tbar-right btn-toolbar mb-3" role="toolbar">
                <div className="btn-group-vertical mr-2 btn-group-lg" role="group">
                    <button className="btn btn-science" onClick={() => { setMdlOpenPlus(true) }}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
            </div>

            <form action='' method='get' className="mb-4">
                <div className="input-group">
                    <input className="form-control" type="text" placeholder={router.locale == 'es' ? 'Buscar Galletas...' : 'Search Cookies...'} aria-describedby="frmBtns" maxLength="100" defaultValue={props.searchBox.searchBar} name={router.locale == 'es' ? 'busqueda' : 'search'} />
                    <div className="input-group-append" >
                        <select className="custom-select rounded-0" defaultValue={props.searchBox.order} name={router.locale == 'es' ? 'orden' : 'order'}>
                            <option value={router.locale == 'es' ? 'creacion' : 'creation'}>{router.locale == 'es' ? 'Creación' : 'Creation'}</option>
                            <option value={router.locale == 'es' ? 'publicacion' : 'publication'}>{router.locale == 'es' ? 'Publicación' : 'Publication'}</option>
                            <option value={router.locale == 'es' ? 'edicion' : 'edition'}>{router.locale == 'es' ? 'Edición' : 'Edition'}</option>
                            <option value={router.locale == 'es' ? 'popularidad' : 'popularity'}>{router.locale == 'es' ? 'Popularidad' : 'Popularity'}</option>
                        </select>
                        <select className="custom-select rounded-0" defaultValue={props.searchBox.direction} name={router.locale == 'es' ? 'direccion' : 'direction'}>
                            <option value={router.locale == 'es' ? 'descendente' : 'descending'}>{router.locale == 'es' ? 'Descendente' : 'Descending'}</option>
                            <option value={router.locale == 'es' ? 'ascendente' : 'ascending'}>{router.locale == 'es' ? 'Ascendente' : 'Ascending'}</option>
                        </select>
                        <button className="btn btn-outline-light" type="submit">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </div>
            </form>

            {totalPages > 1 ?
                <nav >
                    <ul className="pagination justify-content-end">
                        <li className="page-item" key='1'>
                            <button className="page-link text-light bg-transparent" onClick={() => handlePageChange(-1)}>
                                <span aria-hidden="true">«</span>
                            </button>
                        </li>
                        <li className="page-item" key='2'>
                            <span className="page-link text-light bg-transparent">{page}</span>
                        </li>
                        <li className="page-item" key='3'>
                            <button className="page-link text-light bg-transparent" onClick={() => handlePageChange(1)}>
                                <span aria-hidden="true">»</span>
                            </button>
                        </li>
                    </ul>
                </nav>
                : null
            }

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-1 row-cols-lg-2 row-cols-xl-3">
                {searchRes.length < 1 ?
                    <h5 className="mt-0 text-center" key='1'>No se han encontrado resultados</h5> : <></>
                }
                {(!props.searchParams.kywords && page == 1) || searchRes.length < 1 ?
                    <div className="col mb-4" key='0'>
                        <div className="card text-dark bg-light h-100 cardBorder" style={{ borderColor: '#343a40' }}>
                            <a type="button" onClick={() => { setMdlOpenPlus(true) }} className="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center">
                                <h1 style={{ fontSize: '6rem' }} className="mb-0">
                                    <FontAwesomeIcon icon={faPlusSquare} />
                                </h1>
                            </a>
                        </div>
                    </div>
                    : <></>
                }
                {searchRes.map((cookie, idx) => {
                    if (idx == searchRes.length - 1) {
                        if (paglast[page] == undefined || paglast[page] == null) {
                            paglast.push(cookie.id);
                        } else if (paglast[page] != cookie.id) {
                            paglast.splice(page, 1, cookie.id);
                        }
                    }
                    return (
                        <div className="col mb-4" key={cookie.id}>
                            <div className={`card text-dark bg-light h-100 cardBorder ${cookie.owner == authUser?.uid ? 'border-success' : 'border-secondary'}`}>
                                <div className="card-header bg-light m-0 py-0 text-right">
                                    <div className="row justify-content-between">
                                        {!cookie.public ?
                                            <div className="col-auto p-0">
                                                <span className="badge badge-warning">{router.locale == 'es' ? 'Borrador' : 'Draft'}</span>
                                            </div> : <></>
                                        }
                                        <div className="col-auto p-0 ml-auto">
                                            <div className="dropdown">
                                                <button className="btn btn-light" onClick={() => handleDropdownClick(cookie.id)} onBlur={() => { handleDropdownBlur(cookie.id) }}>
                                                    <FontAwesomeIcon icon={faEllipsisH} />
                                                </button>
                                            </div>
                                            <div className={`dropdown-menu dropdown-menu-right ${dropdowns[cookie.id] ? 'show' : ''}`}>
                                                <Link className="dropdown-item" href={`/${router.locale}/${NavLinks['es']['edit']}?id=${cookie.id}`} as={`/${NavLinks[router.locale]['edit']}?id=${cookie.id}`} locale={false}>
                                                    {router.locale == 'es' ? 'Editar ' : 'Edit '}
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </Link>
                                                {cookie.public ?
                                                    <a className="dropdown-item" href={'/' + NavLinks[router.locale].cook + cookie.fileTranslations[router.locale] + '/'} target='_blank'>
                                                        {router.locale == 'es' ? 'Ver galleta ' : 'View cookie '}
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </a>
                                                    : <></>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Link className="text-decoration-none text-dark" href={`/${router.locale}/${NavLinks['es']['edit']}?id=${cookie.id}`} as={`/${NavLinks[router.locale]['edit']}?id=${cookie.id}`} locale={false}>
                                    <div className='card-img-top' style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
                                        <Image fill src={cookie.picUrl} alt={cookie.title || (router.locale == 'es' ? 'No hay imagen' : 'No image')} sizes="(max-width: 1200px) 25vw, 17vw" style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div className="card-body">
                                        <h3 className="card-title">{cookie.title}</h3>
                                        <p>{`${router.locale == 'es' ? 'Autor(es)' : 'Author(s)'}: ${cookie.authors}`}</p>
                                        <p className="card-text">{cookie.description}</p>
                                    </div>
                                    <div className="card-footer text-muted">
                                        <p>{`${router.locale == 'es' ? 'Creado' : 'Created'}: ${formatDate(cookie.created)}`}</p>
                                        <p>{`${router.locale == 'es' ? 'Actualizado' : 'Actualizado'}: ${formatDate(cookie.ledit)}`}</p>
                                        {cookie.public ?
                                            <p>{`${router.locale == 'es' ? 'Publicado' : 'Published'}: ${formatDate(cookie.published)}`}</p>
                                            :
                                            <p>{router.locale == 'es' ? 'No publicado' : 'Not published'}</p>
                                        }
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>

            {totalPages > 1 ?
                <nav>
                    <ul className="pagination justify-content-end">
                        <li className="page-item" key='1'>
                            <button className="page-link text-light bg-transparent" onClick={() => handlePageChange(-1)}>
                                <span aria-hidden="true">«</span>
                            </button>
                        </li>
                        <li className="page-item" key='2'>
                            <span className="page-link text-light bg-transparent">{page}</span>
                        </li>
                        <li className="page-item" key='3'>
                            <button className="page-link text-light bg-transparent" onClick={() => handlePageChange(1)}>
                                <span aria-hidden="true">»</span>
                            </button>
                        </li>
                    </ul>
                </nav>
                : null
            }
        </>
    );

}

export async function getServerSideProps(context) {
    //Parse query to get results
    const query = context.query;
    const searchBox = {};
    let kywords = '', direction, orderq, desc = false, order;

    if (query.search || query.busqueda) {
        if (query.search) {
            kywords = query.search;
        } else {
            kywords = query.busqueda;
        }
    }
    direction = (query.direction || query.direccion) || (context.locale === 'es' ? 'descendente' : 'descending');
    if (direction == 'descendente' || direction == 'descending') {
        desc = true;
    }
    orderq = (query.order || query.orden) || (context.locale === 'es' ? 'creacion' : 'creation');
    switch (orderq) {
        case 'creacion':
        case 'creation':
            order = 'created'
            break;
        case 'publicacion':
        case 'publication':
            order = 'published'
            break;
        case 'edicion':
        case 'edition':
            order = 'ledit'
            break;
        case 'popularidad':
        case 'popularity':
            order = 'pop';
            break;
        default:
            order = 'created';
            break;
    }
    searchBox.searchBar = kywords;
    searchBox.direction = direction;
    searchBox.order = orderq;


    const props = {
        site: 'drafts',
        host: context.req.headers.host,
        ...(await getGlobalData(context)),
        langsList: await getConfigLanguages(),
        searchBox: { ...searchBox },
        searchResults: { ...(await getDraftsSearch(context.locale, kywords, order, desc, 1)) },
        searchParams: {
            kywords: kywords,
            order: order,
            desc: desc
        }
    }
    return { props: props }
}