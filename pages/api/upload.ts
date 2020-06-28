import fs, { promises as fsPromise } from "fs"
import { NextApiRequest, NextApiResponse, PageConfig } from "next"
import { IncomingForm, Fields, Files } from "formidable"

export const config: PageConfig = {
    api: {
        bodyParser: false
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const form = new IncomingForm()

    const { fields, files } = await new Promise<{ fields: Fields, files: Files }>((resolve, reject) => {
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
    await fsPromise.rename(files.file.path, `C:\\repos\\kronos\\upload\\${files.file.name}`)

    res.status(200).json({ fields, files })
}