import Head from 'next/head';
import styles from '../styles/index.module.scss';
import HeadSecond from '../components/headSecond';
import { useRouter } from 'next/router';
import { getGlobalData, rmDiacs } from '../lib/utils';
import Image from 'next/image';
import { getConfigCatsList, getIndexSearch } from '../firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import NavLink from '../components/navLinks';

export default function Home(props) {
  const router = useRouter();
  return (
    <>
      <Head>
        <HeadSecond host={props.host} locale={router.locale} site={props.site} />

        <meta name="description" content={router.locale == 'es' ? 'Artículos de ciencia con chispas de chocolate. Artículos de difusión científica y sobre curiosidades.' : 'Science articles with chocolate chips. Articles of scientific diffusion and on curiosities.'} />
        <meta property="og:description" content={router.locale == 'es' ? 'Artículos de ciencia con chispas de chocolate. Artículos de difusión científica y sobre curiosidades.' : 'Science articles with chocolate chips. Articles of scientific diffusion and on curiosities.'} />
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

      <form id="frmSrch" className="mb-4">
        <div className={`rounded mb-1 pl-2 pt-1 ${styles['cats-container']}`}>
          <div className="from-row">
            <label htmlFor="cats">{router.locale == 'es' ? 'Categorías' : 'Categories'}</label>
            <div className="form-check">
              <input type="checkbox" id="catA" className="form-check-input" defaultChecked={props.searchBox.checkCats.indexOf('all') != -1 || props.searchBox.checkCats.indexOf('todas') != -1} />
              <label htmlFor="catA" className="form-check-label">{router.locale == 'es' ? 'Todas' : 'All'}</label>
            </div>
          </div>
          <div className="form-row justify-content-around">
            {props.configCatsList[router.locale].allCats.map((cat, idx) => {
              return (
                <div className="form-group col-auto" key={cat}>
                  <div className="form-check">
                    <input type="checkbox" id={`cat${idx}`} className="form-check-input" defaultValue={cat} defaultChecked={props.searchBox.checkCats.indexOf(cat) != -1} />
                    <label htmlFor={`cat${idx}`} className="form-check-label">{props.configCatsList[router.locale].textCats[idx]}</label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="input-group">
          <input type="text" className="form-control" placeholder={router.locale == 'es' ? 'Buscar Galletas...' : 'Search Cookies...'} maxLength="100" defaultValue={props.searchBox.searchBar} />
          <div className="input-group-append">
            <select name="" id="inOrd" className="custom-select rounded-0" defaultValue={props.searchBox.srtOrd}>
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

      <nav id="pgNavT" aria-label="pageNavT">
        <ul className="pagination justify-content-end">
          <li className="page-item" key='1'>
            <button id="pgTPrv" className="page-link text-light bg-transparent" aria-label="pgTPrv">
              <span aria-hidden="true">«</span>
            </button>
          </li>
          <li className="page-item" key='2'>
            <span id="disPgT" className="page-link text-light bg-transparent">1</span>
          </li>
          <li className="page-item" key='3'>
            <button id="pgTNxt" className="page-link text-light bg-transparent" aria-label="pgTNxt">
              <span aria-hidden="true">»</span>
            </button>
          </li>
        </ul>
      </nav>

      <div>
        {props.searchResults.resultCount == 0 ?
          <div className="text-light">
            <div className="media mb-3">
              <div className="media-body"><h5 className="mt-0 text-center">{router.locale == 'es' ? 'No se han encontrado resultados' : 'No results found'}</h5></div>
            </div>
          </div>
          :
          <>
            {props.searchResults.docs.map((cookie, idx) => {
              return (
                <>
                  {idx != 0 ? <div className="dropdown-divider d-md-none"></div> : null}
                  <NavLink type='cookie' file={cookie.fileTranslations[router.locale]} className='text-decoration-none text-dark' key={cookie.id}>
                  test
                  </NavLink>
                </>
              )
            })}
          </>
        }
      </div>

      <nav id="pgNavB" aria-label="pageNavB">
        <ul className="pagination justify-content-end">
          <li className="page-item" key='1'>
            <button id="pgBPrv" className="page-link text-light bg-transparent" aria-label="pgBPrv">
              <span aria-hidden="true">«</span>
            </button>
          </li>
          <li className="page-item" key='2'>
            <span id="disPgB" className="page-link text-light bg-transparent">1</span>
          </li>
          <li className="page-item" key='3'>
            <button id="pgBNxt" className="page-link text-light bg-transparent" aria-label="pgBNxt">
              <span aria-hidden="true">»</span>
            </button>
          </li>
        </ul>
      </nav>
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
  checkCats.push(context.locale == 'es' ? 'todas' : 'all');

  if (query.categories || query.categorias) {
    if (query.categories) {
      cats = query.categories.split('+');
      cats = cats.concat(query.categorias?.split('+'))
    } else {
      cats = query.categorias.split('+');
    }
  }
  if (query.search || query.busqueda) {
    if (query.search) {
      kywords = query.search.split('+');
      kywords = kywords.concat(query.busqueda?.split('+'))
    } else {
      kywords = query.busqueda.split('+');
    }
  };
  kywords.forEach(itm => {
    searchBar += itm + ' ';
  });
  searchBox.searchBar = searchBar;
  kywords = cats.concat(kywords);
  kywords.forEach((itm, idx) => {
    kywords.splice(idx, 1, rmDiacs(itm.toLowerCase()));
  });
  configCatsList[context.locale].allCats.forEach((itm) => {
    if (kywords.indexOf(itm) == -1) {
      checkCats.splice(checkCats.indexOf(itm), 1);
    } else {
      checkCats.splice(checkCats.indexOf('todas'), 1);
      checkCats.splice(checkCats.indexOf('all'), 1);
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
    ...(await getGlobalData(context)),
    configCatsList: { ...configCatsList },
    searchBox: { ...searchBox },
    searchResults: { ...(await getIndexSearch(context.locale, kywords, srtOrd, desc)) }
  }
  props.host = context.req.headers.host;
  return { props: props }
}