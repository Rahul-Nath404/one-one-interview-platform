'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { apiClient } from '@/lib/api'
import { Interview } from '@/lib/types'
import { Plus, Key, ChevronRight, LogOut, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'

// Helper to generate a consistent avatar style based on string
const getAvatarStyle = (str: string) => {
	const styles = ['bg-black text-white', 'bg-gray-800 text-white', 'bg-gray-700 text-white']
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}
	return styles[Math.abs(hash) % styles.length]
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
		<div className="min-h-screen bg-white text-black font-sans antialiased">
			{/* Header */}
			<header className="bg-white border-b border-black sticky top-0 z-50">
				<div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white font-bold text-sm">
							I
						</div>
						<span className="font-bold text-black text-sm">
							InterviewOS
						</span>
					</div>

					{/* Center Search Bar */}
					<div className="flex-1 max-w-sm relative">
						<input
							type="text"
							placeholder="Search candidates or sessions..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-3 pr-4 py-2 bg-white border border-black focus:border-black rounded-lg text-sm font-medium text-black transition-all focus:outline-none placeholder:text-gray-500"
						/>
					</div>

					{/* Sign Out Action Button */}
					<button
						onClick={handleLogout}
						className="h-8 w-8 rounded-lg border border-black bg-white hover:bg-black hover:text-white flex items-center justify-center text-black transition-all duration-200"
						title="Sign Out"
					>
						<LogOut size={16} />
					</button>
				</div>
			</header>

			{/* Main Feed Container */}
			<main className="max-w-2xl mx-auto px-4 py-8 space-y-7">
				
				{/* Welcome header */}
				<div className="text-center space-y-1">
					<h2 className="text-xl font-bold text-black">
						Welcome, {user?.name || 'Recruiter'}
					</h2>
					<p className="text-sm text-gray-600">
						Dashboard
					</p>
				</div>

				{/* Primary Quick Actions Grid */}
				<div className="grid grid-cols-2 gap-4">
					{/* Action: Schedule Round */}
					<Link href="/dashboard/interviews/new" className="block group">
						<Card className="bg-white border border-black hover:bg-gray-50 cursor-pointer transition-all duration-300 h-full rounded-lg">
							<CardContent className="p-5 flex flex-col items-center justify-center text-center gap-3">
								<div className="h-10 w-10 rounded-lg bg-black text-white flex items-center justify-center group-hover:scale-105 transition-transform">
									<Plus size={18} />
								</div>
								<div>
									<h3 className="text-sm font-bold text-black group-hover:text-gray-700 transition-colors">Schedule Interview</h3>
									<p className="text-xs text-gray-600 font-medium mt-0.5">Create new session</p>
								</div>
							</CardContent>
						</Card>
					</Link>

					{/* Action: Direct Join */}
					<Card className="bg-white border border-black hover:bg-gray-50 transition-all duration-300 h-full rounded-lg">
						<CardContent className="p-5 flex flex-col items-center justify-center text-center gap-3">
							<div className="h-10 w-10 rounded-lg bg-black text-white flex items-center justify-center">
								<Key size={18} />
							</div>
							<form onSubmit={handleJoinRoomDirect} className="w-full flex flex-col items-center gap-2">
								<h3 className="text-sm font-bold text-black">Join Session</h3>
								<div className="flex w-full gap-2 mt-0.5">
									<input
										type="text"
										placeholder="Enter ID"
										value={joinRoomId}
										onChange={(e) => setJoinRoomId(e.target.value)}
										disabled={isJoining}
										className="flex-1 px-3 py-1 bg-white border border-black rounded-lg text-xs focus:outline-none text-black font-bold placeholder:text-gray-500"
									/>
									<Button 
										type="submit" 
										disabled={isJoining || !joinRoomId}
										size="sm" 
										className="bg-black hover:bg-gray-900 text-white font-bold h-6 text-xs px-3 rounded-lg transition-colors"
									>
										Join
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>

				{/* Candidates Bubbles Row */}
				<div className="space-y-3">
					<h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 px-1">
						Active Candidates
					</h3>
					<div className="flex items-center gap-4 overflow-x-auto py-2.5 px-1">
						{isLoading ? (
							<div className="flex gap-4">
								{[1, 2, 3].map((n) => (
									<div key={n} className="flex flex-col items-center gap-1.5 animate-pulse">
										<div className="h-12 w-12 rounded-lg bg-gray-300 border border-black"></div>
										<div className="h-2 w-10 bg-gray-300 rounded"></div>
									</div>
								))}
							</div>
						) : uniqueCandidates.length === 0 ? (
							<div className="text-gray-600 text-xs font-semibold italic py-2 px-1 flex items-center gap-1.5">
								<ShieldAlert size={12} /> No candidate profiles yet.
							</div>
						) : (
							uniqueCandidates.map((c) => {
								const initial = c.candidateId.charAt(0).toUpperCase()
								const name = getDisplayName(c.candidateId)
								const avatarStyle = getAvatarStyle(c.candidateId)
								return (
									<Link 
										key={c.id} 
										href={`/interview/${c.roomId}`} 
										className="flex flex-col items-center text-center gap-2 group shrink-0"
									>
										<div className={`h-12 w-12 rounded-lg flex items-center justify-center font-bold text-sm border border-black transition-all duration-300 group-hover:scale-105 ${avatarStyle}`}>
											{initial}
										</div>
										<span className="text-xs font-bold text-gray-600 group-hover:text-black transition-colors max-w-[65px] truncate">
											{name}
										</span>
									</Link>
								)
							})
						)}
					</div>
				</div>

				{/* Recent Activity List */}
				<div className="space-y-3">
					<h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 px-1">
						Session Activity
					</h3>
					<Card className="bg-white border border-black rounded-lg overflow-hidden">
						<CardContent className="p-0 divide-y divide-black">
							{isLoading ? (
								<div className="flex flex-col items-center justify-center py-16 gap-3 bg-gray-50">
									<div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-black"></div>
									<span className="text-xs text-gray-600 font-bold uppercase tracking-wider">Loading...</span>
								</div>
							) : filteredInterviews.length === 0 ? (
								<div className="text-center py-16 text-gray-600 text-xs italic bg-gray-50">
									{searchQuery ? 'No interviews match your search' : 'No interview sessions recorded'}
								</div>
							) : (
								filteredInterviews.map((interview) => {
									const name = getDisplayName(interview.candidateId)
									const initial = interview.candidateId.charAt(0).toUpperCase()
									const avatarStyle = getAvatarStyle(interview.candidateId)

									return (
										<Link
											key={interview.id}
											href={`/interview/${interview.roomId}`}
											className="flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-200 group"
										>
											<div className="flex items-center gap-3">
												<div className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs border border-black shrink-0 ${avatarStyle}`}>
													{initial}
												</div>
												<div>
													<h4 className="text-sm font-bold text-black group-hover:text-gray-700 transition-colors">
														{interview.title}
													</h4>
													<p className="text-xs text-gray-600 font-medium mt-0.5">
														{name}
													</p>
												</div>
											</div>

											<div className="flex items-center gap-3 text-right">
												<div>
													<span className="text-xs font-bold text-black block">
														{new Date(interview.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
													</span>
													<span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg mt-0.5 inline-block border ${
														interview.status === 'scheduled'
															? 'bg-white text-black border-black'
															: interview.status === 'in-progress'
															? 'bg-gray-800 text-white border-black animate-pulse'
															: 'bg-gray-100 text-gray-700 border-black'
													}`}>
														{interview.status}
													</span>
												</div>
												<ChevronRight size={16} className="text-gray-600 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
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
