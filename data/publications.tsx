

export type PublicationStatus = 'PENDING' | 'REVIEW' | 'APPROVED' | 'REJECTED'| 'PUBLISHED'; ;
export interface Publication {
    id: string
    title: string
    author: string[] | string  // author: string[] for multiple authors
    date: string
    status: 'PUBLISHED' | 'PENDING' | 'REJECTED' | 'REVIEW' 
    category: string
    pdfUrl: string,
    image?: string
    abstract?: string;
    keywords?: string[];
  }

 export interface PendingPublication {
    id: string
    title: string
    author: Author[] | Author 
    status: PublicationStatus; // Update to use PublicationStatus type
    date: string
    category: string
    pdf_url: string
    reviewer?: string
    abstract: string
    keywords: string[]
  }
// First update interfaces
export interface Submission {
    id: string;
    title: string;
    author: Author [] | Author;
    status: PublicationStatus;
    abstract: string;
    submittedDate: string;
    category: string;
    type?: string;
    reviewer?: string[] | string;
    pdfUrl: string;
    keywords?: string[]
  }
  
export interface Author {
    name: string;
    email: string;
    institution: string;
  }

export interface Reviewer {
    id: string
    name: string
    email: string
    institution: string
    role: string
  }
  
  
export const statusStyles: Record<PublicationStatus, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'REVIEW': 'bg-blue-100 text-blue-800',
    'APPROVED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'PUBLISHED': 'bg-green-100 text-green-800'
  }; 
// Update status labels
export const statusLabels: Record<PublicationStatus, string> = {
    'PENDING': 'En attente',
    'REVIEW': 'En cours',
    'APPROVED': 'Approuvé',
    'REJECTED': 'Rejeté',
    'PUBLISHED': 'Publié'
  };

