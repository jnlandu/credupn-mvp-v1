import { Facebook, Twitter, Linkedin, Mail, Heart } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="sm:text-center bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">CRIDUPN</h3>
            <p className="text-gray-400">
              Centre de Recherche  Interdisciplinaire de l'Université Pédagogique Nationale
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/publications" className="text-gray-400 hover:text-white">
                  Publications
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="text-gray-400 hover:text-white">
                  Actualités
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>UPN, Kinshasa, RDC</li>
              <li>inforevue@cridupn-rdc.cd</li>
              <li>+243 000 000 000</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-white">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="mailto:contact@credupn.cd"
                className="text-gray-400 hover:text-white">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

       {/* Copyright */}
       <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} CRIDUPN. Tous droits réservés.</p>
          <p className="mt-2 flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500 inline fill-red-500" /> by 
            <Link href={"https://"} className="text-gray-400 hover:text-white mx-1">
              Telema
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

