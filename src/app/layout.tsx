import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PhoneBook — CRUD App',
  description: 'Manajemen data kontak telepon dengan Next.js & MySQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
