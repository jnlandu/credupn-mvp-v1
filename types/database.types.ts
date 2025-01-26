// types/database.types.ts
export interface Profile {
    id: string
    email: string
    full_name: string
    avatar_url?: string
    role: 'admin' | 'researcher' | 'reviewer'
  }
  
  export interface Publication {
    id: string
    title: string
    abstract: string
    author_id: string
    status: 'draft' | 'submitted' | 'under_review' | 'accepted'
    created_at: string
  }
  
  export interface Payment {
    id: string
    publication_id: string
    amount: number
    status: 'pending' | 'completed' | 'failed'
    created_at: string
  }