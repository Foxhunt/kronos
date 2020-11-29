import { useAtom } from "jotai"
import TaskList from "../components/TaskList"
import { userDocRefAtom } from "../store"

export default function files() {
    const [userDocRef] = useAtom(userDocRefAtom)

    return userDocRef ? <TaskList /> : null
}
