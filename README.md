# ⚡ Guerreros del Cálculo - Mundo Mate 4º
### Matemáticas Épicas, Gamificadas e Interactivas (PWA 100% Offline para Tablet Android)
### Adaptado 100% al libro "Esto es lo más" (Matemáticas 4) · Editorial Edelvives
### Para niños de 9 años (4º de Educación Primaria en España) | Inspirado en la pedagogía adaptativa de Smartick

¡Bienvenido a **Guerreros del Cálculo** (Mundo Mate 4º)! Una Progressive Web App (PWA) educativa gamificada, interactiva y adaptativa creada a medida del currículo oficial del libro escolar: **"Esto es lo más" de la Editorial Edelvives (4º de Educación Primaria)**, ambientada en un universo anime shonen de artes marciales y energía cósmica 100% original (sin marcas registradas ni derechos de autor).

---

## 📱 Guía de Instalación en Tablet Android (GitHub Pages)

Esta aplicación está especialmente diseñada y optimizada para usarse en **tablets Android** (orientación horizontal o vertical) a pantalla completa y **100% offline** (sin necesidad de WiFi ni conexión a datos una vez instalada).

### Paso 1: Publicar en GitHub Pages
1. Sube este repositorio a tu cuenta de GitHub (por ejemplo: `https://github.com/tu-usuario/app-mates`).
2. En GitHub, entra en tu repositorio y haz clic en **Settings** (Configuración) ⚙️.
3. En el menú lateral izquierdo, haz clic en **Pages**.
4. En **Build and deployment > Source**, selecciona **Deploy from a branch**.
5. En **Branch**, selecciona `main` (o `master`) y la carpeta `/(root)`. Haz clic en **Save**.
6. En un par de minutos, GitHub te dará la URL pública del juego (ej: `https://tu-usuario.github.io/app-mates/`).

### Paso 2: Instalar en la Tablet Android del niño
1. Abre **Google Chrome** en la tablet Android.
2. Navega a la URL de GitHub Pages de tu juego.
3. Pulsa el botón de los tres puntos verticales **(⋮)** en la esquina superior derecha de Chrome.
4. Selecciona **"Instalar aplicación"** o **"Añadir a la pantalla de inicio"**.
5. Confirma la instalación. Aparecerá el icono oficial de **Guerreros del Cálculo** con el escudo dorado del Ki en el escritorio de la tablet.
6. ¡Listo! Al tocar el icono, la app se abrirá a **pantalla completa (modo app nativa)**, sin barra de direcciones del navegador y con respuesta táctil instantánea (`touch-action: manipulation`).

### Paso 3: Uso 100% Offline (Sin Conexión)
- Gracias al Service Worker (`sw.js`) con estrategia *Cache-First*, la app almacena localmente todos los archivos (código, estilos, lógica, vectores SVG y manifest).
- El niño puede abrir el juego en el coche, de viaje o en cualquier lugar sin conexión a internet y todo su progreso se guardará de forma persistente en la tablet (`localStorage`).

---

## 🔐 Control Parental de Seguridad (PIN 2026)

Para proteger las estrellas, monedas, Ki acumulado y villanos derrotados de cualquier borrado accidental:
- Al pulsar **"Reiniciar Progreso"** (desde el menú de Perfil o el Dojo), se abre un diálogo de confirmación que requiere introducir el **PIN de seguridad parental: `2026`**.
- El botón de reinicio permanece bloqueado y deshabilitado hasta que se introduce el PIN correcto.

---

## 🥋 Temática: Guerreros del Cálculo (Estilo Shonen 100% Original)

- **Nivel de Poder (Ki de Combate ⚡):** Cada acierto suma Ki a tu guerrero (500 Ki, 1.000 Ki, 3.000 Ki, 7.000 Ki, 15.000+ Ki).
- **5 Modos de Transformación y Auras Animadas:**
  1. **Modo Aprendiz (Base):** Pelo oscuro estilo Shonen y Dogi naranja de artes marciales.
  2. **Modo Destello (1.000 Ki / Combo x3):** Pelo erizado dorado y aura brillante con partículas radiantes.
  3. **Modo Furia Solar (3.000 Ki / Combo x6):** Pelo ardiente y aura rojo carmesí de gran intensidad.
  4. **Modo Cósmico (7.000 Ki / Combo x9):** Pelo y aura plasma azul eléctrico con relámpagos de energía.
  5. **Modo Astral (15.000 Ki / Maestro):** Pelo blanco plateado celestial y aura legendaria.

