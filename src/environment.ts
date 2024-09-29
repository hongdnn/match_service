import * as dotenv from 'dotenv'

dotenv.config({ path: `.env` })

const mongoUrl = process.env.MONGO_URL
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000


export {
    mongoUrl, PORT
}


