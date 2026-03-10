'use client'

import Link from 'next/link'
import { Search, Menu, Home, Calendar } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function Navbar() {
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setIsSearchOpen(false)
        }
    }

    return (
        <nav className="fixed top-0 w-full z-50 bg-primary shadow-lg h-16 md:h-20 flex items-center">
            <div className="max-w-6xl mx-auto px-4 w-full flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                    <button className="hover:bg-black/10 p-2 rounded-md transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                    <Link href="/" className="hover:bg-black/10 p-2 rounded-md transition-colors">
                        <Home className="w-6 h-6" />
                    </Link>
                </div>

                <div className="flex flex-col items-center flex-1">
                    <Link href="/" className="flex flex-col items-center">
                        <h1 className="text-lg md:text-xl font-bold tracking-tight leading-tight text-center text-primary">
                            AsilMedia.NET
                        </h1>
                        <span className="text-[10px] md:text-xs opacity-80 font-medium">barchasi faqat bizda!</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <button className="hover:bg-black/10 p-2 rounded-md transition-colors hidden sm:block">
                        <Calendar className="w-6 h-6" />
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="hover:bg-black/10 p-2 rounded-md transition-colors"
                        >
                            <Search className="w-6 h-6" />
                        </button>

                        {isSearchOpen && (
                            <div className="absolute right-0 top-full mt-2 w-64 md:w-80 bg-card p-4 rounded-lg shadow-2xl border border-white/10">
                                <form onSubmit={handleSearch}>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Qidiruv..."
                                        className="w-full bg-background border border-border rounded-md py-2 px-4 text-sm focus:outline-none focus:border-primary transition-all text-white"
                                    />
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
