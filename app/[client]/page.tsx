import { notFound } from 'next/navigation';
import clients from '../../data/clients.json';
import Image from 'next/image';

type Boton = {
  texto: string;
  url: string;
};

type ClientData = {
  nombre: string;
  subtitulo?: string;
  descripcion?: string;
  logo: string;
  colorPrimario: string;
  colorFondo: string;
  botones: Boton[];
};

const clientsData = clients as Record<string, ClientData>;

// Pre-genera cada página de cliente en el build (más rápido y no expone
// lógica de "búsqueda" en tiempo real al navegador).
export function generateStaticParams() {
  return Object.keys(clientsData).map((slug) => ({ client: slug }));
}

export default function ClientPage({ params }: { params: { client: string } }) {
  const data = clientsData[params.client];

  if (!data) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '3rem 1.5rem',
        background: data.colorFondo,
        color: 'white',
        textAlign: 'center',
      }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Image
          src={data.logo}
          alt={data.nombre}
          width={160}
          height={160}
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{data.nombre}</h1>

        {data.subtitulo && (
          <p style={{ fontSize: '1rem', opacity: 0.85, fontWeight: 500 }}>
            {data.subtitulo}
          </p>
        )}

        {data.descripcion && (
          <p
            style={{
              opacity: 0.7,
              maxWidth: '340px',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-line',
            }}
          >
            {data.descripcion}
          </p>
        )}
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {data.botones.map((boton, index) => {
          const esPrincipal = index === data.botones.length - 1;
          return (
            <a
              key={`${boton.url}-${index}`}
              href={boton.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                width: '100%',
                padding: '1rem',
                borderRadius: '999px',
                background: esPrincipal ? data.colorPrimario : 'transparent',
                border: esPrincipal ? 'none' : `2px solid ${data.colorPrimario}`,
                color: 'white',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '1rem',
                boxShadow: esPrincipal ? '0 8px 24px rgba(0,0,0,0.35)' : 'none',
              }}
            >
              {boton.texto}
            </a>
          );
        })}
      </div>
    </main>
  );
}
