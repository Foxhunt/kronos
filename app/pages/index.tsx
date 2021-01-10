
import Head from "next/head"
import { useAtom } from "jotai"
import CollectionList from "../components/CollectionList"
import { userDocRefAtom } from "../store"

export default function files() {
    const [userDocRef] = useAtom(userDocRefAtom)

    return <>
        <Head>
            <title>Index</title>
            <link rel="shortcut icon" href="/list.svg" />
        </Head>
        {userDocRef && <CollectionList />}
    </>
}
