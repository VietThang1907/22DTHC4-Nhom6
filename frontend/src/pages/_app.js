import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import '../styles/animation.css'
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Đồ án Nhóm 6 </title>
        <meta name="description" content="Xem phim trực tuyến miễn phí HD" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"></link>
      </Head>
      
      <Component {...pageProps} />
      
      <style jsx global>{`
        body {
          background-color: #000;
          color: #fff;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #111;
        }
        ::-webkit-scrollbar-thumb {
          background: #e50914;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}

export default MyApp;
