import { supabase } from '@/lib/supabase'
import { MovieCard, Movie } from '@/components/movies/MovieCard'
import { TopAd } from '@/components/layout/AdPlaceholder'
import { notFound } from 'next/navigation'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const title = slug.charAt(0).toUpperCase() + slug.slice(1)
    return {
        title: `${title} - FILM.NET`,
    }
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params

    // Map slugs to display names or categories
    const categoryMap: { [key: string]: string } = {
        'movies': 'Action', // For now let's just filter by some logic or show all
        'series': 'Sci-Fi'
    }

    // If the user clicks "Movies", maybe we want to show all movies? 
    // Let's filter by category if it matches, otherwise just show by popular
    const { data: movies } = await supabase
        .from('movies')
        .select('*')
        .ilike('category', `%${slug.replace('s', '')}%`)
        .order('created_at', { ascending: false })

    const typedMovies = (movies as Movie[]) || []

    if (typedMovies.length === 0 && slug !== 'movies' && slug !== 'series') {
        // If it's a specific category and not found
    }

    return (
        <div className="pt-24 pb-12 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <TopAd />

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
                            {slug === 'movies' ? 'All Movies' : slug === 'series' ? 'TV Shows' : slug}
                        </h1>
                        <div className="h-1 w-20 bg-primary" />
                    </div>
                </div>

                {typedMovies.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                        {typedMovies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-card rounded-xl border border-border dashed">
                        <p className="text-muted italic">No content found in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
