import { AppProps } from "next/dist/next-server/lib/router/router"
import { ComponentType } from "react"
import UserProvider from '../context/userContext'

type Props = {
    Component: ComponentType<any>
    pageProps: AppProps
}

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }: Props) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}
