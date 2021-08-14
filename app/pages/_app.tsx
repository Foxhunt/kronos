import { Provider } from "jotai"
import { AppProps } from "next/dist/shared/lib/router/router"
import { ComponentType } from "react"
import Header from "../components/Header"
import "../firebase/clientApp"
import User from "../services/User"
import "../styles.css"

type Props = {
  Component: ComponentType<any>
  pageProps: AppProps
}

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }: Props) {
  return (
    <Provider>
      <User />
      <Header />
      <Component {...pageProps} />
    </Provider>
  )
}
