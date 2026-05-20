import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-black bg-white">
        <div className="container flex items-center justify-between py-4">
          <div className="text-2xl font-bold text-black">InterviewOS</div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 container py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-black">
            Conduct Better Interviews
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            A unified platform for scheduling, video interviews, collaborative coding, and evaluation. Simplify your hiring workflow.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Features Preview */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="p-6 bg-white rounded-lg border border-black shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2 text-black">Smart Scheduling</h3>
              <p className="text-gray-700">Calendar integration with timezone support and automated confirmations.</p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-black shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2 text-black">HD Video Rooms</h3>
              <p className="text-gray-700">Secure interview rooms with WebRTC video/audio and password protection.</p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-black shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2 text-black">Collaborative Code</h3>
              <p className="text-gray-700">Real-time code editor with multiple programming language support.</p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-black shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2 text-black">Live Chat</h3>
              <p className="text-gray-700">Real-time messaging and note-taking during interviews.</p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-black shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2 text-black">AI Summaries</h3>
              <p className="text-gray-700">Automated interview summaries and candidate evaluation reports.</p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-black shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2 text-black">Analytics</h3>
              <p className="text-gray-700">Track interview metrics and candidate performance analytics.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black bg-black text-white">
        <div className="container py-8">
          <div className="flex justify-between items-center">
            <div>&copy; 2024 InterviewOS. All rights reserved.</div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-gray-300">Privacy</Link>
              <Link href="#" className="hover:text-gray-300">Terms</Link>
              <Link href="#" className="hover:text-gray-300">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
