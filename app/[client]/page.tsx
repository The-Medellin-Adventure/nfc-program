// ── IMPORTS ──────────────────────────────────────────────────────────
// Herramientas que usa este archivo.
import { notFound } from 'next/navigation';       // Muestra un 404 si el cliente no existe
import clients from '../../data/clients.json';    // Tu archivo de datos de todos los clientes
import Image from 'next/image';                   // Componente de imagen optimizado de Next.js

// ── TIPOS (solo para que TypeScript valide la forma de los datos) ──────
type Boton = {
  texto: string;
  url: string;
};

type ClientData = {
  nombre: string;
  subtitulo?: string;      // el "?" significa que es opcional
  descripcion?: string;
  logo: string;
  colorPrimario: string;
  colorFondo: string;
  botones: Boton[];         // una lista de botones
};

const clientsData = clients as Record<string, ClientData>;

// ── FUNCIÓN 1: generateStaticParams ─────────────────────────────────
// Le dice a Next.js: "en el momento de compilar, crea una página real
// (HTML) por cada cliente que exista en clients.json". Gracias a esto,
// cada cliente nuevo que agregues al JSON obtiene su propia página
// automáticamente, sin que tengas que tocar este archivo.
export function generateStaticParams() {
  return Object.keys(clientsData).map((slug) => ({ client: slug }));
}

// ── FUNCIÓN 2: generateMetadata (la que agregamos) ──────────────────
// Controla el título que aparece en la PESTAÑA DEL NAVEGADOR y en las
// vistas previas al compartir el link (WhatsApp, redes, etc).
// Busca los datos del cliente actual según la URL y usa su "nombre"
// como título de la pestaña.
export function generateMetadata({ params }: { params: { client: string } }) {
  const data = clientsData[params.client];
  if (!data) return {};
  return {
    title: data.nombre,
    description: data.subtitulo || data.descripcion,
  };
}

// ── FUNCIÓN 3: ClientPage (el componente principal) ─────────────────
// Esta es la que dibuja TODO lo que ves en pantalla: logo, nombre,
// subtítulo, descripción y botones. "params.client" es el slug que
// viene de la URL (ej: "entre-guaduales"), y con eso busca los datos
// exactos de ESE cliente en el JSON.
export default function ClientPage({ params }: { params: { client: string } }) {
  const data = clientsData[params.client];

  // Si alguien entra a una URL que no corresponde a ningún cliente,
  // muestra la página de error 404.
  if (!data) {
    notFound();
  }

  return (
    // Contenedor de toda la pantalla: fondo con degradado usando los
    // colores del cliente, todo centrado vertical y horizontalmente.
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
      {/* Columna central angosta que agrupa todo el contenido */}
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
        {/* ── LOGO ── círculo con anillo del color de marca alrededor */}
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

        {/* ── NOMBRE, SUBTÍTULO, LÍNEA DIVISORA Y DESCRIPCIÓN ── */}
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

          {/* Solo se muestra si el cliente tiene "subtitulo" en el JSON */}
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

          {/* Línea fina decorativa */}
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

          {/* Solo se muestra si el cliente tiene "descripcion" en el JSON */}
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

        {/* ── BOTONES ── recorre la lista "botones" del JSON y dibuja
            uno por cada elemento. El ÚLTIMO de la lista sale resaltado
            (fondo sólido); los demás salen solo con borde. */}
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
