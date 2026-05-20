'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function SignupPage() {
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const { signup } = useAuthStore()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (password !== confirmPassword) {
			toast.error('Passwords do not match')
			return
		}

		setIsLoading(true)

		try {
			await signup(email, password, name)
			toast.success('Account created successfully')
			router.push('/dashboard')
		} catch (error: any) {
			toast.error(error.response?.data?.message || 'Signup failed')
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
							Register to create an account
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Full Name */}
						<div className="space-y-2">
							<label className="text-sm font-bold text-black block">
								Full Name
							</label>
							<Input
								type="text"
								placeholder="John Doe"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								disabled={isLoading}
								className="text-sm bg-white border border-black focus:border-black rounded-lg px-4 py-2 transition-all focus:outline-none text-black"
							/>
						</div>

						{/* Email Address */}
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

						{/* Confirm Password */}
						<div className="space-y-2">
							<label className="text-sm font-bold text-black block">
								Confirm Password
							</label>
							<Input
								type="password"
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
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
							{isLoading ? 'Creating account...' : 'Create Account'}
						</Button>
					</form>

					<div className="text-center text-sm text-gray-700 pt-2 border-t border-black">
						Already have an account?{' '}
						<Link href="/login" className="text-black font-bold hover:underline transition-colors">
							Sign In
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
