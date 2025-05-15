import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add your Bootstrap Icons stylesheet here */}
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
        
        {/* Script to prevent repeated data fetching if account locked */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && localStorage.getItem('isAccountLocked') === 'true' && window.location.pathname !== '/account-locked') {
              // Prevent data fetching and redirect to locked page
              const originalFetch = window.fetch;
              window.fetch = function(url, options) {
                if (typeof url === 'string' && url.includes('/_next/data')) {
                  console.log('Request blocked due to locked account:', url);
                  return Promise.resolve(new Response(JSON.stringify({ blocked: true }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                  }));
                }
                return originalFetch(url, options);
              };

              // Redirect to locked account page if not already there
              if (window.location.pathname !== '/account-locked') {
                window.location.href = '/account-locked';
              }
            }
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}