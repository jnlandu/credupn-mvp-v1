import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import FooterClient from '@/components/FooterClient'
import { Toaster } from "@/components/ui/toaster"
import ScrollToTop from '@/components/backTop';
import { ChatBot } from '@/components/ChatBot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CRIDUPN - Centre de Recherche Interdisciplinaire',
  description: 'Centre de Recherche Interdisciplinaire de l\'Université Pédagogique Nationale (RDC)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>
            < ScrollToTop/>
            {children}
            
          </main>
          <ChatBot /> {/* Add here, before Footer */}
          <Toaster />
          <FooterClient />
          
        </ThemeProvider>
       
      </body>
    </html>
  );
}