'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewInterviewPage() {
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		candidateId: '',
		scheduledAt: '',
		duration: 60,
	})
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: name === 'duration' ? parseInt(value) : value,
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/interviews`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify({
					...formData,
					scheduledAt: new Date(formData.scheduledAt).toISOString(),
				}),
			})

			if (!response.ok) {
				throw new Error('Failed to create interview')
			}

			const interview = await response.json()
			toast.success('Interview scheduled successfully')
			router.push(`/dashboard`)
		} catch (error) {
			console.error('Error:', error)
			toast.error('Failed to schedule interview')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased relative overflow-x-hidden">
			{/* Ambient background glows */}
			<div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
			<div className="absolute bottom-[10%] left-[-80px] w-[300px] h-[300px] bg-violet-600/5 rounded-full blur-[110px] pointer-events-none" />

			{/* Top Glass Header */}
			<header className="bg-[#030712]/75 backdrop-blur-xl border-b border-slate-900/80 sticky top-0 z-50">
				<div className="max-w-xl mx-auto px-4 py-3.5 flex items-center justify-between">
					<Link
						href="/dashboard"
						className="text-[10px] text-slate-400 hover:text-blue-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
					>
						<ArrowLeft size={13} /> Back
					</Link>
					<span className="font-semibold text-slate-200 tracking-tight text-xs uppercase tracking-widest font-bold">
						Initialize Workspace
					</span>
					<div className="w-10"></div> {/* spacer */}
				</div>
			</header>

			{/* Main Centered Container */}
			<main className="max-w-xl mx-auto px-4 py-10 relative z-10">
				<Card className="bg-slate-950/45 border border-slate-900/80 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
					<CardContent className="p-6 space-y-6">
						<div className="text-center space-y-1">
							<h2 className="text-base font-bold text-white tracking-tight">
								Create assessment round
							</h2>
							<p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
								Access credentials will be generated dynamically
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Interview Title */}
							<div className="space-y-1.5">
								<label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
									Interview Title *
								</label>
								<Input
									type="text"
									name="title"
									placeholder="e.g., Senior Systems Engineer Round 1"
									value={formData.title}
									onChange={handleChange}
									required
									disabled={isLoading}
									className="text-xs bg-slate-900/60 border border-slate-800 focus:border-blue-500/70 hover:border-slate-750/80 rounded-xl px-3.5 py-2 transition-all focus:outline-none text-slate-200 font-medium placeholder:text-slate-650"
								/>
							</div>

							{/* Description */}
							<div className="space-y-1.5">
								<label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
									Assessment Description / Topics
								</label>
								<textarea
									name="description"
									placeholder="e.g., Algorithms focus, microservices design questions, backend load balancing..."
									value={formData.description}
									onChange={handleChange}
									disabled={isLoading}
									rows={3}
									className="w-full text-xs bg-slate-900/60 border border-slate-800 focus:border-blue-500/70 hover:border-slate-750/80 rounded-xl p-3 transition-all focus:outline-none text-slate-200 font-medium placeholder:text-slate-650 leading-relaxed"
								/>
							</div>

							{/* Candidate Email */}
							<div className="space-y-1.5">
								<label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
									Candidate Email *
								</label>
								<Input
									type="email"
									name="candidateId"
									placeholder="candidate@company.com"
									value={formData.candidateId}
									onChange={handleChange}
									required
									disabled={isLoading}
									className="text-xs bg-slate-900/60 border border-slate-800 focus:border-blue-500/70 hover:border-slate-750/80 rounded-xl px-3.5 py-2 transition-all focus:outline-none text-slate-200 font-medium placeholder:text-slate-650"
								/>
							</div>

							{/* Date & Time / Duration Grid */}
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
										Date & Time *
									</label>
									<Input
										type="datetime-local"
										name="scheduledAt"
										value={formData.scheduledAt}
										onChange={handleChange}
										required
										disabled={isLoading}
										className="text-xs bg-slate-900/60 border border-slate-800 focus:border-blue-500/70 hover:border-slate-750/80 rounded-xl px-3.5 py-2 transition-all focus:outline-none text-slate-200 font-medium"
									/>
								</div>

								<div className="space-y-1.5">
									<label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
										Duration (minutes)
									</label>
									<Input
										type="number"
										name="duration"
										value={formData.duration}
										onChange={handleChange}
										min="15"
										max="480"
										disabled={isLoading}
										className="text-xs bg-slate-900/60 border border-slate-800 focus:border-blue-500/70 hover:border-slate-750/80 rounded-xl px-3.5 py-2 transition-all focus:outline-none text-slate-200 font-bold"
									/>
								</div>
							</div>

							{/* Buttons Grid */}
							<div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-900 mt-6">
								<Link href="/dashboard" className="w-1/2 sm:w-auto">
									<Button
										type="button"
										variant="outline"
										className="w-full border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 rounded-full font-bold h-9 text-xs transition-colors"
									>
										Cancel
									</Button>
								</Link>
								<Button
									type="submit"
									disabled={isLoading}
									className="w-1/2 sm:w-auto bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-full h-9 text-xs shadow-lg shadow-blue-500/10 transition-colors"
								>
									{isLoading ? 'Creating Session...' : 'Create Workspace'}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</main>
		</div>
	)
}
