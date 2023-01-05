import { getGlobalData } from '../lib/utils';
import MetaDescription from '../components/metaDescription';
import { useRouter } from 'next/router';


export default function Calendarios(props) {
    const router = useRouter();
    return (
        <>
            <MetaDescription description={router.locale == 'es' ? 'Revisa y edita los calendarios' : 'Review and edit the calendars'} />
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