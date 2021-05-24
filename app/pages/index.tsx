import Head from "next/head"

import { useAtom } from "jotai"
import { userDocRefAtom } from "../store"

import CollectionList from "../components/CollectionList"

export default function files() {
    const [userDocRef] = useAtom(userDocRefAtom)

    return <>
        <Head>
            <title>Index</title>
            <link rel="shortcut icon" href="/list.svg" />
        </Head>
        {userDocRef &&
            <CollectionList />}
    </>
}
