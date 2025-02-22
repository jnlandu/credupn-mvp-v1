// components/SignOutButton.tsx
'use client'

import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"

interface SignOutButtonProps {
  onSignOut: () => Promise<void>
  isSigningOut: boolean
}

export function SignOutButton({ onSignOut, isSigningOut }: SignOutButtonProps) {
  return (
    <Button 
      variant="ghost" 
      onClick={onSignOut}
      disabled={isSigningOut}
      className="w-full text-left flex items-center"
    >
      {isSigningOut ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      Se déconnecter
    </Button>
  )
}