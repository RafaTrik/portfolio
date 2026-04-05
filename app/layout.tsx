import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rafael Pérez — Full-Stack Developer',
  description: 'Full-stack developer with 6 years of production experience building systems that scale.',
  openGraph: {
    title: 'Rafael Pérez — Full-Stack Developer',
    description: 'Full-stack developer with 6 years of production experience building systems that scale.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
