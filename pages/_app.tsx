import "../styles/globals.css";
import type { AppProps } from "next/app";
import { StateProvider } from "../src/context/StateProvider";
import reducer, { initialState } from "../src/context/reducer";
import Layout from "../src/components/Layout";
import { AnimatePresence } from "framer-motion";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <Layout>
        <AnimatePresence exitBeforeEnter>
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Layout>
    </StateProvider>
  );
}
export default MyApp;
