
import Head from "next/head"
import { useAtom } from "jotai"
import TaskList from "../components/CollectionList"
import { userDocRefAtom } from "../store"

export default function files() {
    const [userDocRef] = useAtom(userDocRefAtom)

    return <>
        <Head>
            <title>Index</title>
        </Head>
        {userDocRef && <TaskList />}
    </>
}
