import prisma from "@/lib/dbInstance"
import crypto from 'crypto'
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params
    const token = crypto.randomBytes(32).toString('hex')
    const hashid = crypto.createHash('sha256').update(token).digest('hex')

    try {
        const app = await prisma.app.update({
            where: {
                id: id
            },
            data: {
                hashid: hashid
            }
        })
        if (!app) {
            return Response.json({
                data: null,
                message: "App not found",
                success: false
            }, {
                status: 404
            })
        }
        return Response.json({
            data: app,
            message: "App Regenerated Successfully!",
            success: true,
            token
        }, {
            status: 200
        })
    } catch (error) {
        return Response.json({
            data: null,
            message: "Something went wrong!",
            success: false,
            errorMessage: error
        }, {
            status: 500
        })
    }
}