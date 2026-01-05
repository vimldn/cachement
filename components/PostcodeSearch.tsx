'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  placeholder?: string
  className?: string
}

export function PostcodeSearch({ placeholder, className = '' }: Props) {
  const [postcode, setPostcode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const cleaned = postcode.replace(/\s/g, '').toUpperCase()
    
    // Basic validation
    if (cleaned.length < 5 || cleaned.length > 8) {
      setError('Please enter a valid UK postcode')
      return
    }
    
    router.push(`/schools-near/${cleaned}`)
  }
  
  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={placeholder || 'Enter postcode, e.g. SW1A 1AA'}
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          className="flex-1 px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>
      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </form>
  )
}