---

## 🦹 Colección de 11 Villanos Matemáticos en SVG

Cada unidad escolar y modo de juego cuenta con su propio villano temático original:
1. **Lord Cero (U1 · La Tierra en cifras):** El amo del vacío que absorbe las decenas de millar.
2. **Dr. Restas (U2 · ¿Echamos una partida?):** Científico loco que roba números en las llevadas.
3. **General Multiplicón (U3 · ¡Que empiece la función!):** Táctico acorazado con escudo de factores.
4. **Sombra Divisora (U4 · Mensajes cifrados):** Ente oscuro que divide y oculta los restos.
5. **Monstruo Fraccionario (U5 · ¡Toma tu parte!):** Bestia de gelatina que devora porciones de pizza.
6. **Barón Simetría (U6 · Patrones y formas):** Aristócrata con monóculo que invierte los ejes cartesianos.
7. **Titán Poliedro (U7 · Geometría urbana):** Gigante de cristal geométrico hecho de caras, aristas y vértices.
8. **Conde Probábilis (U8 · Una población diversa):** Vampiro estadístico que juega con canicas y dados.
9. **Megawatt Desperdicio (U9 · Reduce, reutiliza y recicla):** Robot oxidado que desequilibra las balanzas.
10. **Káiser Blitz (Misión Tablas):** Autómata cibernético de cálculo relámpago.
11. **Rey del Caos Numérico (Sesión del Día):** El monarca cósmico que desafía todos los saberes.

---

## ⚔️ Arena de Combate y Feedback Visual ("Juice")

- **Arena Compacta Héroe vs. Villano:** Ubicada entre la pregunta y las opciones, muestra al niño con su aura activa y barra de Energía Ki a la izquierda, y al Villano con su barra de Vida (HP) a la derecha.
- **Al acertar:** El héroe adopta postura de ataque, lanza un rayo de energía cósmica (`#energy-beam`) hacia el villano, reduce su barra de vida en tiempo real y aumenta el Combo de Energía (`💥 COMBO xN`).
- **Al fallar (Pedagogía respetuosa):** El villano despliega una burbuja de bloqueo suave (`🛡️ ¡BLOQUEO!`) sin ninguna agresividad y resalta con un brillo dorado el botón de **"💡 ¿Necesitas una pista?"**.
- **Cuadrícula de Opciones Adaptativa:** Preguntas con 4 opciones se muestran en 2x2 simétrica, y con 3 opciones se adaptan automáticamente a 3 columnas horizontales (`grid-cols-3`).
- **Rachas Diferenciadas:** La barra superior muestra la **Racha de días** de entrenamiento diario (con cálculo de fecha real `lastPlayDate`), mientras que en combate se muestra el **Combo de Energía**.

---

## 🥋 Selección de Guerreros y Desequipar

El niño puede elegir y alternar en cualquier momento entre **5 Arquetipos de Guerreros Shonen originales**:
1. **🐉 Kaito (Guerrero Dragón):** Maestro del fuego matemático.
2. **⚡ Akira (Guerrera Relámpago):** Veloz como el trueno.
3. **🐅 Ren (Guerrero Tigre):** Feroz e indomable con marcas marciales.
4. **✨ Sakura (Guerrera Astral):** Sabiduría geométrica y lazos de seda dorada.
5. **🤖 Ryu-01 (Cíborg del Ki):** Héroe tecnomarcial con reactor de Ki cuántico.

- **Modo Guerrero Puro (Desequipar Todo):** Con un solo toque, el avatar luce su peinado original, marcas faciales, aura activa y kimono auténtico.
- **Tarjetas de Desequipar en el Dojo:** Opciones de desequipar accesorio individual en cada una de las 4 categorías.

---

