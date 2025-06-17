import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()


const loginController = async (req,res) => {
    try{
        const {email,password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'all fields are required!'
            })
        }

        const user = await prisma.user.findUnique({
            where: {email}
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            })
        }

        if (user.password != password) {
            return res.status(401).json({
                success: false,
                message: "password is not correct"
            })
        }

        return res.status(200).json({
            success: true,
            message: 'login successful',
            userid: user.id
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'login failed due to server error',
            error: error.message
        })
    }
}

export default loginController