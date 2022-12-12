import { getGlobalData } from '../lib/utils';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';


export default function Borradores(props) {
    const router = useRouter();
    return (
        <>
            <Head>
                <meta name="description" content={router.locale == 'es' ? 'Revisa y administra tus borradores' : 'Review and manage your drafts'} />
                <meta property="og:description" content={router.locale == 'es' ? 'Revisa y administra tus borradores' : 'Review and manage your drafts'} />
            </Head>

            {/* Plus modal */}
            <div class="modal fade" id="mdlPlus" tabindex="-1" aria-labelledby="mdlPlusL" aria-hidden="true">
                <div id="alrtPlusContainer">
                </div>
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="mdlPlusL">{router.locale == 'es' ? 'Crear una nueva Galleta' : 'Create a new Cookie'}</h5>
                            <button class="close" id="btnCanPlus1" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="frmPlus">
                                <div class="form-group">
                                    <label for="inTitle">{router.locale == 'es' ? 'Título de la Galleta' : 'Cookie title'}</label>
                                    <input class="form-control" id="inTitle" type="text" placeholder={router.locale == 'es' ? 'Nueva Galleta' : 'New Cookie'} required />
                                </div>
                                <div class="form-group">
                                    <label for="inFile">{router.locale == 'es' ? 'Nombre del archivo' : 'File name'}</label>
                                    <input class="form-control" id="inFile" type="text" placeholder={router.locale == 'es' ? 'nueva-galleta' : 'new-cookie'} required />
                                </div>
                                <div class="dropdown-divider">
                                </div>
                                <button class="btn btn-primary btn-block" id="btnPlusConf" type="submit">{router.locale == 'es' ? 'Crear' : 'Create'}</button>
                                <div class="progress d-none" id="barCont">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated" id="bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary btn-block" id="btnCanPlus0" type="button" data-dismiss="modal">
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Side toolbar */}
            <div class="tbar tbar-right btn-toolbar mb-3" role="toolbar">
                <div class="btn-group-vertical mr-2 btn-group-lg" role="group">
                    <button class="btn btn-science" id="btnPlus" type="button">
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
            </div>

            <form class="mb-4" id="frmSrch">
                <div class="input-group">
                    <input class="form-control" id="srcBox" type="text" placeholder={router.locale == 'es' ? 'Buscar Galletas...' : 'Search Cookies...'} aria-describedby="frmBtns" maxlength="100" />
                    <div class="input-group-append" id="frmBtns">
                        <select class="custom-select rounded-0" id="inOrd">
                            <option id="inSrchOrd0" value="created">{router.locale == 'es' ? 'Creación' : 'Creation'}</option>
                            <option id="inSrchOrd1" value="published">{router.locale == 'es' ? 'Publicación' : 'Publication'}</option>
                            <option id="inSrchOrd2" value="ledit">{router.locale == 'es' ? 'Edición' : 'Edition'}</option>
                            <option id="inSrchOrd3" value="pop">{router.locale == 'es' ? 'Popularidad' : 'Popularity'}</option>
                        </select>
                        <select class="custom-select rounded-0" id="inDir">
                            <option id="inSrchDir0" value="desc">{router.locale == 'es' ? 'Descendente' : 'Descending'}</option>
                            <option id="inSrchDir1" value="asc">{router.locale == 'es' ? 'Ascendente' : 'Ascending'}</option>
                        </select>
                        <button class="btn btn-outline-light" type="submit">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </div>
            </form>

            <nav class="d-none" id="pgNavT" aria-label="pageNavT">
                <ul class="pagination justify-content-end">
                    <li class="page-item">
                        <button class="page-link text-light bg-transparent" id="pgTPrv" aria-label="pgTPrv">
                            <span aria-hidden="true">«</span>
                        </button>
                    </li>
                    <li class="page-item">
                        <span class="page-link text-light bg-transparent" id="disPgT">1</span>
                    </li>
                    <li class="page-item">
                        <button class="page-link text-light bg-transparent" id="pgTNxt" aria-label="pgTNxt">
                            <span aria-hidden="true">»</span>
                        </button>
                    </li>
                </ul>
            </nav>

            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-1 row-cols-lg-2 row-cols-xl-3" id="crdContainer"></div>

            <nav class="d-none" id="pgNavB" aria-label="pageNavB">
                <ul class="pagination justify-content-end">
                    <li class="page-item">
                        <button class="page-link text-light bg-transparent" id="pgBPrv" aria-label="pgBPrv">
                            <span aria-hidden="true">«</span>
                        </button>
                    </li>
                    <li class="page-item">
                        <span class="page-link text-light bg-transparent" id="disPgB">1</span>
                    </li>
                    <li class="page-item">
                        <button class="page-link text-light bg-transparent" id="pgBNxt" aria-label="pgBNxt">
                            <span aria-hidden="true">»</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    );

}

export async function getServerSideProps(context) {
    const props = {
        site: 'drafts',
        host: context.req.headers.host,
        ...(await getGlobalData(context)),
        configCatsList: { ...configCatsList }
    }
    return { props: props }
}