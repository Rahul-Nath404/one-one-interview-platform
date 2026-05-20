'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const { login } = useAuthStore()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			await login(email, password)
			toast.success('Logged in successfully')
			router.push('/dashboard')
		} catch (error: any) {
			toast.error(error.response?.data?.message || 'Login failed')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-white text-black font-sans antialiased px-4">
			<Card className="w-full max-w-md bg-white border border-black shadow-lg rounded-lg">
				<CardContent className="p-8 space-y-6">
					<div className="text-center space-y-2">
						<h2 className="text-2xl font-bold text-black">InterviewOS</h2>
						<p className="text-sm text-gray-700">
							Log in to access your interview dashboard
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Email */}
						<div className="space-y-2">
							<label className="text-sm font-bold text-black block">
								Email Address
							</label>
							<Input
								type="email"
								placeholder="recruiter@company.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={isLoading}
								className="text-sm bg-white border border-black focus:border-black rounded-lg px-4 py-2 transition-all focus:outline-none text-black"
							/>
						</div>

						{/* Password */}
						<div className="space-y-2">
							<label className="text-sm font-bold text-black block">
								Password
							</label>
							<Input
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={isLoading}
								className="text-sm bg-white border border-black focus:border-black rounded-lg px-4 py-2 transition-all focus:outline-none text-black"
							/>
						</div>

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full bg-black text-white font-bold rounded-lg h-10 text-sm transition-colors mt-4"
						>
							{isLoading ? 'Logging in...' : 'Sign In'}
						</Button>
					</form>

					<div className="text-center text-sm text-gray-700 pt-2 border-t border-black">
						Don't have an account?{' '}
						<Link href="/signup" className="text-black font-bold hover:underline transition-colors">
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
