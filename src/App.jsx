// import { useState } from 'react'
import './styles/tailwind.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-8 bg-white shadow-xl rounded-2xl border border-blue-200">
        <h1 className="text-3xl font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
          Tailwind is Working!
        </h1>
        <p className="mt-4 text-gray-600">
          Start building your RMS Frontend.
        </p>
        <button className="mt-6 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
          Click Me
        </button>
      </div>
    </div>
  )
}

export default App
