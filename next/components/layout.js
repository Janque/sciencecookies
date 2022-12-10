import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from './navbar';
import Register from './register';
import Sidebar from './sidebarL';
import Banner from './banner';
import AdsV from './adsV';
import AdsH from './adsH';
import Footer from './footer';
import Script from 'next/script';

export default function Layout({ children }) {
    const router = useRouter();
    const props = children.props;
    return (
        <>
            <Head>
                {props.site == 'index' ? <>
                    <meta property="og:locale" content={router.locale} />
                    <link rel="alternate" hrefLang="es" href={props.host + '/'} />
                    <link rel="alternate" hrefLang="en" href={props.host + '/'} />
                    <link rel="alternate" hrefLang="x-default" href={props.host + '/'} />
                    <link rel="canonical" href={props.host + '/'} />
                    <meta property="og:url" content={props.host + '/'} />
                </> : <>
                    <meta property="og:locale" content={router.locale} />
                    <link rel="alternate" hrefLang="es" href={props.host + '/' + NavLinks["es"][props.site]} />
                    <link rel="alternate" hrefLang="en" href={props.host + '/' + NavLinks["en"][props.site]} />
                    <link rel="alternate" hrefLang="x-default" href={props.host + '/' + NavLinks["es"][props.site]} />
                    <link rel="canonical" href={props.host + '/' + NavLinks[router.locale][props.site]} />
                    <meta property="og:url" content={props.host + '/' + NavLinks[router.locale][props.site]} />
                    <meta key="ogtitle" property="og:title" content={Buttons[router.locale][props.site] + ' - Science Cookies'} />
                    <title key="title">{Buttons[router.locale][props.site] + ' - Science Cookies'}</title>
                </>
                }
            </Head>

            <Script
                dangerouslySetInnerHTML={{
                    __html: `(function(c,l,a,r,i,t,y){
                        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
                        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                        })(window, document, "clarity", "script", "56t5m147ti");`,
                }}>
            </Script>

            <Navbar site={props.site} />

            <Register site={props.site} />

            <div className="container-fluid text-white page-container">
                <div className="row justify-content-around">
                    <Sidebar latestCookie={props.latestCookie} mostPopularCookies={props.mostPopularCookies} latestCalendar={props.latestCalendar} />
                    <div className="col-12 col-sm-9 col-md-6 col-xl-7 py-md-3 pl-md-3">
                        <Banner />
                        {children}
                    </div>
                    <AdsV />
                </div>
                <AdsH />
            </div>

            <Footer site={props.site} fullUrl={props.fullUrl} isMobile={props.isMobile} />

            {/* Global JS*/}
            {/* Page JS*/}
        </>
    )
}