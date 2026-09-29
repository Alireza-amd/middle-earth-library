import { redisClient } from "@/redis/redis"
import crypto from "crypto"
import { cookies } from "next/headers"
import z from "zod"

const VERFICATION_CODE_EXIPRATION_IN_SECONDS = 2 * 60
const VERFICATION_CODE_KEY_COOKIES = "verfication_code"

const verficationCodeSchema = z.string().min(6).max(6)

export async function syncVerficationCode(verficationCode: string) {
    const verficationCodeId = crypto.randomBytes(64).toString("hex").normalize()
    await redisClient.set(`verficationCode:${verficationCodeId}`,
        verficationCode, { ex: VERFICATION_CODE_EXIPRATION_IN_SECONDS })

    await setVerficationCodeCookies(verficationCodeId)
}

export function generateVerficationCode() {
    return crypto.randomBytes(6)
        .toString('base64') // or 'hex'
        .replace(/[^a-zA-Z0-9]/g, '') // remove non-alphanumeric
        .substring(0, 6);
}


async function setVerficationCodeCookies(codeId: string) {
    const clientCookies = await cookies()
    clientCookies.set(VERFICATION_CODE_KEY_COOKIES, codeId, {
        expires: Date.now() + VERFICATION_CODE_EXIPRATION_IN_SECONDS * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: true,
    })
}

export async function getVerficationCodeFromDB() {
    const verficationCodeId=await getVerficationCodeId()
    const rawCode = await redisClient.get(`verficationCode:${verficationCodeId}`)

    const { data, success } = verficationCodeSchema.safeParse(rawCode)

    if (!success) throw new Error("Failed to get verfication code.")

    return data
}

async function getVerficationCodeId() {
    const clientCookies = await cookies()

    const codeIdInCookies = clientCookies.get(VERFICATION_CODE_KEY_COOKIES)?.value

    if (codeIdInCookies == null) throw new Error("There is no code in cookies")

    return codeIdInCookies
}

export async function deleteVerficationCode() {
    const verficationCodeId=await getVerficationCodeId()

    await redisClient.del(`verficationCode:${verficationCodeId}`)
    await deleteCodeFromCookie()
}

async function deleteCodeFromCookie(){
    const clientCookies=await cookies()

    clientCookies.delete(VERFICATION_CODE_KEY_COOKIES)
}