import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import FooterClient from '@/components/FooterClient'
import { Toaster } from "@/components/ui/toaster"

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
            
            {children}
            
          </main>
          <Toaster />
          <FooterClient />
          
        </ThemeProvider>
       
      </body>
    </html>
  );
}