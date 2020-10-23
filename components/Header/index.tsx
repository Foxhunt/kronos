import Navigation from "./Navigation"
import LocationAndFolders from "./LocationAndFolders"
import { userDocRefAtom } from "../../store"
import { useAtom } from "jotai"

export default function Header() {
    const [userDocRef] = useAtom(userDocRefAtom)

    return <header>
        <Navigation
            loggedIn={userDocRef !== undefined} />
        {userDocRef ? <LocationAndFolders /> : null}
    </header>
}
