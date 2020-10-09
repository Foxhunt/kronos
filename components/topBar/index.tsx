import { useUser } from "../../context/userContext"

import UserArea from "./UserArea"
import Navigation from "./Navigation"

export default function TopBar() {
    const { user, logout } = { ...useUser() }

    return <>
        <UserArea
            user={user}
            logout={logout} />
        {user ? <Navigation /> : null}
    </>
}
