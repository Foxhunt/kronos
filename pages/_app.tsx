import { AppProps } from "next/dist/next-server/lib/router/router"
import { ComponentType } from "react"

import UserArea from "../components/UserArea"
import Navigation from "../components/Navigation"

import UserProvider from '../context/userContext'

type Props = {
  Component: ComponentType<any>
  pageProps: AppProps
}

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }: Props) {
  return (
    <UserProvider>
      <UserArea />
      <Navigation />
      <Component {...pageProps} />
    </UserProvider>
  )
}
