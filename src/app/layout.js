import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Skillease',
  description: 'Connect with trusted local service providers. From electricians to tutors, find the perfect professional with real-time location tracking.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}