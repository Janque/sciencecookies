import { Html, Head, Main, NextScript } from 'next/document'
import CustomHead from '../components/head';

export default function Document() {
    return (
        <Html>
            <Head>
                <CustomHead/>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}