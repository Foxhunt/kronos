import { useEffect } from "react"

export function useClickedOutside(ref: any, callback: Function) {
    useEffect(() => {
        function detectClickedOutside(event: MouseEvent) {
            if (!ref?.current?.contains(event.target)) {
                callback(event)
            }
        }

        document.addEventListener("pointerdown", detectClickedOutside)
        return () => {
            document.removeEventListener("pointerdown", detectClickedOutside)
        }
    }, [ref, callback])
}
