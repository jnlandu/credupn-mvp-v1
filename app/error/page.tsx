'use client'
import { useRouter } from 'next/navigation'

export default function ErrorPage() {
    const router = useRouter()
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-red-600 mb-4">Oups !</h1>
                <p className="text-xl text-gray-700 mb-6">Une erreur est survenue</p>
                <p className="text-gray-500 mb-6">
                    Nous sommes désolés pour la gêne occasionnée. Veuillez réessayer plus tard.
                </p>
                <button
                    onClick={() => router.refresh()}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Réessayer
                </button>
            </div>
        </div>
    );
}