import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document 
{
    render() 
    {
        return(
            <Html>
                <Head>
                    <meta charSet="utf-8" />
                    <title>Podcastr - NLW #5</title>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet" />
                    <link rel="shortcut icon" href="/favicon.png" type="image/png" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}