import MetaDescription from '../components/metaDescription';
import Head from 'next/head';
import styles from '../styles/index.module.scss';
import { useRouter } from 'next/router';
import { getGlobalData, rmDiacs, formatDate } from '../lib/utils';
import Image from 'next/image';
import { getConfigCatsList, getIndexSearch, indexPreviewLim } from '../firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import NavLink from '../components/navLinks';
import { useState } from 'react';

export default function Home(props) {
  const router = useRouter();

  //Form functions
  const [selCats, setSelCats] = useState(props.searchBox.checkCats);
  function handleAllCatsClick(e) {
    if (e.target.checked) {
      setSelCats(props.configCatsList[router.locale].allCats.slice());
    } else {
      setSelCats([]);
    }
  }
  function handleCatsClick(e, cat) {
    if (e.target.checked) {
      let tc = selCats.slice();
      tc.push(cat);
      tc.sort();
      setSelCats(tc);
    } else {
      let tc = selCats.slice();
      tc.splice(tc.indexOf(cat), 1);
      setSelCats(tc);
    }
  }

  //Page controls
  const [searchRes, setSearchRes] = useState(props.searchResults.docs);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(props.searchResults.resultCount / indexPreviewLim);
  var paglast = [null];
  async function handlePageChange(np) {
    if (page <= 1 && np == -1) return;
    if (page == totalPages && np == 1) return;
    setSearchRes((await getIndexSearch(router.locale, props.searchParams.kywords, props.searchParams.srtOrd, props.searchParams.desc, true, paglast[page])).docs);
    setPage(page + np);
  }

  return (
    <>
      <MetaDescription description={router.locale == 'es' ? 'Artículos de ciencia con chispas de chocolate. Artículos de difusión científica y sobre curiosidades.' : 'Science articles with chocolate chips. Articles of scientific diffusion and on curiosities.'} />
      <Head>
        <title key="title">{router.locale == 'es' ? 'Science Cookies - Artículos de ciencia con chispas de chocolate.' : 'Science Cookies - Science articles with chocolate chips.'}</title>
        <meta key="ogtitle" property="og:title" content={'Science Cookies - ' + (router.locale == 'es' ? 'Artículos de ciencia con chispas de chocolate.' : 'Science articles with chocolate chips.')} />
        <meta property="og:image" content={props.host + "/img/logoT.svg"} />
      </Head>


      <div className="container-fluid mb-4 rounded-lg p-3 bg-rebecca">
        <NavLink type='calendar' date={props.latestCalendar.published} className='text-decoration-none text-light' >
          <div className="media">
            <div className='align-self-center mr-3' style={{ position: 'relative', width: '64px', height: '64px' }}>
              <Image fill src={props.latestCalendar.picUrl} alt={props.latestCalendar.title} sizes="(max-width: 1200px) 25vw, 17vw" style={{ objectFit: 'cover' }} />
            </div>
            <div className="media-body">
              <h5 className="mt-0">{props.latestCalendar.title}</h5>
              <p>{props.latestCalendar.descriptionShort}</p>
            </div>
          </div>
        </NavLink>
      </div>

      <form action='' method='get' className="mb-4">
        <div className={`rounded mb-1 pl-2 pt-1 ${styles['cats-container']}`}>
          <div className="from-row">
            <label>{router.locale == 'es' ? 'Categorías' : 'Categories'}</label>
            <div className="form-check">
              <input type="checkbox" id="catA" className="form-check-input" checked={selCats.length == props.configCatsList['es'].allCats.length} defaultChecked={selCats.length == props.configCatsList['es'].allCats.length} onChange={handleAllCatsClick} />
              <label htmlFor="catA" className="form-check-label">{router.locale == 'es' ? 'Todas' : 'All'}</label>
            </div>
          </div>
          <div className="form-row justify-content-around">
            {props.configCatsList[router.locale].allCats.map((cat, idx) => {
              return (
                <div className="form-group col-auto">
                  <div className="form-check">
                    <input type="checkbox" id={`cat${idx}`} className="form-check-input" defaultValue={cat} checked={selCats.indexOf(cat) != -1} defaultChecked={selCats.indexOf(cat) != -1} name={router.locale == 'es' ? 'categorias' : 'categories'} onChange={(e) => handleCatsClick(e, cat)} />
                    <label htmlFor={`cat${idx}`} className="form-check-label">{props.configCatsList[router.locale].textCats[idx]}</label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="input-group">
          <input type="text" className="form-control" placeholder={router.locale == 'es' ? 'Buscar Galletas...' : 'Search Cookies...'} maxLength="100" defaultValue={props.searchBox.searchBar} name={router.locale == 'es' ? 'busqueda' : 'search'} />
          <div className="input-group-append">
            <select name={router.locale == 'es' ? 'orden' : 'order'} id="inOrd" className="custom-select rounded-0" defaultValue={props.searchBox.srtOrd}>
              <option value={router.locale == 'es' ? 'nuevo' : 'new'}>{router.locale == 'es' ? 'Más nuevo' : 'Newest'}</option>
              <option value={router.locale == 'es' ? 'viejo' : 'old'}>{router.locale == 'es' ? 'Más viejo' : 'Oldest'}</option>
              <option value="popular">{router.locale == 'es' ? 'Más popular' : 'Popularity'}</option>
            </select>
            <button className="btn btn-outline-light" type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </form>

      {totalPages > 1 ?
        <nav>
          <ul className="pagination justify-content-end">
            {page > 1 ?
              <li className="page-item" key='1'>
                <button className="page-link text-light bg-transparent" onClick={() => handlePageChange(-1)}>
                  <span aria-hidden="true">«</span>
                </button>
              </li>
              : null}
            <li className="page-item" key='2'>
              <span className="page-link text-light bg-transparent">{page}</span>
            </li>
            {page < totalPages ?
              <li className="page-item" key='3'>
                <button className="page-link text-light bg-transparent" onClick={() => handlePageChange(1)}>
                  <span aria-hidden="true">»</span>
                </button>
              </li>
              : null}
          </ul>
        </nav>
        : null}

      <div>
        {props.searchResults.resultCount == 0 ?
          <div className="text-light">
            <div className="media mb-3">
              <div className="media-body"><h5 className="mt-0 text-center">{router.locale == 'es' ? 'No se han encontrado resultados' : 'No results found'}</h5></div>
            </div>
          </div>
          :
          <>
            {searchRes.map((cookie, idx) => {
              if (idx == indexPreviewLim - 1) {
                if (paglast[page] == undefined || paglast[page] == null) {
                  paglast.push(cookie.id);
                } else if (paglast[page] != cookie.id) {
                  paglast.splice(page, 1, cookie.id);
                }
              }
              return (
                <>
                  {idx != 0 ? <div className="dropdown-divider d-md-none"></div> : null}
                  <NavLink type='cookie' file={cookie.fileTranslations[router.locale]} className='text-decoration-none text-light' key={cookie.id}>
                    <div className="media mb-3">
                      <Image className="align-self-center mr-3" src={cookie.picUrl} width={64} height={64} alt={cookie.title} />
                      <div className="media-body">
                        <h5 className="mt-0">{cookie.title}</h5>
                        <p dangerouslySetInnerHTML={{ __html: cookie.description }}></p>
                        <p className="my-0">{
                          cookie.dledit ?
                            (router.locale == 'es' ? 'Actualizado: ' : 'Updated: ') + formatDate(cookie.dledit) :
                            (router.locale == 'es' ? 'Publicado: ' : 'Published: ') + formatDate(cookie.published)
                        }</p>
                        <p className="mt-0">{router.locale == 'es' ? 'Autor(es):' : 'Author(s)' + cookie.authors}</p>
                      </div>
                    </div>
                  </NavLink>
                </>
              )
            })}
          </>
        }
      </div>

      {totalPages > 1 ?
        <nav>
          <ul className="pagination justify-content-end">
            {page > 1 ?
              <li className="page-item" key='1'>
                <button className="page-link text-light bg-transparent" onClick={() => handlePageChange(-1)}>
                  <span aria-hidden="true">«</span>
                </button>
              </li>
              : null}
            <li className="page-item" key='2'>
              <span className="page-link text-light bg-transparent">{page}</span>
            </li>
            {page < totalPages ?
              <li className="page-item" key='3'>
                <button className="page-link text-light bg-transparent" onClick={() => handlePageChange(1)}>
                  <span aria-hidden="true">»</span>
                </button>
              </li>
              : null}
          </ul>
        </nav>
        : null}
    </>
  )
}

export async function getServerSideProps(context) {
  //Parse query to get results
  const query = context.query;
  const configCatsList = await getConfigCatsList();
  const searchBox = {};
  let cats, checkCats, kywords = [], searchBar = '', srtOrd, desc;

  cats = configCatsList[context.locale].allCats.slice();
  checkCats = cats.slice();

  if (query.search || query.busqueda) {
    if (query.search) {
      searchBar = query.search;
      kywords = query.search.split(' ');
      if (query.busqueda) {
        searchBar += ' ' + query.busqueda;
        kywords = kywords.concat(query.busqueda.split(' '));
      }
    } else {
      searchBar = query.busqueda;
      kywords = query.busqueda.split(' ');
    }
    cats = [];
    checkCats = [];
  } else if (query.categories || query.categorias) {
    if (typeof query.categories === 'string') query.categories = [query.categories];
    if (typeof query.categorias === 'string') query.categorias = [query.categorias];
    if (query.categories) {
      cats = query.categories;
      if (query.categorias) cats = cats.concat(query.categorias);
    } else {
      cats = query.categorias;
    }
  }
  searchBox.searchBar = searchBar;
  kywords = kywords.concat(cats);
  kywords.forEach((itm, idx) => {
    kywords.splice(idx, 1, rmDiacs(itm.toLowerCase()));
  });
  configCatsList[context.locale].allCats.forEach((itm) => {
    if (kywords.indexOf(itm) == -1) {
      checkCats.splice(checkCats.indexOf(itm), 1);
    }
  });
  searchBox.checkCats = checkCats;
  srtOrd = query.order || query.orden;
  srtOrd = srtOrd || (context.locale == 'es' ? 'nuevo' : 'new');
  searchBox.srtOrd = srtOrd;
  if (srtOrd == 'new' || srtOrd == 'nuevo') {
    srtOrd = 'ledit';
    desc = true;
  }
  if (srtOrd == 'old' || srtOrd == 'viejo') {
    srtOrd = 'ledit';
    desc = false;
  }
  if (srtOrd == 'popular') {
    srtOrd = 'pop';
    desc = true;
  }

  const props = {
    site: 'index',
    host: context.req.headers.host,
    ...(await getGlobalData(context)),
    configCatsList: { ...configCatsList },
    searchBox: { ...searchBox },
    searchResults: { ...(await getIndexSearch(context.locale, kywords, srtOrd, desc)) },
    searchParams: {
      kywords: kywords,
      srtOrd: srtOrd,
      desc: desc
    }
  }
  return { props: props }
}