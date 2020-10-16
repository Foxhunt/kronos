import UserArea from "./UserArea"
import Navigation from "./Navigation"
import { userDocAtom } from "../../store"
import { useAtom } from "jotai"

export default function TopBar() {
    const [userDocRef] = useAtom(userDocAtom)

    return <>
        <UserArea
            loggedIn={userDocRef !== null} />
        {userDocRef ? <Navigation /> : null}
    </>
}
