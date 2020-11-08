import useTasks from "../../hooks/useTasks"
import Task from "./Task"

export default function TaskList() {
    const tasks = useTasks()

    return <>
        {tasks.map(task => (
            <Task
                key={task.id}
                task={task} />
        ))}
    </>
}
