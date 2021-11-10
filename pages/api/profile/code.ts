import { NextApiRequest, NextApiResponse } from "next";
import { profiles } from "@lib/mock/profile";
import { COOKIE_PROFILE, createCookie } from "@lib/cookie";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Common.ApiResponse>
) {
    const { uid, code } = req.body;

    const profile = profiles[uid];

    if (!uid || !code || !profile) {
        return res.status(500).json({
            date: Date.now(),
            message: "Invalid request.",
            status: 500,
        });
    }

    if (!!profile.password && code !== profile.password) {
        return res.status(400).json({
            date: Date.now(),
            message: "Oops, wrong code. Please try again.",
            status: 400,
        });
    }

    res.setHeader("Set-Cookie", createCookie(COOKIE_PROFILE, uid, { maxAge: 60 * 60 * 24 })); // 24 hours
    res.status(200).json({ date: Date.now(), message: "Success.", status: 200 });
}
