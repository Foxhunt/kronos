import Navigation from "./Navigation"
import Location from "./Location"
import { userDocRefAtom } from "../../store"
import { useAtom } from "jotai"

export default function Header() {
    const [userDocRef] = useAtom(userDocRefAtom)

    return <header>
        <Navigation
            loggedIn={userDocRef !== undefined} />
        {userDocRef ? <Location /> : null}
    </header>
}
