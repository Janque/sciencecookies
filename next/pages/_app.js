//Bootstrap
import 'bootstrap/dist/css/bootstrap.css';

import '../styles/main.scss';
import Layout from '../components/layout';

import { useEffect } from "react";

import { AuthUserProvider } from "../firebase/auth";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
    <AuthUserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthUserProvider>
  );
};