// components/ChatBot.tsx
'use client'

import { useState } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ChatMessage {
  type: 'user' | 'bot'
  content: string
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: 'bot', content: 'Bonjour! Je suis là pour répondre à vos questions sur le CRIDUPN. Comment puis-je vous aider?' }
  ])
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: input }])

    // TODO: Replace with actual API call
    const botResponse = "Je suis en cours de développement. Je pourrai bientôt répondre à vos questions sur le CRIDUPN."
    
    // Add bot response with delay
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', content: botResponse }])
    }, 1000)

    setInput('')
  }

  return (
    <div className="fixed bottom-4 right-4 z-50  ">
      {/* Chat Toggle Button */}
      <Button
        className="rounded-full p-4 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border">
          {/* Header */}
          <div className="p-4 border-b bg-primary text-black rounded-t-lg flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h3 className="font-semibold">Assistant CRIDUPN</h3>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-gray-200 text-black'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question..."
                className="flex-1"
              />
              <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Add to main page
