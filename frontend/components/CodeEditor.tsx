'use client'

import React from 'react'
import Editor from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { Play, Settings, FileText, Lock, ClipboardList } from 'lucide-react'

interface CodeEditorProps {
	code: string
	language: string
	onChange: (value: string) => void
	onLanguageChange: (lang: string) => void
	isReadOnly?: boolean
	onRunCode?: () => void
	isExecuting?: boolean
	candidateName?: string
	isInterviewer?: boolean
	onOpenEvaluation?: () => void
}

const SUPPORTED_LANGUAGES = [
	{ label: 'JavaScript (Node)', value: 'javascript' },
	{ label: 'Python (3.10)', value: 'python' },
	{ label: 'Go (1.21)', value: 'go' },
	{ label: 'Java (OpenJDK)', value: 'java' },
	{ label: 'C++ (GCC)', value: 'cpp' },
]

export function CodeEditor({
	code,
	language,
	onChange,
	onLanguageChange,
	isReadOnly = false,
	onRunCode,
	isExecuting = false,
	candidateName = 'Candidate',
	isInterviewer = false,
	onOpenEvaluation,
}: CodeEditorProps) {

	const handleEditorChange = (value: string | undefined) => {
		if (value !== undefined) {
			onChange(value)
		}
	}

	return (
		<div className="flex flex-col h-full bg-[#1e1e1e] text-white overflow-hidden border border-[#2d2d2d] rounded-lg">
			{/* IDE Header Bar (CoderPad Style) */}
			<div className="flex items-center justify-between px-4 py-2 bg-[#141414] border-b border-[#2d2d2d]">
				<span className="text-xs font-bold text-slate-200">
					Interview with {candidateName}
				</span>

				<div className="flex items-center gap-2">
					<button
						type="button"
						className="flex items-center gap-1.5 bg-[#252526] hover:bg-[#2d2d2e] border border-[#3c3c3c] text-slate-300 text-[10px] font-bold px-3 py-1 rounded transition-colors"
					>
						<FileText size={11} />
						Snippets
					</button>
					<button
						type="button"
						className="flex items-center gap-1.5 bg-[#252526] hover:bg-[#2d2d2e] border border-[#3c3c3c] text-slate-300 text-[10px] font-bold px-3 py-1 rounded transition-colors"
					>
						<Lock size={11} />
						Pad Privacy
					</button>

					{/* Private Evaluation notes trigger for Interviewer */}
					{isInterviewer && onOpenEvaluation && (
						<button
							onClick={onOpenEvaluation}
							type="button"
							className="flex items-center gap-1.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/25 text-blue-400 text-[10px] font-bold px-3 py-1 rounded transition-colors"
							title="Interviewer Private Assessment Notes"
						>
							<ClipboardList size={11} />
							Evaluation
						</button>
					)}
				</div>
			</div>

			{/* Monaco Editor Canvas */}
			<div className="flex-1 min-h-0 relative bg-[#1e1e1e]">
				<Editor
					height="100%"
					language={language}
					value={code}
					theme="vs-dark"
					onChange={handleEditorChange}
					options={{
						readOnly: isReadOnly,
						minimap: { enabled: false },
						fontSize: 14,
						fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
						tabSize: 2,
						automaticLayout: true,
						wordWrap: 'on',
						lineNumbers: 'on',
						scrollbar: {
							vertical: 'visible',
							horizontal: 'visible',
							verticalScrollbarSize: 8,
							horizontalScrollbarSize: 8,
						},
						padding: { top: 12, bottom: 12 },
					}}
					loading={
						<div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e]">
							<div className="flex flex-col items-center gap-3">
								<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
								<span className="text-xs text-slate-500">Initializing editor...</span>
							</div>
						</div>
					}
				/>
			</div>

			{/* IDE Footer Bar (CoderPad Style) */}
			<div className="flex items-center justify-between px-4 py-2 bg-[#141414] border-t border-[#2d2d2d]">
				{/* Green Play Run Button */}
				{onRunCode && (
					<Button
						onClick={onRunCode}
						disabled={isExecuting}
						size="sm"
						className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold px-5 h-9 rounded flex items-center justify-center gap-2 border-none shadow-none text-xs"
					>
						<Play size={13} fill="currentColor" className={isExecuting ? 'animate-pulse' : ''} />
						{isExecuting ? 'Running...' : 'Run'}
					</Button>
				)}

				<div className="flex items-center gap-2">
					{/* Language Select Dropdown */}
					<div className="bg-[#252526] border border-[#3c3c3c] px-3 py-1.5 rounded flex items-center">
						<select
							value={language}
							onChange={(e) => onLanguageChange(e.target.value)}
							disabled={isReadOnly}
							className="bg-transparent text-xs text-slate-200 font-bold focus:outline-none cursor-pointer pr-1"
						>
							{SUPPORTED_LANGUAGES.map((lang) => (
								<option key={lang.value} value={lang.value} className="bg-[#1e1e1e] text-slate-250">
									{lang.label}
								</option>
							))}
						</select>
					</div>

					{/* Settings Gear Button */}
					<button
						type="button"
						className="p-2 bg-[#252526] hover:bg-[#2d2d2e] border border-[#3c3c3c] rounded text-slate-350 hover:text-slate-100 transition-colors"
						title="Editor Settings"
					>
						<Settings size={14} />
					</button>
				</div>
			</div>
		</div>
	)
}
