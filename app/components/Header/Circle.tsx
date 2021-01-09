import { motion, SVGMotionProps } from "framer-motion"

export default function Circle(props: SVGMotionProps<SVGElement>) {
    return <motion.svg
        {...props}
        width="10"
        height="10"
        viewBox="0 0 10 10">
        <motion.circle cx="5" cy="5" r="5" fill="black" />
    </motion.svg>
}
