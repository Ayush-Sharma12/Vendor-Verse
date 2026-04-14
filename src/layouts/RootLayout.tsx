import { type ReactElement } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Website from '@/layouts/Website';

interface RootLayoutProps {
  children: ReactElement;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Website>
      <Navbar />
      {children}
      <Footer />
    </Website>
  );
}
