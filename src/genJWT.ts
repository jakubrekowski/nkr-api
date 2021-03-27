import { sign } from 'jsonwebtoken'
import { config } from 'dotenv'
config()

async function genToken() {
  const token = sign({
    iat: Date.now(),
    username: 'req',
    id: 'k9eIEe25vBWBl3X5Emyu',
    exp: new Date().setHours(new Date().getHours() + 1)
  }, process.env.tokenSecret)

  console.log(token)
} 

genToken()