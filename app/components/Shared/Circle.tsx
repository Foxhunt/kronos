import { motion, SVGMotionProps } from "framer-motion"
import styled from "styled-components"

const Container = styled.div`
    margin-right: 5px;
`

export default function Circle({ fill, stroke, ...props }: SVGMotionProps<SVGElement>) {
    return <Container>
        <motion.svg
            {...props}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            strokeWidth="1"
            shapeRendering="geometricPrecision">
            <motion.circle
                initial={{
                    fill,
                    stroke
                }}
                animate={{
                    fill,
                    stroke
                }}
                transition={{
                    duration: .3
                }}
                cx="6"
                cy="6"
                r="5" />
        </motion.svg>
    </Container>
}
