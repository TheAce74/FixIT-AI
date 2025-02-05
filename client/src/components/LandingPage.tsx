import type React from "react"
import { Link } from "react-router-dom"

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to FixIT AI</h1>
      <p className="text-xl mb-8 text-center">Your AI-powered troubleshooting assistant for computer issues</p>
      <Link
        to="/symptoms"
        className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors"
      >
        Start Troubleshooting
      </Link>
    </div>
  )
}

export default LandingPage

