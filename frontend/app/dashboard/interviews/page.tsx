'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { apiClient } from '@/lib/api'
import { Interview } from '@/lib/types'
import { ArrowLeft, Plus, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

// Helper to generate a consistent premium gradient based on string
const getAvatarGradient = (str: string) => {
	const gradients = [
		'from-blue-500 to-indigo-500 text-white shadow-blue-500/15',
		'from-purple-500 to-pink-500 text-white shadow-purple-500/15',
		'from-emerald-400 to-teal-500 text-white shadow-emerald-500/15',
		'from-amber-400 to-orange-500 text-white shadow-amber-500/15',
		'from-violet-500 to-fuchsia-500 text-white shadow-violet-500/15',
		'from-cyan-400 to-blue-500 text-white shadow-cyan-500/15',
	]
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}
	return gradients[Math.abs(hash) % gradients.length]
}

// Get candidate display name
const getDisplayName = (email: string) => {
	const parts = email.split('@')[0]
	return parts.charAt(0).toUpperCase() + parts.slice(1)
}

export default function InterviewsListPage() {
	const router = useRouter()
	const [interviews, setInterviews] = useState<Interview[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all')

	useEffect(() => {
		const fetchInterviews = async () => {
			try {
				const data = await apiClient.getInterviews()
				setInterviews(data || [])
			} catch (err) {
				console.error('Failed to fetch interviews:', err)
				toast.error('Failed to load interviews')
			} finally {
				setIsLoading(false)
			}
		}
		fetchInterviews()
	}, [])

	const filteredInterviews = interviews.filter((i) => {
		if (filter === 'upcoming') return i.status === 'scheduled' || i.status === 'in-progress'
		if (filter === 'completed') return i.status === 'completed'
		return true
	})

	return (
		<div className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased relative overflow-x-hidden">
			{/* Ambient background glows */}
			<div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
			<div className="absolute bottom-[20%] left-[-100px] w-[300px] h-[300px] bg-violet-600/5 rounded-full blur-[110px] pointer-events-none" />

			{/* Top Glass Header */}
			<header className="bg-[#030712]/75 backdrop-blur-xl border-b border-slate-900/80 sticky top-0 z-50">
				<div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
					<Link
						href="/dashboard"
						className="text-[10px] text-slate-400 hover:text-blue-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
					>
						<ArrowLeft size={13} /> Back
					</Link>
					<span className="font-semibold text-slate-200 tracking-tight text-xs uppercase tracking-widest font-bold">
						Session Logs
					</span>
					<Link href="/dashboard/interviews/new">
						<Button className="bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-[10px] font-bold h-7 px-4 rounded-full flex items-center gap-1 shadow-md shadow-blue-500/15 transition-colors">
							<Plus size={11} /> Schedule
						</Button>
					</Link>
				</div>
			</header>

			{/* Main Feed Container */}
			<main className="max-w-2xl mx-auto px-4 py-8 space-y-5 relative z-10">
				{/* Tab Filters (GPay Sub-tabs style with premium dark tags) */}
				<div className="flex bg-slate-950/70 border border-slate-900 p-0.5 rounded-full w-fit gap-0.5 shadow-inner">
					{(['all', 'upcoming', 'completed'] as const).map((tab) => (
						<button
							key={tab}
							onClick={() => setFilter(tab)}
							className={`py-1 px-4 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-250 ${
								filter === tab
									? 'bg-slate-900 text-blue-450 border border-slate-800/80 shadow-sm'
									: 'text-slate-500 hover:text-slate-350'
							}`}
						>
							{tab}
						</button>
					))}
				</div>

				{/* History Feed List */}
				<Card className="bg-slate-950/45 border border-slate-900/80 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
					<CardContent className="p-0 divide-y divide-slate-900/60">
						{isLoading ? (
							<div className="flex flex-col items-center justify-center py-16 gap-3 bg-slate-950/20">
								<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
								<span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Syncing session history...</span>
							</div>
						) : filteredInterviews.length === 0 ? (
							<div className="text-center py-16 text-slate-650 text-xs italic bg-slate-950/25">
								No sessions match this filter.
							</div>
						) : (
							filteredInterviews.map((interview) => {
								const name = getDisplayName(interview.candidateId)
								const initial = interview.candidateId.charAt(0).toUpperCase()
								const gradientClass = getAvatarGradient(interview.candidateId)

								return (
									<Link
										key={interview.id}
										href={`/interview/${interview.roomId}`}
										className="flex items-center justify-between p-4 hover:bg-slate-900/25 transition-all duration-200 group"
									>
										<div className="flex items-center gap-3.5">
											{/* Avatar bubble */}
											<div className={`h-9 w-9 rounded-xl bg-gradient-to-br flex items-center justify-center font-extrabold text-[11px] border border-white/5 shrink-0 ${gradientClass}`}>
												{initial}
											</div>
											<div>
												<h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors leading-tight">
													{interview.title}
												</h4>
												<p className="text-[9px] text-slate-500 font-semibold mt-0.5">
													Candidate: <span className="font-bold text-slate-400">{name}</span>
												</p>
											</div>
										</div>

										{/* Right side information */}
										<div className="flex items-center gap-3 text-right">
											<div>
												<span className="text-[10px] font-bold text-slate-300 block">
													{new Date(interview.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
												</span>
												<span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5 inline-block ${
													interview.status === 'scheduled'
														? 'bg-blue-500/10 text-blue-400 border border-blue-500/10'
														: interview.status === 'in-progress'
														? 'bg-amber-500/10 text-amber-400 border border-amber-500/10 animate-pulse'
														: 'bg-slate-900/60 text-slate-500 border border-slate-800'
												}`}>
													{interview.status}
												</span>
											</div>
											<ChevronRight size={13} className="text-slate-650 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
										</div>
									</Link>
								)
							})
						)}
					</CardContent>
				</Card>
			</main>
		</div>
	)
}
