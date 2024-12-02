import "@/styles/globals.css";
import 'litegraph.js/css/litegraph.css'
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
