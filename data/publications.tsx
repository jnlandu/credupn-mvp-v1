export interface Publication {
    id: string
    title: string
    author: string
    date: string
    status: 'published' | 'pending' | 'rejected'
    category: string
    pdfUrl: string,
    image?: string
  }
  
export const Publications: Publication[] = [
    {
        id: 'pub-1',
        title: "L'impact des Technologies Educatives",
        author: "Dr. Marie Kabongo",
        date: "2024-03-15", 
        status: 'published',
        category: 'Recherche',
        pdfUrl: '/publications/tech-education.pdf'
    },
    {
        id: 'pub-2',
        title: "Méthodes d'Enseignement Innovantes",
        author: "Prof. Jean Lutumba",
        date: "2024-03-10",
        status: 'pending', 
        category: 'Pédagogie',
        pdfUrl: '/publications/methodes-enseignement.pdf'
    },
    {
        id: 'pub-3',
        title: "Évaluation des Apprentissages à Distance",
        author: "Dr. Sarah Mukendi",
        date: "2024-03-08",
        status: 'published',
        category: 'Éducation', 
        pdfUrl: '/publications/evaluation-distance.pdf'
    },
    {
        id: 'pub-4',
        title: "Intelligence Artificielle en Éducation",
        author: "Prof. Paul Mbiya",
        date: "2024-03-05",
        status: 'rejected',
        category: 'Technologie',
        pdfUrl: '/publications/ia-education.pdf'
    },
    {
        id: 'pub-5',
        title: "Développement Professionnel des Enseignants",
        author: "Dr. Claire Musau",
        date: "2024-03-01",
        status: 'published',
        category: 'Formation',
        pdfUrl: '/publications/dev-professionnel.pdf'
    },
    {
        id: 'pub-6',
        title: "Inclusion Numérique en Éducation",
        author: "Prof. Marc Kabamba",
        date: "2024-02-28",
        status: 'pending',
        category: 'Technologie',
        pdfUrl: '/publications/inclusion-numerique.pdf'
    },
    {
        id: 'pub-7',
        title: "Apprentissage Collaboratif en Ligne",
        author: "Dr. Alice Kalonda",
        date: "2024-02-25",
        status: 'published',
        category: 'Pédagogie',
        pdfUrl: '/publications/apprentissage-collaboratif.pdf'
    },
    {
        id: 'pub-8',
        title: "Éducation Hybride: Défis et Opportunités",
        author: "Prof. Thomas Mukeba",
        date: "2024-02-20",
        status: 'pending',
        category: 'Recherche',
        pdfUrl: '/publications/education-hybride.pdf'
    },
    {
        id: 'pub-9',
        title: "Compétences Numériques des Étudiants",
        author: "Dr. Emma Tshilombo",
        date: "2024-02-15",
        status: 'published',
        category: 'Technologie',
        pdfUrl: '/publications/competences-numeriques.pdf'
    },
    {
        id: 'pub-10',
        title: "Stratégies d'Évaluation Formative",
        author: "Prof. Robert Kanda",
        date: "2024-02-10",
        status: 'rejected',
        category: 'Évaluation',
        pdfUrl: '/publications/evaluation-formative.pdf'
    },
    {
        id: 'pub-11',
        title: "Innovation Pédagogique en RDC",
        author: "Dr. Sophie Mbuyi",
        date: "2024-02-05",
        status: 'published',
        category: 'Innovation',
        pdfUrl: '/publications/innovation-pedagogique.pdf'
    },
  {
      id: '72285b35-f245-4416-9c34-b09939c6a212',
      title: "Elements de mathematiques",
      author: "Mayala Lemba Francis, Nlandu Mabiala Jeremie",
      date: "2025-01-19",
      status: 'published',
      category: "Méthodologie",
      pdfUrl: '/publications/167d24a53fb8fc2f07a2e6600.pdf'
    },
  {
      id: 'aa05c8b3-87af-4b3a-8d7f-7186a9313145',
      title: "Elements des sciences de donnnées",
      author: "Mayala Lemba Francis, Nlandu Mabiala Jeremie",
      date: "2025-01-19",
      status: 'pending',
      category: "Méthodologie",
      pdfUrl: '/publications/c792ba5960fffce6c757acc00.pdf'
    }
]


export const statusStyles = {
    published: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800'
  }