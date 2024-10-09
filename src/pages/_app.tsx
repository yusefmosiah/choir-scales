import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import { AppBar } from '../components/AppBar';
import Notifications from '../components/Notification'
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
          <Head>
            <title>Chorus</title>
          </Head>

          <ContextProvider>
            <div className="flex flex-col min-h-screen">
              <Notifications />
              <AppBar/>
              <main className="flex-1">
                <Component {...pageProps} />
              </main>
            </div>
          </ContextProvider>
        </>
    );
};

export default App;
