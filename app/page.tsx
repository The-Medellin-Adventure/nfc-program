export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        background: '#0f172a',
        color: 'white',
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Servicio de tarjetas NFC para reseñas
        </h1>
        <p style={{ opacity: 0.7 }}>
          Cada negocio tiene su propia página en /nombre-del-negocio
        </p>
      </div>
    </main>
  );
}
