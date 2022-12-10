//Bootstrap
import 'bootstrap/dist/css/bootstrap.css';

//FontAwesomeIcon
import '@fortawesome/fontawesome-svg-core/styles.css';

import '../styles/main.scss';
import Layout from '../components/layout';

import { useEffect } from "react";

import { AuthUserProvider } from "../firebase/auth";
import { AlertProvider } from '../components/alert';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
    <AlertProvider>
      <AuthUserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthUserProvider>
    </AlertProvider>
  );
};