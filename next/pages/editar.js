import styles from '../styles/edit.module.scss';
import { getGlobalData } from '../lib/utils';
import MetaDescription from '../components/metaDescription';


export default function Editar(props) {
    const router = useRouter();
    return (
        <>
            <MetaDescription description={router.locale == 'es' ? 'Edita las Galletas' : 'Edit the Cookies'} />
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