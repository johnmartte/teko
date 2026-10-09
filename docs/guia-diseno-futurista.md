# Guía de diseño: futurista sin que parezca hecho con IA

Esta guía explica las decisiones detrás del rediseño de teko.do para que se puedan replicar en otra marca con **colores distintos**. Lo que se transfiere no son los colores. Es la disciplina: pocos recursos, aplicados con precisión.

> Regla madre: **lo futurista se siente con restricción, no con efectos.** La IA genera "futuro" a base de gradientes morados, glow por todas partes y emojis. Un diseño humano usa un solo acento, mucho negro y detalles tipográficos que una máquina no suele elegir.

---

## 1. Por qué los diseños hechos con IA se reconocen

Si un diseño tiene varias de estas cosas, se nota que lo hizo una IA. Hay que evitarlas todas:

| Señal de IA | Qué hicimos en su lugar |
|---|---|
| Gradiente morado → azul → rosa de fondo | Fondo casi negro y plano, con **un solo** halo radial muy tenue arriba |
| Glow neón en cada botón y tarjeta | Brillo solo en 1 o 2 elementos por pantalla (CTA principal, número clave) |
| Muchos colores de acento compitiendo | **Un único color de acento.** El resto son blancos con distinta opacidad |
| Texto blanco puro `#fff` sobre negro puro `#000` | Blanco roto `#f2f3f5` sobre negro azulado `#080a0f` |
| Todo centrado y simétrico | Hero alineado a la izquierda, grids con tamaños distintos |
| Tarjetas idénticas en filas de 3 con icono arriba | Tarjetas con jerarquía distinta y contenido real (números, nombres de clientes) |
| Emojis o iconos 3D como decoración | Iconos lineales finos (lucide) o ninguno |
| Titulares genéricos ("Transforma tu negocio con IA") | Copy concreto con una palabra destacada en serif itálica |
| Animaciones que rebotan o giran | Entradas cortas y suaves: subir 20px + aparecer |
| Bordes gruesos de colores | Bordes de 1px en blanco al 10% |

---

## 2. Color

### La estructura (se mantiene con cualquier marca)

```
Fondo base        #080a0f   negro con un toque del tono de la marca, nunca #000
Superficie        rgba(255,255,255,0.04)   tarjetas, inputs
Superficie hover  rgba(255,255,255,0.06)
Borde             rgba(255,255,255,0.10)   siempre 1px
Borde sutil       rgba(255,255,255,0.06)   divisores

Texto principal   #f2f3f5
Texto secundario  rgba(242,243,245,0.72)
Texto terciario   rgba(242,243,245,0.55)
Texto apagado     rgba(242,243,245,0.40)

ACENTO            #1ec4ff en TEKO → aquí va el color de la nueva marca
Acento suave      ACENTO al 12% de opacidad (fondos de badges, item activo)
Acento borde      ACENTO al 30%
```

### Decisiones

- **La jerarquía se hace con opacidad, no con colores.** Un solo blanco con 4 niveles de transparencia. Así todo se ve parte de lo mismo.
- **El negro tiene tinte.** `#080a0f` tira levemente a azul porque TEKO es azul. Para una marca verde usaría algo como `#080c0a`; para una cálida, `#0d0a08`. Así el fondo combina con el acento sin que se note el truco.
- **El acento es escaso.** Aparece en: botón principal, la etiqueta pequeña arriba del título, números grandes, el item activo del menú. Nada más. Si todo es acento, nada destaca.
- **Botón principal sólido con texto oscuro** (acento de fondo y `#080a0f` de texto). No usar botones con gradiente.
- **Versión clara del acento para palabras en serif**: en TEKO es `#bfe9ff` (el cyan casi blanco). Brilla sin cansar la vista.
- **Errores y estados** usan rojo `#f87171` y verde `#4ade80` con la misma lógica (sólido para el texto, 12% para el fondo).

### Adaptar a otra paleta

1. Elige **un** color de acento con buena luminosidad (que se lea sobre negro).
2. Teñir el negro base hacia ese tono, muy poco.
3. Crea la versión clara del acento (mezcla del acento con mucho blanco) para las palabras destacadas.
4. No agregues un segundo acento. Si la marca tiene dos colores, el segundo se usa solo en ilustraciones o imágenes, nunca en la interfaz.

---

## 3. Tipografía (lo que más aleja el diseño de la IA)

### Dos fuentes, roles fijos

- **Sans (Geist / Inter):** todo el texto funcional.
- **Instrument Serif itálica:** solo **una palabra por titular**. Nunca un párrafo, nunca un titular completo.

```
Hacemos que tus <em>servicios</em> trabajen por ti
```

Este contraste entre una sans precisa y una serif editorial es lo que hace que la página se sienta "de diseñador" y no "de plantilla". La palabra en serif va en peso 400 y en el color claro del acento.

### Valores exactos

```
H1 hero      clamp(36px, 5vw, 58px)   weight 600   line-height 1.02   letter-spacing -0.035em
H2 sección   clamp(28px, 4vw, 44px)   weight 600   line-height 1.1    letter-spacing -0.03em
H3 tarjeta   16–26px                  weight 600                      letter-spacing -0.02em
Eyebrow      12–13px  MAYÚSCULAS  weight 600  letter-spacing 0.08em  color ACENTO
Cuerpo       15–17px  color texto secundario  line-height 1.6
Labels       11px  MAYÚSCULAS  letter-spacing amplio  color texto apagado
```

### Decisiones

