import { useRouter } from "next/router";
import Image from 'next/image';

export default function Banner() {
    const router = useRouter();
    return (
        <div className="row justify-content-center mt-3 mb-4 align-items-center" style={{ height: 'calc(100% - 2.5rem)' }}>
            <div className="col-10 col-sm-5 col-xl-3" style={{ height: '100%' }}>
                <Image priority fill src='/img/logoT.svg' alt='Science Cookies Logo' sizes="(max-width: 576px) 85vw, (max-width: 1200px) 42vw, 25vw" />
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
                <h1 className="title v1 text-center" style={{ fontSize: '2.8rem' }}>SCIENCE COOKIES</h1>
                <h2 className="title v2 text-center" style={{ fontSize: '1rem' }}>{router.locale == 'es' ? 'Artículos de ciencia con chispas de chocolate' : 'Science articles with chocolate chips'}</h2>
            </div>
        </div>
    );
}