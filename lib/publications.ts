// libations.ts
export interface Publication {
  id: string;  // Make sure this is required
  title: string;
  authors: string[];
  date: string;
  abstract: string;
  keywords: string[];
  category: string;
  type: 'Tous' | 'Article' | 'These' | 'Livre' | 'Rapport';
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  citations: number;
  status?: string;
  image?: string,
  isRestricted: boolean;
  previewUrl?: string; // URL for preview-only PDF (first 2 pages)
  pdfUrl?: string;
  downloadUrl: string;
}



export const categories = ["Tous", "Recherche", "Méthodologie", "Guide Pratique", "Politique Éducative"]
export const types = ["Tous", "Article", "Thèse", "Livre", "Rapport"]



export const publications = [
    {
      id: 'pub-1',
      title: "L'impact des Technologies Éducatives sur l'Apprentissage  en RDC dans les fillières des sciences fondamentales, cas de la Chimie",
      authors: ["Prof. Dr. Yvonne Ibebe"],
      date: "2024-01-15",
      abstract: `Cette étude examine l'impact de l'introduction des technologies éducatives dans les écoles 
      congolaises, en mettant l'accent sur les zones urbaines et rurales. Les résultats montrent une 
      amélioration significative des résultats d'apprentissage lorsque la technologie est intégrée de 
      manière appropriée.`,
      keywords: ["technologie éducative", "Femmes dans les Sciences", "Excellence en Feminin", "éducation numérique", "Chimie"],
      category: "Recherche",
      type: "Article",
      journal: "Revue Africaine des Sciences de l'Éducation",
      volume: "12",
      issue: "3",
      pages: "45-67",
      doi: "10.1234/rase.2024.12.3.45",
      citations: 8,
      image: "/images/divers/upn-0.jpg",
      isRestricted: true,
      previewUrl: '/pdfs/previews/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf',
      pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf',
      downloadUrl: "/publications/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf"
    },
    {
      id: 'pub-2',
      title: "Formation des Enseignants en RDC : Défis et Perspectives",
      authors: ["Prof. Sarah Mutombo", "Dr. Robert Ngandu", "Dr. Claire Dubois"],
      date: "2023-11-20",
      abstract: `Une analyse approfondie des programmes de formation des enseignants en République 
      Démocratique du Congo, identifiant les principaux défis et proposant des recommandations pour 
      l'amélioration de la qualité de la formation.`,
      keywords: ["formation des enseignants", "éducation", "RDC", "développement professionnel"],
      category: "Recherche",
      type: "Thèse",
      institution: "Université Pédagogique Nationale",
      pages: "245",
      citations: 12,
      image: "/images/divers/upn-2.jpg",
      isRestricted: true,
      previewUrl: '/pdfs/previews/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf',
      pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf',
      downloadUrl: "/publications/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf"
    },
    {
      id: 'pub-3',
      title: "Méthodes Innovantes d'Évaluation dans l'Enseignement Supérieur",
      authors: ["Dr. Emmanuel Tshibangu", "Prof. Marie-Claire Muamba"],
      date: "2023-09-05",
      abstract: `Cette recherche présente une analyse comparative des méthodes d'évaluation innovantes 
      dans l'enseignement supérieur, avec un focus particulier sur leur applicabilité dans le contexte 
      de la RDC.`,
      keywords: ["évaluation", "enseignement supérieur", "innovation pédagogique"],
      category: "Méthodologie",
      type: "Article",
      journal: "Journal International de Pédagogie Universitaire",
      volume: "8",
      issue: "2",
      pages: "123-145",
      doi: "10.5678/jipu.2023.8.2.123",
      citations: 5,
      image: "/images/divers/upn-3.jpg",
      isRestricted: false,
      previewUrl: '/pdfs/previews/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf',
      pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf',
      downloadUrl: "/publications/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf"
    },
    {
      id: 'pub-4',
      title: "Guide des Bonnes Pratiques en Enseignement à Distance",
      authors: ["Prof. Jean Kalala", "Dr. Jeanne Mwamba"],
      date: "2023-07-15",
      abstract: `Un guide complet détaillant les meilleures pratiques pour l'enseignement à distance 
      dans le contexte africain, basé sur des expériences réussies et des recherches empiriques.`,
      keywords: ["enseignement à distance", "e-learning", "pédagogie numérique"],
      category: "Guide Pratique",
      type: "Livre",
      publisher: "Éditions CREDUPN",
      pages: "180",
      isbn: "978-2-12345-678-9",
      citations: 15,
      image: "/images/divers/upn-4.jpg",
      isRestricted: false,
      previewUrl: '/pdfs/previews/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf',
      pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf',
      downloadUrl: "/publications/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf"
    },
    {
      id: 'pub-5',
      title: "L'Éducation Inclusive en RDC : État des Lieux et Perspectives",
      authors: ["Dr. Pierre Lefebvre", "Prof. Samuel Mukendi"],
      date: "2023-06-01",
      abstract: `Une étude approfondie sur la situation de l'éducation inclusive en RDC, analysant 
      les politiques actuelles, les pratiques sur le terrain et proposant des recommandations pour 
      une meilleure inclusion.`,
      keywords: ["éducation inclusive", "RDC", "politiques éducatives"],
      category: "Politique Éducative",
      type: "Rapport",
      institution: "CREDUPN",
      pages: "95",
      citations: 7,
      image: "/images/divers/upn-1.jpg",
      isRestricted: true,
      previewUrl: '/pdfs/previews/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf',
      pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf',
      downloadUrl: "/publications/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf"
    },
    {
      id: 'pub-6',
      title: "Stratégies d'Apprentissage Collaboratif en Milieu Universitaire",
      authors: ["Dr. Alice Kabongo", "Prof. Marc Ntumba"],
      date: "2023-05-10",
      abstract: `Une analyse des méthodes d'apprentissage collaboratif et leur efficacité dans 
      l'enseignement supérieur en RDC. L'étude met en évidence les facteurs clés de succès et 
      les obstacles à surmonter.`,
      keywords: ["apprentissage collaboratif", "université", "pédagogie", "RDC"],
      category: "Méthodologie",
      type: "Article",
      journal: "Revue des Sciences de l'Éducation en Afrique",
      volume: "15",
      issue: "4",
      pages: "78-95",
      doi: "10.3456/rsea.2023.15.4.78",
      citations: 6,
      image: "/images/divers/upn-6.jpg",
      isRestricted: false,
      previewUrl: '/pdfs/previews/tech-education-preview.pdf',
      pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf',
      downloadUrl: "/publications/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf"
      },
      {
      id: 'pub-7',
      title: "L'Intelligence Artificielle dans l'Éducation Congolaise",
      authors: ["Prof. David Kasongo", "Dr. Sophie Mbemba"],
      date: "2023-04-15",
      abstract: `Cette étude explore les possibilités d'intégration de l'IA dans le système 
      éducatif congolais, en examinant les opportunités et les défis technologiques, 
      pédagogiques et infrastructurels.`,
      keywords: ["intelligence artificielle", "éducation", "innovation", "RDC"],
      category: "Recherche",
      type: "Article",
      journal: "Technologies Éducatives en Afrique",
      volume: "7",
      issue: "2",
      pages: "112-130",
      doi: "10.5678/tea.2023.7.2.112",
      citations: 4,
      image: "/images/divers/upn-5.jpg",
      isRestricted: false,
      previewUrl: '/pdfs/previews/tech-education-preview.pdf',
      pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf',
      downloadUrl: "/publications/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf"
      },
      {
        id: 'pub-8',
        title: "L'Éducation Environnementale dans les Écoles de la RDC",
        authors: ["Dr. Julie Mwanza", "Prof. Thomas Bokanga"],
        date: "2023-03-20",
        abstract: `Cette thèse examine l'état actuel de l'éducation environnementale dans les écoles 
        congolaises et propose un cadre méthodologique pour son intégration effective dans les 
        programmes scolaires.`,
        keywords: ["éducation environnementale", "développement durable", "RDC", "programme scolaire"],
        category: "Recherche",
        type: "Thèse",
        institution: "Université de Kinshasa",
        pages: "278",
        citations: 3,
        image: "/images/divers/upn-3.jpg",
        isRestricted: false,
        previewUrl: '/pdfs/previews/tech-education-preview.pdf',
        pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf',
        downloadUrl: "/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf"
      }
  ]
  

