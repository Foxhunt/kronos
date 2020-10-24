import { useAtom } from "jotai"
import Overview from "../components/Overview"
import { userDocRefAtom } from "../store"

export default function Home() {
  const [userDocRef] = useAtom(userDocRefAtom)

  return <>
    {userDocRef ? <Overview /> : null}
  </ >
}
