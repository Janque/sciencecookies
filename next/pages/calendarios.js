import { getGlobalData } from '../lib/utils';
import Head from 'next/head';


export default function Calendarios(props) {
    const router = useRouter();
    return (
        <>
            <Head>
                <meta name="description" content={router.locale == 'es' ? 'Revisa y edita los calendarios' : 'Review and edit the calendars'} />
                <meta property="og:description" content={router.locale == 'es' ? 'Revisa y edita los calendarios' : 'Review and edit the calendars'} />
            </Head>
        </>
    );

}

export async function getServerSideProps(context) {
    const props = {
        site: 'draftsCal',
        host: context.req.headers.host,
        ...(await getGlobalData(context))
    }
    return { props: props }
}