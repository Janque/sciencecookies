import Head from 'next/head';
export default function MetaDescription({ description }) {
    return (
        <>
            <Head>
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
            </Head>
        </>
    )
}