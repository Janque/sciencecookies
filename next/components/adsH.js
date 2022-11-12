import { useRouter } from "next/router";
import Image from 'next/image';

export default function AdsV() {
    const router = useRouter();
    return (
        <div className="row bg-info px-2 text-dark d-sm-none justify-content-center">
            <div className="col-12 pt-2">
                <h5 className="text-center mx-auto">{router.locale == 'es' ? 'Publicidad' : 'Advertising'}</h5>
            </div>
            <div className="col-6 px-1">
                <a href="https://www.instagram.com/_pedacitode_cielo/" rel="sponsored">
                    <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }} className="mb-2">
                        <Image src='/publicidad/PedacitoDeCielo.webp' fill alt='Pedacito de Cielo' sizes='(max-width: 576px) 50vw, 0vw' style={{objectFit:'contain'}} />
                    </div>
                </a>
            </div>
            <div className="col-6 px-1">
                <a href="https://www.google.com/url?sa=t&source=web&rct=j&url=https://www.instagram.com/awesomefundas/&ved=2ahUKEwi7pZiOvfjqAhUD2qwKHSV_ChQQFjAAegQIBhAC&usg=AOvVaw072K32mWOHN9b7u3cEzrcd" rel="sponsored">
                    <div style={{ position: 'relative', width: '100%', paddingTop: '164%' }} className="mb-2">
                        <Image src='/publicidad/AwesomeFundas.webp' alt='Awesome Fundas' fill sizes='(max-width: 576px) 50vw, 0vw' style={{objectFit:'contain'}} />
                    </div>
                </a>
            </div>
        </div>
    );
}