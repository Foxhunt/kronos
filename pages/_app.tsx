import { AppProps } from "next/dist/next-server/lib/router/router"
import { ComponentType } from "react"
import { Provider } from "jotai"

import "../firebase/clientApp"

import User from "../firebase/User"
import TopBar from "../components/topBar";

type Props = {
  Component: ComponentType<any>
  pageProps: AppProps
}

const isOnClient = typeof window !== "undefined";

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }: Props) {
  return (
    <Provider>
      {isOnClient && <User />}
      <TopBar />
      <Component {...pageProps} />
    </Provider>
  )
}
