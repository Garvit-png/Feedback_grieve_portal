'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

function Page() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSignIn = () => {
        setLoading(true)
        fetch(`/api/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(res => res.json()).then(data => {
            if (data.success) {
                localStorage.setItem("token", data.token)
                router.push("/dashboard")
            } else {
                setLoading(false)
                setError(data.message)

            }
            setLoading(false)
        })
    }
    return (
        <div className='flex items-center justify-center h-screen w-screen'>
            {!loading ? (<div className='flex flex-col gap-4 items-center justify-center p-8 border rounded-2xl w-80'>
                <h1 className='text-2xl'>Login</h1>
                <div className='flex w-full'>
                    {error && <p className='text-red-500'>{error}</p>}
                </div>
                <div className='flex flex-col w-full'>
                    <label htmlFor="">Email:</label>
                    <input type="email" className='border py-2 px-4 rounded-md' value={email} onChange={(e) => {
                        if (!e.target.value.includes("@") || !e.target.value.includes(".")) {
                            setError("Invalid email")
                        } else {
                            setError("")
                        }
                        setEmail(e.target.value)
                    }} />
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex flex-row items-center justify-between'>
                        <label htmlFor="">Password:</label>
                        <p className='text-blue-500 underline cursor-pointer select-none' onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"} password</p>
                    </div>
                    <input type={showPassword ? "text" : "password"} className='border py-2 px-4 rounded-md' value={password} onChange={(e) => {
                        if (e.target.value.length < 8) {
                            setError("Password must be at least 8 characters")
                        } else {
                            setError("")
                        }
                        setPassword(e.target.value)
                    }} />
                </div>
                <button className='bg-white text-black rounded-lg w-full py-2 cursor-pointer' onClick={handleSignIn}>Login</button>
                <div className='flex w-full'>
                    <p className='text-align-left'>Forgot password ? <span className='text-blue-500 underline cursor-pointer'>Contact admin</span></p>
                </div>
            </div>) : <p>Loading...</p>}
        </div>
    )
}

export default Page
