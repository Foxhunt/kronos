import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { userDocRefAtom } from "../../store"

import Task from "./Task"

export default function Overview() {
    const [userDocRef] = useAtom(userDocRefAtom)

    const [tasks, setTasks] = useState<firebase.firestore.DocumentSnapshot[]>([])
    useEffect(() => {
        if (userDocRef) {
            const unsubscribe = userDocRef
                .collection("tasks")
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    setTasks(snapshot.docs)
                })
            return unsubscribe
        }
    }, [userDocRef])

    return <>{
        tasks.map(task => (
            <Task
                key={task.id}
                task={task} />
        ))
    }</>
}
