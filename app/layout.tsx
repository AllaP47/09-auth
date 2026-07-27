import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { TanStackProvider } from '../components/TanStackProvider/TanStackProvider';
import { AuthProvider } from '../components/AuthProvider/AuthProvider';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import './globals.css';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'Зручний додаток для створення та керування вашими особистими нотатками.',
};


interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}


export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en" className={roboto.variable}>
      <body 
        className={roboto.className} 
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}
      >
        <TanStackProvider>
       
          <AuthProvider>
            <Header />
            <div style={{ flex: '1 0 auto' }}>
              {children}
            </div>
          
            {modal}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}



