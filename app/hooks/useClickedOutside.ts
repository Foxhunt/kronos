import { useEffect } from "react"

export function useClickedOutside(ref: any, callback: Function) {
    useEffect(() => {
        function detectClickedOutside(event: MouseEvent) {
            if (!ref?.current?.contains(event.target)) {
                callback(event)
            }
        }

        document.addEventListener("mousedown", detectClickedOutside)
        return () => {
            document.removeEventListener("mousedown", detectClickedOutside)
        }
    }, [ref, callback])
}
