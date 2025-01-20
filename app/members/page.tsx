// app/members/page.tsx
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import {
  Search,
  GraduationCap,
  Building2,
  Mail,
  Globe,
  Filter
} from 'lucide-react'

interface Member {
    id: string
    name: string
    title: string
    image: string
    institution: string
    specialization: string
    bio: string
    email: string
    publications: number
    research_areas: string[]
    achievements: string[]
    current_projects: {
      title: string
      description: string
    }[]
    education: {
      degree: string
      institution: string
      year: string
    }[]
    contact: {
      office: string
      phone: string
      website?: string
    }
    social: {
      linkedin?: string
      researchgate?: string
      googleScholar?: string
    }
    metrics: {
      citations: number
      hIndex: number
      publications: {
        journals: number
        conferences: number
        books: number
      }
    }
  }

  const specializations = [
    'Tous',
    'Sciences de l\'Éducation',
    'Pédagogie',
    'Technologie Éducative',
    'Psychologie de l\'Éducation',
    'Didactique',
    'Évaluation',
    'Formation des Enseignants'
  ]

const members: Member[] = [
  {
    id: 'm1',
    name: 'Prof. Emmanuel Kabongo',
    title: 'Directeur de Recherche',
    image: "/images/prof-yawidi.jpg",
    institution: 'UPN',
    specialization: 'Sciences de l\'Éducation',
    bio: 'Expert en méthodologie de recherche avec plus de 20 ans d\'expérience...',
    email: 'emmanuel.k@upn.cd',
    publications: 45,
    research_areas: ['Pédagogie', 'Formation des enseignants'],
    achievements: ['Prix d\'Excellence en Recherche 2020', 'Médaille du Mérite Académique'],
    current_projects: [
        {
            title: 'Innovation en Formation des Enseignants',
            description: 'Développement de nouvelles approches pédagogiques'
        }
    ],
    education: [
        {
            degree: 'Doctorat en Sciences de l\'Éducation',
            institution: 'Université de Kinshasa',
            year: '2000'
        }
    ],
    contact: {
        office: 'Bâtiment A, Bureau 304',
        phone: '+243 123 456 789',
        website: 'www.upn.cd/ekabongo'
    },
    social: {
        linkedin: 'emmanuel-kabongo',
        researchgate: 'E_Kabongo',
        googleScholar: 'EKabongo123'
    },
    metrics: {
        citations: 850,
        hIndex: 15,
        publications: {
            journals: 30,
            conferences: 12,
            books: 3
        }
    }
  },
{
    id: 'm2',
    name: 'Dr. Marie Lukusa',
    title: 'Chercheuse Principale',
    image: "/images/prof-ndakaishe.jpg",
    institution: 'UPN',
    specialization: 'Technologie Éducative',
    bio: 'Spécialiste en technologies éducatives et innovation pédagogique...',
    email: 'marie.l@upn.cd',
    publications: 28,
    research_areas: ['Technologie Éducative', 'Innovation Pédagogique'],
    achievements: ['Prix Innovation Numérique 2021', 'Bourse d\'Excellence UNIKIN'],
    current_projects: [
        {
            title: 'E-learning en RDC',
            description: 'Développement de plateformes d\'apprentissage en ligne'
        }
    ],
    education: [
        {
            degree: 'Doctorat en Technologies Éducatives',
            institution: 'Université de Kinshasa',
            year: '2015'
        }
    ],
    contact: {
        office: 'Bâtiment B, Bureau 207',
        phone: '+243 987 654 321',
        website: 'www.upn.cd/mlukusa'
    },
    social: {
        linkedin: 'marie-lukusa',
        researchgate: 'M_Lukusa',
        googleScholar: 'MLukusa456'
    },
    metrics: {
        citations: 420,
        hIndex: 12,
        publications: {
            journals: 18,
            conferences: 8,
            books: 2
        }
    }
  },
  {
    id: 'm3',
    name: 'Prof. Jean-Paul Mbuyi',
    title: 'Chercheur Senior',
    image: "/images/prof-ndakaishe.jpg",
    institution: 'UPN',
    specialization: 'Pédagogie',
    bio: 'Expert en développement curriculaire et formation continue...',
    email: 'jeanpaul.m@upn.cd',
    publications: 35,
    research_areas: ['Pédagogie', 'Développement Curriculaire'],
    achievements: ['Prix Innovation Pédagogique 2019', 'Mention d\'Excellence UPN'],
    current_projects: [
        {
            title: 'Réforme Curriculaire',
            description: 'Modernisation des programmes d\'études'
        }
    ],
    education: [
        {
            degree: 'Doctorat en Sciences de l\'Éducation',
            institution: 'Université de Lubumbashi',
            year: '2005'
        }
    ],
    contact: {
        office: 'Bâtiment C, Bureau 105',
        phone: '+243 456 789 123',
        website: 'www.upn.cd/jpmbuyi'
    },
    social: {
        linkedin: 'jeanpaul-mbuyi',
        researchgate: 'JP_Mbuyi',
        googleScholar: 'JPMbuyi789'
    },
    metrics: {
        citations: 580,
        hIndex: 14,
        publications: {
            journals: 22,
            conferences: 10,
            books: 3
        }
    }
  },
{
    id: 'm4',
    name: 'Prof. Dr Mayala Lemba Francis',
    title: 'Chercheuse Associée',
    image: "/images/prof-mayala-lemba.jpg",
    institution: 'UPN',
    specialization: 'Sciences de l\'Éducation',
    bio: 'Spécialiste en éducation comparative et systèmes éducatifs africains...',
    email: 'sarah.n@upn.cd',
    publications: 22,
    research_areas: ['Éducation Comparative', 'Systèmes Éducatifs'],
    achievements: ['Prix de Recherche UPN 2022', 'Bourse de Recherche CEDESURK'],
    current_projects: [
        {
            title: 'Éducation Comparative en Afrique',
            description: 'Étude des systèmes éducatifs d\'Afrique centrale'
        }
    ],
    education: [
        {
            degree: 'Doctorat en Sciences de l\'Éducation',
            institution: 'Université de Kinshasa',
            year: '2018'
        }
    ],
    contact: {
        office: 'Bâtiment D, Bureau 412',
        phone: '+243 234 567 890',
        website: 'www.upn.cd/sndumba'
    },
    social: {
        linkedin: 'sarah-ndumba',
        researchgate: 'S_Ndumba',
        googleScholar: 'SNdumba234'
    },
    metrics: {
        citations: 320,
        hIndex: 10,
        publications: {
            journals: 15,
            conferences: 5,
            books: 2
        }
    }
  },
  {
    id: 'm5',
    name: 'Prof. Daniel Mukendi',
    title: 'Chercheur Senior',
    image: "/images/prof-mengi-kapita.jpg",
    institution: 'UPN',
    specialization: 'Pédagogie',
    bio: 'Expert en évaluation des apprentissages et formation professionnelle...',
    email: 'daniel.m@upn.cd',
    publications: 31,
    research_areas: ['Évaluation', 'Formation Professionnelle'],
    achievements: ['Prix d\'Excellence UPN 2021', 'Certificat de Mérite Académique'],
    current_projects: [
        {
            title: 'Évaluation des Compétences',
            description: 'Développement de nouveaux outils d\'évaluation'
        }
    ],
    education: [
        {
            degree: 'Doctorat en Sciences de l\'Éducation',
            institution: 'Université de Kinshasa',
            year: '2008'
        }
    ],
    contact: {
        office: 'Bâtiment B, Bureau 301',
        phone: '+243 345 678 912',
        website: 'www.upn.cd/dmukendi'
    },
    social: {
        linkedin: 'daniel-mukendi',
        researchgate: 'D_Mukendi',
        googleScholar: 'DMukendi567'
    },
    metrics: {
        citations: 450,
        hIndex: 13,
        publications: {
            journals: 20,
            conferences: 8,
            books: 3
        }
    }
  },
{
    id: 'm6',
    name: 'Dr. Françoise Muamba',
    title: 'Chercheuse Associée',
    image: "/images/prof-mengi-kapita.jpg",
    institution: 'UPN',
    specialization: 'Sciences de l\'Éducation',
    bio: 'Experte en psychologie de l\'éducation et développement cognitif...',
    email: 'francoise.m@upn.cd',
    publications: 25,
    research_areas: ['Psychologie Éducative', 'Développement Cognitif'],
    achievements: ['Prix Jeune Chercheur 2022', 'Certification en Psychologie Éducative'],
    current_projects: [
        {
            title: 'Développement Cognitif en Milieu Scolaire',
            description: 'Étude sur l\'impact des méthodes d\'enseignement sur le développement cognitif'
        }
    ],
    education: [
        {
            degree: 'Doctorat en Sciences de l\'Éducation',
            institution: 'Université de Kinshasa',
            year: '2016'
        }
    ],
    contact: {
        office: 'Bâtiment B, Bureau 405',
        phone: '+243 456 789 012',
        website: 'www.upn.cd/fmuamba'
    },
    social: {
        linkedin: 'francoise-muamba',
        researchgate: 'F_Muamba',
        googleScholar: 'FMuamba345'
    },
    metrics: {
        citations: 280,
        hIndex: 9,
        publications: {
            journals: 16,
            conferences: 7,
            books: 2
        }
    }
  },
  {
    id: 'm7',
    name: 'Prof. Albert Kalonga',
    title: 'Chercheur Senior',
    image: "/images/ct-jean-mathy.jpg",
    institution: 'UPN',
    specialization: 'Technologie Éducative',
    bio: 'Spécialiste en intégration des TIC dans l\'éducation...',
    email: 'albert.k@upn.cd',
    publications: 38,
    research_areas: ['TIC en Éducation', 'Formation à Distance'],
    achievements: ['Prix Excellence TIC 2020', 'Certificat Innovation Numérique'],
    current_projects: [
        {
            title: 'Intégration des TIC',
            description: 'Modernisation des méthodes d\'enseignement par les technologies'
        }
    ],
    education: [
        {
            degree: 'Doctorat en Technologie Éducative',
            institution: 'Université de Kinshasa',
            year: '2010'
        }
    ],
    contact: {
        office: 'Bâtiment A, Bureau 205',
        phone: '+243 567 891 234',
        website: 'www.upn.cd/akalonga'
    },
    social: {
        linkedin: 'albert-kalonga',
        researchgate: 'A_Kalonga',
        googleScholar: 'AKalonga890'
    },
    metrics: {
        citations: 520,
        hIndex: 14,
        publications: {
            journals: 25,
            conferences: 10,
            books: 3
        }
    }
  },
  {
    id: 'm8',
    name: 'Dr. Claire Masamba',
    title: 'Chercheuse Principale',
    image: "/images/ct-jean-mathy.jpg",
    institution: 'UPN',
    specialization: 'Pédagogie',
    bio: 'Spécialiste en méthodes d\'enseignement innovantes...',
    email: 'claire.m@upn.cd',
    publications: 29,
    research_areas: ['Innovation Pédagogique', 'Méthodes d\'Enseignement'],
    achievements: ['Prix d\'Innovation Pédagogique 2021', 'Médaille du Mérite Académique'],
    current_projects: [
        {
            title: 'Méthodes d\'Enseignement Innovantes',
            description: 'Recherche sur les nouvelles approches pédagogiques'
        }
    ],
    education: [
        {
            degree: 'Doctorat en Sciences de l\'Éducation',
            institution: 'Université de Kinshasa',
            year: '2012'
        }
    ],
    contact: {
        office: 'Bâtiment C, Bureau 203',
        phone: '+243 678 912 345',
        website: 'www.upn.cd/cmasamba'
    },
    social: {
        linkedin: 'claire-masamba',
        researchgate: 'C_Masamba',
        googleScholar: 'CMasamba123'
    },
    metrics: {
        citations: 380,
        hIndex: 11,
        publications: {
            journals: 20,
            conferences: 7,
            books: 2
        }
    }
  },
  {
    id: 'm9',
    name: 'Prof. Philippe Nseka',
    title: 'Directeur de Recherche',
    image: "/images/prof-yawidi.jpg",
    institution: 'UPN',
    specialization: 'Sciences de l\'Éducation',
    bio: 'Expert en politique éducative et gestion des systèmes éducatifs...',
    email: 'philippe.n@upn.cd',
    publications: 42,
    research_areas: ['Politique Éducative', 'Gestion Éducative'],
    achievements: ['Prix d\'Excellence en Recherche 2019', 'Certificat de Leadership Académique'],
    current_projects: [
        {
            title: 'Réforme du Système Éducatif',
            description: 'Analyse et recommandations pour la modernisation'
        }
    ],
    education: [
        {
            degree: 'Doctorat en Sciences de l\'Éducation',
            institution: 'Université de Kinshasa',
            year: '2003'
        }
    ],
    contact: {
        office: 'Bâtiment A, Bureau 401',
        phone: '+243 789 123 456',
        website: 'www.upn.cd/pnseka'
    },
    social: {
        linkedin: 'philippe-nseka',
        researchgate: 'P_Nseka',
        googleScholar: 'PNseka678'
    },
    metrics: {
        citations: 680,
        hIndex: 16,
        publications: {
            journals: 28,
            conferences: 11,
            books: 3
        }
    }
  },
  {
    id: 'm10',
    name: 'Dr. Thérèse Kalonji',
    title: 'Chercheuse Senior',
    image: "/images/prof-yawidi.jpg",
    institution: 'UPN',
    specialization: 'Pédagogie',
    bio: 'Experte en éducation inclusive et besoins spéciaux...',
    email: 'therese.k@upn.cd',
    publications: 33,
    research_areas: ['Éducation Inclusive', 'Besoins Spéciaux'],
    achievements: ['Prix Innovation Inclusive 2020', 'Certification en Éducation Spécialisée'],
    current_projects: [
        {
            title: 'Éducation Inclusive en RDC',
            description: 'Développement de programmes pour l\'inclusion scolaire'
        }
    ],
    education: [
        {
            degree: 'Doctorat en Sciences de l\'Éducation',
            institution: 'Université de Kinshasa',
            year: '2011'
        }
    ],
    contact: {
        office: 'Bâtiment D, Bureau 302',
        phone: '+243 891 234 567',
        website: 'www.upn.cd/tkalonji'
    },
    social: {
        linkedin: 'therese-kalonji',
        researchgate: 'T_Kalonji',
        googleScholar: 'TKalonji901'
    },
    metrics: {
        citations: 410,
        hIndex: 12,
        publications: {
            journals: 21,
            conferences: 9,
            books: 3
        }
    }
  }
]

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null)

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization = !selectedSpecialization || 
                                 member.specialization === selectedSpecialization
    return matchesSearch && matchesSpecialization
  })

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Nos Membres</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez notre équipe de chercheurs et experts dédiés à l'avancement 
          de la recherche en éducation en République Démocratique du Congo.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un membre..."
            className="pl-10"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
            {specializations.map((spec) => (
                <Badge
                key={spec}
                variant={
                    spec === 'Tous' && !selectedSpecialization ? 'default' :
                    selectedSpecialization === spec ? 'default' : 'outline'
                }
                className="cursor-pointer hover:bg-primary/90 transition-colors"
                onClick={() => setSelectedSpecialization(spec === 'Tous' ? null : spec)}
                >
                {spec}
                </Badge>
            ))}
            </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-64">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-xl font-bold text-white">{member.name}</h3>
              <p className="text-white/90">{member.title}</p>
            </div>
          </div>
          
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4" />
                {member.institution}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="h-4 w-4" />
                {member.specialization}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                {member.email}
              </div>
            </div>
        
            <div>
              <h4 className="font-semibold mb-2">Formation</h4>
              <div className="space-y-1">
                {member.education.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{edu.degree}</span>
                    <span className="text-gray-500"> • {edu.institution}, {edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
        
            <div>
              <h4 className="font-semibold mb-2">Métriques de recherche</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{member.metrics.publications.journals}</p>
                  <p className="text-xs text-gray-500">Articles</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{member.metrics.citations}</p>
                  <p className="text-xs text-gray-500">Citations</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{member.metrics.hIndex}</p>
                  <p className="text-xs text-gray-500">Index H</p>
                </div>
              </div>
            </div>
        
            <div>
              <h4 className="font-semibold mb-2">Projets en cours</h4>
              <div className="space-y-2">
                {member.current_projects.map((project, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{project.title}</p>
                    <p className="text-gray-500">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
        
            <div className="flex flex-wrap gap-2">
              {member.research_areas.map((area) => (
                <Badge key={area} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
        
            <div className="flex justify-center gap-4 pt-4 border-t">
              {member.social.linkedin && (
                <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
                  LinkedIn
                </a>
              )}
              {member.social.researchgate && (
                <a href={member.social.researchgate} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
                  ResearchGate
                </a>
              )}
              {member.social.googleScholar && (
                <a href={member.social.googleScholar} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
                  Google Scholar
                </a>
              )}
            </div>
          </CardContent>
        </Card>
        ))}
      </div>
    </div>
  )
}