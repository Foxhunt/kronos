import firebase from "../../firebase/clientApp"
import { motion, Variants } from "framer-motion"
import styled from "styled-components"

import TagList from "./TagList"
import { useAtom } from "jotai"
import { userDocRefAtom } from "../../store"

const Container = styled(motion.div)`
    position: absolute;
    width: 100%;
    height: 100%;

    /* display: flex;
    justify-content: center;
    align-items: center; */
`

type props = {
    fileDocSnap: firebase.firestore.DocumentSnapshot
}

export default function Overlay({ fileDocSnap }: props) {
    const [userDocRef] = useAtom(userDocRefAtom)
    const containerVariants: Variants = {
        hidden: {
            backgroundColor: "rgb(200 200 200 / 0)",
            backdropFilter: "blur(0px)",
            transition: {
                when: "aferChildren",
                duration: 0.4
            }
        },
        visible: {
            backgroundColor: "rgb(200 200 200 / 0.4)",
            backdropFilter: "blur(1px)",
            transition: {
                duration: .1,
                when: "beforeChildren"
            }
        }
    }

    const childVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    }

    return <Container
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={containerVariants}>
        <motion.div
            variants={childVariants}>
            favorite? <input
                type="checkbox"
                checked={fileDocSnap.get("favorite")}
                onChange={event => {
                    fileDocSnap.ref.update({
                        favorite: event.target.checked
                    })
                }} />
        </motion.div>
        <TagList
            items={fileDocSnap.get("tags")}
            onAdd={tagName => {
                const tagRef = userDocRef?.ref.collection("tags").doc(tagName)
                tagRef?.set({ name: tagName })
                fileDocSnap.ref.update({
                    tags: firebase.firestore.FieldValue.arrayUnion(tagName)
                })
            }}
            onRemove={item => {
                fileDocSnap.ref.update({
                    tags: firebase.firestore.FieldValue.arrayRemove(item)
                })
            }} />
    </Container>
}
