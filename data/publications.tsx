

export type PublicationStatus = 'PENDING' | 'REVIEW' | 'APPROVED' | 'REJECTED'| 'PUBLISHED'; ;
export interface Publication {
    id: string
    title: string
    author: string[] | string  // author: string[] for multiple authors
    date: string,
    type: string,
    status: 'PUBLISHED' | 'PENDING' | 'REJECTED' | 'REVIEW' 
    category: string
    pdfUrl: string,
    image?: string
    abstract?: string;
    keywords?: string[];
  }

  export interface PublicationWithRelationsUser {
    id: string
    title: string
    // author: string[] | string  // author: string[] for multiple authors
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
    role?: string,
    specialization?: string
  }

export interface User {
    id: string
    name: string
    email: string
    role: 'author' | 'reviewer' | 'admin'
    institution: string
    phone?: string
    publications?: PublicationWithRelationsUser[]
  }

export interface Payment {
    id: number; // Primary key
    user_id: string; // Foreign key to users table
    publication_id: string; // Foreign key to publications table
    amount: number; // Payment amount
    payment_method: string; // e.g., "Credit Card", "PayPal"
    status: 'Pending' | 'Completed' | 'Failed'; // Payment status
    created_at: string; // Timestamp when payment was made
    details?: string; // Additional payment details (optional)
    customer_email?: string; // Email of the customer making the payment
    customer_name: string; // Name of the customer making the payment
    reason?: string; // Reason for payment failure (optional)
  }

export interface PaymentWithRelations extends Payment {
    user?: {
      id: string;
      name: string;
      email: string;
      institution: string;
    };
    publication?: {
      id: string;
      title: string;
      category: string;
      status: string;
    };
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

export const cardTypes = [
    {
      id: 'visa',
      name: 'Visa',
      logoPath: '/images/payments/visa.svg'
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      logoPath: '/images/payments/mastercard.svg'
    },
    {
      id: 'amex',
      name: 'American Express',
      logoPath: '/images/payments/amex.svg'
    }
  ]
export interface Notification {
  id: string
  user_id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at: string
}

export const requirements = [
  {
    title: "Résumé",
    items: ["Français et version anglaise"],
  },
  {
    title: "Mots Clés",
    items: ["Français et version anglaise"],
  },
  {
    title: "Introduction",
    items: [
      "Problème : Théories, Situation désirée, Situation vécue",
      "Problématique (Questions de recherche) = Réponse provisoire",
      "Hypothèse",
      "Objectif",
    ],
  },
  {
    title: "II. Méthodologie",
    items: [
      "Méthodes et techniques de collecte, d’analyse et d’interprétation des données",
      "Population",
      "Échantillon",
    ],
  },
  {
    title: "III. Résultats",
    items: ["Présentation des résultats"],
  },
  {
    title: "IV. Discussion",
    items: [
      "Analyse et interprétation des résultats",
      "Vérification (confrontation de l’écart entre théories et résultats existants et actuels)",
    ],
  },
  {
    title: "Conclusion",
    items: [],
  },
  {
    title: "Références",
    items: ["Normes APA"],
  },
];