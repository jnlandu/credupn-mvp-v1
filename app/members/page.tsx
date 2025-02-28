"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import {
  Search,
  GraduationCap,
  Building2,
  Mail,
  Globe,
  Filter,
  BookOpen,
  Award,
  Briefcase,
  ExternalLink,
  User,
  ChevronRight
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

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
  const [showFilters, setShowFilters] = useState(false)

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization = !selectedSpecialization || 
                                 member.specialization === selectedSpecialization
    return matchesSearch && matchesSpecialization
  })

  return (
    <div className="bg-gray-50/50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-primary/90 py-16 text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge className="bg-white/20 text-white hover:bg-white/30 mb-4">
              Notre Équipe
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Chercheurs et Experts
            </h1>
            <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
              Découvrez notre équipe de chercheurs et experts dédiés à l'avancement 
              de la recherche en éducation en République Démocratique du Congo.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto -mt-8 px-4 relative z-20">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher par nom ou spécialisation..."
                className="pl-10 py-6 text-base"
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filtrer
                <Badge className="ml-1 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                  {selectedSpecialization || 'Tous'}
                </Badge>
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium mb-2 text-gray-700">Spécialisation</h3>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec) => (
                  <Badge
                    key={spec}
                    variant={
                      spec === 'Tous' && !selectedSpecialization ? 'default' :
                      selectedSpecialization === spec ? 'default' : 'outline'
                    }
                    className="cursor-pointer hover:bg-primary/90 transition-colors px-3 py-1"
                    onClick={() => setSelectedSpecialization(spec === 'Tous' ? null : spec)}
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Members Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredMembers.length} Membres trouvés
            </h2>
            <p className="text-gray-600">
              {selectedSpecialization 
                ? `Spécialisation: ${selectedSpecialization}` 
                : 'Toutes les spécialisations'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMembers.map((member, index) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 bg-gray-500">
              <div className="relative h-64">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  style={{ objectPosition: '50% 15%' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge className="bg-primary/90 hover:bg-primary mb-2 border-0">
                    {member.specialization}
                  </Badge>
                  <h3 className="text-2xl font-bold  mb-1">{member.name}</h3>
                  <p className="font-medium">{member.title}</p>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Building2 className="h-4 w-4 text-gray-600" />
                    </div>
                    <span>{member.institution}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-gray-600" />
                    </div>
                    <span>{member.email}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div>
                    <h4 className="text-sm uppercase tracking-wider mb-3">Expertises</h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {member.research_areas.map((area) => (
                        <Badge key={area} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm uppercase tracking-wider mb-3">Métriques</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-black">{member.metrics.publications.journals}</p>
                        <p className="text-xs text-gray-600">Articles</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-black">{member.metrics.citations}</p>
                        <p className="text-xs text-gray-600">Citations</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-black">{member.metrics.hIndex}</p>
                        <p className="text-xs text-gray-600">Index H</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm uppercase tracking-wider mb-3">Formation</h4>
                    {member.education.map((edu, index) => (
                      <div key={index} className="flex items-start gap-3 mb-2">
                        <div className="bg-gray-100 p-2 rounded-full mt-1">
                          <GraduationCap className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{edu.degree}</div>
                          <div className="text-xs text-black">{edu.institution}, {edu.year}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="flex space-x-3">
                  {member.social.linkedin && (
                    <a 
                      href={`https://linkedin.com/in/${member.social.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-primary transition-colors"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                  {member.social.googleScholar && (
                    <a 
                      href={`https://scholar.google.com/citations?user=${member.social.googleScholar}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-primary transition-colors"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
                      </svg>
                    </a>
                  )}
                  {member.social.researchgate && (
                    <a 
                      href={`https://www.researchgate.net/profile/${member.social.researchgate}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-primary transition-colors"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.365 8.365 0 0 0-.078.53 9 9 0 0 0-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.121 0 0 0 .014 1.017 9 9 0 0 0 .05.727 7.946 7.946 0 0 0 .078.53h-.005a3.334 3.334 0 0 0 .112.438c.242.743.65 1.303 1.214 1.68.565.376 1.256.564 2.075.564.8 0 1.536-.213 2.105-.603.57-.39.94-.916 1.175-1.65.076-.235.135-.558.177-.93a10.9 10.9 0 0 0 .043-1.207v-.82c0-.095-.047-.142-.14-.142h-3.064c-.094 0-.14.047-.14.141v.956c0 .094.046.14.14.14h1.666c.056 0 .084.03.084.086 0 .36 0 .62-.036.865-.038.244-.1.447-.147.606-.108.385-.348.664-.638.876-.29.212-.738.35-1.227.35-.545 0-.901-.15-1.21-.323-.306-.174-.517-.4-.663-.645-.145-.244-.236-.54-.296-.826a6.9 6.9 0 0 1-.108-1.152c0-.31.01-.727.032-1.119a4.463 4.463 0 0 1 .163-1.01c.087-.282.214-.528.367-.727.153-.2.382-.366.608-.466.226-.1.544-.19.88-.19a1.997 1.997 0 0 1 1.105.346c.285.197.466.454.609.768.046.094.088.12.157.07l.978-.565c.07-.046.085-.093.045-.166-.04-.073-.105-.155-.168-.24a3.876 3.876 0 0 0-.538-.65c-.235-.219-.551-.422-.88-.57-.329-.15-.724-.23-1.159-.23zm-10.514.01c-.073 0-.11.033-.11.1v14.56c0 .07.037.105.11.105h1.615c.074 0 .11-.036.11-.106V.11c0-.066-.036-.1-.11-.1H9.072zm3.444 7.87c-.18.18-.27.397-.27.705a.972.972 0 0 0 .933.995c.323.003.526-.103.632-.29.105-.19.142-.94.153-.166a.972.972 0 0 0-.153-.597c-.07-.123-.211-.24-.35-.269-.14-.03-.362-.05-.448-.05-.323 0-.497.09-.497.268v-.596zM5.833 9.593a5.9 5.9 0 0 0-1.856.856c-.88-.282-.974-.313-1.076-.313-.112 0-.226.03-.282.14-.28.51-.04.25-.04.442v2.287c0 .095.047.142.143.142h.888c.058 0 .086-.023.086-.07a5.99 5.99 0 0 1 .008-.433v-.212c.007-.135.033-.198.11-.198.023 0 .047 0 .086.022.039.023.086.056.175.1a3.67 3.67 0 0 0 1.077.358c.101.023.168.085.168.174v.245c0 .551-.025.954-.112 1.354a3.444 3.444 0 0 1-.394 1.169 2.072 2.072 0 0 1-.706.786c-.298.2-.632.3-1.04.3-.576 0-.955-.176-1.25-.428-.294-.252-.501-.622-.67-.919-.045-.095-.075-.141-.18-.141-.042 0-.102 0-.132.047l-.57.30c-.083.047-.1.141-.55.235.349.808.8 1.336 1.406 1.71.606.376 1.363.618 2.2.618.974 0 1.69-.27 2.26-.731a4.363 4.363 0 0 0 1.304-1.7c.297-.687.466-1.394.525-2.058.06-.663.07-1.193.07-1.528 0-.344-.005-.645-.015-.919a4.644 4.644 0 0 0-.099-.879c-.094-.43-.24-.832-.427-1.164a3.323 3.323 0 0 0-.815-.957 3.386 3.386 0 0 0-1.216-.59A5.87 5.87 0 0 0 5.833 9.59v.003zm10.765.47c-.236 0-.417.08-.56.255-.146.176-.265.34-.35.578a3.635 3.635 0 0 0-.227 1.036 8.533 8.533 0 0 0-.071 1.142v.316a22.69 22.69 0 0 0 .039.903 6.15 6.15 0 0 0 .151 1.019c.093.352.227.68.41.878.112.197.262.282.467.282.22 0 .417-.088.58-.267.164-.18.295-.388.393-.619a2.93 2.93 0 0 0 .201-.962c.033-.377.05-.695.05-1.36 0-.574-.012-.908-.036-1.272-.023-.363-.09-.701-.183-.994-.092-.294-.237-.536-.408-.714a.901.901 0 0 0-.647-.22h.191zm-11.349.296c.376 0 .698.114.975.391.136.136.22.272.283.408.062.135.113.272.151.467.039.196.067.453.079.816.012.364.015.841.015 1.458 0 .439-.003.769-.015 1.022a6.94 6.94 0 0 1-.079.816 3.08 3.08 0 0 1-.15.642c-.63.18-.148.327-.284.462a1.493 1.493 0 0 1-.974.39c-.394 0-.698-.114-.987-.39a2.075 2.075 0 0 1-.3-.415 1.943 1.943 0 0 1-.163-.467 4.33 4.33 0 0 1-.09-.695 10.767 10.767 0 0 1-.026-.856c0-.59.01-1.055.026-1.394.016-.34.052-.602.09-.784.038-.181.093-.341.163-.463.07-.122.178-.257.3-.414.152-.16.324-.27.513-.323.19-.054.315-.081.473-.081z" />
                      </svg>
                    </a>
                  )}
                </div>
                
                <Button variant="outline" className="flex items-center gap-1 text-primary">
                  Profil complet <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredMembers.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800">Aucun membre trouvé</h3>
            <p className="text-gray-600 max-w-md mx-auto mt-2">
              Essayez d'ajuster vos critères de recherche ou de sélectionner une autre spécialisation.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization(null);
              }}
            >
              Réinitialiser la recherche
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}