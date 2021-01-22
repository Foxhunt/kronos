import { motion, SVGMotionProps } from "framer-motion"

export default function Circle(props: SVGMotionProps<SVGElement>) {
    return <motion.svg
        {...props}
        width="12"
        height="12"
        viewBox="0 0 12 12"
        strokeWidth="1"
        shapeRendering="geometricPrecision">
        <motion.circle cx="6" cy="6" r="5" />
    </motion.svg>
}
