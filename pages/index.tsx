import { useAtom } from "jotai"
import TaskOverview from "../components/TaskOverview"
import { userDocRefAtom } from "../store"

export default function index() {
  const [userDocRef] = useAtom(userDocRefAtom)

  return <>
    {userDocRef ? <TaskOverview /> : null}
  </ >
}
