import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/providers/AuthProvider'
import NavbarWrapper from '@/components/layout/NavbarWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import GlobalOverlays from '@/components/layout/GlobalOverlays'
import { Inter, Space_Grotesk, Bodoni_Moda, Geist } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })
const bodoniModa = Bodoni_Moda({ subsets: ['latin'], variable: '--font-bodoni-moda', style: ['italic', 'normal'] })

export const metadata: Metadata = {
  title: 'Tracknit | Premium Music Licensing',
  description: 'Premium Royalty-Free Music. From start to success, We track it all.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

import { cn } from "@/lib/utils";
import { TooltipProvider } from '@/components/ui/tooltip';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("dark", inter.variable, spaceGrotesk.variable, bodoniModa.variable, "font-sans", geist.variable)}>
      <head>
        <link href="https://fonts.cdnfonts.com/css/roslane" rel="stylesheet" />
      </head>
      <body className="font-body selection:bg-[#3b82f6]/30 selection:text-white">
        <AuthProvider>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <NavbarWrapper />
              <main className="flex-grow">
                {children}
              </main>
              <FooterWrapper />
            </div>
            <GlobalOverlays />
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
