import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import AdminNavbar from './AdminNavbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {isAdminPage && <AdminNavbar />}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}