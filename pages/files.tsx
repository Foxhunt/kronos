import { useAtom } from "jotai"
import Files from "../components/Files"
import { userDocRefAtom } from "../store"

export default function Home() {
    const [userDocRef] = useAtom(userDocRefAtom)

    return <>
        {userDocRef ? <Files /> : null}
    </ >
}
