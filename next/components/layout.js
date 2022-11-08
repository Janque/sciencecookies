import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from './navbar';
import Sidebar from './sidebarL';
import Footer from './footer';

export default function Layout({ children }) {
    const router = useRouter();
    return (
        <>
            <Head>
                <meta property="og:locale" content={router.locale} />
            </Head>

            <Navbar site={children.props.site} />

            {/* <Register />*/}

            <div className="container-fluid text-white page-container">
                <div className="row justify-content-around">
                    <Sidebar />
                    <div id="cookCnt" className="col-12 col-sm-9 col-md-6 col-xl-7 py-md-3 pl-md-3">
                        {/* <Banner />*/}
                        {children}
                    </div>
                    {/* <AdsV />*/}
                </div>
                {/* <AdsH />*/}
            </div>
            <Footer site={children.props.site} />
            {/* Global JS*/}
            {/* Page JS*/}
        </>
    )
}