'use client'

import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading ? (
        "Enregistrement..."
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer les modifications
        </>
      )}
    </Button>
  )
}