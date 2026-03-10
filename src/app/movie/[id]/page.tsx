import { supabase } from '@/lib/supabase'
import { Movie } from '@/components/movies/MovieCard'
import { MovieCard } from '@/components/movies/MovieCard'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NextImage from 'next/image'

interface Props {
    params: Promise<{ id: string }>
}

function getEmbedUrl(url: string) {
    if (!url) return ''
    if (url.includes('iframe')) return url

    // YouTube conversion
    if (url.includes('youtube.com/watch?v=')) {
        const id = url.split('v=')[1]?.split('&')[0]
        return `https://www.youtube.com/embed/${id}`
    }
    if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0]
        return `https://www.youtube.com/embed/${id}`
    }

    return url
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const { data: movie } = await supabase
        .from('movies')
        .select('title, description')
        .eq('id', id)
        .single()

    if (!movie) return { title: 'Movie Not Found' }

    return {
        title: `${movie.title} - AsilMedia.NET ! O'zbekcha tarjima kino skachat !`,
        description: movie.description,
        keywords: [movie.title, 'tarjima kino', 'o\'zbek tilida', 'skachat', 'asilmedia'],
        openGraph: {
            title: `${movie.title} - AsilMedia.NET !`,
            description: movie.description,
            siteName: 'AsilMedia.NET'
        }
    }
}

export default async function MoviePage({ params }: Props) {
    const { id } = await params
    const { data: movie } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single()

    if (!movie) notFound()

    const typedMovie = movie as Movie

    // Fetch similar movies
    const { data: similar } = await supabase
        .from('movies')
        .select('*')
        .eq('category', typedMovie.category)
        .neq('id', typedMovie.id)
        .limit(6)

    const similarMovies = (similar as Movie[]) || []

    return (
        <div className="relative min-h-screen">
            {/* Background Blur Backdrop */}
            <div className="absolute inset-0 h-[600px] overflow-hidden -z-10 opacity-30">
                <NextImage
                    src={typedMovie.thumbnail_url}
                    alt=""
                    fill
                    className="object-cover blur-3xl scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>

            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
                            {typedMovie.video_url.includes('iframe') ? (
                                <div
                                    className="w-full h-full"
                                    dangerouslySetInnerHTML={{ __html: typedMovie.video_url }}
                                />
                            ) : (
                                <iframe
                                    src={getEmbedUrl(typedMovie.video_url)}
                                    className="w-full h-full"
                                    allowFullScreen
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            )}
                        </div>

                        <div className="space-y-4 bg-card/40 backdrop-blur-sm p-6 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide">
                                    {typedMovie.category}
                                </span>
                                <span className="text-muted text-xs font-bold">{new Date(typedMovie.created_at).getFullYear()} yil</span>
                                <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold ml-auto">
                                    <span>★</span> 8.5
                                </div>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                                {typedMovie.title}
                            </h1>
                            <div className="h-0.5 w-12 bg-primary" />
                            <p className="text-base text-white/70 leading-relaxed max-w-4xl pt-2">
                                {typedMovie.description}
                            </p>

                            <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-6">
                                <button className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-4 py-2 rounded-sm text-xs font-bold border border-primary/20">
                                    ULASHISH
                                </button>
                                <button className="flex items-center gap-2 bg-card text-white/70 hover:text-white transition-colors px-4 py-2 rounded-sm text-xs font-bold border border-white/10">
                                    MAXSUS KLUB
                                </button>
                            </div>
                        </div>

                    </div>

                    <aside className="space-y-8">

                        <section className="bg-card/30 backdrop-blur-sm p-6 rounded-lg border border-white/5">
                            <div className="flex flex-col mb-6">
                                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    O'xshash videolar
                                </h2>
                                <div className="h-0.5 w-8 bg-primary mt-1" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {similarMovies.map((similarMovie) => (
                                    <MovieCard key={similarMovie.id} movie={similarMovie} />
                                ))}
                            </div>
                            {similarMovies.length === 0 && (
                                <p className="text-muted text-xs italic">Hozircha boshqa videolar yo'q...</p>
                            )}
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    )
}
