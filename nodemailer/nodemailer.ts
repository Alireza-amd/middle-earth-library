import { serverEnv } from "@/data/env/server";
import nodemailer from "nodemailer"

export async function sendEmail({ to, code }: { to: string, code: string }) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: serverEnv.EMAIL_NAME,   // ایمیل شما
            pass: serverEnv.EMAIL_PASSWORD,   // رمز یا App Password
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject:"VerficationCode for Middle Earth Libary",
            text:`Your verfication code is ${code}`,
        });
        console.log("email sent succesfully");

    } catch (error) {
        console.log(error);

    }
}