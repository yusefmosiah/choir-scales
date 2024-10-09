import Head from 'next/head';
import StreamChat from '../components/StreamChat';

const StreamPage = () => {
  return (
    <div className="bg-gray-900">
      <Head>
        <title>Choir — Chorus AI</title>
        <meta name="description" content="Choir — Chorus AI" />
      </Head>
      <StreamChat />
    </div>
  );
};

export default StreamPage;
