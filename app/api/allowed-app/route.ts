import prisma from "@/lib/dbInstance";
import crypto from "crypto"

export async function GET() {
    try {
        const apps = await prisma.app.findMany()
        return Response.json({
            data: apps,
            message: "Apps fetched Successfully!",
            success: true
        },{
             status: 200
        })
    } catch (error) {
        console.log(error)
        return Response.json({
            data: null,
            message: "Something went wrong!",
            success: false,
            errorMessage: error
        },{
             status: 500
        })
    }
}

export async function POST(request: Request) {
    const body = await request.json()
    const name = body?.name
    const desc = body?.desc
    if (!name) {
        return Response.json({
            message: "Name is required!",
            success: false
        }, {
            status: 400
        })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const hashid = crypto.createHash('sha256').update(token).digest('hex')

    try {
        const app = await prisma.app.create({
            data: {
                name: name,
                description: desc,
                hashid: hashid
            }
        })
        return Response.json({
            data: app,
            message: "App created Successfully!",
            success: true,
            token
        },{
              status: 200
        })
    } catch (error) {
        console.log(error)
        return Response.json({
            data: null,
            message: "Something went wrong!",
            success: false,
            errorMessage: error
        },{
            status: 500
        })
    }

}

export async function PATCH(request: Request) {
    const body = await request.json()
    const id = body?.id
    const name = body?.name
    const desc = body?.desc
    if (!id) {
        return Response.json({
            message: "Id is required",
            success: false
        },{
            status: 400
        })
    }
    try {
        const app = await prisma.app.update({
            where: {
                id: id
            },
            data: {
                name: name,
                description: desc
            }
        })
        if (!app) {
            return Response.json({
                data: null,
                message: "App not found",
                success: false
            },{
                status: 404
            })
        }
        return Response.json({
            data: app,
            message: "App updated Successfully!",
            success: true
        },{
            status: 200
        })
    } catch (error) {
        console.log(error)
        return Response.json({
            data: null,
            message: "Something went wrong",
            success: false,
            errorMessage: error
        },{
            status: 500
        })
    }
}

export async function DELETE(request: Request) {
    const body = await request.json()
    const id = body?.id
    if (!id) {
        return Response.json({
            message: "Id is required",
            success: false
        },{
            status: 400
        })
    }
    try {
        const app = await prisma.app.delete({
            where: {
                id: id
            }
        })

        if (!app) {
            return Response.json({
                data: null,
                message: "App not found",
                success: false
            },{
                status: 404
            })
        }

        return Response.json({
            data: app,
            message: "App deleted Successfully!",
            success: true
        },{
            status: 200
        })
    } catch (error) {
        console.log(error)
        return Response.json({
            data: null,
            message: "Something went wrong",
            success: false,
            errorMessage: error
        },{
            status: 500
        })
    }
}

