import Navigation from "./Navigation"
import { userDocRefAtom } from "../../store"
import { useAtom } from "jotai"

export default function Header() {
    const [userDocRef] = useAtom(userDocRefAtom)

    return <header>
        <Navigation
            loggedIn={userDocRef !== undefined} />
    </header>
}
