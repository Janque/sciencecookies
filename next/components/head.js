import Script from 'next/script';

export default function CustomHead() {
  return (
        <>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="google-site-verification" content="pffq0MGMyrYBsgL7f9drofhXb0nfHmqE8-h1YZf83xA" />

            <meta property="og:type" content="website" />

            <meta name="root-url" content="https://sciencecookies.net/" />

            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#791acd" />
            <meta name="msapplication-TileColor" content="#791acd" />
            <meta name="theme-color" content="#343a40" />

            <Script
                dangerouslySetInnerHTML={{
                    __html: `(function(c,l,a,r,i,t,y){
                        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
                        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                        })(window, document, "clarity", "script", "56t5m147ti");`,
                }}>
            </Script>
        </>);
};