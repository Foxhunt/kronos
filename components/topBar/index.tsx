import UserArea from "./UserArea"
import Navigation from "./Navigation"
import { userDocRefAtom } from "../../store"
import { useAtom } from "jotai"

export default function TopBar() {
    const [userDocRef] = useAtom(userDocRefAtom)

    return <>
        <UserArea
            loggedIn={userDocRef !== null} />
        {userDocRef ? <Navigation /> : null}
    </>
}
