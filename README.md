# NFC Reviews — Landing por cliente (sin dominio propio)

Sistema para servir una página de "déjanos tu reseña en Google" por cada
cliente, cada uno en su propia ruta dentro de tu URL gratuita de Vercel:

```
tu-proyecto.vercel.app/restaurante-juan
tu-proyecto.vercel.app/cafe-aroma
```

No necesitas comprar dominio. Todo corre gratis con GitHub + Vercel.

## 1. Cómo funciona

- Un solo proyecto de Next.js sirve a todos los clientes.
- Los datos de cada cliente (nombre, logo, color, link de Google) están
  en `data/clients.json`. Agregar un cliente nuevo = agregar una entrada
  ahí, sin tocar el resto del código.
- `app/[client]/page.tsx` lee el slug de la URL y renderiza la
  presentación (logo, nombre, botón de reseña) de ese cliente.

## 2. Subir el proyecto a GitHub

```bash
cd nfc-reviews
git init
git add .
git commit -m "Proyecto inicial"
gh repo create nfc-reviews --private --source=. --push
# o si no usas GitHub CLI: crea el repo vacío en github.com y luego
git remote add origin https://github.com/TU_USUARIO/nfc-reviews.git
git branch -M main
git push -u origin main
```

## 3. Desplegar en Vercel (gratis)

1. Ve a https://vercel.com → "Add New Project" → importa tu repo de GitHub.
2. Framework Preset: detecta Next.js automáticamente, no cambies nada.
3. Deploy.
4. Vercel te da una URL fija gratis, algo como:
   `https://nfc-reviews-tuusuario.vercel.app`
   (puedes personalizar el nombre del proyecto antes de desplegar, en
   Project Settings → General → Project Name, para que la URL se vea
   más limpia, ej. `midistribuidora.vercel.app`).

Cada push a `main` redespliega automáticamente en ~1 minuto.

## 4. Agregar un cliente nuevo

Edita `data/clients.json`:

```json
"nombre-del-slug": {
  "nombre": "Nombre del Negocio",
  "logo": "/logos/nombre-del-slug.png",
  "colorPrimario": "#111111",
  "colorFondo": "#ffffff",
  "googleReviewUrl": "https://g.page/r/XXXXXXXX/review"
}
```

Sube el logo a `public/logos/nombre-del-slug.png` (recomendado: PNG
cuadrado, fondo transparente, 160x160px o más). El `nombre-del-slug`
será exactamente la ruta final: `tu-proyecto.vercel.app/nombre-del-slug`.

Haz commit y push — Vercel redepliega automáticamente.

## 5. Cómo conseguir el link de reseña de Google del cliente

1. En Google Maps o Google Search, el cliente busca su propio negocio.
2. Clic en "Escribir una reseña" — copia esa URL, o:
3. Alternativa más confiable: usa el
   [Place ID Finder de Google](https://developers.google.com/maps/documentation/places/web-service/place-id)
   para obtener el `place_id` del negocio, y arma el link así:
   `https://search.google.com/local/writereview?placeid=EL_PLACE_ID`

Ese es el link que va en `googleReviewUrl`.

## 6. Programar las tarjetas NFC

Con cualquier app de escritura NFC (ej. "NFC Tools", gratis en Android/iOS):
graba la URL completa, ej. `https://tu-proyecto.vercel.app/restaurante-juan`
en la tarjeta. Al acercar el celular, abre directo la página con el botón.

## 7. Seguridad ya incluida (todo gratis)

- **Sin source maps en producción** (`productionBrowserSourceMaps: false`):
  nadie puede reconstruir tu código original desde el navegador.
- **HTTPS automático** en el dominio `.vercel.app` (Vercel + Let's Encrypt),
  sin configuración adicional.
- **Cabeceras de seguridad** (`next.config.js`): CSP, X-Frame-Options,
  bloqueo de iframes ajenos, política de referrer restrictiva.
- **Páginas pre-generadas en el build** (`generateStaticParams`): cada
  página de cliente se genera como HTML estático en el momento del
  deploy, no hay endpoints de "búsqueda en vivo" que atacar.
- Consola sin `console.log` en producción (se eliminan automáticamente).

### Sobre "ocultar el código"

El HTML/CSS/JS que ve el navegador de un visitante **siempre es
técnicamente legible** — el navegador necesita poder ejecutarlo para
mostrar la página. Lo que sí logramos:

- El código queda minificado (nombres cortos, todo en una línea) —
  ilegible para alguien casual, aunque no "encriptado" ni imposible de
  leer para alguien muy insistente.
- No hay mapas de código fuente que faciliten reconstruirlo bonito.
- El visitante nunca descarga `clients.json` completo: solo recibe el
  HTML ya renderizado de SU cliente específico.

## 8. Cuándo pasar a un dominio propio

Cuando ya tengas clientes pagando y quieras verte más profesional
(`restaurante-juan.tuservicio.com` en vez de
`tu-proyecto.vercel.app/restaurante-juan`), el cambio es sencillo:
solo hay que comprar el dominio (~10 USD/año) y agregar un pequeño
middleware para leer subdominios en vez de rutas. Si llegas a ese punto,
dímelo y adaptamos el mismo proyecto sin perder nada de lo ya configurado.

## 9. Nota sobre uso comercial en Vercel

El plan gratuito (Hobby) de Vercel es oficialmente para uso personal/no
comercial. Puedes usarlo para probar y mostrar demos a clientes potenciales,
pero si ya estás cobrando por este servicio a negocios reales, lo correcto
según los términos de Vercel es pasar al plan Pro (USD 20/mes) para evitar
que te pausen el proyecto.
