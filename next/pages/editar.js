import styles from '../styles/edit.module.scss';
import { getGlobalData } from '../lib/utils';
import Head from 'next/head';


export default function Editar(props) {
    const router = useRouter();
    return (
        <>
            <Head>
                <meta name="description" content={router.locale == 'es' ? 'Edita las Galletas' : 'Edit the Cookies'} />
                <meta property="og:description" content={router.locale == 'es' ? 'Edita las Galletas' : 'Edit the Cookies'} />
            </Head>
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