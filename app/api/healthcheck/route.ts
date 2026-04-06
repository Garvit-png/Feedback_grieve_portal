
const appName = process.env.APP_NAME

export async function GET(request: Request) {
    return Response.json({ 
        status: 200,
        message : `${appName || "mircroservice"} server is up and running!`,
        success : true
    })
}