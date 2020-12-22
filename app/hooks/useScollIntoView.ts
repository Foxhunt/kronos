import { RefObject, useEffect } from "react"

export function useScollIntoView(selectedItemRef: RefObject<HTMLElement>) {
    useEffect(() => {
        if (selectedItemRef.current) {
            selectedItemRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
        }
    }, [selectedItemRef.current])
}
