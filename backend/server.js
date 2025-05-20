import express from 'express'
import mongoose from 'mongoose'
import path, { join } from 'path'
import url from 'url'
import multer from 'multer'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import connection from './connection.js'
import legal_router from './routes/legal.routes.js'


dotenv.config()
const app = express()
const port = 3000
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({ extended: true }))
app.use("/images",express.static(path.join(__dirname,'images')))

app.use("/api",legal_router)

connection().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
}).catch((err) => {
  console.error('Failed to start server due to DB error:', err)
})