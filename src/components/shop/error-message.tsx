"use client"

import { Button } from "../ui/button"

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="text-center py-8">
      <p className="text-red-500">{message}</p>
      <Button 
        onClick={() => window.location.reload()}
        className="mt-4"
      >
        Try Again
      </Button>
    </div>
  )
}
