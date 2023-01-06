import { getGlobalData } from '../lib/utils';
import MetaDescription from '../components/metaDescription';
import { useRouter } from 'next/router';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faEdit, faEye, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { NavLinks } from '../components/layoutAttr';
import { getDraftsCalSearch, draftsPreviewLim } from '../firebase/firestore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavLink from '../components/navLinks';
import Image from 'next/image';

export default function Calendarios(props) {
    const router = useRouter();

    //Page controls
    const [searchRes, setSearchRes] = useState(props.searchResults.docs);
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(props.searchResults.resultCount / draftsPreviewLim);
    var paglast = [null];
    useEffect(() => {
        if (paglast[page] == undefined || paglast[page] == null) {
            paglast.push(searchRes[searchRes.length - 1].id);
        } else if (paglast[page] != searchRes[searchRes.length - 1].id) {
            paglast.splice(page, 1, searchRes[searchRes.length - 1].id);
        }
    }, searchRes)
    async function handlePageChange(np) {
        if (page <= 1 && np == -1) return;
        if (page == totalPages && np == 1) return;
        setSearchRes((await getDraftsCalSearch(router.locale, true, paglast[page])).docs);
        setPage(page + np);
    }

    return (
        <>
            <MetaDescription description={router.locale == 'es' ? 'Revisa y edita los calendarios' : 'Review and edit the calendars'} />

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
                {searchRes.map(calendar => {
                    return (
                        <div className="col mb-4">
                            <div className={`card text-dark bg-light h-100 cardBorder ${calendar.public ? 'border-success' : 'border-secondary'}`}>
                                <div className="card-header bg-light m-0 py-0 text-right">
                                    <div className="row justify-content-between">
                                        {!calendar.public ?
                                            <div className="col-auto p-0">
                                                <span className="badge badge-warning">{router.locale == 'es' ? 'Pendiente' : 'Pending'}</span>
                                            </div>
                                            : null
                                        }
                                        <div className="col-auto p-0 ml-auto">
                                            <Dropdown>
                                                <Dropdown.Toggle variant="light" className='no-arrow'>
                                                    <FontAwesomeIcon icon={faEllipsisH} />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu drop='end'>
                                                    <Link className="dropdown-item" href={`/${router.locale}/${NavLinks['es']['editCal']}?id=${calendar.id}`} as={`/${NavLinks[router.locale]['editCal']}?id=${calendar.id}`} locale={false}>
                                                        {router.locale == 'es' ? 'Editar ' : 'Edit '}
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Link>
                                                    <Dropdown.Item href={'../vista-email-calendario/' + calendar.id} target='_blank'>
                                                        {router.locale == 'es' ? 'Vista correo ' : 'Mail preview '}
                                                        <FontAwesomeIcon icon={faEnvelope} />
                                                    </Dropdown.Item>
                                                    {calendar.public ?
                                                        <NavLink type='calendar' className='dropdown-item' date={props.latestCalendar.published} target='_blank'>
                                                            {router.locale == 'es' ? 'Ver calendario ' : 'View calendar '}
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </NavLink>
                                                        : null
                                                    }
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                                <Link href={`/${router.locale}/${NavLinks['es']['editCal']}?id=${calendar.id}`} as={`/${NavLinks[router.locale]['editCal']}?id=${calendar.id}`} locale={false} className='text-decoration-none text-dark'>
                                    <div className='card-img-top' style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
                                        <Image fill src={calendar.picUrl} alt={router.locale == 'es' ? 'No hay imagen' : 'No image'} sizes="(max-width: 1200px) 25vw, 17vw" style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div className="card-body">
                                        <h3 className="card-title">{calendar.title}</h3>
                                        <p className="card-text">{calendar.description}</p>
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
    const props = {
        site: 'draftsCal',
        host: context.req.headers.host,
        ...(await getGlobalData(context)),
        searchResults: { ...(await getDraftsCalSearch(context.locale)) },
    }
    return { props: props }
}