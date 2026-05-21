// app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import {ThemeProvider} from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Notes App - Organize Your Thoughts',
  description: 'A beautiful notes app to capture and organize your ideas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}