- **Titulares con tracking negativo** (letras más juntas). Es lo que hacen Apple, Linear o Vercel. La IA casi siempre deja el tracking por defecto.
- **Etiquetas pequeñas en mayúsculas con tracking positivo** encima de cada título ("SERVICIOS", "NUESTRO PROCESO"). Dan ritmo y aire técnico.
- **Peso 600, no 800.** Los titulares muy gruesos se ven de plantilla. Semibold con tracking negativo se ve más caro.
- **`text-wrap: balance`** en titulares para que no queden palabras sueltas en la última línea.
- **Tipografía gigante como textura**: el "TEKO" enorme del footer (`clamp(90px, 20vw, 300px)`) o un "Aa" en serif al 4–5% de opacidad detrás de una tarjeta. Es decorativo, no se lee, y da profundidad sin usar imágenes.

---

## 4. Superficies y profundidad (glass sin exagerar)

```css
background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
border: 1px solid rgba(255,255,255,0.1);
border-radius: 16px;          /* 12px en inputs y botones */
backdrop-filter: blur(12px);  /* solo en header fijo y modales */
```

- **El gradiente de la tarjeta va de 4% a 2%**: casi imperceptible, pero hace que la tarjeta parezca iluminada desde arriba.
- **El blur se usa solo donde hay algo detrás** (header al hacer scroll, modales). Ponerle blur a todo es otra señal de IA.
- **Sin sombras de color.** Las sombras, si existen, son negras. El "glow" de color se reserva para el CTA principal.
- **Fondos de sección**: un halo radial suave arriba, no un gradiente completo:

```css
background: radial-gradient(60% 40% at 50% 0%, ACENTO_al_12%, transparent 70%);
```

- **Hover sutil**: la superficie pasa de 4% a 6% y el borde de 10% a 15–30% de acento. Nada de escalar tarjetas al 110%.

---

## 5. Movimiento (GSAP)

Una sola forma de entrar, usada en todo el sitio. La consistencia es lo que hace que se sienta diseñado.

```js
gsap.fromTo(el,
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: i * 0.08,
    scrollTrigger: { trigger: el, start: "top 85%", once: true } }
);
```

### Decisiones

- **`power3.out`**: arranca rápido y frena suave. Se siente premium. Evitar `bounce`, `elastic` o `back`, que se ven de juguete.
- **Distancia corta (20px) y duración corta (0.7s).** El usuario no debería "ver" la animación, solo sentir que la página está viva.
- **Stagger de 0.08s** entre elementos de un grupo (eyebrow → título → texto → botones).
- **`once: true`**: anima una vez. Que las cosas se re-animen al subir y bajar cansa.
- **Números que cuentan** desde 0 en las estadísticas. Es de lo poco que sí llama la atención a propósito.
- **Respetar `prefers-reduced-motion`**: si el usuario lo pide, no hay animación.
- **Micro-interacciones** con `cubic-bezier(0.23, 1, 0.32, 1)` y 150–200ms.

---

## 6. Layout

- **Hero alineado a la izquierda** con el contenido en máximo ~720px de ancho. Lo centrado es lo primero que hace una IA.
- **Mucho espacio vertical** entre secciones (96–160px). El aire es lo que hace que el negro se vea elegante y no vacío.
- **Contenedor de 1200–1280px** con padding lateral de 24px en móvil.
- **Grids con jerarquía**: una tarjeta destacada más grande que las demás, o un plan "recomendado" con borde de acento.
- **Contenido real en vez de relleno**: capturas de proyectos reales, nombres de clientes, cifras concretas. Lo genérico delata a la IA más que cualquier color.

---

## 7. Detalles que suman

- Selección de texto con el acento al 20–30%.
- Foco de teclado visible: `outline: 2px solid ACENTO; outline-offset: 2px`.
- `<select>` con fondo de opciones `#0d1017` para que no aparezca el menú blanco del sistema.
- Placeholders en todos los inputs, en el texto apagado (40%).
- Páginas de error con el mismo lenguaje: número enorme con gradiente de acento a transparente y una palabra en serif ("Página no *encontrada*").

---

## 8. Prompt listo para copiar

Cambia lo que está entre corchetes:

```
Diseña [nombre de la página] con estética oscura premium y futurista que NO parezca hecha con IA.

Paleta:
- Fondo #[negro teñido hacia el color de marca], nunca #000.
- Un solo color de acento: #[ACENTO]. Úsalo solo en el botón principal, las etiquetas
  pequeñas sobre los títulos, números destacados y el estado activo. Nada más.
- Versión clara del acento #[ACENTO claro] solo para la palabra en serif de cada titular.
- Texto #f2f3f5 con jerarquía por opacidad (100%, 72%, 55%, 40%).
- Superficies en rgba(255,255,255,0.04) con borde 1px rgba(255,255,255,0.1), radio 16px.

Tipografía:
- Sans (Geist o Inter) para todo. Titulares peso 600, letter-spacing -0.03em, line-height ~1.05.
- Instrument Serif itálica SOLO en una palabra por titular.
- Etiqueta en mayúsculas de 12px con letter-spacing 0.08em encima de cada título de sección.

Profundidad:
- Un halo radial suave del acento al 12% arriba del hero. Sin gradientes de fondo completos.
- Blur solo en el header fijo y en modales. Sin sombras de color salvo en el CTA principal.

Movimiento (GSAP):
- Entrada única para todo: opacity 0→1, y 20→0, 0.7s, power3.out, stagger 0.08s,
  ScrollTrigger start "top 85%", once: true. Respeta prefers-reduced-motion.
- Prohibido bounce, elastic, rotaciones o escalados grandes.

Layout:
- Hero alineado a la izquierda, no centrado. Mucho espacio entre secciones (120px+).
- Grids con jerarquía (un elemento destacado), no filas de tarjetas idénticas.

Prohibido: gradientes morado-rosa, glow en todo, emojis, iconos 3D, más de un color de acento,
blanco puro sobre negro puro, titulares genéricos tipo "Transforma tu negocio".
```
