import { useAtom } from "jotai"
import Overview from "../components/Overview"
import { userDocRefAtom } from "../store"

export default function index() {
  const [userDocRef] = useAtom(userDocRefAtom)

  return <>
    {userDocRef ? <Overview /> : null}
  </ >
}
