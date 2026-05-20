'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { apiClient } from '@/lib/api'
import { Interview } from '@/lib/types'
import { Search, Plus, Key, ChevronRight, LogOut, ShieldAlert } from 'lucide-react'
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

export default function DashboardPage() {
	const router = useRouter()
	const { user, logout } = useAuthStore()
	const [interviews, setInterviews] = useState<Interview[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [joinRoomId, setJoinRoomId] = useState('')
	const [isJoining, setIsJoining] = useState(false)

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

	const handleLogout = async () => {
		try {
			await logout()
			toast.success('Logged out successfully')
			router.push('/')
		} catch (error) {
			toast.error('Logout failed')
		}
	}

	const handleJoinRoomDirect = (e: React.FormEvent) => {
		e.preventDefault()
		if (!joinRoomId.trim()) return
		setIsJoining(true)
		router.push(`/interview/${joinRoomId.trim()}`)
	}

	// Filter based on search query
	const filteredInterviews = interviews.filter((i) => {
		const query = searchQuery.toLowerCase()
		return (
			i.title.toLowerCase().includes(query) ||
			i.candidateId.toLowerCase().includes(query) ||
			(i.description && i.description.toLowerCase().includes(query))
		)
	})

	// Get unique candidates for the bubble view
	const candidatesMap = new Map<string, Interview>()
	interviews.forEach((i) => {
		if (!candidatesMap.has(i.candidateId)) {
			candidatesMap.set(i.candidateId, i)
		}
	})
	const uniqueCandidates = Array.from(candidatesMap.values())

	return (
		<div className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased relative overflow-x-hidden selection:bg-blue-600/30 selection:text-blue-200">
			{/* Ambient background glows */}
			<div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
			<div className="absolute top-[20%] left-[-100px] w-[350px] h-[350px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

			{/* Sticky Glassmorphic Header */}
			<header className="bg-[#030712]/75 backdrop-blur-xl border-b border-slate-900/80 sticky top-0 z-50">
				<div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-extrabold text-white shadow-lg shadow-blue-500/20 text-sm">
							OS
						</div>
						<span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight text-sm">
							InterviewOS
						</span>
					</div>

					{/* Center Search Bar */}
					<div className="flex-1 max-w-sm relative">
						<Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
						<input
							type="text"
							placeholder="Search candidates or sessions..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-800 focus:border-blue-500/70 hover:border-slate-700/80 rounded-full text-[11px] font-medium text-slate-200 transition-all focus:outline-none placeholder:text-slate-500 shadow-inner"
						/>
					</div>

					{/* Sign Out Action Button */}
					<button
						onClick={handleLogout}
						className="h-8 w-8 rounded-full border border-slate-800 bg-slate-900/40 hover:bg-rose-500/10 hover:border-rose-500/20 flex items-center justify-center text-slate-450 hover:text-rose-400 transition-all duration-200 shadow-sm"
						title="Sign Out"
					>
						<LogOut size={13} />
					</button>
				</div>
			</header>

			{/* Main Feed Container */}
			<main className="max-w-2xl mx-auto px-4 py-8 space-y-7 relative z-10">
				
				{/* Welcome & Metadata header */}
				<div className="text-center space-y-1">
					<h2 className="text-base font-bold text-white tracking-tight">
						Welcome, {user?.name || 'Recruiter'}
					</h2>
					<p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
						Workspace assessment control panel
					</p>
				</div>

				{/* Primary Quick Actions Grid */}
				<div className="grid grid-cols-2 gap-4">
					{/* Action: Schedule Round */}
					<Link href="/dashboard/interviews/new" className="block group">
						<Card className="bg-slate-900/20 border border-slate-900 hover:border-blue-500/30 hover:bg-slate-900/40 backdrop-blur-md cursor-pointer transition-all duration-300 h-full shadow-lg rounded-2xl overflow-hidden">
							<CardContent className="p-5 flex flex-col items-center justify-center text-center gap-3">
								<div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600/15 to-indigo-600/15 border border-blue-500/10 text-blue-400 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
									<Plus size={18} />
								</div>
								<div>
									<h3 className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">Schedule Interview</h3>
									<p className="text-[9px] text-slate-500 font-semibold mt-0.5">Initialize a secure coding workspace</p>
								</div>
							</CardContent>
						</Card>
					</Link>

					{/* Action: Direct Join */}
					<Card className="bg-slate-900/20 border border-slate-900 hover:border-blue-500/30 backdrop-blur-md transition-all duration-300 h-full shadow-lg rounded-2xl overflow-hidden">
						<CardContent className="p-5 flex flex-col items-center justify-center text-center gap-3">
							<div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600/15 to-teal-600/15 border border-emerald-500/10 text-emerald-400 flex items-center justify-center shadow-inner">
								<Key size={16} />
							</div>
							<form onSubmit={handleJoinRoomDirect} className="w-full flex flex-col items-center gap-2">
								<h3 className="text-xs font-bold text-slate-200">Join Workspace ID</h3>
								<div className="flex w-full gap-2 mt-0.5">
									<input
										type="text"
										placeholder="Enter ID"
										value={joinRoomId}
										onChange={(e) => setJoinRoomId(e.target.value)}
										disabled={isJoining}
										className="flex-1 px-3 py-1 bg-slate-900/60 border border-slate-800 focus:border-emerald-500/40 rounded-xl text-[10px] focus:outline-none text-slate-200 font-bold tracking-wide placeholder:text-slate-600 shadow-inner"
									/>
									<Button 
										type="submit" 
										disabled={isJoining || !joinRoomId}
										size="sm" 
										className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-6 text-[9px] px-3.5 rounded-xl transition-colors"
									>
										Join
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>

				{/* Candidates Bubbles Row (Google Pay style contacts) */}
				<div className="space-y-3">
					<h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
						Active Candidates
					</h3>
					<div className="flex items-center gap-4 overflow-x-auto py-2.5 px-1 scrollbar-none">
						{isLoading ? (
							<div className="flex gap-4">
								{[1, 2, 3].map((n) => (
									<div key={n} className="flex flex-col items-center gap-1.5 animate-pulse">
										<div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-850"></div>
										<div className="h-2 w-10 bg-slate-900 rounded"></div>
									</div>
								))}
							</div>
						) : uniqueCandidates.length === 0 ? (
							<div className="text-slate-650 text-[10px] font-semibold italic py-2 px-1 flex items-center gap-1.5">
								<ShieldAlert size={12} /> No candidate profiles registered yet.
							</div>
						) : (
							uniqueCandidates.map((c) => {
								const initial = c.candidateId.charAt(0).toUpperCase()
								const name = getDisplayName(c.candidateId)
								const gradientClass = getAvatarGradient(c.candidateId)
								return (
									<Link 
										key={c.id} 
										href={`/interview/${c.roomId}`} 
										className="flex flex-col items-center text-center gap-2 group shrink-0 relative"
									>
										<div className={`h-12 w-12 rounded-full bg-gradient-to-br flex items-center justify-center font-extrabold text-sm shadow-lg border border-white/5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/10 ${gradientClass}`}>
											{initial}
										</div>
										<span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors max-w-[65px] truncate">
											{name}
										</span>
									</Link>
								)
							})
						)}
					</div>
				</div>

				{/* Recent Activity List (Google Pay style transaction records) */}
				<div className="space-y-3">
					<h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
						Session Activity History
					</h3>
					<Card className="bg-slate-950/45 border border-slate-900 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
						<CardContent className="p-0 divide-y divide-slate-900/60">
							{isLoading ? (
								<div className="flex flex-col items-center justify-center py-16 gap-3 bg-slate-950/20">
									<div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-blue-500"></div>
									<span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Syncing dashboard data...</span>
								</div>
							) : filteredInterviews.length === 0 ? (
								<div className="text-center py-16 text-slate-600 text-xs italic bg-slate-950/25">
									{searchQuery ? 'No interviews match your search filter' : 'No interview sessions recorded'}
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
												{/* Small Circular Profile bubble */}
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

											{/* Right side transaction-style information */}
											<div className="flex items-center gap-3 text-right">
												<div>
													<span className="text-[10px] font-bold text-slate-300 block">
														{new Date(interview.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
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
												<ChevronRight size={13} className="text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
											</div>
										</Link>
									)
								})
							)}
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	)
}
