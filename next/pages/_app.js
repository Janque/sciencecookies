//Bootstrap
import 'bootstrap/dist/css/bootstrap.css';

//Font awesome
import '../vendor/font-awesome/css/all.min.css';

//FirebaseUI
import '../vendor/firebaseui.min.css';

import '../styles/main.scss';
import Layout from '../components/layout';

import { useEffect } from "react";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};