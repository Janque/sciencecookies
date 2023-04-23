import stylesEdit from '../styles/edit.module.scss';
import stylesCookie from '../styles/cookie.module.scss';
import { formatDate, getGlobalData } from '../lib/utils';
import MetaDescription from '../components/metaDescription';
import { useRouter } from 'next/router';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import { Buttons } from '../components/layoutAttr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faCheckSquare, faEdit, faEnvelope, faExchangeAlt, faExternalLinkAlt, faEye, faImage, faLanguage, faLock, faPaperPlane, faPlus, faPlusSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { cookieExists, getConfigCatsList, getConfigLanguages, getConfigAuthors, getCookieEdit, uploadCookie } from '../firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useAlert, AlertComponent } from '../components/alert';
import { useAuth } from '../firebase/auth';
import Spinner from 'react-bootstrap/Spinner';
import { ultraClean } from '../lib/utils';
import dynamic from 'next/dynamic'
const CustomEditor = dynamic(
    () => import('../components/customEditor'),
    { ssr: false }
)
import Script from 'next/script';
import ImageRatio from '../components/imageRatio';
import ImageAuto from '../components/imageAuto';

export default function Editar(props) {
    const router = useRouter();
    const { authUser } = useAuth();
    const { showAlert, hideAlert } = useAlert();

    //Get Cookie data
    const [cookie, setCookie] = useState(null);
    const [cookieLoading, setCookieLoading] = useState(true);
    useEffect(() => {
        if (authUser && props.cookieId) {
            const unsubscribe = getCookieEdit(router.locale, props.cookieId, setCookie, setCookieLoading);
            window.onbeforeunload = () => unsubscribe();
            return () => unsubscribe();
        }
    }, [getCookieEdit, authUser, props.cookieId]);

    let submitingPlus, progressPlusVar, progressPlus, mdlOpenPub, mdlOpenTrans;//temp
    //Plus Sect modal
    const [toAddSect, setToAddSect] = useState(-1);
    const [mdlOpenPlusSect, setMdlOpenPlusSect] = useState(false);

    //Media modals
    const [toAddMed, setToAddMed] = useState(-1);
    const [addFromMed, setAddFromMed] = useState(-1);
    //Choose
    const [mdlOpenMedCho, setMdlOpenMedCho] = useState(false);
    //Add
    const [mdlOpenMedAdd, setMdlOpenMedAdd] = useState(false);
    //Manage
    const [mdlOpenMedMan, setMdlOpenMedMan] = useState(false);


    //Top form
    const [topForm, setTopForm] = useState({});
    const [topFormChanged, setTopFormChanged] = useState(false);
    function handleNewFile(newFile) {
        newFile = ultraClean(newFile, '-', true, true);
        setTopForm({ ...topForm, file: newFile });
    }
    function handleFileChange(e) {
        handleNewFile(e.target.value);
        setTopFormChanged(true);
    }
    function handleFileBlur(e) {
        handleNewFile(e.target.value);
    }
    function handleDescriptionChange(e) {
        setTopForm({ ...topForm, description: e.target.value });
        setTopFormChanged(true);
    }
    function handleDescriptionBlur(e) {
        setTopForm({ ...topForm, description: e.target.value.trim() });
    }
    //Categories selection
    function handleCatsClick(e, cat) {
        let tc = topForm.fixedCats.slice();
        if (e.target.checked) {
            tc.push(cat);
            tc.sort();
        } else {
            tc.splice(tc.indexOf(cat), 1);
        }
        setTopForm({ ...topForm, fixedCats: tc });
        setTopFormChanged(true);
    }
    function handleTopFormRevert() {
        setTopForm({
            file: cookie.fileTranslations[router.locale],
            fixedCats: cookie.fixedCats,
            description: cookie.description
        })
        setTopFormChanged(false);
    }
    async function submitTopForm(e) {
        e.preventDefault();
        if (topForm.file != cookie.fileTranslations[router.locale] && (await cookieExists(router.locale, topForm.file))) {
            showAlert(router.locale == 'es' ? 'Ese nombre de archivo ya esta en uso.' : 'That file name is already in use.', 'danger', 'alrtPlus');
        } else {
            normSave(true);
        }
    }

    //Upload changes
    function saveCookie(saveSections = false) {
        //Not finished@#

        //Save sections
        if (saveSections) saveAllSections();
        //Set no changes
        setTopFormChanged(false);

        setCookieLoading(true);
        return uploadCookie(router.locale, props.cookieId, {
            ...cookie,
            cont: sectionsNorm,
            //Special data
            authors: sectionsNorm[0].author,
            title: sectionsNorm[0].title,
            //Top form
            fileTranslations: {
                ...cookie.fileTranslations,
                [router.locale]: topForm.file
            },
            fixedCats: topForm.fixedCats,
            description: topForm.description
        });
    }
    async function normSave(saveSections = false) {
        await saveCookie(saveSections);
        showAlert('saved', 'success');
    }

    useEffect(() => {
        if (!cookieLoading) {
            //Reversible data no longer reversible
            setTopForm({
                file: cookie.fileTranslations[router.locale],
                fixedCats: cookie.fixedCats,
                description: cookie.description
            });
        }
    }, [cookie])

    //Sections functions
    //Control
    const [sectionsNorm, setSectionsNorm] = useState([]);
    const [sectionsForm, setSectionsForm] = useState([]);
    const [sectionsOpen, setSectionsOpen] = useState(-1);
    const [sectionsSet, setSectionsSet] = useState(false);
    const [sectChanged, setSectChanged] = useState(false);
    const [sectChangedIdx, setSectChangedIdx] = useState(-1);
    const isFirst = useRef(true);
    useEffect(() => {
        if (!cookieLoading && sectionsSet) {
            if (!isFirst.current) {
                normSave();
            } else {
                isFirst.current = false;
            }
        }
    }, [sectionsNorm])
    useEffect(() => {
        if (sectChangedIdx != -1) {
            const norm = sectionsNorm[sectChangedIdx];
            const form = sectionsForm[sectChangedIdx];
            let change = false;
            if (norm.type == 'head') {
                change = (norm.title != form.title || form.author.length != norm.author.length);
                for (let i = 0; i < form.author.length; i++) {
                    if (norm.author.indexOf(form.author[i]) == -1) change = true;
                    if (change) break;
                }
            } else {
                const nk = Object.keys(norm);
                const fk = Object.keys(form);
                change = (nk.length != fk.length);
                for (let key of nk) {
                    if (norm[key] !== form[key]) change = true;
                    if (change) break;
                }
            }
            setSectChanged(change);
        }
    }, [sectionsNorm, sectionsForm, sectChangedIdx])
    useEffect(() => {
        if (!cookieLoading && !sectionsSet) {
            let t = cookie.cont.map(sect => {
                let newSect = {};
                Object.keys(sect).forEach(key => {
                    if (key == 'author' || key == 'ref') newSect[key] = sect[key].slice();
                    else newSect[key] = sect[key];
                });
                return newSect;
            });
            let tt = t.map(sect => {
                let newSect = {};
                if (sect.type != 'ref') {
                    Object.keys(sect).forEach(key => {
                        if (key == 'author') newSect[key] = sect[key].slice();
                        else newSect[key] = sect[key];
                    });
                }
                return newSect;
            });
            setSectionsNorm(t);
            setSectionsForm(tt);
            setSectionsSet(true);
        }
    }, [cookie, sectionsSet])
    function saveAllSections(idx = -1, normal = true) {
        if (sectionsOpen != -1) saveSection(sectionsOpen);
        if (openRef != -1) saveRef(openRef);
        if (normal) {
            setSectionsOpen(idx);
            setOpenRef(-1);
        } else {
            setOpenRef(idx);
            setSectionsOpen(-1);
        }
    }
    useEffect(() => {
        if (mdlOpenPlusSect) saveAllSections();
    }, [mdlOpenPlusSect])
    //Control refs
    const [openRef, setOpenRef] = useState(-1);
    const [openRefLink, setOpenRefLink] = useState('');
    const [openRefType, setOpenRefType] = useState('web');
    const [changedRefL, setChangedRefL] = useState(false);
    const [changedRefT, setChangedRefT] = useState(false);
    function saveRef(idx) {
        if (!changedRefL && !changedRefT) return;
        let t = sectionsNorm.slice();
        let tt = t[t.length - 1].ref.slice();
        tt[idx].link = openRefLink;
        tt[idx].type = openRefType;
        tt.sort((a, b) => ((a.link.toUpperCase() < b.link.toUpperCase()) ? -1 : 1));
        t[t.length - 1].ref = tt;
        setSectionsNorm(t);
        setChangedRefL(false);
        setChangedRefT(false);
    }
    function delRef(idx) {
        let t = sectionsNorm.slice();
        let tt = t[t.length - 1].ref.slice();
        tt.splice(idx, 1);
        t[t.length - 1].ref = tt;
        setOpenRef(-1);
        setSectionsNorm(t);
    }
    function plusRef() {
        saveAllSections();
        let t = sectionsNorm.slice();
        let tt = t[t.length - 1].ref.slice();
        tt.push({ link: '', type: 'web' });
        t[t.length - 1].ref = tt;
        setOpenRef(tt.length - 1);
        setSectionsNorm(t);
    }
    //Plus
    function plusSection(type) {
        let norm = {
            key: Math.floor(Date.now() / 1000)
        };
        if (type == 'html') {
            norm = {
                ...norm,
                type: type,
                html: '',
                css: '',
                js: ''
            };
        } else if (type == 'parra') {
            norm = {
                ...norm,
                type: type,
                text: '',
                title: "0",
                titleTxt: ''
            };
        } else if (type == 'youtube') {
            norm = {
                ...norm,
                type: type,
                vidUrl: '',
                ratio: "16by9"
            };
        } else if (type == 'medSimple') {
            norm = {
                ...norm,
                type: type,
                medUrl: "https://via.placeholder.com/150.webp",
                alt: '',
                caption: '',
                hasCapt: "true",
                width: "75%"
            };
        } else {
            return;
        }
        let t = sectionsNorm.slice();
        t.splice(toAddSect, 0, norm);
        setSectionsNorm(t);
        let tt = sectionsForm.slice();
        tt.splice(toAddSect, 0, norm);
        setSectionsForm(tt);
        setMdlOpenPlusSect(false);
        setSectionsOpen(toAddSect);
    }
    //Edition
    function editSection(idx) {
        let norm = sectionsNorm.slice();
        if (norm[idx].type == 'html') {
            setSrcDocCurrent({
                html: sectionsForm[idx].html,
                css: sectionsForm[idx].css,
                js: sectionsForm[idx].js
            })
        }
        saveAllSections(idx);
    }
    function cancelEditSection(idx) {
        if (!sectChanged) {
            setSectionsOpen(-1);
            return;
        }
        let norm = sectionsNorm.slice();
        if (norm.type == 'ref') {
            showAlert(router.locale == 'es' ? 'No se puede cancelar la edición de Ref' : 'Edition of Ref cannot be canceled', 'danger');
            setSectionsOpen(-1);
            return;
        }
        let form = sectionsForm.slice();
        Object.keys(norm[idx]).forEach(key => {
            if (key == 'author') form[idx][key] = norm[idx][key].slice();
            else form[idx][key] = norm[idx][key];
        });
        setSectionsOpen(-1);
        setSectionsForm(form);
    }
    function saveSection(idx) {
        if (!sectChanged) return;
        let norm = sectionsNorm.slice();
        if (norm.type == 'ref') {
            showAlert(router.locale == 'es' ? 'No se puede guardar la edición de Ref' : 'Edition of Ref cannot be saved', 'danger');
            setSectionsOpen(-1);
            return;
        }
        let form = sectionsForm.slice();
        Object.keys(form[idx]).forEach(key => {
            if (key == 'author') norm[idx][key] = form[idx][key].slice();
            else norm[idx][key] = form[idx][key];
        });
        setSectionsNorm(norm);
    }
    //Custom HTML sects
    const [srcDocCurrent, setSrcDocCurrent] = useState({});
    useEffect(() => {
        if (sectChangedIdx != -1 && sectionsForm[sectChangedIdx].type == 'html') {
            const timeout = setTimeout(() => {
                setSrcDocCurrent({
                    html: sectionsForm[sectChangedIdx].html,
                    css: sectionsForm[sectChangedIdx].css,
                    js: sectionsForm[sectChangedIdx].js
                })
            }, 1500)
            return () => clearTimeout(timeout)
        }
    }, [sectionsForm, sectChangedIdx])
    //Delete
    const [sectionToDel, setSectionToDel] = useState(-1);
    function deleteSection(idx) {
        if (sectionToDel == idx) {
            setSectionToDel(-1);
            hideAlert();
            let norm = sectionsNorm.slice();
            let form = sectionsForm.slice();
            norm.splice(idx, 1);
            form.splice(idx, 1);
            setSectionsNorm(norm);
            setSectionsForm(form);
            setSectionsOpen(-1);
        } else {
            showAlert(router.locale == 'es' ? "<strong>¿Quieres eliminar esta sección?</strong> Presiona de nuevo el botón para confirmar." : "<strong>Do you want to delete this section? </strong> Press the button again to confirm.", 'danger');
            setSectionToDel(idx);
            setTimeout(() => {
                setSectionToDel(-1);
            }, 3000);
        }
    }
    //Translate
    function translateSection() {
        /*
        To Do
        getDoc(docRef(FSDB, 'cookies/langs/' + selLang.value, docId)).then(async function (doc) {
            let sect = doc.data().cont[idx];
            if (item.type != sect.type) return;
            if (sect.type == 'head') {
                docDat.cont[idx].title = await translateSimple(sect.title, selLang.value, lang);
            } else if (sect.type == 'html') {
                docDat.cont[idx].html = await translateSimple(sect.html, selLang.value, lang);
            } else if (sect.type == 'parra') {
                docDat.cont[idx].text = await translateSimple(sect.text, selLang.value, lang);
                if (sect.title != "0") {
                    docDat.cont[idx].titleTxt = await translateSimple(sect.titleTxt, selLang.value, lang);
                }
            } else if (sect.type == 'medSimple') {
                docDat.cont[idx].alt = await translateSimple(sect.alt, selLang.value, lang);
                docDat.cont[idx].caption = await translateSimple(sect.caption, selLang.value, lang);
            }
            console.log(docDat.cont[idx]);
            normSave();
        }).catch(err => console.log(err));
        */
    }

    return (
        (!authUser || cookieLoading) ?
            <Spinner animation="border" variant="primary" style={{ marginLeft: '50%', marginTop: '25%' }} />
            :
            <>
                <MetaDescription description={router.locale == 'es' ? 'Edita las Galletas' : 'Edit the Cookies'} />

                {/* Add section modal */}
                <Modal className='text-dark' show={mdlOpenPlusSect} onHide={() => setMdlOpenPlusSect(false)} centered scrollable>
                    <AlertComponent id='alrtPlus' />
                    <Modal.Header>
                        <Modal.Title>{router.locale == 'es' ? 'Añadir una sección' : 'Add section'}</Modal.Title>
                        <button className="close" type="button" onClick={() => setMdlOpenPlusSect(false)} disabled={submitingPlus}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Button className='btn-science m-2' onClick={() => plusSection('parra')}>{router.locale == 'es' ? 'Párrafo' : 'Paragraph'}</Button>
                        <Button className="btn-science m-2" onClick={() => plusSection('html')}>HTML</Button>
                        <Button className="btn-science m-2" onClick={() => plusSection('youtube')}>Youtube</Button>
                        <Button className="btn-science m-2" onClick={() => plusSection('medSimple')}>Multimedia</Button>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-grid w-100">
                            <Button disabled={submitingPlus} variant="secondary" type="button" onClick={() => setMdlOpenPlusSect(false)}>{Buttons[router.locale]["cancel"]}</Button>
                        </div>
                    </Modal.Footer>
                </Modal>

                {/* Manage media modal */}
                <Modal className='text-dark' show={mdlOpenMedMan} onHide={() => setMdlOpenMedMan(false)} centered scrollable>
                    <AlertComponent id='alrtPlus' />
                    <Modal.Header>
                        <Modal.Title>{router.locale == 'es' ? 'Administra las imágenes' : 'Manage media'}</Modal.Title>
                        <button className="close" type="button" onClick={() => setMdlOpenMedMan(false)} disabled={submitingPlus}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row row-cols-1 row-cols-md-3" id="contMedMan">
                            <div className="col mb-4">
                                <div className="card text-dark bg-light h-100 cardBorder" style={{ borderColor: '#343a40' }}>
                                    <a className="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center" type="button" aria-label="Close" onclick="addFrom=0;">
                                        <span className="mb-0" style={{ fontSize: '6rem' }}>
                                            <FontAwesomeIcon icon={faPlusSquare} />
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-grid w-100">
                            <Button disabled={submitingPlus} variant="secondary" type="button" onClick={() => setMdlOpenMedMan(false)}>{Buttons[router.locale]["cancel"]}</Button>
                        </div>
                    </Modal.Footer>
                </Modal>

                {/* Choose media modal */}
                <Modal className={`text-dark ${stylesEdit['mdl-choose-media']}`} show={mdlOpenMedCho} onHide={() => setMdlOpenMedCho(false)} centered scrollable>
                    <AlertComponent id='alrtPlus' />
                    <Modal.Header>
                        <Modal.Title>{router.locale == 'es' ? 'Escoge una imagen' : 'Choose an image'}</Modal.Title>
                        <button className="close" type="button" onClick={() => setMdlOpenMedCho(false)} disabled={submitingPlus}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3">
                            <div className={`col mb-4 ${stylesEdit['adder-button']}`}>
                                <div className="card text-dark bg-light h-100 cardBorder">
                                    <Button className="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center" type="button" onClick={() => {
                                        setMdlOpenMedCho(false);
                                        setMdlOpenMedAdd(true);
                                        setAddFromMed(1);
                                    }}>
                                        <span className="mb-0">
                                            <FontAwesomeIcon icon={faPlusSquare} />
                                        </span>
                                    </Button>
                                </div>
                            </div>
                            {cookie.media.map(media => {
                                return (
                                    <div className={`col mb-4 ${stylesEdit['media-card']}`} key={media.key}>
                                        <a type='button' onClick={() => {
                                            if (toAddMed == -1) return;
                                            let t = sectionsForm.slice();
                                            t[toAddMed].medUrl = media.medUrl;
                                            console.log(media.medUrl)
                                            setSectionsForm(t);
                                            setSectChangedIdx(toAddMed);
                                            setMdlOpenMedCho(false);
                                        }}>
                                            <div className='card text-light bg-dark'>
                                                <ImageAuto className='card-img' src={media.medUrl} alt={media.medFile} sizes='(max-width: 576px) 50vw, (max-width: 1200px) 25vw, 17vw' />
                                            </div>
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-grid w-100">
                            <Button disabled={submitingPlus} variant="secondary" type="button" onClick={() => setMdlOpenMedCho(false)}>{Buttons[router.locale]["cancel"]}</Button>
                        </div>
                    </Modal.Footer>
                </Modal>

                {/* Add media modal */}
                <Modal className='text-dark' show={mdlOpenMedAdd} onHide={() => setMdlOpenMedAdd(false)} centered scrollable>
                    <AlertComponent id='alrtPlus' />
                    <Modal.Header>
                        <Modal.Title>{router.locale == 'es' ? 'Añadir multimedia a la Galleta' : 'Add media to the Cookie'}</Modal.Title>
                        <button className="close" type="button" onClick={() => setMdlOpenMedAdd(false)} disabled={submitingPlus}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row mb-3 w-100 py-0 justify-content-center mx-auto">
                            <img className="w-75 m-0" id="prevNewMed" src='' />
                        </div>
                        <form id="frmAddMed">
                            <div className="row mb-3">
                                <div className="form-check form-check-inline ml-3">
                                    <input className="form-check-input" id="inMedSrc0" type="radio" name="radsMedSrc" value="home" required />
                                    <label className="form-check-label" for="inMedSrc0">{router.locale == 'es' ? 'Propio' : 'Own'}</label>
                                </div>
                                <div className="form-check form-check-inline ml-3">
                                    <input className="form-check-input" id="inMedSrc1" type="radio" name="radsMedSrc" value="out" required />
                                    <label className="form-check-label" for="inMedSrc1">{router.locale == 'es' ? 'Externo' : 'External'}</label>
                                </div>
                            </div>
                            <div className="custom-file mb-5 d-none" id="inNewMedFileCont">
                                <input className="custom-file-input" id="inNewMed" type="file" />
                                <label className="custom-file-label" id="inNewMedL" for="inNewMed" data-browse="Elegir">{router.locale == 'es' ? 'Subir archivo' : 'Upload file'}</label>
                            </div>
                            <div className="row mb-2 d-none" id="inNewMedUrlCont">
                                <div className="col">
                                    <label for="inNewMedUrl">{router.locale == 'es' ? 'URL del archivo' : 'Media URL'}</label>
                                    <input className="form-control" id="inNewMedUrl" type="text" placeholder={router.locale == 'es' ? 'https://imagen.com' : 'https://image.com'} />
                                </div>
                            </div>
                            <div className="d-grid w-100">
                                <button id="btnCnfNewMed" className="btn btn-primary btn-block" type="submit">{router.locale == 'es' ? 'Añadir' : 'Add'}</button>
                            </div>
                        </form>
                        <ProgressBar variant={progressPlusVar} animated now={progressPlus} label={`${progressPlus}%`} />
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-grid w-100">
                            <Button disabled={submitingPlus} variant="secondary" type="button" onClick={() => setMdlOpenMedAdd(false)}>{Buttons[router.locale]["cancel"]}</Button>
                        </div>
                    </Modal.Footer>
                </Modal>

                {/* Publish modal */}
                <Modal className='text-dark' show={mdlOpenPub} onHide={() => setMdlOpenPub(false)} centered scrollable>
                    <AlertComponent id='alrtPlus' />
                    <Modal.Header>
                        <Modal.Title>{router.locale == 'es' ? 'Publicar la Galleta' : 'Publish Cookie'}</Modal.Title>
                        <button className="close" type="button" onClick={() => setMdlOpenPub(false)} disabled={submitingPlus}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <p id="mdlPublishTxt"></p>
                        <form className="d-none" id="frmPublish">
                            <div className="form-row d-none" id="sendUptCont">
                                <div className="form-check">
                                    <input className="form-check-input" id="inSendUpt" type="checkbox" />
                                    <label className="form-check-label" for="inSendUpt">{router.locale == 'es' ? 'Notificar actualización' : 'Notify update'}</label>
                                </div>
                                <div className="row my-2 d-none" id="uptDescCont">
                                    <div className="col">
                                        <label>{router.locale == 'es' ? 'Descripción de la actualización' : 'Update description'}</label>
                                        <textarea className="form-control" id="inUptDesc" rows="3"></textarea>
                                    </div>
                                </div>
                            </div>
                        </form>
                        { /* TO DO: baking gif */}
                        <ProgressBar variant={progressPlusVar} animated now={progressPlus} label={`${progressPlus}%`} />
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-grid w-100">
                            <button className="btn btn-science btn-block" id="btnCnfPublish" type="button">{router.locale == 'es' ? 'Publicar' : 'Publish'}</button>
                            <Button disabled={submitingPlus} variant="secondary" type="button" onClick={() => setMdlOpenPub(false)}>{Buttons[router.locale]["cancel"]}</Button>
                        </div>
                    </Modal.Footer>
                </Modal>

                {/* Translate modal */}
                <Modal className='text-dark' show={mdlOpenTrans} onHide={() => setMdlOpenTrans(false)} centered scrollable>
                    <AlertComponent id='alrtPlus' />
                    <Modal.Header>
                        <Modal.Title>{router.locale == 'es' ? 'Generar traducción' : 'Generate translation'}</Modal.Title>
                        <button className="close" type="button" onClick={() => setMdlOpenTrans(false)} disabled={submitingPlus}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </Modal.Header>
                    <form id="frmTranslate">
                        <Modal.Body>
                            <p id="mdlTranslateTxt"></p>
                            <div className="form-row">
                                {router.locale == 'es' ?
                                    <div className="alert alert-dismissible fade show alert-danger" role="alert">Estás en español, ¿realmente quieres traducir desde otro idioma?</div>
                                    : null
                                }
                                <div className="alert alert-dismissible fade show alert-warning" role="alert">{router.locale == 'es' ? 'La traducción sobreescribe los cambios en el idioma actual' : 'The translation overrides the changes in the current language'}</div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label for="inTransFrom">{router.locale == 'es' ? 'Traducir del' : 'Translate from'}</label>
                                    <select className="form-control" id="inTransFrom" required="required">
                                        <option selected="selected" value=''>{router.locale == 'es' ? 'Choose...' : 'Generate translation'}</option>
                                    </select>
                                </div>
                            </div>
                            <ProgressBar variant={progressPlusVar} animated now={progressPlus} label={`${progressPlus}%`} />
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="d-grid w-100">
                                <button className="btn btn-science btn-block" id="btnCnfTranslate" type="button">{router.locale == 'es' ? 'Traducir' : 'Translate'}</button>
                                <Button disabled={submitingPlus} variant="secondary" type="button" onClick={() => setMdlOpenTrans(false)}>{Buttons[router.locale]["cancel"]}</Button>
                            </div>
                        </Modal.Footer>
                    </form>
                </Modal>

                { /* Side toolbar */}
                <div className="tbar tbar-right btn-toolbar mb-3" role="toolbar">
                    <div className="btn-group-vertical btn-group-lg" role="group">
                        <button className="btn btn-science" data-toggle="modal" data-target="#mdlPlusSect" onclick="toAdd=docDat.cont.length-1;">
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                        <button className="btn btn-science" data-toggle="modal" data-target="#mdlMedMan">
                            <FontAwesomeIcon icon={faImage} />
                        </button>
                        <button className="btn btn-science" data-toggle="modal" data-target="#mdlTranslate">
                            <FontAwesomeIcon icon={faLanguage} />
                        </button>
                        <a className="btn btn-science" id="btnPrevCook" target="_blank">
                            <FontAwesomeIcon icon={faEye} />
                        </a>
                        <a className="btn btn-science" id="btnPrevMail" target="_blank">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </a>
                        {cookie.public ?
                            <>
                                <button className="btn btn-science" id="btnPrivate">
                                    <FontAwesomeIcon icon={faLock} />
                                </button>
                            </> :
                            <>
                                <button className="btn btn-science" id="btnAprove">
                                    <FontAwesomeIcon icon={faCheckSquare} />
                                </button>
                                <button className="btn btn-science" id="btnPub" data-toggle="modal" data-target="#mdlPublish">
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            </>
                        }
                    </div>
                </div>

                <div className="container-fluid mb-2 rounded-lg p-3" style={{ backgroundColor: '#57238b' }}>
                    <div className="row mb-2 px-2">
                        <div className="col-auto">
                            <select className="form-control mr-0 ml-2 h-100" id="selFileTrans"></select>
                        </div>
                        <button className="btn btn-light btn-link-scckie" id="btnFileTrans">
                            <FontAwesomeIcon icon={faLanguage} />
                        </button>
                    </div>
                    <form id="frmFile">
                        <div className="row mb-2">
                            <label className="col-sm-auto col-lg-4 col-form-label">{router.locale == 'es' ? 'Nombre del archivo' : 'File name'}</label>
                            <div className="col">
                                <input className="form-control" id="inFile" type="text" placeholder={router.locale == 'es' ? 'nueva-galleta' : 'new-cookie'} value={topForm.file || ''} required onBlur={handleFileBlur} onChange={handleFileChange} onFocus={hideAlert} />
                            </div>
                        </div>
                        <div className="row mb-2">
                            <label className="col-sm-auto col-form-label">{router.locale == 'es' ? 'Descripción' : 'Description'}</label>
                            <div className="col">
                                <textarea className="form-control" id="inDesc" rows="3" value={topForm.description} onBlur={handleDescriptionBlur} onChange={handleDescriptionChange}></textarea>
                            </div>
                        </div>
                        <div className="form-row my-4 justify-content-around">
                            {props.configCatsList[router.locale].allCats.map((cat, idx) => {
                                return (
                                    <div className="form-group col-auto">
                                        <div className="form-check">
                                            <input type="checkbox" id={`cat${idx}`} className="form-check-input" defaultValue={cat} checked={topForm.fixedCats?.indexOf(cat) != -1} onChange={(e) => handleCatsClick(e, cat)} />
                                            <label htmlFor={`cat${idx}`} className="form-check-label">{props.configCatsList[router.locale].textCats[idx]}</label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="row mb-2 justify-content-end">
                            <Button disabled={!topFormChanged} variant="secondary" onClick={handleTopFormRevert}>{router.locale == 'es' ? 'Revertir' : 'Revert'}</Button>
                            <Button variant='light' className="btn-link-scckie mx-3" type="submit" onClick={submitTopForm}>
                                <FontAwesomeIcon icon={faCheck} />
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="container-fluid mb-2 rounded-lg p-3" id="cont" style={{ backgroundColor: '#57238b' }}>
                    {sectionsNorm.map((sect, idx) => {
                        const norm = sect;
                        const form = sectionsForm[idx];
                        const isOpen = sectionsOpen == idx;
                        const isClosed = sectionsOpen != idx;
                        return (
                            <div key={norm.key}>
                                {norm.type != 'head' ? <div className="dropdown-divider"></div> : null}

                                {/* Actions */}
                                <div className='row mb-2'>
                                    <div className="col-auto">
                                        {(norm.type != 'head' && norm.type != 'ref') ?
                                            <Button className="btn-link-science" variant="light" onClick={() => deleteSection(idx)}>
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </Button>
                                            : null
                                        }
                                    </div>
                                    {norm.type != 'ref' ?
                                        <>
                                            <div className="col-auto pr-0">
                                                <select className='form-control pl-2 pr-1 h-100' defaultValue={props.langsList[0] != router.locale ? props.langsList[0] : props.langsList[1]}>
                                                    {props.langsList.map(l => {
                                                        if (l != router.locale) {
                                                            return (
                                                                <option value={l}>{l}</option>
                                                            )
                                                        }
                                                    })}
                                                </select>
                                            </div>
                                            <div className="col-auto pl-2">
                                                <Button className="btn-link-science ml-2" variant="light" onClick={() => translateSection(idx)}>
                                                    <FontAwesomeIcon icon={faLanguage} />
                                                </Button>
                                            </div>
                                            <div className="col-auto ml-auto">
                                                {isClosed ?
                                                    <>
                                                        <Button className="btn-link-science ml-auto" variant="light" onClick={() => editSection(idx)}>
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </Button>
                                                        <Button className="btn-link-science ml-2" variant="light" onClick={() => {
                                                            setMdlOpenPlusSect(true);
                                                            setToAddSect(idx + 1);
                                                        }}>
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </Button>
                                                    </>
                                                    : <>
                                                        <Button className="ml-auto" variant="danger" onClick={() => cancelEditSection(idx)}>
                                                            <FontAwesomeIcon icon={faBan} />
                                                        </Button>
                                                        <Button className="btn-link-science ml-2" variant="light" onClick={() => saveAllSections()}>
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        </Button>
                                                    </>
                                                }
                                            </div>
                                        </>
                                        : null
                                    }
                                </div>
                                {norm.type == 'head' ?
                                    <>{isClosed ?
                                        <div>
                                            <h1 className='text-center'>{norm.title}</h1>
                                            <p>{router.locale == 'es' ? 'Publicado: ' : 'Published: '} {formatDate(cookie.published)}</p>
                                            {cookie.dledit ?
                                                <p>{router.locale == 'es' ? 'Ultima actualización: ' : 'Last updated: '} {formatDate(cookie.ledit)}</p>
                                                : null
                                            }
                                            <p>{router.locale == 'es' ? 'Autor(es): ' : 'Author(s): '} {norm.author.map((a, i) => (a + (i < norm.author.length - 1 ? ',' : '')))}</p>
                                        </div>
                                        :
                                        <div>
                                            <div className='row justify-content-center mb-2'>
                                                <div className="col col-lg-6">
                                                    <input type="text" className='form-control form-control-lg text-center' placeholder={norm.title} value={form.title} onChange={e => {
                                                        let t = sectionsForm.slice();
                                                        t[idx].title = e.target.value;
                                                        setSectionsForm(t);
                                                        setSectChangedIdx(idx);
                                                    }} />
                                                </div>
                                            </div>
                                            <div className='row mb-2'>
                                                <label htmlFor="dpub" className='col-sm-auto col-form-label'>
                                                    {router.locale == 'es' ? 'Publicado: ' : 'Published: '}
                                                </label>
                                                <div className="col">
                                                    <input id='dpub' type="text" className='form-control' defaultValue={formatDate(cookie.published)} readOnly />
                                                </div>
                                            </div>
                                            {cookie.dledit ?
                                                <div className='row mb-2'>
                                                    <label htmlFor="ledit" className='col-sm-auto col-form-label'>
                                                        {router.locale == 'es' ? 'Ultima actualización: ' : 'Last updated: '}
                                                    </label>
                                                    <div className="col">
                                                        <input id='ledit' type="text" className='form-control' defaultValue={formatDate(cookie.ledit)} readOnly />
                                                    </div>
                                                </div>
                                                : null
                                            }
                                            <div className='row mb-2'>
                                                <label className='col-sm-auto col-form-label'>
                                                    {router.locale == 'es' ? 'Autor(es): ' : 'Author(s): '}
                                                </label>
                                                <div className="form-row justify-content-around pt-2 px-3">
                                                    {props.authorsList.map((author, i) => (
                                                        <div className="form-group col-auto mr-2">
                                                            <div className="form-check">
                                                                <input type="checkbox" id={`author${i}`} className="form-check-input" defaultValue={author} checked={form.author.indexOf(author) != -1} onChange={(e) => {
                                                                    let t = sectionsForm.slice();
                                                                    if (e.target.checked) {
                                                                        t[idx].author.push(author);
                                                                        t[idx].author.sort((a, b) => {
                                                                            let aa = a.split(' '), bb = b.split(' ');
                                                                            return (aa[aa.length - 1] < bb[bb.length - 1] ? -1 : 1);
                                                                        });
                                                                    } else {
                                                                        t[idx].author.splice(t[idx].author.indexOf(author), 1)
                                                                    }
                                                                    setSectionsForm(t)
                                                                    setSectChangedIdx(idx);
                                                                }} />
                                                                <label htmlFor={`author${i}`} className="form-check-label">{author}</label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    }</>
                                    : null
                                }
                                {norm.type == 'ref' ?
                                    <>
                                        <h3>
                                            <br />{router.locale == 'es' ? 'Referencias' : 'References'}
                                            <Button variant="light" className="btn-science ml-2" onClick={() => plusRef()}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Button>
                                        </h3>
                                        {norm.ref.map((refer, ridx) => {
                                            return (
                                                <div key={ultraClean(refer.link)} className='row mb-2'>
                                                    <div className="col">
                                                        {openRef != ridx ?
                                                            <>
                                                                {refer.type == 'web' ?
                                                                    <p>
                                                                        <a href={refer.link} target="_blank" rel="noopener noreferrer" className='text-warning text-break'>
                                                                            {refer.link} <FontAwesomeIcon icon={faExternalLinkAlt} />
                                                                        </a>
                                                                    </p>
                                                                    : null
                                                                }
                                                                {refer.type == 'cite' ?
                                                                    <p dangerouslySetInnerHTML={{ __html: refer.link }}></p>
                                                                    : null
                                                                }
                                                            </>
                                                            :
                                                            <div className="row">
                                                                <div className="col">
                                                                    <input type="text" className="form-control" value={openRefLink} placeholder={(openRefType == 'web' ? 'https://google.com' : (openRefType == 'cite' ? 'Ref' : null))} onChange={e => {
                                                                        let val = e.target.value.trim();
                                                                        if (val != openRefLink) setChangedRefL(true);
                                                                        else setChangedRefL(false);
                                                                        setOpenRefLink(val);
                                                                    }} />
                                                                </div>
                                                                <div className="col-auto pl-0">
                                                                    <select className='form-control' value={openRefType} onChange={e => {
                                                                        let val = e.target.value.trim();
                                                                        if (val != openRefType) setChangedRefT(true);
                                                                        else setChangedRefT(false);
                                                                        setOpenRefType(e.target.value)
                                                                    }}>
                                                                        <option value="web">Web</option>
                                                                        <option value="cite">{router.locale == 'es' ? 'Otro' : 'Other'}</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="col-auto">
                                                        {openRef != ridx ?
                                                            <Button variant="light" className="btn-link-science ml-auto" onClick={() => {
                                                                saveAllSections(ridx, false);
                                                                setOpenRefLink(refer.link);
                                                                setOpenRefType(refer.type);
                                                            }}>
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </Button>
                                                            :
                                                            <>
                                                                <Button variant="light" className="btn-link-science ml-auto"
                                                                    onClick={() => saveAllSections()}>
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </Button>
                                                                <Button variant="light" className="btn-link-science ml-2"
                                                                    onClick={() => delRef(ridx)}>
                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                </Button>
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <Button variant="light" className="btn-science btn-block border border-light" type="button" onClick={() => plusRef()}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </Button>
                                    </>
                                    : null
                                }
                                {norm.type == 'parra' ?
                                    <>{isClosed ?
                                        <>
                                            {(Number(norm.title) >= 1 && Number(norm.title) <= 6) ?
                                                <span dangerouslySetInnerHTML={{ __html: `<h${norm.title}>${(Number(norm.title) == 2) ? '<br/>' : ''}${norm.titleTxt}</h${norm.title}>` }} />
                                                : null
                                            }
                                            <p dangerouslySetInnerHTML={{ __html: norm.text }} />
                                        </>
                                        :
                                        <>
                                            <div className="row">
                                                <div className="col">
                                                    <input type="text" className="form-control" value={form.titleTxt} placeholder={(Number(form.title) > 0) ? (router.locale == 'es' ? 'Subtítulo' : 'Subtitle') : ''} readOnly={Number(form.title) == 0} onChange={e => {
                                                        let t = sectionsForm.slice();
                                                        t[idx].titleTxt = e.target.value.trim();
                                                        setSectionsForm(t);
                                                        setSectChangedIdx(idx);
                                                    }} />
                                                </div>
                                                <div className="col-auto pl-0">
                                                    <select className="form-control" value={form.title} onChange={e => {
                                                        let t = sectionsForm.slice();
                                                        t[idx].title = e.target.value;
                                                        if (t[idx].title == '0') t[idx].titleTxt = '';
                                                        setSectionsForm(t);
                                                        setSectChangedIdx(idx);
                                                    }}>
                                                        {[0, 1, 2, 3, 4, 5, 6].map(a => {
                                                            return (<option value={a}>{a}</option>)
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row my-2">
                                                <div className="col">
                                                    <textarea rows="8" className="form-control" onChange={e => {
                                                        let t = sectionsForm.slice();
                                                        t[idx].text = e.target.value.trim();
                                                        setSectionsForm(t);
                                                        setSectChangedIdx(idx);
                                                    }}>{form.text}</textarea>
                                                </div>
                                            </div>
                                        </>
                                    }</>
                                    : null
                                }
                                {norm.type == 'html' ?
                                    <>
                                        {isClosed ?
                                            <>
                                                <div dangerouslySetInnerHTML={{ __html: sectionsNorm[idx].html }}></div>
                                                <style dangerouslySetInnerHTML={{ __html: sectionsNorm[idx].css }}></style>
                                                <Script dangerouslySetInnerHTML={{ __html: sectionsNorm[idx].js }}></Script>
                                            </>
                                            :
                                            <>
                                                <div dangerouslySetInnerHTML={{ __html: srcDocCurrent.html }}></div>
                                                <style dangerouslySetInnerHTML={{ __html: srcDocCurrent.css }}></style>
                                                <Script dangerouslySetInnerHTML={{ __html: srcDocCurrent.js }}></Script>
                                            </>
                                        }
                                        <div className={`row my-2 ${isClosed ? 'd-none' : ''}`}>
                                            <CustomEditor
                                                language="html"
                                                displayName="HTML"
                                                value={form.html}
                                                onChange={(value) => {
                                                    let t = sectionsForm.slice();
                                                    t[idx].html = value;
                                                    setSectionsForm(t);
                                                    setSectChangedIdx(idx);
                                                }}
                                            />
                                            <CustomEditor
                                                language="javascript"
                                                displayName="JS"
                                                value={form.js}
                                                onChange={(value) => {
                                                    let t = sectionsForm.slice();
                                                    t[idx].js = value;
                                                    setSectionsForm(t);
                                                    setSectChangedIdx(idx);
                                                }}
                                            />
                                            <CustomEditor
                                                language="css"
                                                displayName="CSS"
                                                value={form.css}
                                                onChange={(value) => {
                                                    let t = sectionsForm.slice();
                                                    t[idx].css = value;
                                                    setSectionsForm(t);
                                                    setSectChangedIdx(idx);
                                                }}
                                            />
                                        </div>
                                    </>
                                    : null
                                }
                                {norm.type == 'youtube' ?
                                    <>
                                        <div className={`embed-responsive embed-responsive-${isClosed ? norm.ratio : form.ratio} mb-2`}>
                                            <iframe allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen src={isClosed ? norm.vidUrl : form.vidUrl}></iframe>
                                        </div>
                                        {isClosed ?
                                            null
                                            :
                                            <div className="row">
                                                <div className="col">
                                                    <label htmlFor="inUrl">URL</label>
                                                    <input id='inUrl' type="text" className="form-control" value={form.vidUrl} onChange={e => {
                                                        let convUrl = e.target.value.trim();
                                                        if (convUrl.length == 11) convUrl = "https://www.youtube.com/embed/" + convUrl;
                                                        else {
                                                            let part, i = 1;
                                                            do {
                                                                part = convUrl[i - 1] + convUrl[i];
                                                                i++;
                                                            } while (part != "e/" && part != "v=");
                                                            convUrl = "https://www.youtube.com/embed/" + convUrl.substring(i, 11);
                                                        }
                                                        let t = sectionsForm.slice();
                                                        t[idx].vidUrl = convUrl;
                                                        setSectionsForm(t);
                                                        setSectChangedIdx(idx);
                                                    }} />
                                                    <small className="text-muted">{router.locale == 'es' ? 'aaaaaaaaaaa o https://youtu.be/aaaaaaaaaaa o https://www.youtube.com/watch?v=aaaaaaaaaaa' : 'aaaaaaaaaaa or https://youtu.be/aaaaaaaaaaa or https://www.youtube.com/watch?v=aaaaaaaaaaa'}</small>
                                                </div>
                                                <div className="col-auto pl-0">
                                                    <label htmlFor="inRatio">Ratio</label>
                                                    <select id="inRatio" className="form-control" value={form.ratio} onChange={e => {
                                                        let t = sectionsForm.slice();
                                                        t[idx].ratio = e.target.value;
                                                        setSectionsForm(t);
                                                        setSectChangedIdx(idx);
                                                    }}>
                                                        {['21by9', '16by9', '4by3', '1by1'].map(a => {
                                                            return (<option value={a}>{a.replaceAll('by', ':')}</option>)
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        }
                                    </>
                                    : null
                                }
                                {norm.type == 'medSimple' ?
                                    <>
                                        <figure className={stylesCookie['med-simple']} style={{ width: isClosed ? norm.width + '%' : form.width + '%' }}>
                                            <ImageAuto src={isClosed ? norm.medUrl : form.medUrl} alt={isClosed ? norm.alt : form.alt} />
                                            {(isClosed && norm.hasCapt) || (isOpen && form.hasCapt) ?
                                                <figcaption dangerouslySetInnerHTML={{ __html: isClosed ? norm.caption : norm.caption }} />
                                                : null
                                            }
                                            {isOpen ?
                                                <div className='card-img-overlay pt-0'>
                                                    <div className='row mb-2 p-0'>
                                                        <Button variant='light' size='sm' className='btn-science ml-auto' onClick={() => {
                                                            setToAddMed(idx);
                                                            setMdlOpenMedCho(true);
                                                        }}>
                                                            <FontAwesomeIcon icon={faExchangeAlt} />
                                                        </Button>
                                                    </div>
                                                </div>
                                                : null
                                            }
                                        </figure>
                                        {isOpen ?
                                            <>
                                                <div className="form-group my-2">
                                                    <label htmlFor="inSize">{router.locale == 'es' ? 'Tamaño' : 'Size'}</label>
                                                    <div className="row">
                                                        <div className="col align-center d-flex pr-0">
                                                            <input type="range" id="inSize" className="form-control-range" min='1' max='100' step='1' value={form.width} onChange={e => {
                                                                let t = sectionsForm.slice();
                                                                t[idx].width = e.target.value;
                                                                setSectionsForm(t);
                                                                setSectChangedIdx(idx);
                                                            }} />
                                                        </div>
                                                        <div className="col-auto">
                                                            <span className='badge badge-primary range-value-L'>{form.width}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mb-2 align-items-end">
                                                    <div className="col">
                                                        <label htmlFor="inCaption">{router.locale == 'es' ? 'Pie de foto' : 'Caption'}</label>
                                                        <input type="text" className="form-control" value={form.caption} onChange={e => {
                                                            let t = sectionsForm.slice();
                                                            t[idx].caption = e.target.value.trim();
                                                            setSectionsForm(t);
                                                            setSectChangedIdx(idx);
                                                        }} readOnly={!form.hasCapt} />
                                                    </div>
                                                    <div className="col-auto pl-0">
                                                        <select className='form-control pr-0' value={form.hasCapt} onChange={e => {
                                                            let t = sectionsForm.slice();
                                                            t[idx].hasCapt = e.target.value == 'true';
                                                            setSectionsForm(t);
                                                            setSectChangedIdx(idx);
                                                        }}>
                                                            <option value={true}>{router.locale == 'es' ? 'Sí' : 'Yes'}</option>
                                                            <option value={false}>No</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <label htmlFor="inAlt">Alt</label>
                                                        <input type="text" className="form-control" value={form.alt} onChange={e => {
                                                            let t = sectionsForm.slice();
                                                            t[idx].alt = e.target.value;
                                                            setSectionsForm(t);
                                                            setSectChangedIdx(idx);
                                                        }} />
                                                    </div>
                                                </div>
                                            </>
                                            : null
                                        }
                                    </>
                                    : null
                                }
                            </div>
                        )
                    })}
                </div>

                {/*Legacy JS*/}
                <div className="container-fluid mb-2 rounded-lg p-3" style={{ backgroundColor: '#57238b' }}>
                    <div className="row mb-2">
                        <div className="col">
                            <label for="inJava">JavaScript</label>
                            <textarea className="form-control" id="inJava" rows="8" readonly>
                                {cookie.java}
                            </textarea>
                        </div>
                    </div>
                </div>
                <Script dangerouslySetInnerHTML={{ __html: cookie.java }} />
            </>
    );

}

export async function getServerSideProps(context) {
    const props = {
        site: 'edit',
        host: context.req.headers.host,
        ...(await getGlobalData(context)),
        configCatsList: { ...(await getConfigCatsList()) },
        langsList: await getConfigLanguages(),
        authorsList: await getConfigAuthors(),
        cookieId: context.query.id
    }
    return { props: props }
}