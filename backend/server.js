import express from 'express'
import loginRoutes from './routes/loginRoutes.js'
import signupRoutes from './routes/signupRoutes.js'

const app = express()
const PORT = 8000

app.use(express.json())

app.get('/' , (req,res) => {
    res.send('CinemaBoxd backend is running!')
})

app.use('/api',loginRoutes)
app.use('/api',signupRoutes)

app.listen(PORT | 8000 , () => {
    console.log(`Server is running at PORT:${PORT}`)
})