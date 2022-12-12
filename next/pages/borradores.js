import { getGlobalData } from '../lib/utils';
import Head from 'next/head';


export default function Borradores(props) {
    const router = useRouter();
    return (
        <>
            <Head>
                <meta name="description" content={router.locale == 'es' ? 'Revisa y administra tus borradores' : 'Review and manage your drafts'} />
                <meta property="og:description" content={router.locale == 'es' ? 'Revisa y administra tus borradores' : 'Review and manage your drafts'} />
            </Head>
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