## 📚 Las 9 Unidades Oficiales de Edelvives "Esto es lo más"

| Unidad | Título oficial | ODS | Saberes Básicos cubiertos |
|---|---|---|---|
| **U1** | **La Tierra en cifras** | ODS 15 (Vida terrestre) | Números de 4 y 5 cifras, descomposición (DM, UM, C, D, U), valor posicional, comparar ($<, >$), aproximar y redondear a decenas, centenas y millares. Problemas de fauna y flora. |
| **U2** | **¿Echamos una partida?** | ODS 16 (Paz y justicia) | Sumas con llevada (hasta 5 cifras), restas con llevada (con ceros en el minuendo), operaciones inversas y la prueba de la resta ($M = S + D$). Problemas de juegos y puntuaciones. |
| **U3** | **¡Que empiece la función!** | ODS 4 (Educación) | Tablas de multiplicar, cálculo mental ($\times 10, 100, 1000$), multiplicación por 1 y 2 cifras, y propiedades conmutativa, asociativa y distributiva. Problemas de auditorios y funciones. |
| **U4** | **Mensajes cifrados** | ODS 17 (Alianzas) | Términos de la división (dividendo, divisor, cociente, resto), división exacta y entera, división por 1 y 2 cifras, operaciones combinadas con paréntesis y jerarquía, problemas de descifrado empezando por el final. |
| **U5** | **¡Toma tu parte!** | ODS 5 (Igualdad) | Concepto visual de fracción (numerador y denominador), tartas y pizzas interactivas, comparar y ordenar fracciones (igual denominador, igual numerador, unidad), suma y resta con igual denominador. |
| **U6** | **Patrones y formas** | ODS 8 (Trabajo) | Coordenadas cartesianas en cuadrícula $(X, Y)$ interactiva, itinerarios y rutas (Norte, Sur, Este, Oeste), simetría respecto a un eje, traslaciones y giros de 90° y 180°, problemas de averiguar el dato falso. |
| **U7** | **Geometría urbana** | ODS 9 (Innovación) | Figuras geométricas (polígonos, triángulos: equilátero, isósceles, escaleno; cuadriláteros), poliedros (caras, aristas y vértices en cubos, prismas y pirámides), cuerpos redondos (cilindro, cono, esfera). Descripciones completas en píldoras 100% legibles. |
| **U8** | **Una población diversa** | ODS 10 (Desigualdades) | Estudios estadísticos, tablas de frecuencia, moda, gráficos de barras interactivos en SVG, pictogramas con valor múltiple y cálculo de probabilidades (suceso seguro, posible e imposible, urnas con cantidad exacta de canicas dibujadas). |
| **U9** | **Reduce, reutiliza y recicla** | ODS 11 (Ciudades sostenibles) | Balanzas en equilibrio e igualdades ($=, \neq, <, >$), pesas con incógnitas, series y patrones numéricos crecientes, decrecientes y multiplicativos, separación correcta de residuos (azul, amarillo, verde, marrón) y pensamiento computacional (secuencias y bucles con repeticiones). |

---

## 🎯 Selector de Dificultad Manual y Adaptativo

- **Selector Horizontal en Pantalla Principal**:
  - `⭐ Nivel 1: Básico · Gravedad x1`
  - `⭐⭐ Nivel 2: Intermedio · Gravedad x10`
  - `⭐⭐⭐ Nivel 3: Avanzado · Gravedad x50`
  - `⭐⭐⭐⭐ Nivel 4: Experto · Gravedad x100`
- **Cambio de Nivel en Vivo**: Pulsando el botón de nivel durante un ejercicio, el reto actual se recarga y adapta en tiempo real.
- **Adaptación Continua**: El algoritmo ajusta automáticamente el nivel con las rachas de aciertos o errores sin frustración.

---

## ✖️⚡ Misión Especial: Tablas de Multiplicar

- Práctica libre o guiada de las tablas del 1 al 12.
- Foco intensivo en las tablas difíciles (6, 7, 8 y 9).
- Matrices visuales de filas y columnas en SVG, factores misteriosos y cálculo relámpago con decenas y centenas.
