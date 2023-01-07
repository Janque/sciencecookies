import styles from '../styles/edit.module.scss';
import { getGlobalData } from '../lib/utils';
import MetaDescription from '../components/metaDescription';
import { useRouter } from 'next/router';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import { Buttons } from '../components/layoutAttr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

export default function Editar(props) {
    const router = useRouter();

    //Plus Sect modal
    const [mdlOpenPlusSect, setMdlOpenPlusSect] = useState(false);

    return (
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
                    <button className="btn btn-science m-2" onclick="plusSect('parra');">{router.locale == 'es' ? 'Párrafo' : 'Paragraph'}</button>
                    <button className="btn btn-science m-2" onclick="plusSect('html');">HTML</button>
                    <button className="btn btn-science m-2" onclick="plusSect('youtube');">Youtube</button>
                    <button className="btn btn-science m-2" onclick="plusSect('medSimple');">Multimedia</button>
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
                                        <i className="far fa-plus-square"></i>
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
                        <i className="fas fa-plus"></i>
                    </button>
                    <button className="btn btn-science" data-toggle="modal" data-target="#mdlMedMan">
                        <i className="fas fa-image"></i>
                    </button>
                    <button className="btn btn-science" data-toggle="modal" data-target="#mdlTranslate">
                        <i className="fas fa-language"></i>
                    </button>
                    <a className="btn btn-science" id="btnPrevCook" target="_blank">
                        <i className="fas fa-eye"></i>
                    </a>
                    <a className="btn btn-science" id="btnPrevMail" target="_blank">
                        <i className="fas fa-envelope"></i>
                    </a>
                    <button className="btn btn-science d-none" id="btnPrivate">
                        <i className="fas fa-lock"></i>
                    </button>
                    <button className="btn btn-science d-none" id="btnAprove">
                        <i className="far fa-check-square"></i>
                    </button>
                    <button className="btn btn-science d-none" id="btnPub" data-toggle="modal" data-target="#mdlPublish">
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>

            <div className="container-fluid mb-2 rounded-lg p-3" style={{ backgroundColor: '#57238b' }}>
                <div className="row mb-2 px-2">
                    <div className="col-auto">
                        <select className="form-control mr-0 ml-2 h-100" id="selFileTrans"></select>
                    </div>
                    <button className="btn btn-light btn-link-scckie" id="btnFileTrans">
                        <i className="fas fa-language"></i>
                    </button>
                </div>
                <form id="frmFile">
                    <div className="row mb-2">
                        <label className="col-sm-2 col-lg-4 col-form-label">{router.locale == 'es' ? 'Nombre del archivo' : 'File name'}</label>
                        <div className="col">
                            <input className="form-control" id="inFile" type="text" placeholder="titulo-galleta" />
                        </div>
                    </div>
                    <div className="row mb-2">
                        <label className="col-sm-2 col-form-label">{router.locale == 'es' ? 'Descripción' : 'Description'}</label>
                        <div className="col">
                            <textarea className="form-control" id="inDesc" rows="3"></textarea>
                        </div>
                    </div>
                    <div className="form-row my-4 justify-content-around" id="catFrmCont"></div>
                    <div className="row mb-2 justify-content-end">
                        <button className="btn btn-secondary" id="btnCanFile">{router.locale == 'es' ? 'Revertir' : 'Revert'}</button>
                        <button className="btn btn-light btn-link-scckie mx-3" type="submit">
                            <i className="fas fa-check"></i>
                        </button>
                    </div>
                </form>
            </div>

            <div className="container-fluid mb-2 rounded-lg p-3" id="cont" style={{ backgroundColor: '#57238b' }}></div>
            <div className="container-fluid mb-2 rounded-lg p-3" style={{ backgroundColor: '#57238b' }}>
                <div className="row mb-2 px-2">
                    <button className="btn btn-light btn-link-scckie ml-auto mr-2" id="btnEditJs">
                        <i className="fas fa-edit" aria-hidden="true"></i>
                    </button>
                    <button className="btn btn-light btn-link-scckie ml-auto mr-2 d-none" id="btnCheckJs">
                        <i className="fas fa-check" aria-hidden="true"></i>
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
        configCatsList: { ...configCatsList }
    }
    return { props: props }
}