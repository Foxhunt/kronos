import fs, { promises as fsPromise } from "fs"
import { NextApiRequest, NextApiResponse, PageConfig } from "next"
import { IncomingForm, Fields, Files } from "formidable"

export const config: PageConfig = {
    api: {
        bodyParser: false
    }
}

type Form = { fields: Fields, files: Files }

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const form = new IncomingForm()

    const parsedForm = await new Promise<Form>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err)
            }
            resolve({ fields, files })
        })
    }).catch(console.error)

    if (!fs.existsSync("C:\\repos\\kronos\\upload")) {
        await fsPromise.mkdir("C:\\repos\\kronos\\upload")
    }

    if (parsedForm) {

        const { files, fields } = parsedForm

        await fsPromise.rename(parsedForm.files.file.path, `C:\\repos\\kronos\\upload\\${files.file.name}`)

        res.status(200).json({ fields, files })

    }
}