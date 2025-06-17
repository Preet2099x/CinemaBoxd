import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const signupController = async (req,res) => {
    try {
        const {username,email,password} = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required!'
            })
        }

        if (password.length < 8 || !/\d/.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'password must be at least 8 characters long and include a number'
            })
        }

        const existingUser = await prisma.user.findUnique({
            where: {email}
        })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'email already registered'
            })
        }

        const existingUsername = await prisma.user.findFirst({
            where: { username }
        })


        if(existingUsername) {
            return res.status(409).json({
                success: false,
                message: 'username already taken'
            })
        }

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password
            }
        })

        return res.status(201).json({
            success: true,
            message: 'user created successfully!',
            userid: newUser.id
        })
    }
    catch(error){
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'error in signup',
            error: error.message
        })
    }
}

export default signupController