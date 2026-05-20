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
		<div className="min-h-screen flex items-center justify-center bg-[#030712] text-slate-100 font-sans antialiased relative overflow-hidden px-4 selection:bg-blue-600/30 selection:text-blue-200">
			{/* Ambient background glows */}
			<div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
			<div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />

			<Card className="w-full max-w-md bg-slate-950/45 border border-slate-900 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden relative z-10">
				<CardContent className="p-8 space-y-6">
					<div className="text-center space-y-1.5">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-extrabold text-white shadow-lg shadow-blue-500/20 text-base mx-auto mb-3">
							OS
						</div>
						<h2 className="text-xl font-bold text-white tracking-tight">Create Account</h2>
						<p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
							Register a recruiter assessor credentials
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Full Name */}
						<div className="space-y-1.5">
							<label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
								Full Name
							</label>
							<Input
								type="text"
								placeholder="John Doe"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								disabled={isLoading}
								className="text-xs bg-slate-900/60 border border-slate-800 focus:border-blue-500/70 hover:border-slate-750/80 rounded-xl px-3.5 py-2 transition-all focus:outline-none text-slate-200 font-medium placeholder:text-slate-650"
							/>
						</div>

						{/* Email Address */}
						<div className="space-y-1.5">
							<label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
								Email Address
							</label>
							<Input
								type="email"
								placeholder="recruiter@company.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={isLoading}
								className="text-xs bg-slate-900/60 border border-slate-800 focus:border-blue-500/70 hover:border-slate-750/80 rounded-xl px-3.5 py-2 transition-all focus:outline-none text-slate-200 font-medium placeholder:text-slate-650"
							/>
						</div>

						{/* Password */}
						<div className="space-y-1.5">
							<label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
								Password
							</label>
							<Input
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={isLoading}
								className="text-xs bg-slate-900/60 border border-slate-800 focus:border-blue-500/70 hover:border-slate-750/80 rounded-xl px-3.5 py-2 transition-all focus:outline-none text-slate-200 font-medium placeholder:text-slate-650"
							/>
						</div>

						{/* Confirm Password */}
						<div className="space-y-1.5">
							<label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
								Confirm Password
							</label>
							<Input
								type="password"
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								disabled={isLoading}
								className="text-xs bg-slate-900/60 border border-slate-800 focus:border-blue-500/70 hover:border-slate-750/80 rounded-xl px-3.5 py-2 transition-all focus:outline-none text-slate-200 font-medium placeholder:text-slate-650"
							/>
						</div>

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-full h-10 text-xs shadow-lg shadow-blue-500/10 transition-colors mt-2"
						>
							{isLoading ? 'Creating account...' : 'Create Account'}
						</Button>
					</form>

					<div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-900/65">
						Already have an account?{' '}
						<Link href="/login" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">
							Sign In
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
