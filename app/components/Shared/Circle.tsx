import { motion, SVGMotionProps } from "framer-motion"
import styled from "styled-components"

const Container = styled.div`
    margin-right: 5px;
`

export default function Circle({ fill, stroke, ...props }: SVGMotionProps<SVGElement>) {
    return <Container>
        <motion.svg
            {...props}
            initial={{
                fill: fill as string,
                stroke: stroke as string
            }}
            animate={{
                fill: fill as string,
                stroke: stroke as string
            }}
            transition={{
                duration: .3
            }}
            width="10"
            height="10"
            viewBox="0 0 12 12"
            strokeWidth="1"
            shapeRendering="geometricPrecision">
            <motion.circle
                cx="6"
                cy="6"
                r="5" />
        </motion.svg>
    </Container>
}
