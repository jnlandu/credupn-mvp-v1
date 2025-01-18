
export const events = [
    {
      id: 'conf-2024',
      title: "Conférence Internationale sur l'Éducation",
      date: "2024-04-15",
      time: "09:00 - 17:00",
      description: "Une conférence majeure réunissant des experts internationaux pour discuter des innovations pédagogiques et des défis de l'éducation en Afrique.",
      longDescription: `
        Rejoignez-nous pour une journée exceptionnelle dédiée à l'avenir de l'éducation en Afrique. 
        Cette conférence internationale rassemblera des experts de premier plan pour explorer les 
        dernières innovations pédagogiques et aborder les défis cruciaux auxquels fait face 
        l'éducation dans notre continent.
  
        Programme de la journée:
        - 09:00 - Ouverture et discours d'introduction
        - 10:00 - Keynote: "L'avenir de l'éducation en Afrique"
        - 11:30 - Panel: "Innovation pédagogique et contexte local"
        - 14:00 - Ateliers parallèles
        - 16:00 - Session plénière et conclusions
        
        La conférence inclut:
        - Traduction simultanée (français, anglais)
        - Déjeuner et pauses café
        - Documentation complète
        - Certificat de participation
      `,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
      location: "Campus Principal UPN, Amphithéâtre Central",
      speakers: [
        "Prof. Marie Dubois - Université de Paris",
        "Dr. John Smith - Oxford University",
        "Prof. Kabongo Mukendi - UPN"
      ],
      category: "Conférence",
      price: "Gratuit pour les membres",
      registration: true,
      maxParticipants: 200
    },
    {
      id: 'conf-numerique-2024',
      title: "Conférence sur la Transformation Numérique de l'Éducation",
      date: "2024-05-20",
      time: "10:00 - 18:00",
      description: "Une journée dédiée à l'exploration des opportunités et défis de la digitalisation dans l'enseignement supérieur africain.",
      longDescription: `
        La transformation numérique bouleverse le paysage éducatif mondial. Cette conférence 
        explorera comment les institutions africaines peuvent tirer parti des technologies 
        émergentes tout en relevant les défis spécifiques à notre contexte.
  
        Thèmes abordés:
        - L'enseignement hybride et à distance
        - Les outils numériques pour l'évaluation
        - L'accessibilité et l'inclusion numérique
        - La formation des enseignants aux nouvelles technologies
        
        Au programme:
        - Démonstrations technologiques
        - Retours d'expérience
        - Sessions de networking
        - Exposition de solutions éducatives
      `,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80",
      location: "Centre de Conférences CREDUPN",
      speakers: [
        "Dr. Emmanuel Tshibangu - Expert EdTech",
        "Prof. Lisa Chen - Stanford University",
        "M. Patrick Mukuna - Microsoft Education"
      ],
      category: "Conférence",
      price: "50$ / participant",
      registration: true,
      maxParticipants: 150
    },
    {
      id: 'sem-2024',
      title: "Séminaire de Recherche en Sciences de l'Éducation",
      date: "2024-03-28",
      time: "14:00 - 18:00",
      description: "Un séminaire approfondi sur les méthodologies de recherche en éducation, destiné aux chercheurs et doctorants.",
      longDescription: `
        Ce séminaire intensif offre une plongée approfondie dans les méthodologies de recherche 
        contemporaines en sciences de l'éducation. Les participants auront l'opportunité d'échanger 
        avec des chercheurs expérimentés et de développer leurs compétences en recherche.
  
        Points clés:
        - Méthodologies qualitatives et quantitatives
        - Analyse de données éducatives
        - Publication scientifique
        - Éthique de la recherche
  
        Chaque participant recevra:
        - Un guide méthodologique complet
        - Des modèles de protocoles de recherche
        - Un accès à notre bibliothèque numérique
      `,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80",
      location: "Centre de Recherche CREDUPN, Salle de Conférence",
      speakers: [
        "Prof. Sarah Mutombo - UPN",
        "Dr. Pierre Lefebvre - Université de Montréal"
      ],
      category: "Séminaire",
      price: "25$ / participant",
      registration: true,
      maxParticipants: 50
    },
    {
      id: 'sem-evaluation-2024',
      title: "Séminaire sur l'Évaluation des Apprentissages",
      date: "2024-06-10",
      time: "09:00 - 16:00",
      description: "Un séminaire pratique sur les méthodes modernes d'évaluation et leur mise en œuvre dans l'enseignement supérieur.",
      longDescription: `
        L'évaluation est un élément crucial du processus d'apprentissage. Ce séminaire explore 
        les approches innovantes en matière d'évaluation, en mettant l'accent sur l'équité, 
        l'efficacité et la pertinence.
  
        Programme:
        - Les différents types d'évaluation
        - Conception d'outils d'évaluation
        - Feedback et remédiation
        - Évaluation par compétences
  
        Le séminaire inclut:
        - Cas pratiques
        - Outils d'évaluation
        - Sessions de travail en groupe
        - Support pédagogique complet
      `,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80",
      location: "Faculté des Sciences de l'Éducation, UPN",
      speakers: [
        "Dr. Marie Kalonji - UPN",
        "Prof. Thomas Dubois - Université de Genève",
        "Dr. Jeanne Mwamba - CREDUPN"
      ],
      category: "Séminaire",
      price: "30$ / participant",
      registration: true,
      maxParticipants: 40
    },
    {
      id: 'atelier-2024',
      title: "Atelier sur l'Innovation Pédagogique",
      date: "2024-03-10",
      time: "10:00 - 16:00",
      description: "Un atelier pratique explorant les nouvelles approches pédagogiques et leur application dans le contexte congolais.",
      longDescription: `
        Cet atelier pratique vise à explorer et à mettre en œuvre des approches pédagogiques 
        innovantes adaptées au contexte congolais. Les participants travailleront en petits 
        groupes sur des cas concrets et repartiront avec des outils pratiques.
  
        Objectifs:
        - Découvrir les pédagogies actives
        - Adapter les méthodes au contexte local
        - Développer des ressources pédagogiques
        - Évaluer l'impact des innovations
  
        Modalités:
        - Travail en petits groupes
        - Mise en situation
        - Production de ressources
        - Partage d'expériences
      `,
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80",
      location: "Laboratoire d'Innovation Pédagogique, UPN",
      speakers: [
        "Dr. Jean Kalala - UPN",
        "Prof. Marie-Claire Muamba - CREDUPN"
      ],
      category: "Atelier",
      price: "Gratuit",
      registration: true,
      maxParticipants: 30
    },
    {
      id: 'atelier-recherche-2024',
      title: "Atelier d'Écriture Scientifique",
      date: "2024-07-05",
      time: "09:00 - 17:00",
      description: "Un atelier intensif pour développer ses compétences en rédaction d'articles scientifiques et de demandes de financement.",
      longDescription: `
        La publication scientifique est essentielle pour la carrière académique. Cet atelier 
        pratique vous donnera les outils et techniques pour améliorer vos compétences en 
        écriture scientifique.
  
        Au programme:
        - Structure d'un article scientifique
        - Techniques de rédaction efficace
        - Soumission aux revues
        - Réponse aux reviewers
        - Rédaction de demandes de financement
  
        Les participants travailleront sur:
        - Leurs propres projets d'articles
        - Des exercices pratiques
        - Des révisions par les pairs
        - Des simulations de soumission
      `,
      image: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&q=80",
      location: "Bibliothèque Universitaire, UPN",
      speakers: [
        "Prof. Robert Ngandu - CREDUPN",
        "Dr. Claire Dubois - Éditrice en chef, African Education Review",
        "Prof. Samuel Mukendi - UPN"
      ],
      category: "Atelier",
      price: "40$ / participant",
      registration: true,
      maxParticipants: 25
    }
  ]
  
  export const categories = ["Tous", "Conférence", "Séminaire", "Atelier"]
  