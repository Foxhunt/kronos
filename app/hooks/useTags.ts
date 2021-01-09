import firebase from "../firebase/clientApp"
import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import {
    userDocRefAtom
} from "../store"

export function useTags() {
    const [userDocRef] = useAtom(userDocRefAtom)
    const [tags, setTags] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        const unsubscribe = userDocRef?.ref
            .collection("tags")
            .onSnapshot(snapshot => {
                setTags(snapshot.docs)
            })
        return unsubscribe
    }, [userDocRef])

    return tags
}
