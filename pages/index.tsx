import { useAtom } from "jotai"
import Collection from "../components/collection"
import { userDocRefAtom } from "../store"

export default function Home() {
  const [userDocRef] = useAtom(userDocRefAtom)

  return <>
    {userDocRef ? <Collection /> : null}
  </ >
}
