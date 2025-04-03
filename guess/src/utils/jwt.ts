import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export function jwtGeneration(userName: string) {
    const token = jwt.sign({ userName: userName }, process.env.JWT_SECRET_KEY)
    return token
}