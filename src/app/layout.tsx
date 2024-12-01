import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Naval Tactical Simulator',
  description: 'A sophisticated naval tactical simulation system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} fixed inset-0`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 