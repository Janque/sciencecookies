import Head from 'next/head';
//import styles from '../styles/index.scss';
import HeadSecond from '../components/headSecond';
import { getRecommended } from '../firebase/firestore';

export default function Home(data) {
  return (
    <>
      <Head>
        <HeadSecond host={data.host} locale={data.locale} site={data.site} />

        <meta name="description" content={data.locale == 'es' ? 'Artículos de ciencia con chispas de chocolate. Artículos de difusión científica y sobre curiosidades.' : 'Science articles with chocolate chips. Articles of scientific diffusion and on curiosities.'} />
        <meta property="og:description" content={data.locale == 'es' ? 'Artículos de ciencia con chispas de chocolate. Artículos de difusión científica y sobre curiosidades.' : 'Science articles with chocolate chips. Articles of scientific diffusion and on curiosities.'} />
        <title key="title">{data.locale == 'es' ? 'Science Cookies - Artículos de ciencia con chispas de chocolate.' : 'Science Cookies - Science articles with chocolate chips.'}</title>
        <meta key="ogtitle" property="og:title" content={'Science Cookies - ' + (data.locale == 'es' ? 'Artículos de ciencia con chispas de chocolate.' : 'Science articles with chocolate chips.')} />
        <meta property="og:image" content={data.host + "/img/logoT.svg"} />
      </Head>
    </>
  )
}

export async function getServerSideProps(context) {
  const data = {
    site: 'index',
    ...(await getRecommended(context.locale)),
    title: "The Title"
  }
  data.locale = context.locale;
  data.host = context.req.headers.host;
  return { props: data }
}