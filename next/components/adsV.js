import { useRouter } from "next/router";
import Image from 'next/image';

export default function AdsV() {
    const router = useRouter();
    return (
        <div className="col-2 py-md-3 d-none d-sm-block bg-info text-dark text-center justify-content-center px-1 px-lg-2">
            <h5 className="text-center mx-auto">{router.locale == 'es' ? 'Publicidad' : 'Advertising'}</h5>
            <a href="https://www.instagram.com/_pedacitode_cielo/" rel="sponsored">
                <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }} className="mb-2">
                    <Image src='/publicidad/PedacitoDeCielo.webp' fill objectFit="contain" alt='Pedacito de Cielo' />
                </div>
            </a>
            <a href="https://www.google.com/url?sa=t&source=web&rct=j&url=https://www.instagram.com/awesomefundas/&ved=2ahUKEwi7pZiOvfjqAhUD2qwKHSV_ChQQFjAAegQIBhAC&usg=AOvVaw072K32mWOHN9b7u3cEzrcd" rel="sponsored">
                <div style={{ position: 'relative', width: '100%', paddingTop: '164%' }} className="mb-2">
                    <Image src='/publicidad/AwesomeFundas.webp' alt='Awesome Fundas' fill objectFit="contain" />
                </div>
            </a>
        </div>
    );
}