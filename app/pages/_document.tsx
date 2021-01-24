import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document"
import { ServerStyleSheet, createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "FuturaNowHeadline-Bd";
    src:  url("webFonts/FuturaNowHeadline-Bd/font.woff2") format("woff2"),
          url("webFonts/FuturaNowHeadline-Bd/font.woff") format("woff");
  }

   html, body {
    margin: 0px;
    font-family: "FuturaNowHeadline-Bd"
  }

  #__next {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
`

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<>
              <GlobalStyle />
              <App {...props} />
            </>),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Indexed is a digital online archive for visual designes." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html >
  }
}
