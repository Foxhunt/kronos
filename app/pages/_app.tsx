import { AppProps } from "next/dist/next-server/lib/router/router"
import { ComponentType } from "react"
import { Provider } from "jotai"

import "../firebase/clientApp"

import User from "../services/User"
import FileUpload from "../services/FileUpload"

import Header from "../components/Header"

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
      <FileUpload />
      <Header />
      <Component {...pageProps} />
    </Provider>
  )
}
