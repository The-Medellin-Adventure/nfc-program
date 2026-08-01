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

// El título de la pestaña del navegador = nombre del negocio de cada cliente
export function generateMetadata({ params }: { params: { client: string } }) {
  const data = clientsData[params.client];
  if (!data) return {};
  return {
    title: data.nombre,
    description: data.subtitulo || data.descripcion,
  };
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
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        textAlign: 'center',
        background: `radial-gradient(circle at 50% 0%, ${data.colorPrimario}22, ${data.colorFondo} 55%)`,
        color: 'white',
      }}
    >
      <div
        className="fade-in"
        style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        {/* Logo enmarcado */}
        <div
          style={{
            width: '168px',
            height: '168px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.04)',
            border: `2px solid ${data.colorPrimario}66`,
            boxShadow: `0 0 0 8px rgba(255,255,255,0.03)`,
          }}
        >
          <Image
            src={data.logo}
            alt={data.nombre}
            width={110}
            height={110}
            style={{ objectFit: 'contain', borderRadius: '50%' }}
            priority
          />
        </div>

        {/* Nombre, subtítulo, divisor y descripción */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '1.9rem',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
            }}
          >
            {data.nombre}
          </h1>

          {data.subtitulo && (
            <p
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                opacity: 0.65,
              }}
            >
              {data.subtitulo}
            </p>
          )}

          <span
            aria-hidden="true"
            style={{
              width: '32px',
              height: '1px',
              background: `${data.colorPrimario}`,
              opacity: 0.8,
              margin: '0.15rem 0',
            }}
          />

          {data.descripcion && (
            <p
              style={{
                opacity: 0.72,
                maxWidth: '320px',
                fontSize: '0.92rem',
                lineHeight: 1.65,
                whiteSpace: 'pre-line',
                fontWeight: 400,
              }}
            >
              {data.descripcion}
            </p>
          )}
        </div>

        {/* Botones */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginTop: '0.5rem',
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
                  padding: '0.95rem',
                  borderRadius: '999px',
                  background: esPrincipal ? data.colorPrimario : 'transparent',
                  border: esPrincipal ? 'none' : `1.5px solid rgba(255,255,255,0.25)`,
                  color: 'white',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  boxShadow: esPrincipal ? `0 10px 30px -8px ${data.colorPrimario}bb` : 'none',
                  transition: 'transform 0.15s ease, opacity 0.15s ease',
                }}
              >
                {boton.texto}
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
