import './globals.css';

export const metadata = {
  title: 'Déjanos tu reseña',
  description: 'Gracias por visitarnos, cuéntanos qué tal tu experiencia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
