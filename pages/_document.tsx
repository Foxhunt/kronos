import Document, { DocumentContext } from 'next/document'
import { ServerStyleSheet, createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
   html, body, #__next {
    margin: 0px;
    width: 100%;
    height: 100%;
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
}
