import Head from 'next/head';
import StreamChat from '../components/StreamChat';

const StreamPage = () => {
  return (
    <div>
      <Head>
        <title>Stream Chat</title>
        <meta name="description" content="Stream chat with OpenAI" />
      </Head>
      <StreamChat />
    </div>
  );
};

export default StreamPage;
