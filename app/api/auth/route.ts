import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (email === process.env.USERNAME && password === process.env.PASSWORD) {
            // Generate a dummy token or use a real one if needed. 
            // For now, just returning success as per plan.
            const token = "dummy-token-" + Date.now();
            return NextResponse.json({
                success: true,
                message: "Login successful",
                token: token
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
}
