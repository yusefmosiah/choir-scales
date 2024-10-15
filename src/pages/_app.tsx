import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import { AppBar } from '../components/AppBar';
import Notifications from '../components/Notification';
import '@solana/wallet-adapter-react-ui/styles.css';
import '../styles/globals.css';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Choir — Chorus AI</title>
        <meta name="description" content="Choir — Chorus AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ContextProvider>
        <div className="min-h-screen bg-gray-900">
          <AppBar />
          <main className="relative">
            <Component {...pageProps} />
          </main>
        </div>
        <Notifications />
      </ContextProvider>
    </>
  );
};

export default App;
