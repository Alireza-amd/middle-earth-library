import crypto from "crypto"

export function generateRandomBytes(length:number) {
    return crypto.randomBytes(length).toString("hex").normalize()
}

export async function hashPssword(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password.normalize(), salt, 64, (error, hashedPassword) => {
            if (error) reject(error)

            resolve(hashedPassword.toString("hex").normalize())
        })
    })
}

export async function comparePassword({hashedPassword,password,salt}:{salt: string, password: string, hashedPassword: string}) {
    const inputHashedPassword = await hashPssword(password, salt)

    return crypto.timingSafeEqual(
        Buffer.from(inputHashedPassword, "hex"),
        Buffer.from(hashedPassword, "hex")
    )
}