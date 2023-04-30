import stylesEdit from '../styles/edit.module.scss';
import stylesCookie from '../styles/cookie.module.scss';
import { Buttons, NavLinks } from '../components/layoutAttr';
import { useAlert, AlertComponent } from '../components/alert';
import MetaDescription from '../components/metaDescription';
import ImageAuto from '../components/imageAuto';
import ToolBar from '../components/toolbar';
import { cookieExists, getConfigCatsList, getConfigLanguages, getConfigAuthors, getCookieEdit, uploadCookie, translateTopForm } from '../firebase/firestore';
import { useAuth } from '../firebase/auth';
import { addCookieMedia, deleteCookieMedia } from '../firebase/storage';
import { formatDate, getGlobalData, ultraClean } from '../lib/utils';
import useNotOnFirst from '../lib/hooks/useNotOnFirst';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic'
const CustomEditor = dynamic(
    () => import('../components/customEditor'),
    { ssr: false }
)
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faCheckSquare, faEdit, faEnvelope, faExchangeAlt, faExternalLinkAlt, faEye, faImage, faLanguage, faLink, faLock, faPaperPlane, faPlus, faPlusSquare, faStar, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

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

    let progressPlusVar, progressPlus, mdlOpenPub, mdlOpenTrans;//temp
    //Plus Sect modal
    const [toAddSect, setToAddSect] = useState(-1);
    const [mdlOpenPlusSect, setMdlOpenPlusSect] = useState(false);

    //Media modals
    const [localMedia, setLocalMedia] = useState([]);
    const [localPicUrl, setLocalPicUrl] = useState('');
    const [localPicUrlSet, setLocalPicUrlSet] = useState(false);
    useNotOnFirst(normSave, [localPicUrl, localPicUrlSet, cookieLoading], !cookieLoading && localPicUrlSet);
    useEffect(() => {
        if (!cookieLoading && !localPicUrlSet) {
            setLocalPicUrl(cookie.picUrl);
            setLocalPicUrlSet(true);
        }
    }, [cookie, localPicUrlSet, cookieLoading]);
    const [mediaSet, setMediaSet] = useState(false);
    useNotOnFirst(normSave, [localMedia, mediaSet, cookieLoading], !cookieLoading && mediaSet);
    useEffect(() => {
        if (!cookieLoading && !mediaSet) {
            let t = cookie.media.map(med => {
                let newMed = {};
                Object.keys(med).forEach(key => {
                    if (key == 'author' || key == 'ref') newMed[key] = med[key].slice();
                    else newMed[key] = med[key];
                });
                return newMed;
            });
            setLocalMedia(t);
            setMediaSet(true);
        }
    }, [cookie, mediaSet, cookieLoading]);
    const [toAddMed, setToAddMed] = useState(-1);
    const [toDelMed, setToDelMed] = useState(-1);
    const [addFromMed, setAddFromMed] = useState(-1);
    const [medTltipCpTxt, setMedTltipCpTxt] = useState(router.locale == 'es' ? 'Copiar' : 'Copy');
    //Choose
    const [mdlOpenMedCho, setMdlOpenMedCho] = useState(false);
    //Add
    const [mdlOpenMedAdd, setMdlOpenMedAdd] = useState(false);
    const [submittingNewMed, setSubmitingNewMed] = useState(false);
    const [medSource, setMedSource] = useState('own');
    const [medNewUrl, setMedNewUrl] = useState('');
    const [medAddPrgVar, setMedAddPrgVar] = useState('primary');
    const [medAddPrg, setMedAddPrg] = useState(0);
    function handleMedSrcChange(e) {
        setMedSource(e.target.value);
    }
    async function handleMedAddSubmit(e) {
        e.preventDefault();
        setMedAddPrg(0);
        setSubmitingNewMed(true);
        if (medSource == 'out') {
            let m = localMedia.slice();
            m.push({
                medFile: 'externo',
                medUrl: medNewUrl
            });
            setLocalMedia(m);
        } else {
            await addCookieMedia(props.cookieId, e.target.fileUpload.files[0],
                (snap) => {
                    setMedAddPrg((snap.bytesTransferred / snap.totalBytes) * 100);
                },
                (err) => {
                    showAlert((router.locale == 'es' ? "<strong>¡Ha ocurrido un error!</strong> " : "<strong>¡There has been an error!</strong> ") + err.code, 'danger', 'alrtMedAdd');
                    console.log(err);
                }, localMedia, setLocalMedia);
        }
        setMedAddPrg(100);
        setMedAddPrgVar('success');
        setMdlOpenMedAdd(false);
        if (addFromMed == 0) setMdlOpenMedMan(true);
        else setMdlOpenMedCho(true);
        setSubmitingNewMed(false);
        setMedSource('own');
        setMedNewUrl('');
        setMedAddPrg(0);
        setMedAddPrgVar('primary');
    }
    //Manage
    const [mdlOpenMedMan, setMdlOpenMedMan] = useState(false);
    async function handleDelMedia(media, i) {
        if (toDelMed == i) {
            setToDelMed(-1);
            hideAlert();
            if (media.medFile != 'externo') {
                await deleteCookieMedia(props.cookieId, media.medFile);
            }
            if (media.medUrl == cookie.picUrl) {
                docDat.picUrl = "";
            }
            let m = localMedia.slice();
            m.splice(i, 1);
            setLocalMedia(m);
        } else {
            showAlert(router.locale == 'es' ? '<strong>¿Quieres eliminar esta imagen?</strong> Presiona de nuevo el botón para confirmar.' : '<strong>Do you want to delete this image? </strong> Press the button again to confirm.', 'warning', 'alrtMedMan');
            setToDelMed(i);
        }
    }
    useEffect(() => {
        if (toDelMed != -1) {
            setTimeout(() => {
                setToDelMed(-1);
            }, 3000);
        }
    }, [toDelMed])


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
    async function saveTopForm() {
        if (topForm.file != cookie.fileTranslations[router.locale] && (await cookieExists(router.locale, topForm.file))) {
            showAlert(router.locale == 'es' ? 'Ese nombre de archivo ya esta en uso.' : 'That file name is already in use.', 'danger', 'alrtPlus');
        } else {
            normSave();
        }
    }
    function handleTopFormSubmit(e) {
        e.preventDefault();
        saveTopForm();
    }
    //Top form translations
    const [fromLangFile, setFromLangFile] = useState(props.langsList[0] != router.locale ? props.langsList[0] : props.langsList[1]);
    const [translatedTopForm, setTranslatedTopForm] = useState(false);
    useEffect(() => {
        if (translatedTopForm) {
            setTranslatedTopForm(false);
            saveTopForm();
        }
    }, [translatedTopForm, topForm]);
    async function handleTopFormTranslate(e) {
        e.preventDefault();
        const trans = await translateTopForm(fromLangFile, router.locale, props.cookieId);
        setTranslatedTopForm(true);
        setTopForm({
            ...topForm,
            file: trans.file,
            description: trans.description
        });
    }

    //Upload changes
    function saveCookie(saveSections = true) {
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
            media: localMedia,
            picUrl: localPicUrl,
            //Top form
            fileTranslations: {
                ...cookie.fileTranslations,
                [router.locale]: topForm.file
            },
            fixedCats: topForm.fixedCats,
            description: topForm.description
        });
    }
    async function normSave(saveSections = true) {
        await saveCookie(saveSections);
        showAlert('Saved', 'success');//Change to nav tag
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
    }, [cookie, cookieLoading]);

    //Sections functions
    //Control
    const [sectionsNorm, setSectionsNorm] = useState([]);
    const [sectionsForm, setSectionsForm] = useState([]);
    const [sectionsOpen, setSectionsOpen] = useState(-1);
    const [sectionsSet, setSectionsSet] = useState(false);
    const [sectChanged, setSectChanged] = useState(false);
    const [sectChangedIdx, setSectChangedIdx] = useState(-1);
    useNotOnFirst(() => normSave(false), [sectionsNorm, sectionsSet, cookieLoading], !cookieLoading && sectionsSet);
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
    }, [cookie, sectionsSet, cookieLoading]);
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
                        <button className="close" type="button" onClick={() => setMdlOpenPlusSect(false)}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Button variant='science' className='m-2' onClick={() => plusSection('parra')}>{router.locale == 'es' ? 'Párrafo' : 'Paragraph'}</Button>
                        <Button variant='science' className="m-2" onClick={() => plusSection('html')}>HTML</Button>
                        <Button variant='science' className="m-2" onClick={() => plusSection('youtube')}>Youtube</Button>
                        <Button variant='science' className="m-2" onClick={() => plusSection('medSimple')}>Multimedia</Button>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-grid w-100">
                            <Button variant="secondary" type="button" onClick={() => setMdlOpenPlusSect(false)}>{Buttons[router.locale]["cancel"]}</Button>
                        </div>
                    </Modal.Footer>
                </Modal>

                {/* Manage media modal */}
                <Modal className={`text-dark ${stylesEdit['mdl-manage-media']}`} show={mdlOpenMedMan} onHide={() => setMdlOpenMedMan(false)} centered scrollable>
                    <AlertComponent id='alrtMedMan' />
                    <Modal.Header>
                        <Modal.Title>{router.locale == 'es' ? 'Administra las imágenes' : 'Manage media'}</Modal.Title>
                        <button className="close" type="button" onClick={() => setMdlOpenMedMan(false)}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row row-cols-1 row-cols-md-3" id="contMedMan">
                            <div className={`col mb-4 ${stylesEdit['adder-button']}`}>
                                <div className="card text-dark bg-light h-100 cardBorder">
                                    <Button className="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center" type="button" onClick={() => {
                                        setMdlOpenMedMan(false);
                                        setMdlOpenMedAdd(true);
                                        setAddFromMed(0);
                                    }}>
                                        <span className="mb-0">
                                            <FontAwesomeIcon icon={faPlusSquare} />
                                        </span>
                                    </Button>
                                </div>
                            </div>
                            {cookie.media.map((media, idx) => {
                                return (
                                    <div className={`col mb-4 ${stylesEdit['media-card']}`} key={media.key}>
                                        <div className='card text-light bg-dark'>
                                            <ImageAuto className='card-img' src={media.medUrl} alt={media.medFile} sizes='(max-width: 576px) 50vw, (max-width: 1200px) 25vw, 17vw' />
                                            <div className="card-img-overlay pt-0 px-3">
                                                <div className='row mb-2 p-0'>
                                                    <Button className="btn-science" variant='light' size='sm' onClick={async () => await handleDelMedia(media, idx)}><FontAwesomeIcon icon={faTrashAlt} /></Button>
                                                    <div className={`ml-auto ${stylesEdit['tooltipn']}`}>
                                                        <Button className="btn-science" variant='light' size='sm' onClick={async () => {
                                                            await navigator.clipboard.writeText(media.medUrl);
                                                            setMedTltipCpTxt(router.locale == 'es' ? 'URL copiado' : 'Copied URL');
                                                        }} onMouseLeave={() => setMedTltipCpTxt(router.locale == 'es' ? 'Copiar' : 'Copy')}>
                                                            <span className={`${stylesEdit['tooltipTextn']}`}>{medTltipCpTxt}</span>
                                                            <FontAwesomeIcon icon={faLink} />
                                                        </Button>
                                                    </div>
                                                    <Button className="btn-science ml-1" variant='light' size='sm' onClick={() => {
                                                        if (cookie.picUrl == media.medUrl) {
                                                            setLocalPicUrl('');
                                                        } else {
                                                            setLocalPicUrl(media.medUrl);
                                                        }
                                                    }}>
                                                        <FontAwesomeIcon icon={cookie.picUrl == media.medUrl ? faStar : farStar} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-grid w-100">
                            <Button variant="secondary" type="button" onClick={() => setMdlOpenMedMan(false)}>{Buttons[router.locale]["close"]}</Button>
                        </div>
                    </Modal.Footer>
                </Modal>

                {/* Choose media modal */}
                <Modal className={`text-dark ${stylesEdit['mdl-choose-media']}`} show={mdlOpenMedCho} onHide={() => setMdlOpenMedCho(false)} centered scrollable>
                    <Modal.Header>
                        <Modal.Title>{router.locale == 'es' ? 'Escoge una imagen' : 'Choose an image'}</Modal.Title>
                        <button className="close" type="button" onClick={() => setMdlOpenMedCho(false)}>
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
                            <Button variant="secondary" type="button" onClick={() => setMdlOpenMedCho(false)}>{Buttons[router.locale]["cancel"]}</Button>
                        </div>
                    </Modal.Footer>
                </Modal>

                {/* Add media modal */}
                <Modal className='text-dark' show={mdlOpenMedAdd} onHide={() => setMdlOpenMedAdd(false)} centered scrollable>
                    <AlertComponent id='alrtMedAdd' />
                    <Modal.Header>
                        <Modal.Title>{router.locale == 'es' ? 'Añadir multimedia a la Galleta' : 'Add media to the Cookie'}</Modal.Title>
                        <button className="close" type="button" onClick={() => setMdlOpenMedAdd(false)}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        {(medSource == 'own' && medNewUrl) || (medSource == 'out' && medNewUrl.length > 8) ?
                            <div className="row mb-3 w-100 py-0 justify-content-center mx-auto">
                                <ImageAuto width='75' id="prevNewMed" className="m-0" src={medNewUrl} alt='' />
                            </div>
                            : null
                        }
                        {submittingNewMed ?
                            <ProgressBar variant={medAddPrgVar} animated now={medAddPrg} label={`${medAddPrg}%`} />
                            :
                            <Form onSubmit={handleMedAddSubmit}>
                                <Form.Group controlId="formAMSrc" className="mb-3">
                                    <Form.Label>{router.locale == 'es' ? 'Fuente' : 'Source'}</Form.Label>
                                    <div className="d-flex">
                                        <Form.Check id='formAMSrcOwn' label={router.locale == 'es' ? 'Propio' : 'Own'} className="ml-3" type="radio" name="radsMedSrc" value="own" defaultChecked onChange={handleMedSrcChange} />
                                        <Form.Check id='formAMSrcOut' label={router.locale == 'es' ? 'Externo' : 'External'} className="ml-3" type="radio" name="radsMedSrc" value="out" onChange={handleMedSrcChange} />
                                    </div>
                                </Form.Group>
                                {medSource == 'own' ?
                                    <Form.Group controlId="formAMFile" className="mb-5">
                                        <Form.Label>{router.locale == 'es' ? 'Subir archivo' : 'Upload file'}</Form.Label>
                                        <Form.Control type="file" name='fileUpload' onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setMedNewUrl(URL.createObjectURL(e.target.files[0]));
                                            } else {
                                                setMedNewUrl('');
                                            }
                                        }} />
                                    </Form.Group>
                                    :
                                    <Form.Group controlId="formAMUrl" className="mb-5">
                                        <Form.Label>{router.locale == 'es' ? 'URL del archivo' : 'Media URL'}</Form.Label>
                                        <Form.Control type="text" placeholder={router.locale == 'es' ? 'https://imagen.com' : 'https://image.com'} onChange={(e) => {
                                            setMedNewUrl(e.target.value);
                                        }} />
                                    </Form.Group>
                                }
                                <div className="d-grid w-100">
                                    <Button variant='primary' type='submit'>{router.locale == 'es' ? 'Añadir' : 'Add'}</Button>
                                </div>
                            </Form>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-grid w-100">
                            <Button variant="secondary" type="button" onClick={() => setMdlOpenMedAdd(false)}>{Buttons[router.locale]["cancel"]}</Button>
                        </div>
                    </Modal.Footer>
                </Modal>

                {/* Publish modal */}
                <Modal className='text-dark' show={mdlOpenPub} onHide={() => setMdlOpenPub(false)} centered scrollable>
                    <AlertComponent id='alrtPub' />
                    <Modal.Header>
                        <Modal.Title>{router.locale == 'es' ? 'Publicar la Galleta' : 'Publish Cookie'}</Modal.Title>
                        <button className="close" type="button" onClick={() => setMdlOpenPub(false)}>
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
                            <Button variant="secondary" type="button" onClick={() => setMdlOpenPub(false)}>{Buttons[router.locale]["cancel"]}</Button>
                        </div>
                    </Modal.Footer>
                </Modal>

                {/* Translate modal */}
                <Modal className='text-dark' show={mdlOpenTrans} onHide={() => setMdlOpenTrans(false)} centered scrollable>
                    <AlertComponent id='alrtTrans' />
                    <Modal.Header>
                        <Modal.Title>{router.locale == 'es' ? 'Generar traducción' : 'Generate translation'}</Modal.Title>
                        <button className="close" type="button" onClick={() => setMdlOpenTrans(false)}>
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
                                <Button variant="secondary" type="button" onClick={() => setMdlOpenTrans(false)}>{Buttons[router.locale]["cancel"]}</Button>
                            </div>
                        </Modal.Footer>
                    </form>
                </Modal>

                { /* Side toolbar */}
                <ToolBar>
                    <Button variant='science' onClick={() => {
                        setMdlOpenPlusSect(true);
                        setToAddSect(sectionsNorm.length - 1);
                    }}>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    <Button variant='science' onClick={() => setMdlOpenMedMan(true)}>
                        <FontAwesomeIcon icon={faImage} />
                    </Button>
                    <Button variant='science' onClick={() => setMdlOpenTrans(true)}>
                        <FontAwesomeIcon icon={faLanguage} />
                    </Button>
                    <Button variant='science' href={'/' + NavLinks[router.locale].cook + cookie.fileTranslations[router.locale] + '/'} id="btnPrevCook" target="_blank">
                        <FontAwesomeIcon icon={faEye} />
                    </Button>
                    <Button variant='science' href={'/' + NavLinks[router.locale].prevMail + cookie.fileTranslations[router.locale] + '/'} id="btnPrevMail" target="_blank">
                        <FontAwesomeIcon icon={faEnvelope} />
                    </Button>
                    {cookie.public ?
                        <Button variant='science' id="btnPrivate">
                            <FontAwesomeIcon icon={faLock} />
                        </Button>
                        :
                        <>
                            <Button variant='science' id="btnAprove">
                                <FontAwesomeIcon icon={faCheckSquare} />
                            </Button>
                            <Button variant='science' id="btnPub" data-toggle="modal" data-target="#mdlPublish">
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </Button>
                        </>
                    }
                </ToolBar>

                <div className="container-fluid mb-2 rounded-lg p-3" style={{ backgroundColor: '#57238b' }}>
                    <Form onSubmit={handleTopFormTranslate}>
                        <div className="row mb-2 px-0">
                            <div className="col-auto pr-2">
                                <Form.Select className='form-control pl-2 pr-1 h-100' onChange={(e) => {
                                    setFromLangFile(e.target.value);
                                }} value={fromLangFile}>
                                    {props.langsList.map(l => {
                                        if (l != router.locale) {
                                            return (
                                                <option value={l}>{l}</option>
                                            )
                                        }
                                    })}
                                </Form.Select>
                            </div>
                            <div className="col-auto pl-2">
                                <Button variant='light' className="btn-link-science" type='submit'>
                                    <FontAwesomeIcon icon={faLanguage} />
                                </Button>
                            </div>
                        </div>
                    </Form>
                    <Form onSubmit={handleTopFormSubmit}>
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
                            <Button variant='light' className="btn-link-science mx-3" type="submit">
                                <FontAwesomeIcon icon={faCheck} />
                            </Button>
                        </div>
                    </Form>
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
                                    <>
                                        {(norm.type != 'head' && norm.type != 'ref') ?
                                            <div className="col-auto">
                                                <Button className="btn-link-science" variant="light" onClick={() => deleteSection(idx)}>
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </Button>
                                            </div>
                                            : null
                                        }
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
                                    </>
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
                            <textarea className="form-control" id="inJava" rows="8" readOnly>
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