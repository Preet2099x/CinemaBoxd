import express from 'express'

const app = express()
const PORT = 8000
app.get('/' , (req,res) => {
    res.send('CinemaBoxd backend is running!')
})

app.listen(PORT | 8000 , () => {
    console.log(`Server is running at PORT:${PORT}`)
})