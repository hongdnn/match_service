import express from 'express'
import { loader } from './loaders/index'
import { PORT } from './environment'

async function startServer() {
    const app = express()
    await loader({ expressApp: app })
    app.listen(PORT, () => console.log('Match service is ready'))
}

startServer()