import styles from '../styles/edit.module.scss';
import { formatDate, getGlobalData } from '../lib/utils';
import MetaDescription from '../components/metaDescription';
import { useRouter } from 'next/router';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import { Buttons } from '../components/layoutAttr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faCheckSquare, faEdit, faEnvelope, faEye, faImage, faLanguage, faLock, faPaperPlane, faPlus, faPlusSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { cookieExists, getConfigCatsList, getConfigLanguages, getConfigAuthors, getCookieEdit, uploadCookie } from '../firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAlert, AlertComponent } from '../components/alert';
import { useAuth } from '../firebase/auth';
import Spinner from 'react-bootstrap/Spinner';
import { ultraClean } from '../lib/utils';

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

    let submitingPlus, mdlOpenMedMan, mdlOpenMedCho, mdlOpenMedAdd, progressPlusVar, progressPlus, mdlOpenPub, mdlOpenTrans;//temp
    //Plus Sect modal
    const [toAddSect, setToAddSect] = useState(-1);
    const [mdlOpenPlusSect, setMdlOpenPlusSect] = useState(false);


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
            normSave();
        }
    }

    //Upload changes
    function saveCookie() {
        //Not finished@#
        setCookieLoading(true);
        //Set no changes
        setTopFormChanged(false);

        //Save sections
        saveAllSections();

        return uploadCookie(router.locale, props.cookieId, {
            ...cookie,
            cont: sectionsNorm.map(sect => {
                //Different for array children
                if (sect.type == 'head') {
                    return {
                        key: sect.key,
                        type: "head",
                        title: sect.title,
                        author: sect.author.slice()
                    }
                }
                if (sect.type == 'ref') {
                    return {
                        key: sect.key,
                        type: "ref",
                        ref: sect.ref.slice()
                    }
                }
                return { ...sect };
            }),
            //Special data
            authors: sectionsNorm[0].author.slice(),
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
    async function normSave() {
        await saveCookie();
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
    const isFirst = useRef(true);
    useEffect(() => {
        if (!cookieLoading && !sectionsSet) {
            let t = cookie.cont.map((sect, idx) => {
                let key = sect.key;
                if (!key) {
                    key = idx + Math.floor(Date.now() / 1000);
                }
                if (sect.type == 'head') {
                    return {
                        key: key,
                        type: "head",
                        title: sect.title,
                        author: sect.author.slice()
                    }
                }
                if (sect.type == 'ref') {
                    return {
                        key: key,
                        type: "ref",
                        ref: sect.ref.slice()
                    }
                }
                return { ...sect, key: key };
            });
            setSectionsNorm(t);
            setSectionsForm(t);
            setSectionsSet(true);
        }
    }, [cookie, sectionsSet])
    useEffect(() => {
        if (!cookieLoading && sectionsSet) {
            if (!isFirst.current) {
                normSave();
            } else {
                isFirst.current = false;
            }
        }
    }, [sectionsNorm])
    function saveAllSections(idx = -1) {
        if (sectionsOpen != -1) saveSection(sectionsOpen);
        setSectionsOpen(idx)
    }
    //Plus
    function plusSection(type) {
        saveAllSections();
        let norm = {
            key: Math.floor(Date.now() / 1000)
        };
        if (type == 'html') {
            norm = {
                ...norm,
                type: type,
                html: ""
            };
        } else if (type == 'parra') {
            norm = {
                ...norm,
                type: type,
                text: "",
                title: "0"
            };
        } else if (type == 'youtube') {
            norm = {
                ...norm,
                type: type,
                vidUrl: "",
                ratio: "16by9"
            };
        } else if (type == 'medSimple') {
            norm = {
                ...norm,
                type: type,
                medUrl: "https://via.placeholder.com/150.webp",
                alt: "",
                caption: "",
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
    }
    //Edition
    function editSection(idx) {
        saveAllSections(idx);
        setSectionsOpen(idx);
    }
    function cancelEditSection(idx) {
        let norm = sectionsNorm.slice();
        let form = sectionsForm.slice();
        if (norm[idx].type == 'head') {
            form[idx] = {
                key: norm[idx].key,
                type: "head",
                title: norm[idx].title,
                author: norm[idx].author.slice()
            }
        } else if (norm[idx].type == 'ref') {
            form[idx] = {
                key: norm[idx].key,
                type: "ref",
                ref: norm[idx].ref.slice()
            }
        } else {
            form[idx] = { ...norm[idx] }
        }
        setSectionsOpen(-1);
        setSectionsForm(form);
    }
    function saveSection(idx) {
        let norm = sectionsNorm.slice();
        let form = sectionsForm.slice();
        if (norm[idx].type == 'head') {
            norm[idx] = {
                key: form[idx].key,
                type: "head",
                title: form[idx].title,
                author: form[idx].author.slice()
            }
        } else if (norm[idx].type == 'ref') {
            norm[idx] = {
                key: form[idx].key,
                type: "ref",
                ref: form[idx].ref.slice()
            }
        } else {
            norm[idx] = { ...form[idx] }
        }
        setSectionsOpen(-1);
        setSectionsNorm(norm);
    }
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
                <Modal className='text-dark' show={mdlOpenMedCho} onHide={() => setMdlOpenMedCho(false)} centered scrollable>
                    <AlertComponent id='alrtPlus' />
                    <Modal.Header>
                        <Modal.Title>{router.locale == 'es' ? 'Escoge una imagen' : 'Choose an image'}</Modal.Title>
                        <button className="close" type="button" onClick={() => setMdlOpenMedCho(false)} disabled={submitingPlus}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row row-cols-1 row-cols-md-3" id="contMedCho">
                            <div className="col mb-4">
                                <div className="card text-dark bg-light h-100 cardBorder" style={{ borderColor: '#343a40' }}>
                                    <a className="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center" type="button" data-toggle="modal" data-target="#mdlAddMed" data-dismiss="modal" aria-label="Close" onclick="addFrom=0;">
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
                            <img className="w-75 m-0" id="prevNewMed" src="" />
                        </div>
                        <form id="frmAddMed">
                            <div className="row mb-3">
                                <div className="form-check form-check-inline ml-3">
                                    <input className="form-check-input" id="inMedSrc0" type="radio" name="radsMedSrc" value="home" required="" />
                                    <label className="form-check-label" for="inMedSrc0">{router.locale == 'es' ? 'Propio' : 'Own'}</label>
                                </div>
                                <div className="form-check form-check-inline ml-3">
                                    <input className="form-check-input" id="inMedSrc1" type="radio" name="radsMedSrc" value="out" required="" />
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
                                        <option selected="selected" value="">{router.locale == 'es' ? 'Choose...' : 'Generate translation'}</option>
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
                    <div className="btn-group-vertical mr-2 btn-group-lg" role="group">
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
                        <button className="btn btn-science d-none" id="btnPrivate">
                            <FontAwesomeIcon icon={faLock} />
                        </button>
                        <button className="btn btn-science d-none" id="btnAprove">
                            <FontAwesomeIcon icon={faCheckSquare} />
                        </button>
                        <button className="btn btn-science d-none" id="btnPub" data-toggle="modal" data-target="#mdlPublish">
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
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
                        return (
                            <div key={norm.key}>
                                {!norm.type == 'head' ? <div className="dropdown-divider mx-2"></div> : null}

                                {/* Actions */}
                                <div className='row mb-2 px-2'>
                                    {(norm.type != 'head' && norm.type != 'ref') ?
                                        <Button className="btn-link-science ml-2" variant="light" onClick={() => deleteSection(idx)}>
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </Button>
                                        : null
                                    }
                                    {norm.type != 'ref' ?
                                        <>
                                            <div className="col-auto">
                                                <select className='form-control mr-0 ml-2 h-100' defaultValue={props.langsList[0] != router.locale ? props.langsList[0] : props.langsList[1]}>
                                                    {props.langsList.map(l => {
                                                        if (l != router.locale) {
                                                            return (
                                                                <option value={l}>{l}</option>
                                                            )
                                                        }
                                                    })}
                                                </select>
                                            </div>
                                            <Button className="btn-link-science ml-2" variant="light" onClick={() => translateSection(idx)}>
                                                <FontAwesomeIcon icon={faLanguage} />
                                            </Button>
                                            {sectionsOpen != idx ?
                                                <>
                                                    <Button className="btn-link-science ml-auto" variant="light" onClick={() => editSection(idx)}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>
                                                    <Button className="btn-link-science mx-2" variant="light" onClick={() => {
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
                                                    <Button className="btn-link-science ml-2" variant="light" onClick={() => saveSection(idx)}>
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </Button>
                                                </>
                                            }
                                        </>
                                        : null
                                    }
                                </div>
                                {norm.type == 'head' ?
                                    <>{sectionsOpen != idx ?
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
                                        <div id={'sect' + idx + 't'}>
                                        </div>
                                        <div id={'sect' + idx + 'f'}>
                                        </div>
                                    </>
                                    : null
                                }
                                {norm.type == 'parra' ?
                                    <>
                                        <div id={'sect' + idx + 't'}>
                                        </div>
                                        <div id={'sect' + idx + 'f'}>
                                        </div>
                                    </>
                                    : null
                                }
                                {norm.type == 'html' ?
                                    <>
                                        <div id={'sect' + idx + 't'}>
                                        </div>
                                        <div id={'sect' + idx + 'f'}>
                                        </div>
                                    </>
                                    : null
                                }
                                {norm.type == 'youtube' ?
                                    <>
                                        <div id={'sect' + idx + 't'}>
                                        </div>
                                        <div id={'sect' + idx + 'f'}>
                                        </div>
                                    </>
                                    : null
                                }
                                {norm.type == 'medSimple' ?
                                    <>
                                        <div id={'sect' + idx + 't'}>
                                        </div>
                                        <div id={'sect' + idx + 'f'}>
                                        </div>
                                    </>
                                    : null
                                }
                            </div>
                        )
                    })}
                </div>

                <div className="container-fluid mb-2 rounded-lg p-3" style={{ backgroundColor: '#57238b' }}>
                    <div className="row mb-2 px-2">
                        <button className="btn btn-light btn-link-scckie ml-auto mr-2" id="btnEditJs">
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn btn-light btn-link-scckie ml-auto mr-2 d-none" id="btnCheckJs">
                            <FontAwesomeIcon icon={faCheck} />
                        </button>
                    </div>
                    <div className="row mb-2">
                        <div className="col">
                            <label for="inJava">JavaScript</label>
                            <textarea className="form-control" id="inJava" rows="8" readonly=""></textarea>
                        </div>
                    </div>
                </div>
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