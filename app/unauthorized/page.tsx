// app/unauthorized/page.tsx
import React from 'react'
export default function  UnauthorizedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Non autorisé</h1>
                <p className="mt-4">Vous n'avez pas accès à cette page.</p>
                <a 
                    href="/"
                    className="mt-6 inline-block rounded-md px-4 py-2 text-white bg-green-600 hover:bg-green-700"
                >
                    Retour à l'accueil
                </a>
            </div>
        </div>
    )
}
