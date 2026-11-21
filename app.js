/* ===================================================================
   MUNDO MATE 4º - MOTOR DEL JUEGO CON DIFICULTAD ADAPTATIVA
   Sistema estilo Smartick: Ajuste dinámico de nivel en tiempo real
   Matemáticas para 4º de Educación Primaria (España, 9 años)
   =================================================================== */

// Sistema de Audio Sintetizado con Web Audio API (100% autónomo)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn('Audio no disponible:', e);
    }
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch (e) {}
  }

  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  playCoin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [
        { f: 523.25, d: 0.15 },
        { f: 659.25, d: 0.15 },
        { f: 783.99, d: 0.15 },
        { f: 1046.50, d: 0.45 }
      ];
      let startTime = this.ctx.currentTime;
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, startTime);
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + n.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + n.d);
        startTime += n.d * 0.9;
      });
    } catch (e) {}
  }

  playLevelUp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [587.33, 739.99, 880.00, 1174.66]; // Re, Fa#, La, Re alto
      let startTime = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime + idx * 0.09);
        gain.gain.setValueAtTime(0.22, startTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + idx * 0.09 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime + idx * 0.09);
        osc.stop(startTime + idx * 0.09 + 0.3);
      });
    } catch (e) {}
  }
}

// Confetti Manager
class ConfettiManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 70) {
    if (!this.ctx) return;
    this.resize();
    const colors = ['#3aa0ff', '#4cd964', '#ff9500', '#ffd12d', '#ff5277', '#9b51e0'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: this.canvas.height / 2 - 100,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 16,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        life: 1
      });
    }
    if (!this.animId) this.animate();
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.particles = [];
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45;
      p.rotation += p.rotSpeed;
      p.life -= 0.012;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
      this.ctx.restore();

      if (p.life <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
      }
    }
    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.animate());
    } else {
      this.animId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// Catálogo del Dojo de Equipamiento (Guerreros del Cálculo)
const SHOP_CATALOG = [
  // Peinados y Cascos (type: 'hat')
  { id: 'hat_cap', type: 'hat', name: 'Gorra de Entrenamiento', icon: '🧢', price: 20 },
  { id: 'hat_crown', type: 'hat', name: 'Corona del Campeón', icon: '👑', price: 60 },
  { id: 'hat_wizard', type: 'hat', name: 'Gorro Místico de Sabio', icon: '🧙', price: 40 },
  { id: 'hat_helmet', type: 'hat', name: 'Casco de Combate Cósmico', icon: '🪖', price: 50 },
  { id: 'hat_party', type: 'hat', name: 'Cinta Frontal Ninja', icon: '🥋', price: 15 },

  // Visores de Energía (type: 'glasses')
  { id: 'glasses_cool', type: 'glasses', name: 'Visor Sombras Ki', icon: '🕶️', price: 25 },
  { id: 'glasses_star', type: 'glasses', name: 'Visor Estelar de Precisión', icon: '⭐', price: 35 },
  { id: 'glasses_nerd', type: 'glasses', name: 'Lentes de Cálculo Cuántico', icon: '👓', price: 20 },
  { id: 'glasses_vr', type: 'glasses', name: 'Visor Táctico de Nivel', icon: '🥽', price: 55 },

  // Armaduras y Kimonos (type: 'suit')
  { id: 'suit_super', type: 'suit', name: 'Capa de la Victoria', icon: '🦸', price: 45 },
  { id: 'suit_astro', type: 'suit', name: 'Armadura Espacial', icon: '🧑‍🚀', price: 70 },
  { id: 'suit_ninja', type: 'suit', name: 'Kimono de Guerrero Oscuro', icon: '🥋', price: 50 },
  { id: 'suit_chef', type: 'suit', name: 'Dogi Sagrado Blanco', icon: '🥋', price: 30 },

  // Compañeros de Batalla (type: 'pet')
  { id: 'pet_dog', type: 'pet', name: 'Cachorro Chispas Ki', icon: '🐶', price: 40 },
  { id: 'pet_cat', type: 'pet', name: 'Gatito Relámpago', icon: '🐱', price: 40 },
  { id: 'pet_dragon', type: 'pet', name: 'Dragón de Fuego Cósmico', icon: '🐲', price: 80 },
  { id: 'pet_robot', type: 'pet', name: 'Robotiño Calculador', icon: '🤖', price: 75 },
  { id: 'pet_unicorn', type: 'pet', name: 'Pegaso Astral', icon: '🦄', price: 90 }
];

// Logros
const ACHIEVEMENTS_LIST = [
  { id: 'first_win', title: '¡Primer Paso!', desc: 'Resuelve tu primer reto matemático', icon: '🎯' },
  { id: 'streak_5', title: '¡Racha en Llamas!', desc: 'Consigue 5 aciertos seguidos', icon: '🔥' },
  { id: 'level_3', title: 'Nivel Avanzado', desc: 'Alcanza el nivel 3 con tus aciertos', icon: '⭐' },
  { id: 'level_4', title: 'Genio Matemático', desc: 'Alcanza el nivel 4 (Experto)', icon: '👑' },
  { id: 'rich_kid', title: 'Ahorrador Experto', desc: 'Acumula más de 100 monedas', icon: '💰' },
  { id: 'tables_master', title: 'Mago de las Tablas', desc: 'Resuelve 10 multiplicaciones', icon: '✖️' },
  { id: 'shopper', title: '¡Estreno en el Dojo!', desc: 'Compra tu primer complemento en la tienda', icon: '🛍️' }
];

// DEFINICIÓN DE NIVELES
// Icono vectorial dorado de moneda (100% visible en todos los sistemas y navegadores)
const COIN_SVG = `<svg class="coin-svg coin-svg-sm" viewBox="0 0 24 24" aria-label="Monedas"><circle cx="12" cy="12" r="10" fill="#f59e0b" stroke="#b45309" stroke-width="2"/><circle cx="12" cy="12" r="7.5" fill="#fbbf24" stroke="#d97706" stroke-width="1.2"/><text x="12" y="16.5" font-family="'Fredoka', 'Nunito', sans-serif" font-size="12" font-weight="900" fill="#78350f" text-anchor="middle">M</text></svg>`;

const LEVEL_DEFINITIONS = {
  1: { name: 'Básico', stars: '⭐', class: 'level-1', full: '⭐ Nivel 1: Básico' },
  2: { name: 'Intermedio', stars: '⭐⭐', class: 'level-2', full: '⭐⭐ Nivel 2: Intermedio' },
  3: { name: 'Avanzado', stars: '⭐⭐⭐', class: 'level-3', full: '⭐⭐⭐ Nivel 3: Avanzado' },
  4: { name: 'Experto', stars: '⭐⭐⭐⭐', class: 'level-4', full: '⭐⭐⭐⭐ Nivel 4: Experto' }
};

// ===================================================================
// GENERADOR MATEMÁTICO ADAPTATIVO (NIVELES 1 A 4)
// ===================================================================
class QuestionGenerator {

  // =================================================================
  // UNIDAD 1: LA TIERRA EN CIFRAS (ODS 15: Vida de ecosistemas terrestres)
  // Saberes: Números de 4 y 5 cifras (DM, UM, C, D, U), comparar y representar, aproximar y redondear
  // =================================================================
  static generateUnit1(level = 2) {
    const subtopics = ['decomp', 'compare', 'rounding', 'problem'];
    const chosen = subtopics[Math.floor(Math.random() * subtopics.length)];

    if (chosen === 'decomp') {
      if (level === 1) {
        // Nivel 1: 4 cifras, identificar centenas o valor posicional
        const d = Math.floor(Math.random() * 8000) + 1200;
        const cVal = Math.floor((d % 1000) / 100);
        return {
          topic: 'U1: La Tierra en cifras (Nivel 1)',
          question: `En el número ${d}, ¿cuántas CENTENAS completas hay en esa posición?`,
          visual: `<div class="decomp-container">
            <div class="decomp-chip um">${Math.floor(d/1000)}<span class="decomp-sub">UM</span></div>
            <div class="decomp-chip c">${cVal}<span class="decomp-sub">C</span></div>
            <div class="decomp-chip d">${Math.floor((d%100)/10)}<span class="decomp-sub">D</span></div>
            <div class="decomp-chip u">${d%10}<span class="decomp-sub">U</span></div>
          </div>`,
          hint: `Las centenas ocupan la tercera posición empezando por la derecha: Unidades (U), Decenas (D), Centenas (C).`,
          correct: cVal,
          options: this.makeOptions(cVal, 4, 3),
          type: 'quiz'
        };
      } else if (level === 2) {
        // Nivel 2: Composición de 5 cifras a partir de DM, UM, C, D, U
        const dm = Math.floor(Math.random() * 7) + 2;
        const um = Math.floor(Math.random() * 8) + 1;
        const c = Math.floor(Math.random() * 8) + 1;
        const d = Math.floor(Math.random() * 8) + 1;
        const u = Math.floor(Math.random() * 8) + 1;
        const total = dm * 10000 + um * 1000 + c * 100 + d * 10 + u;
        return {
          topic: 'U1: La Tierra en cifras (Nivel 2)',
          question: `¿Qué número se forma con: ${dm} DM + ${um} UM + ${c} C + ${d} D + ${u} U?`,
          hint: `Recuerda: 1 DM = 10.000, 1 UM = 1.000, 1 C = 100, 1 D = 10 y 1 U = 1.`,
          correct: total.toLocaleString('es-ES'),
          options: this.shuffleArray([
            total.toLocaleString('es-ES'),
            (total + 1000).toLocaleString('es-ES'),
            (total - 100).toLocaleString('es-ES'),
            (dm * 1000 + um * 100 + c * 10 + d).toLocaleString('es-ES')
          ]),
          type: 'quiz'
        };
      } else if (level === 3) {
        // Nivel 3: Número de 5 cifras con ceros intercalados
        const dm = Math.floor(Math.random() * 6) + 3;
        const c = Math.floor(Math.random() * 7) + 2;
        const u = Math.floor(Math.random() * 8) + 1;
        const num = dm * 10000 + c * 100 + u;
        const correctDecomp = `${dm} DM + ${c} C + ${u} U`;
        const wrong1 = `${dm} DM + ${c} D + ${u} U`;
        const wrong2 = `${dm} UM + ${c} C + ${u} U`;
        const wrong3 = `${dm} DM + ${c} C + ${u} D`;
        return {
          topic: 'U1: Ceros intercalados (Nivel 3)',
          question: `¿Cuál es la descomposición del número ${num.toLocaleString('es-ES')}?`,
          hint: `Fíjate en las posiciones con 0: no hay unidades de millar (UM) ni decenas (D).`,
          correct: correctDecomp,
          options: this.shuffleArray([correctDecomp, wrong1, wrong2, wrong3]),
          type: 'quiz'
        };
      } else {
        // Nivel 4 (Experto): Desafío posicional con reagrupación
        const dm = Math.floor(Math.random() * 4) + 4;
        const extraC = 14;
        const u = Math.floor(Math.random() * 8) + 1;
        const num = dm * 10000 + extraC * 100 + u;
        return {
          topic: 'U1: Desafío de Cifras (Nivel 4 Pro)',
          question: `Un censo forestal registra un número con ${dm} DM, ${extraC} C y ${u} U. ¿Qué número es?`,
          hint: `14 Centenas equivalen a 1.400 (1 UM y 4 C). Súmaselo a ${dm} Decenas de Millar (${dm*10000}).`,
          correct: num.toLocaleString('es-ES'),
          options: this.shuffleArray([
            num.toLocaleString('es-ES'),
            (dm * 10000 + 4 * 100 + u).toLocaleString('es-ES'),
            ((dm + 1) * 10000 + 400 + u).toLocaleString('es-ES'),
            (num + 10).toLocaleString('es-ES')
          ]),
          type: 'quiz'
        };
      }
    } else if (chosen === 'compare') {
      if (level <= 2) {
        const base = Math.floor(Math.random() * 4000) + 12000;
        const n1 = base + Math.floor(Math.random() * 50) + 10;
        const n2 = base + Math.floor(Math.random() * 50) + 70;
        const isGreater = Math.random() > 0.5;
        const ans = isGreater ? Math.max(n1, n2) : Math.min(n1, n2);
        return {
          topic: `U1: Comparación de números (Nivel ${level})`,
          question: `¿Cuál de estos dos números es el ${isGreater ? 'MAYOR' : 'MENOR'}: ${n1.toLocaleString('es-ES')} o ${n2.toLocaleString('es-ES')}?`,
          hint: `Compara cifra a cifra de izquierda a derecha: Decenas de millar, Unidades de millar, Centenas...`,
          correct: ans.toLocaleString('es-ES'),
          options: [n1.toLocaleString('es-ES'), n2.toLocaleString('es-ES'), 'Son iguales', 'No se puede saber'],
          type: 'quiz'
        };
      } else {
        const a = Math.floor(Math.random() * 30000) + 40000;
        const b = a + (Math.random() > 0.5 ? 100 : -100);
        const correctSign = a > b ? '>' : '<';
        return {
          topic: `U1: Signos de ordenación (Nivel ${level})`,
          question: `¿Qué signo completa la comparación: ${a.toLocaleString('es-ES')} [ ? ] ${b.toLocaleString('es-ES')}?`,
          hint: `La boca abierta del signo siempre apunta hacia el número mayor: ${a > b ? a : b}.`,
          correct: correctSign,
          options: ['>', '<', '=', '≠'],
          type: 'quiz'
        };
      }
    } else if (chosen === 'rounding') {
      if (level === 1) {
        const u = Math.floor(Math.random() * 8) + 1;
        const d = (Math.floor(Math.random() * 8) + 2) * 10;
        const num = d + u;
        const rounded = u >= 5 ? d + 10 : d;
        return {
          topic: 'U1: Redondeo a la Decena (Nivel 1)',
          question: `Aproxima el número ${num} a la DECENA más cercana:`,
          hint: `Fíjate en las unidades (${u}): si es 5 o más, redondea hacia arriba (${d+10}); si es menor que 5, hacia abajo (${d}).`,
          correct: rounded,
          options: this.shuffleArray([rounded, d, d + 10, d + 20].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4)),
          type: 'quiz'
        };
      } else if (level === 2) {
        const c = (Math.floor(Math.random() * 8) + 1) * 100;
        const rest = Math.floor(Math.random() * 90) + 5;
        const num = 3000 + c + rest;
        const rounded = rest >= 50 ? 3000 + c + 100 : 3000 + c;
        return {
          topic: 'U1: Redondeo a la Centena (Nivel 2)',
          question: `Aproxima el número ${num.toLocaleString('es-ES')} a la CENTENA más cercana:`,
          hint: `Fíjate en las dos últimas cifras (${rest}): si son 50 o más, sube a la siguiente centena.`,
          correct: rounded.toLocaleString('es-ES'),
          options: this.shuffleArray([
            rounded.toLocaleString('es-ES'),
            (3000 + c).toLocaleString('es-ES'),
            (3000 + c + 100).toLocaleString('es-ES'),
            (3000 + c - 100).toLocaleString('es-ES')
          ].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4)),
          type: 'quiz'
        };
      } else {
        const m = (Math.floor(Math.random() * 20) + 10) * 1000;
        const rest = Math.floor(Math.random() * 900) + 50;
        const num = m + rest;
        const rounded = rest >= 500 ? m + 1000 : m;
        return {
          topic: `U1: Redondeo al Millar (Nivel ${level})`,
          question: `Aproxima el número ${num.toLocaleString('es-ES')} a las UNIDADES DE MILLAR más cercanas:`,
          hint: `Fíjate en la centena (${Math.floor(rest/100)}): si es 5 o más, sube al millar superior (${(m+1000).toLocaleString('es-ES')}).`,
          correct: rounded.toLocaleString('es-ES'),
          options: this.shuffleArray([
            rounded.toLocaleString('es-ES'),
            m.toLocaleString('es-ES'),
            (m + 1000).toLocaleString('es-ES'),
            (m - 1000).toLocaleString('es-ES')
          ].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4)),
          type: 'quiz'
        };
      }
    } else {
      const trees1 = Math.floor(Math.random() * 3000) + 3500;
      const trees2 = Math.floor(Math.random() * 2000) + 1500;
      const totalTrees = trees1 + trees2;
      return {
        topic: 'U1: Problema Ecosistemas ODS 15',
        question: `En un parque natural se plantan ${trees1.toLocaleString('es-ES')} robles en otoño y ${trees2.toLocaleString('es-ES')} pinos en primavera. ¿Cuántos árboles se han plantado en total?`,
        hint: `Identifica los datos: suma ambos grupos de árboles (${trees1} + ${trees2}).`,
        correct: totalTrees.toLocaleString('es-ES'),
        options: this.shuffleArray([
          totalTrees.toLocaleString('es-ES'),
          (totalTrees - 200).toLocaleString('es-ES'),
          (totalTrees + 300).toLocaleString('es-ES'),
          (trees1 - trees2).toLocaleString('es-ES')
        ]),
        type: 'quiz'
      };
    }
  }

  // =================================================================
  // UNIDAD 2: ¿ECHAMOS UNA PARTIDA? (ODS 16: Paz, justicia e instituciones sólidas)
  // Saberes: Sumas y restas con llevadas de 4 y 5 cifras, operaciones inversas y prueba de la resta (D = d + r)
  // =================================================================
  static generateUnit2(level = 2) {
    const subtopics = ['addition', 'subtraction', 'inverse_check', 'problem_game'];
    const chosen = subtopics[Math.floor(Math.random() * subtopics.length)];

    if (chosen === 'addition') {
      if (level === 1) {
        const a = Math.floor(Math.random() * 3000) + 1200;
        const b = Math.floor(Math.random() * 2000) + 1100;
        const ans = a + b;
        return {
          topic: 'U2: Suma con llevada (Nivel 1)',
          question: `Calcula: ${a} + ${b}`,
          hint: `Suma unidades con unidades, decenas con decenas y añade las llevadas.`,
          correct: ans,
          options: this.makeOptions(ans, 4, 30),
          type: 'quiz'
        };
      } else if (level === 2) {
        const a = Math.floor(Math.random() * 25000) + 15000;
        const b = Math.floor(Math.random() * 20000) + 12000;
        const ans = a + b;
        return {
          topic: 'U2: Suma de 5 cifras (Nivel 2)',
          question: `Calcula: ${a.toLocaleString('es-ES')} + ${b.toLocaleString('es-ES')}`,
          hint: `Coloca los números en columna y suma con cuidado las decenas de millar.`,
          correct: ans,
          type: 'numpad'
        };
      } else if (level === 3) {
        const a = Math.floor(Math.random() * 12000) + 10000;
        const b = Math.floor(Math.random() * 8000) + 5000;
        const c = Math.floor(Math.random() * 4000) + 2000;
        const ans = a + b + c;
        return {
          topic: 'U2: Suma de 3 números (Nivel 3)',
          question: `Calcula: ${a.toLocaleString('es-ES')} + ${b.toLocaleString('es-ES')} + ${c.toLocaleString('es-ES')}`,
          hint: `Puedes sumar primero los dos primeros sumandos y luego añadir el tercero.`,
          correct: ans,
          type: 'numpad'
        };
      } else {
        const total = 50000;
        const a = Math.floor(Math.random() * 15000) + 20000;
        const missing = total - a;
        return {
          topic: 'U2: Suma con Incógnita (Nivel 4 Pro)',
          question: `¿Qué número falta para completar la igualdad? ${a.toLocaleString('es-ES')} + [ ? ] = 50.000`,
          hint: `Aplica la operación inversa: resta 50.000 - ${a.toLocaleString('es-ES')}.`,
          correct: missing,
          options: this.makeOptions(missing, 4, 500),
          type: 'quiz'
        };
      }
    } else if (chosen === 'subtraction') {
      if (level === 1) {
        const b = Math.floor(Math.random() * 1800) + 1000;
        const ans = Math.floor(Math.random() * 1500) + 1000;
        const a = b + ans;
        return {
          topic: 'U2: Resta con llevada (Nivel 1)',
          question: `Calcula: ${a} - ${b}`,
          hint: `Resta columna a columna recordando pedir prestado si la cifra de arriba es menor.`,
          correct: ans,
          options: this.makeOptions(ans, 4, 30),
          type: 'quiz'
        };
      } else if (level === 2) {
        const b = Math.floor(Math.random() * 15000) + 10000;
        const ans = Math.floor(Math.random() * 15000) + 12000;
        const a = b + ans;
        return {
          topic: 'U2: Resta de 5 cifras (Nivel 2)',
          question: `Calcula: ${a.toLocaleString('es-ES')} - ${b.toLocaleString('es-ES')}`,
          hint: `Resta con atención en las llevadas de las centenas y millares.`,
          correct: ans,
          type: 'numpad'
        };
      } else {
        const minuend = 40000;
        const subtrahend = Math.floor(Math.random() * 18000) + 14000;
        const ans = minuend - subtrahend;
        return {
          topic: `U2: Restas con Ceros en Minuendo (Nivel ${level})`,
          question: `Calcula: ${minuend.toLocaleString('es-ES')} - ${subtrahend.toLocaleString('es-ES')}`,
          hint: `Al restar desde ceros, cada cero se convierte en 9 y el primero en 10.`,
          correct: ans,
          options: this.makeOptions(ans, 4, 200),
          type: 'quiz'
        };
      }
    } else if (chosen === 'inverse_check') {
      if (level <= 2) {
        return {
          topic: `U2: Prueba de la Resta (Nivel ${level})`,
          question: `En una resta bien resuelta, ¿cuál de estas relaciones es la CORRECTA para hacer la prueba?`,
          hint: `Para comprobar la resta, sumamos el sustraendo (lo que quitamos) con la diferencia (lo que queda).`,
          correct: 'Minuendo = Sustraendo + Diferencia',
          options: this.shuffleArray([
            'Minuendo = Sustraendo + Diferencia',
            'Diferencia = Minuendo + Sustraendo',
            'Sustraendo = Minuendo + Diferencia',
            'Minuendo = Sustraendo × Diferencia'
          ]),
          type: 'quiz'
        };
      } else {
        const sustraendo = Math.floor(Math.random() * 3000) + 2000;
        const diferencia = Math.floor(Math.random() * 4000) + 3000;
        const minuendo = sustraendo + diferencia;
        return {
          topic: `U2: Cálculo del Minuendo (Nivel ${level})`,
          question: `En una partida de cartas, el sustraendo de una resta es ${sustraendo.toLocaleString('es-ES')} y la diferencia es ${diferencia.toLocaleString('es-ES')}. ¿Cuál era el MINUENDO original?`,
          hint: `Aplica la prueba de la resta: Minuendo = Sustraendo + Diferencia (${sustraendo} + ${diferencia}).`,
          correct: minuendo,
          options: this.makeOptions(minuendo, 4, 100),
          type: 'quiz'
        };
      }
    } else {
      const p1 = Math.floor(Math.random() * 4000) + 8000;
      const p2 = Math.floor(Math.random() * 3000) + 4000;
      const diff = p1 - p2;
      return {
        topic: 'U2: Problema Partida de Juego (ODS 16)',
        question: `En un torneo escolar de ajedrez por la paz, el equipo azul tiene ${p1.toLocaleString('es-ES')} puntos y el equipo verde tiene ${p2.toLocaleString('es-ES')} puntos. ¿Cuántos puntos de ventaja tiene el equipo azul?`,
        hint: `Para encontrar la diferencia o ventaja, resta la puntuación menor de la mayor: ${p1} - ${p2}.`,
        correct: diff.toLocaleString('es-ES'),
        options: this.shuffleArray([
          diff.toLocaleString('es-ES'),
          (diff + 100).toLocaleString('es-ES'),
          (p1 + p2).toLocaleString('es-ES'),
          (diff - 50).toLocaleString('es-ES')
        ]),
        type: 'quiz'
      };
    }
  }

  // =================================================================
  // UNIDAD 3: ¡QUE EMPIECE LA FUNCIÓN! (ODS 4: Educación de calidad)
  // Saberes: Repasar multiplicación (tablas, x10, x100, x1000), x1 cifra, x2 cifras, propiedades conmutativa, asociativa y distributiva
  // =================================================================
  static generateUnit3(level = 2) {
    const subtopics = ['tables_mental', 'mult_1digit', 'mult_2digits', 'properties', 'theater_problem'];
    const chosen = subtopics[Math.floor(Math.random() * subtopics.length)];

    if (chosen === 'tables_mental') {
      if (level === 1) {
        const a = Math.floor(Math.random() * 4) + 6; // 6 a 9
        const b = Math.floor(Math.random() * 8) + 2; // 2 a 9
        const ans = a * b;
        return {
          topic: 'U3: Repasar la multiplicación (Nivel 1)',
          question: `Calcula: ${a} × ${b}`,
          hint: `Repasa la tabla del ${a}: ${a} veces ${b}.`,
          correct: ans,
          options: this.makeOptions(ans, 4, 8),
          type: 'quiz'
        };
      } else if (level === 2) {
        const n = Math.floor(Math.random() * 60) + 15;
        const factor = [10, 100, 1000][Math.floor(Math.random() * 3)];
        const ans = n * factor;
        return {
          topic: 'U3: Multiplicar por 10, 100 y 1.000 (Nivel 2)',
          question: `Calcula mentalmente: ${n} × ${factor}`,
          hint: `Para multiplicar por la unidad seguida de ceros, añade tantos ceros al final como tenga el factor (${factor === 10 ? 'un cero' : factor === 100 ? 'dos ceros' : 'tres ceros'}).`,
          correct: ans.toLocaleString('es-ES'),
          options: this.shuffleArray([
            ans.toLocaleString('es-ES'),
            (n * 10).toLocaleString('es-ES'),
            (n * 100).toLocaleString('es-ES'),
            (n * 1000).toLocaleString('es-ES')
          ].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4)),
          type: 'quiz'
        };
      } else {
        const a = (Math.floor(Math.random() * 5) + 3) * 100;
        const b = (Math.floor(Math.random() * 6) + 4) * 10;
        const ans = a * b;
        return {
          topic: `U3: Multiplicar decenas y centenas (Nivel ${level})`,
          question: `Calcula mentalmente: ${a} × ${b}`,
          hint: `Multiplica los números base (${a/100} × ${b/10} = ${(a/100)*(b/10)}) y añade los 3 ceros al final.`,
          correct: ans.toLocaleString('es-ES'),
          options: this.shuffleArray([
            ans.toLocaleString('es-ES'),
            (ans / 10).toLocaleString('es-ES'),
            (ans * 10).toLocaleString('es-ES'),
            ((a / 10) * b).toLocaleString('es-ES')
          ]),
          type: 'quiz'
        };
      }
    } else if (chosen === 'mult_1digit') {
      if (level === 1) {
        const a = Math.floor(Math.random() * 50) + 32;
        const b = Math.floor(Math.random() * 5) + 3;
        const ans = a * b;
        return {
          topic: 'U3: Multiplicar por 1 cifra (Nivel 1)',
          question: `Calcula: ${a} × ${b}`,
          hint: `Multiplica primero las unidades (${a%10} × ${b}) y luego las decenas.`,
          correct: ans,
          options: this.makeOptions(ans, 4, 15),
          type: 'quiz'
        };
      } else {
        const a = Math.floor(Math.random() * 400) + 210;
        const b = Math.floor(Math.random() * 6) + 4;
        const ans = a * b;
        return {
          topic: `U3: Multiplicar por 1 cifra (Nivel ${level})`,
          question: `Calcula: ${a} × ${b}`,
          hint: `Multiplica unidades, decenas y centenas, sumando las llevadas correspondientes.`,
          correct: ans,
          type: 'numpad'
        };
      }
    } else if (chosen === 'mult_2digits') {
      if (level <= 2) {
        const a = Math.floor(Math.random() * 30) + 25;
        const b = [12, 14, 15, 21][Math.floor(Math.random() * 4)];
        const ans = a * b;
        return {
          topic: `U3: Multiplicar por 2 cifras (Nivel ${level})`,
          question: `Calcula: ${a} × ${b}`,
          hint: `Multiplica ${a} por las unidades de ${b}, luego por sus decenas (dejando el hueco del cero) y suma los dos resultados.`,
          correct: ans,
          options: this.makeOptions(ans, 4, 40),
          type: 'quiz'
        };
      } else {
        const a = Math.floor(Math.random() * 150) + 125;
        const b = [23, 25, 32, 34][Math.floor(Math.random() * 4)];
        const ans = a * b;
        return {
          topic: `U3: Multiplicar 3 cifras por 2 cifras (Nivel ${level})`,
          question: `Calcula: ${a} × ${b}`,
          hint: `Haz la multiplicación en dos filas y súmalas cuidadosamente.`,
          correct: ans,
          type: 'numpad'
        };
      }
    } else if (chosen === 'properties') {
      const propType = Math.random() > 0.5 ? 'distributiva' : 'conmutativa';
      if (propType === 'conmutativa') {
        const a = Math.floor(Math.random() * 6) + 4;
        const b = Math.floor(Math.random() * 6) + 7;
        return {
          topic: `U3: Propiedad Conmutativa (Nivel ${level})`,
          question: `¿Qué número completa la igualdad: ${a} × ${b} = ${b} × [ ? ]?`,
          hint: `La propiedad conmutativa dice que el orden de los factores no cambia el producto.`,
          correct: a,
          options: this.makeOptions(a, 4, 4),
          type: 'quiz'
        };
      } else {
        const k = Math.floor(Math.random() * 4) + 4;
        const x = 20;
        const y = Math.floor(Math.random() * 5) + 3;
        const ans = k * (x + y);
        return {
          topic: `U3: Propiedad Distributiva (Nivel ${level})`,
          question: `Aplica la propiedad distributiva: ${k} × (${x} + ${y}) = (${k} × ${x}) + (${k} × ${y}). ¿Cuál es el resultado?`,
          hint: `${k} × ${x} = ${k*x}, y ${k} × ${y} = ${k*y}. Ahora suma: ${k*x} + ${k*y}.`,
          correct: ans,
          options: this.makeOptions(ans, 4, 20),
          type: 'quiz'
        };
      }
    } else {
      const rows = Math.floor(Math.random() * 14) + 12; // 12 a 25 filas
      const seats = Math.floor(Math.random() * 16) + 15; // 15 a 30 butacas
      const prices = [4, 5, 6, 8];
      const price = prices[Math.floor(Math.random() * prices.length)];
      const totalPeople = rows * seats;
      const ans = totalPeople * price;
      return {
        topic: 'U3: Problema en el Auditorio (ODS 4)',
        question: `En el teatro del colegio hay ${rows} filas con ${seats} butacas cada una. Si la entrada cuesta ${price}€ y se llena toda la función, ¿cuánto dinero se recauda?`,
        hint: `Primero calcula las butacas totales (${rows} × ${seats} = ${totalPeople}) y luego multiplica por el precio (${totalPeople} × ${price}€ = ${ans}€).`,
        correct: `${ans}€`,
        options: this.makeOptions(ans, 4, 150).map(v => `${v}€`),
        type: 'quiz'
      };
    }
  }

  // =================================================================
  // UNIDAD 4: MENSAJES CIFRADOS (ODS 17: Alianzas para lograr objetivos)
  // Saberes: Conocer la división (términos), dividir por 1 y 2 cifras, operaciones combinadas con paréntesis, resolver empezando por el final
  // =================================================================
  static generateUnit4(level = 2) {
    const subtopics = ['terms', 'div_1digit', 'div_2digits', 'combined_ops', 'reverse_problem'];
    const chosen = subtopics[Math.floor(Math.random() * subtopics.length)];

    if (chosen === 'terms') {
      const qTypes = [
        {
          q: '¿Cómo se llama el resultado que obtenemos al resolver una división?',
          a: 'Cociente',
          w: ['Dividendo', 'Divisor', 'Resto'],
          h: 'El dividendo se reparte entre el divisor y da el cociente, sobrando el resto.'
        },
        {
          q: '¿Cómo se llama la cantidad que sobra si una división no es exacta?',
          a: 'Resto',
          w: ['Cociente', 'Divisor', 'Minuendo'],
          h: 'El resto es lo que queda sin poder repartirse en partes iguales.'
        },
        {
          q: 'Al dividir un número entre 6, ¿cuál de estos valores NUNCA podría ser el resto?',
          a: '7',
          w: ['0', '3', '5'],
          h: 'El resto siempre tiene que ser estrictamente MENOR que el divisor (menor que 6).'
        }
      ];
      const pick = qTypes[Math.floor(Math.random() * qTypes.length)];
      return {
        topic: `U4: Términos de la División (Nivel ${level})`,
        question: pick.q,
        hint: pick.h,
        correct: pick.a,
        options: this.shuffleArray([pick.a, ...pick.w]),
        type: 'quiz'
      };
    } else if (chosen === 'div_1digit') {
      if (level === 1) {
        const divisor = Math.floor(Math.random() * 4) + 3; // 3 a 6
        const quotient = Math.floor(Math.random() * 15) + 12;
        const dividend = divisor * quotient;
        return {
          topic: 'U4: División exacta (Nivel 1)',
          question: `Calcula: ${dividend} ÷ ${divisor}`,
          hint: `Busca qué número multiplicado por ${divisor} da ${dividend}: ${divisor} × ? = ${dividend}.`,
          correct: quotient,
          options: this.makeOptions(quotient, 4, 6),
          type: 'quiz'
        };
      } else {
        const divisor = Math.floor(Math.random() * 4) + 5; // 5 a 8
        const quotient = Math.floor(Math.random() * 15) + 10;
        const remainder = Math.floor(Math.random() * (divisor - 2)) + 1;
        const dividend = divisor * quotient + remainder;
        const optSet = new Set([remainder]);
        for (let r = 0; r < divisor; r++) {
          if (r !== remainder) optSet.add(r);
        }
        let ex = 1;
        while (optSet.size < 4) { optSet.add(remainder + ex); ex++; }
        return {
          topic: `U4: División con Resto (Nivel ${level})`,
          question: `Al dividir ${dividend} entre ${divisor}, ¿cuál es el RESTO que sobra?`,
          hint: `${divisor} × ${quotient} = ${divisor * quotient}. ¿Cuánto falta hasta llegar a ${dividend}?`,
          correct: remainder,
          options: this.shuffleArray(Array.from(optSet).slice(0, 4)),
          type: 'quiz'
        };
      }
    } else if (chosen === 'div_2digits') {
      const divisor = [12, 15, 20, 25][Math.floor(Math.random() * 4)];
      const quotient = Math.floor(Math.random() * 12) + 8;
      const dividend = divisor * quotient;
      return {
        topic: `U4: Dividir entre 2 cifras (Nivel ${level})`,
        question: `Calcula: ${dividend} ÷ ${divisor}`,
        hint: `Prueba cuántas veces cabe ${divisor} en las primeras cifras de ${dividend}.`,
        correct: quotient,
        options: this.makeOptions(quotient, 4, 8),
        type: 'quiz'
      };
    } else if (chosen === 'combined_ops') {
      if (level <= 2) {
        const a = Math.floor(Math.random() * 8) + 4;
        const b = Math.floor(Math.random() * 6) + 3;
        const c = Math.floor(Math.random() * 4) + 2;
        const ans = (a + b) * c;
        return {
          topic: `U4: Operaciones con Paréntesis (Nivel ${level})`,
          question: `Calcula: (${a} + ${b}) × ${c}`,
          hint: `Jerarquía de operaciones: resuelve PRIMERO el paréntesis (${a} + ${b} = ${a+b}) y luego multiplica por ${c}.`,
          correct: ans,
          options: this.makeOptions(ans, 4, 15),
          type: 'quiz'
        };
      } else {
        const multA = Math.floor(Math.random() * 5) + 4;
        const multB = Math.floor(Math.random() * 5) + 4;
        const sub = Math.floor(Math.random() * 15) + 10;
        const ans = (multA * multB) - sub;
        return {
          topic: `U4: Jerarquía de Operaciones (Nivel ${level})`,
          question: `Calcula: ${multA} × ${multB} - ${sub}`,
          hint: `Sin paréntesis, las multiplicaciones tienen prioridad: haz ${multA} × ${multB} = ${multA * multB} y luego resta ${sub}.`,
          correct: ans,
          options: this.makeOptions(ans, 4, 12),
          type: 'quiz'
        };
      }
    } else {
      const ans = Math.floor(Math.random() * 10) + 3; // 3 a 12
      const addVal = Math.floor(Math.random() * 12) + 4; // 4 a 15
      const multVal = Math.random() > 0.5 ? 2 : 3;
      const finalVal = (ans + addVal) * multVal;
      return {
        topic: 'U4: Mensaje Cifrado - Por el Final (ODS 17)',
        question: `Un agente secreto cifra un número: le suma ${addVal}, luego multiplica el resultado por ${multVal} y obtiene ${finalVal}. ¿Cuál era el número secreto original?`,
        hint: `Resuelve empezando por el final haciendo las operaciones inversas: divide ${finalVal} entre ${multVal} (${finalVal/multVal}) y luego réstale ${addVal} (${finalVal/multVal} - ${addVal} = ${ans}).`,
        correct: ans,
        options: this.makeOptions(ans, 4, 4),
        type: 'quiz'
      };
    }
  }

  // =================================================================
  // UNIDAD 5: ¡TOMA TU PARTE! (ODS 5: Igualdad de género)
  // Saberes: Fracciones (numerador y denominador, pizzas/barras), comparar fracciones, sumar y restar con igual denominador
  // =================================================================
  static generateUnit5(level = 2) {
    const subtopics = ['fraction_visual', 'fraction_compare', 'fraction_ops', 'fraction_problem'];
    const chosen = subtopics[Math.floor(Math.random() * subtopics.length)];

    if (chosen === 'fraction_visual') {
      const den = [3, 4, 5, 6, 8][Math.floor(Math.random() * 5)];
      const num = Math.floor(Math.random() * (den - 1)) + 1;
      const visual = this.renderFractionSVG(num, den);
      const correctStr = `${num}/${den}`;
      const optSet = new Set([correctStr]);
      for (let i = 1; i <= den; i++) {
        if (i !== num) optSet.add(`${i}/${den}`);
      }
      let ext = 1;
      while (optSet.size < 4) { optSet.add(`${num}/${den + ext}`); ext++; }
      return {
        topic: `U5: Fracción Visual (Nivel ${level})`,
        question: `¿Qué fracción de la pizza está sombreada en naranja?`,
        visual: visual,
        hint: `El numerador (arriba) indica las partes sombreadas (${num}) y el denominador (abajo) el total de partes (${den}).`,
        correct: correctStr,
        options: this.shuffleArray(Array.from(optSet).slice(0, 4)),
        type: 'quiz'
      };
    } else if (chosen === 'fraction_compare') {
      if (level <= 2) {
        const den = [6, 7, 8, 9, 10][Math.floor(Math.random() * 5)];
        const num1 = Math.floor(Math.random() * (den - 3)) + 1;
        const num2 = num1 + 2;
        return {
          topic: `U5: Comparar con Igual Denominador (Nivel ${level})`,
          question: `¿Cuál de estas dos fracciones es MAYOR: ${num1}/${den} o ${num2}/${den}?`,
          hint: `Con el mismo denominador, es mayor la que tenga un numerador mayor (${num2} > ${num1}).`,
          correct: `${num2}/${den}`,
          options: [`${num1}/${den}`, `${num2}/${den}`, 'Son iguales', 'No se puede saber'],
          type: 'quiz'
        };
      } else {
        const num = Math.floor(Math.random() * 4) + 2; // 2 a 5
        const dens = [3, 4, 5, 6];
        const den1 = dens[Math.floor(Math.random() * dens.length)];
        const den2 = den1 + Math.floor(Math.random() * 3) + 2; // den2 > den1
        return {
          topic: `U5: Comparar con Igual Numerador (Nivel ${level})`,
          question: `¿Cuál de estas dos fracciones es MAYOR: ${num}/${den1} o ${num}/${den2}?`,
          hint: `¡Atención! Si el numerador es igual, al repartir entre menos partes (${den1} partes) cada porción es MÁS GRANDE que si repartes entre ${den2} partes (${num}/${den1} > ${num}/${den2}).`,
          correct: `${num}/${den1}`,
          options: [`${num}/${den1}`, `${num}/${den2}`, 'Son iguales', 'No se puede saber'],
          type: 'quiz'
        };
      }
    } else if (chosen === 'fraction_ops') {
      const isAdd = Math.random() > 0.4;
      const den = [6, 8, 9, 10, 12][Math.floor(Math.random() * 5)];
      if (isAdd) {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 2;
        const ans = `${a + b}/${den}`;
        return {
          topic: `U5: Suma de Fracciones (Nivel ${level})`,
          question: `Calcula: ${a}/${den} + ${b}/${den}`,
          hint: `Con el mismo denominador, sumamos los numeradores (${a} + ${b} = ${a+b}) y dejamos el mismo denominador (${den}).`,
          correct: ans,
          options: this.shuffleArray([ans, `${a + b}/${den * 2}`, `${a}/${den}`, `${Math.max(1, a + b - 1)}/${den}`]),
          type: 'quiz'
        };
      } else {
        const a = Math.floor(Math.random() * 3) + 4;
        const b = Math.floor(Math.random() * 2) + 1;
        const ans = `${a - b}/${den}`;
        return {
          topic: `U5: Resta de Fracciones (Nivel ${level})`,
          question: `Calcula: ${a}/${den} - ${b}/${den}`,
          hint: `Restamos los numeradores (${a} - ${b} = ${a-b}) y mantenemos el denominador común (${den}).`,
          correct: ans,
          options: this.shuffleArray([ans, `${a - b}/${den - b}`, `${a}/${den}`, `${a + b}/${den}`]),
          type: 'quiz'
        };
      }
    } else {
      const dens = [6, 8, 10, 12];
      const den = dens[Math.floor(Math.random() * dens.length)];
      const maxPart = Math.floor(den / 2) - 1;
      const part1 = Math.floor(Math.random() * Math.max(1, maxPart - 1)) + 1;
      const part2 = Math.floor(Math.random() * Math.max(1, maxPart - 1)) + 1;
      const sumPart = part1 + part2;
      const ans = `${sumPart}/${den}`;

      const optSet = new Set([ans]);
      optSet.add(`${sumPart}/${den * 2}`);
      if (part1 !== sumPart) optSet.add(`${part1}/${den}`);
      if (part2 !== sumPart) optSet.add(`${part2}/${den}`);

      let cand = 1;
      while (optSet.size < 4 && cand < den) {
        if (cand !== sumPart) optSet.add(`${cand}/${den}`);
        cand++;
      }
      let offset = 1;
      while (optSet.size < 4) {
        optSet.add(`${sumPart}/${den + offset}`);
        offset++;
      }

      return {
        topic: 'U5: Problema de Reparto (ODS 5)',
        question: `En una merienda cooperativa, Lucía come ${part1}/${den} de la tarta y Daniel come ${part2}/${den}. ¿Qué fracción de la tarta han comido entre los dos?`,
        hint: `Suma las dos fracciones: ${part1}/${den} + ${part2}/${den} = ${sumPart}/${den}.`,
        correct: ans,
        options: this.shuffleArray(Array.from(optSet)),
        type: 'quiz'
      };
    }
  }

  // =================================================================
  // UNIDAD 6: PATRONES Y FORMAS (ODS 8: Trabajo decente y crecimiento económico)
  // Saberes: Localizar en el plano (coordenadas cartesianas), describir itinerarios, simetría y giros, averiguar dato falso
  // =================================================================
  static generateUnit6(level = 2) {
    const subtopics = ['coordinate_grid', 'itinerary', 'symmetry_transforms', 'false_data_problem'];
    const chosen = subtopics[Math.floor(Math.random() * subtopics.length)];

    if (chosen === 'coordinate_grid') {
      const x = Math.floor(Math.random() * 4) + 1;
      const y = Math.floor(Math.random() * 4) + 1;
      const icons = ['💎', '🚀', '⭐', '🌳'];
      const icon = icons[Math.floor(Math.random() * icons.length)];
      const visual = this.renderCoordinateGridSVG(x, y, icon);
      const correctCoord = `(${x}, ${y})`;
      const optSet = new Set([correctCoord]);
      optSet.add(`(${y}, ${x})`);
      optSet.add(`(${x === 1 ? 2 : x - 1}, ${y})`);
      optSet.add(`(${x}, ${y === 1 ? 2 : y - 1})`);
      let offset = 1;
      while (optSet.size < 4) { optSet.add(`(${(x + offset)%5 + 1}, ${(y + offset)%5 + 1})`); offset++; }
      return {
        topic: `U6: Coordenadas en el Plano (Nivel ${level})`,
        question: `¿En qué coordenada cartesiana (X, Y) se encuentra el elemento ${icon}?`,
        visual: visual,
        hint: `El primer número indica la posición horizontal en el eje X (${x}) y el segundo la posición vertical en el eje Y (${y}).`,
        correct: correctCoord,
        options: this.shuffleArray(Array.from(optSet).slice(0, 4)),
        type: 'quiz'
      };
    } else if (chosen === 'itinerary') {
      const startX = 1;
      const startY = 1;
      const stepE = Math.floor(Math.random() * 3) + 2; // 2 a 4 al Este
      const stepN = Math.floor(Math.random() * 3) + 1; // 1 a 3 al Norte
      const finalX = startX + stepE;
      const finalY = startY + stepN;
      const correctCoord = `(${finalX}, ${finalY})`;
      return {
        topic: `U6: Describir Itinerarios (Nivel ${level})`,
        question: `Un robot explorador sale de la casilla (${startX}, ${startY}), avanza ${stepE} casillas al Este (derecha) y ${stepN} casillas al Norte (arriba). ¿A qué coordenada llega?`,
        hint: `Suma las casillas al Este al eje X (${startX} + ${stepE} = ${finalX}) y al Norte al eje Y (${startY} + ${stepN} = ${finalY}).`,
        correct: correctCoord,
        options: this.shuffleArray([
          correctCoord,
          `(${finalY}, ${finalX})`,
          `(${finalX + 1}, ${finalY})`,
          `(${finalX}, ${finalY + 1})`
        ]),
        type: 'quiz'
      };
    } else if (chosen === 'symmetry_transforms') {
      if (level <= 2) {
        const symLetters = ['A', 'H', 'M', 'T', 'V', 'W', 'X', 'Y'];
        const asymLetters = ['F', 'G', 'J', 'L', 'N', 'P', 'Q', 'R', 'S', 'Z'];
        const correctLetter = symLetters[Math.floor(Math.random() * symLetters.length)];
        const shuffledAsym = this.shuffleArray(asymLetters);
        const distractors = shuffledAsym.slice(0, 3);
        const opts = this.shuffleArray([correctLetter, ...distractors]);
        return {
          topic: `U6: Eje de Simetría (Nivel ${level})`,
          question: `Observa la figura de arriba dividida por su eje de simetría (la línea discontinua roja). ¿Cuál de estas letras mayúsculas también tiene un eje de simetría vertical perfecto?`,
          visual: this.renderPolygonSVG('simetria'),
          hint: `Una figura simétrica es idéntica en ambos lados del eje al doblarla por la mitad. La letra ${correctLetter} tiene simetría vertical.`,
          correct: correctLetter,
          options: opts,
          type: 'quiz'
        };
      } else {
        const turns = [
          { key: 'giro_este', text: 'un cuarto de vuelta (90°) en sentido horario (hacia la derecha)', ans: 'Al Este (derecha)', hint: 'Girar 90° horario desde el Norte apunta directamente al Este (derecha).' },
          { key: 'giro_oeste', text: 'un cuarto de vuelta (90°) en sentido antihorario (hacia la izquierda)', ans: 'Al Oeste (izquierda)', hint: 'Girar 90° antihorario desde el Norte apunta directamente al Oeste (izquierda).' },
          { key: 'giro_sur', text: 'media vuelta (180°)', ans: 'Al Sur (abajo)', hint: 'Dar media vuelta (180°) desde el Norte apunta directamente hacia el Sur (abajo).' }
        ];
        const pick = turns[Math.floor(Math.random() * turns.length)];
        return {
          topic: `U6: Giros y Orientación (Nivel ${level})`,
          question: `Observa la brújula de arriba apuntando al Norte (⬆️): Si gira ${pick.text}, ¿hacia dónde apuntará?`,
          visual: this.renderPolygonSVG(pick.key),
          hint: pick.hint,
          correct: pick.ans,
          options: this.shuffleArray(['Al Este (derecha)', 'Al Sur (abajo)', 'Al Oeste (izquierda)', 'Sigue al Norte']),
          type: 'quiz'
        };
      }
    } else {
      const places = this.shuffleArray(['la Noria', 'la Montaña Rusa', 'el Tren', 'los Autos de Choque', 'el Barco Pirata']);
      const p1 = places[0];
      const p2 = places[1];
      const p3 = places[2];
      const x1 = Math.floor(Math.random() * 3) + 2; // 2..4
      const x2 = x1 + Math.floor(Math.random() * 3) + 2; // x2 > x1
      const y1 = Math.floor(Math.random() * 3) + 2; // 2..4
      const y2 = y1 + Math.floor(Math.random() * 3) + 2; // y2 > y1
      // p1 en (x1, y1), p2 en (x2, y1), p3 en (x1, y2)
      return {
        topic: 'U6: Averiguar el Dato Falso (ODS 8)',
        question: `En el plano de un parque de atracciones: ${p1} está en (${x1}, ${y1}), ${p2} en (${x2}, ${y1}) y ${p3} en (${x1}, ${y2}). ¿Cuál de estas afirmaciones es FALSA?`,
        hint: `Compara las coordenadas: ${p1} (${x1}, ${y1}) y ${p2} (${x2}, ${y1}) comparten la misma fila Y=${y1}, mientras que ${p1} y ${p3} comparten la misma columna X=${x1}.`,
        correct: `${p1} y ${p2} están en la misma columna X`,
        options: this.shuffleArray([
          `${p1} y ${p2} están en la misma columna X`,
          `${p1} y ${p3} están en la misma columna X=${x1}`,
          `${p1} y ${p2} están en la misma fila Y=${y1}`,
          `${p3} está situado más al Norte que ${p1}`
        ]),
        type: 'quiz'
      };
    }
  }

  // =================================================================
  // UNIDAD 7: GEOMETRÍA URBANA (ODS 9: Industria, innovación e infraestructura)
  // Saberes: Conocer figuras geométricas (polígonos, triángulos, cuadriláteros), poliedros (prismas, pirámides: caras, aristas, vértices), cuerpos redondos
  // =================================================================
  static generateUnit7(level = 2) {
    const subtopics = ['polygons', 'polyhedra', 'round_bodies', 'urban_problem'];
    const chosen = subtopics[Math.floor(Math.random() * subtopics.length)];

    if (chosen === 'polygons') {
      if (level === 1) {
        const poly = [
          { name: 'Triángulo', key: 'triangulo', sides: 3 },
          { name: 'Cuadrilátero', key: 'cuadrado', sides: 4 },
          { name: 'Pentágono', key: 'pentagono', sides: 5 },
          { name: 'Hexágono', key: 'hexagono', sides: 6 }
        ][Math.floor(Math.random() * 4)];
        return {
          topic: 'U7: Polígonos según sus lados (Nivel 1)',
          question: `Observa la figura geométrica de arriba: ¿Cómo se llama este polígono de ${poly.sides} lados y ${poly.sides} vértices?`,
          visual: this.renderPolygonSVG(poly.key),
          hint: `Cuenta sus lados: 3=Triángulo, 4=Cuadrilátero, 5=Pentágono, 6=Hexágono.`,
          correct: poly.name,
          options: this.shuffleArray(['Triángulo', 'Cuadrilátero', 'Pentágono', 'Hexágono']),
          type: 'quiz'
        };
      } else if (level === 2) {
        const triList = [
          { name: 'Equilátero', key: 'triangulo_equilatero', desc: 'tiene sus 3 lados exactamente iguales' },
          { name: 'Isósceles', key: 'triangulo_isosceles', desc: 'tiene 2 lados iguales y 1 diferente' },
          { name: 'Escaleno', key: 'triangulo_escaleno', desc: 'tiene sus 3 lados de longitudes diferentes' },
          { name: 'Rectángulo', key: 'triangulo_rectangulo', desc: 'tiene 1 ángulo recto de 90°' }
        ];
        const tri = triList[Math.floor(Math.random() * triList.length)];
        return {
          topic: 'U7: Clasificación de Triángulos (Nivel 2)',
          question: `Observa el triángulo de arriba (${tri.desc}): ¿Qué tipo de triángulo es?`,
          visual: this.renderPolygonSVG(tri.key),
          hint: `Equi = lados iguales (equilátero). Isósceles = 2 lados iguales. Escaleno = 3 lados distintos. Rectángulo = 1 ángulo de 90°.`,
          correct: `Triángulo ${tri.name}`,
          options: this.shuffleArray(['Triángulo Equilátero', 'Triángulo Isósceles', 'Triángulo Escaleno', 'Triángulo Rectángulo']),
          type: 'quiz'
        };
      } else {
        const quadList = [
          { name: 'El Rombo', key: 'rombo', q: 'Observa la figura de arriba: Tiene 4 lados iguales pero sus ángulos NO son rectos de 90°. ¿Qué figura es?' },
          { name: 'El Trapecio', key: 'trapecio', q: 'Observa la figura de arriba: Tiene solo 2 lados paralelos (la base mayor y la menor). ¿Cómo se llama?' },
          { name: 'El Rectángulo', key: 'rectangulo', q: 'Observa la figura de arriba: Tiene lados iguales dos a dos y 4 ángulos rectos de 90°. ¿Qué cuadrilátero es?' },
          { name: 'El Cuadrado', key: 'cuadrado', q: 'Observa la figura de arriba: Tiene 4 lados iguales y 4 ángulos rectos de 90°. ¿Qué figura es?' }
        ];
        const quad = quadList[Math.floor(Math.random() * quadList.length)];
        return {
          topic: `U7: Cuadriláteros y Paralelogramos (Nivel ${level})`,
          question: quad.q,
          visual: this.renderPolygonSVG(quad.key),
          hint: `Fíjate en los lados y en los ángulos de la figura ilustrada arriba.`,
          correct: quad.name,
          options: this.shuffleArray(['El Rombo', 'El Cuadrado', 'El Rectángulo', 'El Trapecio']),
          type: 'quiz'
        };
      }
    } else if (chosen === 'polyhedra') {
      if (level <= 2) {
        const qCube = [
          { q: 'Observa el cubo en 3D de arriba: ¿Cuántas CARAS tiene en total?', a: 6, h: 'Cuenta las caras del dado: la superior, la inferior y las 4 caras laterales.' },
          { q: 'Observa el cubo en 3D de arriba: ¿Cuántos VÉRTICES (esquinas marcadas en naranja) tiene?', a: 8, h: 'Tiene 4 vértices arriba y 4 vértices abajo en la base (4 + 4 = 8).' },
          { q: 'Observa el cubo en 3D de arriba: ¿Cuántas ARISTAS (líneas o bordes) tiene en total?', a: 12, h: 'Tiene 4 aristas arriba, 4 abajo y 4 aristas verticales (4 × 3 = 12).' }
        ][Math.floor(Math.random() * 3)];
        return {
          topic: `U7: Elementos del Cubo (Nivel ${level})`,
          question: qCube.q,
          visual: this.renderPolygonSVG('cubo'),
          hint: qCube.h,
          correct: qCube.a,
          options: this.makeOptions(qCube.a, 4, 3),
          type: 'quiz'
        };
      } else {
        const isPyramid = Math.random() > 0.5;
        if (isPyramid) {
          return {
            topic: `U7: Vértices de la Pirámide (Nivel ${level})`,
            question: `Observa la pirámide cuadrangular de arriba: ¿Cuántos VÉRTICES tiene en total contando la cúspide (el punto rojo)?`,
            visual: this.renderPolygonSVG('piramide'),
            hint: `Suma los 4 vértices de la base cuadrada más la cúspide superior (4 + 1 = 5 vértices).`,
            correct: 5,
            options: [5, 4, 8, 6],
            type: 'quiz'
          };
        } else {
          return {
            topic: `U7: Prismas y sus Bases (Nivel ${level})`,
            question: `Observa el prisma triangular de arriba: ¿Cuántas BASES triangulares paralelas tiene?`,
            visual: this.renderPolygonSVG('prisma_triangular'),
            hint: `Todos los prismas se caracterizan por tener exactamente 2 bases paralelas idénticas.`,
            correct: '2 bases paralelas',
            options: this.shuffleArray(['2 bases paralelas', '1 sola base', '3 bases', 'No tiene bases']),
            type: 'quiz'
          };
        }
      }
    } else if (chosen === 'round_bodies') {
      const bodies = [
        { name: 'Cilindro', key: 'cilindro', q: 'Observa el cuerpo geométrico de arriba: Tiene 2 bases circulares planas y una superficie lateral curva. ¿Cómo se llama?' },
        { name: 'Cono', key: 'cono', q: 'Observa el cuerpo geométrico de arriba: Tiene 1 sola base circular plana y una cúspide o vértice. ¿Cómo se llama?' },
        { name: 'Esfera', key: 'esfera', q: 'Observa el cuerpo geométrico de arriba: No tiene bases planas, ni aristas ni vértices, siendo totalmente curvo. ¿Cómo se llama?' }
      ];
      const pick = bodies[Math.floor(Math.random() * bodies.length)];
      return {
        topic: `U7: Cuerpos Redondos (Nivel ${level})`,
        question: pick.q,
        visual: this.renderPolygonSVG(pick.key),
        hint: `Los 3 cuerpos redondos son: cilindro (como una lata), cono (como un cucurucho) y esfera (como un balón).`,
        correct: pick.name,
        options: this.shuffleArray(['Cilindro', 'Cono', 'Esfera', 'Prisma']),
        type: 'quiz'
      };
    } else {
      return {
        topic: 'U7: Arquitectura Urbana (ODS 9)',
        question: `Observa el rascacielos de arriba con forma de prisma hexagonal: ¿Cuántos vértices tiene en total el edificio (6 en la base inferior y 6 en la superior)?`,
        visual: this.renderPolygonSVG('prisma_hexagonal'),
        hint: `Un prisma hexagonal tiene dos bases hexagonales: 6 vértices en la base inferior + 6 en la superior = 12 vértices.`,
        correct: 12,
        options: [12, 6, 8, 18],
        type: 'quiz'
      };
    }
  }

  // =================================================================
  // UNIDAD 8: UNA POBLACIÓN DIVERSA (ODS 10: Reducción de las desigualdades)
  // Saberes: Estudio estadístico (frecuencia, moda), gráficos de barras y pictogramas, cálculo de probabilidades (seguro, posible, imposible)
  // =================================================================
  static generateUnit8(level = 2) {
    const subtopics = ['bar_chart_visual', 'frequency_moda', 'pictogram', 'probability_urna'];
    const chosen = subtopics[Math.floor(Math.random() * subtopics.length)];

    if (chosen === 'bar_chart_visual') {
      const themeSets = [
        { title: 'Deportes', items: ['Fútbol', 'Baloncesto', 'Natación', 'Pádel'] },
        { title: 'Mascotas', items: ['Perro', 'Gato', 'Hámster', 'Pájaro'] },
        { title: 'Talleres Escolares', items: ['Robótica', 'Pintura', 'Ajedrez', 'Teatro'] },
        { title: 'Instrumentos', items: ['Guitarra', 'Piano', 'Batería', 'Flauta'] }
      ];
      const theme = themeSets[Math.floor(Math.random() * themeSets.length)];
      const labels = theme.items;
      const valSet = new Set();
      while (valSet.size < 4) {
        valSet.add(Math.floor(Math.random() * 15) + 4);
      }
      const values = Array.from(valSet);
      const maxVal = Math.max(...values);
      const maxIdx = values.indexOf(maxVal);
      const maxLabel = labels[maxIdx];
      const visual = this.renderBarChartSVG(labels, values);

      const isCompare = Math.random() > 0.5;
      if (isCompare) {
        const otherIdx = (maxIdx + 1) % 4;
        const diff = maxVal - values[otherIdx];
        return {
          topic: `U8: Interpretar Gráfico (${theme.title})`,
          question: `Observando el gráfico, ¿cuántos alumnos MÁS eligieron ${maxLabel} (${maxVal}) que ${labels[otherIdx]} (${values[otherIdx]})?`,
          visual: visual,
          hint: `Resta la altura de las dos barras: ${maxVal} - ${values[otherIdx]} = ${diff}.`,
          correct: diff,
          options: this.makeOptions(diff, 4, 3),
          type: 'quiz'
        };
      } else {
        return {
          topic: `U8: Lectura de Gráfico (${theme.title})`,
          question: `Observando el gráfico de barras, ¿cuál es la opción preferida por más alumnos?`,
          visual: visual,
          hint: `Busca la barra más alta de todas: corresponde a ${maxLabel} con ${maxVal} votos.`,
          correct: maxLabel,
          options: this.shuffleArray([...labels]),
          type: 'quiz'
        };
      }
    } else if (chosen === 'frequency_moda') {
      const modaThemes = [
        { cat: 'la fruta favorita', items: ['Manzana', 'Plátano', 'Fresa'] },
        { cat: 'el color preferido', items: ['Azul', 'Rojo', 'Verde'] },
        { cat: 'la asignatura preferida', items: ['Matemáticas', 'Ciencias', 'Música'] }
      ];
      const mTheme = modaThemes[Math.floor(Math.random() * modaThemes.length)];
      const countSet = new Set();
      while (countSet.size < 3) {
        countSet.add(Math.floor(Math.random() * 11) + 6); // 6 a 16
      }
      const counts = Array.from(countSet);
      const items3 = mTheme.items;
      const maxV = Math.max(...counts);
      const maxI = counts.indexOf(maxV);
      const modaItem = items3[maxI];
      return {
        topic: `U8: Frecuencia y Moda (Nivel ${level})`,
        question: `En una encuesta sobre ${mTheme.cat} en 4º: ${items3[0]} (${counts[0]} votos), ${items3[1]} (${counts[1]} votos), ${items3[2]} (${counts[2]} votos). ¿Cuál es la MODA del estudio?`,
        hint: `La moda es el dato que tiene la mayor frecuencia absoluta (el más votado: ${modaItem} con ${maxV} votos).`,
        correct: modaItem,
        options: this.shuffleArray([...items3, 'No hay moda']),
        type: 'quiz'
      };
    } else if (chosen === 'pictogram') {
      const factors = [2, 4, 5, 10];
      const factor = factors[Math.floor(Math.random() * factors.length)];
      const count = Math.floor(Math.random() * 6) + 3; // 3 a 8
      const icons = [
        { icon: '📚', name: 'libros leídos' },
        { icon: '🌳', name: 'árboles plantados' },
        { icon: '🚲', name: 'kilómetros en bici' },
        { icon: '🍎', name: 'piezas de fruta' }
      ];
      const picItem = icons[Math.floor(Math.random() * icons.length)];
      const total = factor * count;
      const iconsStr = picItem.icon.repeat(count);
      return {
        topic: `U8: Pictograma Estadístico (Nivel ${level})`,
        question: `En un pictograma escolar, cada icono ${picItem.icon} representa ${factor} ${picItem.name}. Si una clase tiene dibujados ${count} iconos (${iconsStr}), ¿cuántos representan en total?`,
        hint: `Multiplica los iconos dibujados por el valor de cada uno: ${count} × ${factor} = ${total}.`,
        correct: total,
        options: this.makeOptions(total, 4, 5),
        type: 'quiz'
      };
    } else {
      if (level === 1) {
        return {
          topic: 'U8: Probabilidad Intuitiva (Nivel 1)',
          question: `Al tirar un dado común de 6 caras (numeradas del 1 al 6), sacar el número 8 es un suceso...`,
          hint: `Como las caras sólo van del 1 al 6, es algo que NUNCA puede ocurrir.`,
          correct: 'Imposible',
          options: this.shuffleArray(['Imposible', 'Seguro', 'Posible pero difícil', 'Muy probable']),
          type: 'quiz'
        };
      } else {
        let red = Math.floor(Math.random() * 8) + 2; // 2..9
        let blue = Math.floor(Math.random() * 8) + 2; // 2..9
        if (red === blue) blue = red > 5 ? red - 3 : red + 3;
        const visual = this.renderProbabilityUrnSVG(red, blue);
        const askMost = Math.random() > 0.5;
        let correctColor = '';
        let qText = '';
        let hintText = '';
        if (askMost) {
          correctColor = red > blue ? 'Bola Roja' : 'Bola Azul';
          const maxColor = red > blue ? 'rojas' : 'azules';
          const maxNum = Math.max(red, blue);
          const minNum = Math.min(red, blue);
          qText = `En una bolsa opaca hay ${red} bolas rojas y ${blue} bolas azules. Si sacas una bola sin mirar, ¿de qué color es MÁS PROBABLE que salga?`;
          hintText = `Hay más bolas ${maxColor} (${maxNum}) que del otro color (${minNum}), por lo que es más fácil sacar una de ese color.`;
        } else {
          correctColor = red < blue ? 'Bola Roja' : 'Bola Azul';
          const minColor = red < blue ? 'rojas' : 'azules';
          const maxNum = Math.max(red, blue);
          const minNum = Math.min(red, blue);
          qText = `En una bolsa opaca hay ${red} bolas rojas y ${blue} bolas azules. Si sacas una bola sin mirar, ¿de qué color es MENOS PROBABLE que salga?`;
          hintText = `Hay menos bolas ${minColor} (${minNum}) que del otro color (${maxNum}), por lo que es menos probable sacarla.`;
        }
        return {
          topic: `U8: Urna de Probabilidad (Nivel ${level})`,
          question: qText,
          visual: visual,
          hint: hintText,
          correct: correctColor,
          options: ['Bola Roja', 'Bola Azul', 'Ambas igual de probables', 'Es imposible saberlo'],
          type: 'quiz'
        };
      }
    }
  }

  // =================================================================
  // UNIDAD 9: REDUCE, REUTILIZA Y RECICLA (ODS 11: Ciudades y comunidades sostenibles)
  // Saberes: Interpretar igualdades y desigualdades (balanzas), patrones y series, pensamiento computacional (secuencias y bucles)
  // =================================================================
  static generateUnit9(level = 2) {
    const subtopics = ['balance_equality', 'patterns_series', 'computational_thinking', 'recycling_problem'];
    const chosen = subtopics[Math.floor(Math.random() * subtopics.length)];

    if (chosen === 'balance_equality') {
      const leftWeight = (Math.floor(Math.random() * 5) + 3) * 5; // 15, 20, 25, 30, 35
      const rightKnown = leftWeight - (Math.floor(Math.random() * 3) + 2) * 2;
      const unknown = leftWeight - rightKnown;
      const visual = this.renderBalanceSVG(leftWeight, rightKnown, '?');
      return {
        topic: `U9: Balanzas en Equilibrio (Nivel ${level})`,
        question: `La balanza está en perfecto equilibrio. ¿Cuánto pesa la caja misteriosa [ ? ]?`,
        visual: visual,
        hint: `Para mantener el equilibrio, ambos lados deben pesar igual: resta ${leftWeight} - ${rightKnown} = ${unknown} kg.`,
        correct: `${unknown} kg`,
        options: this.makeOptions(unknown, 4, 4).map(v => `${v} kg`),
        type: 'quiz'
      };
    } else if (chosen === 'patterns_series') {
      if (level <= 2) {
        const step = Math.floor(Math.random() * 4) + 4; // 4 a 7
        const start = Math.floor(Math.random() * 10) + 5;
        const s1 = start;
        const s2 = s1 + step;
        const s3 = s2 + step;
        const s4 = s3 + step;
        const ans = s4 + step;
        return {
          topic: `U9: Identificar Patrones (Nivel ${level})`,
          question: `¿Qué número sigue en esta serie lógica: ${s1}, ${s2}, ${s3}, ${s4}, [ ? ]?`,
          hint: `Descubre la regla de la serie: a cada número se le suma siempre +${step}.`,
          correct: ans,
          options: this.makeOptions(ans, 4, 6),
          type: 'quiz'
        };
      } else {
        const start = Math.floor(Math.random() * 4) + 2; // 2 a 5
        const factor = Math.random() > 0.5 ? 2 : 3; // ×2 o ×3
        const s1 = start;
        const s2 = s1 * factor;
        const s3 = s2 * factor;
        const s4 = s3 * factor;
        const ans = s4 * factor;
        return {
          topic: `U9: Serie Geométrica (Nivel ${level})`,
          question: `¿Qué número completa la serie de reciclaje: ${s1}, ${s2}, ${s3}, ${s4}, [ ? ]?`,
          hint: `El patrón multiplica cada término por ${factor}: ${s4} × ${factor} = ${ans}.`,
          correct: ans,
          options: this.makeOptions(ans, 4, 15),
          type: 'quiz'
        };
      }
    } else if (chosen === 'computational_thinking') {
      const times = Math.floor(Math.random() * 3) + 3; // 3 a 5
      const meters = Math.floor(Math.random() * 4) + 2; // 2 a 5
      const totalDist = times * meters;
      const codeVisual = `
        <div class="code-sequence-box">
          <div class="code-line"><span class="code-tag loop">BUCLE</span> Repetir ${times} veces:</div>
          <div class="code-line code-indent"><span class="code-tag step">PASO 1</span> Avanzar ${meters} metros</div>
          <div class="code-line code-indent"><span class="code-tag step">PASO 2</span> Recoger plástico de la orilla</div>
        </div>
      `;
      return {
        topic: `U9: Programar Bucles (Nivel ${level})`,
        question: `Un robot ecológico ejecuta el programa mostrado arriba. ¿Cuántos metros recorre en total al finalizar el bucle?`,
        visual: codeVisual,
        hint: `Multiplica las repeticiones del bucle por la distancia de cada paso: ${times} veces × ${meters} metros = ${totalDist} m.`,
        correct: `${totalDist} m`,
        options: this.makeOptions(totalDist, 4, 6).map(v => `${v} m`),
        type: 'quiz'
      };
    } else {
      const wasteBank = [
        // Azul: papel y cartón
        { item: 'una caja de cartón plegada', bin: 'Contenedor Azul' },
        { item: 'un periódico o revista vieja', bin: 'Contenedor Azul' },
        { item: 'un cuaderno gastado de papel', bin: 'Contenedor Azul' },
        { item: 'un paquete de folios usados', bin: 'Contenedor Azul' },
        // Amarillo: plástico, latas, briks
        { item: 'una botella de plástico de agua', bin: 'Contenedor Amarillo' },
        { item: 'una lata de refresco de aluminio', bin: 'Contenedor Amarillo' },
        { item: 'un brik de zumo o leche', bin: 'Contenedor Amarillo' },
        { item: 'una tarrina de yogur limpia', bin: 'Contenedor Amarillo' },
        // Verde: vidrio
        { item: 'un tarro de cristal de mermelada', bin: 'Contenedor Verde' },
        { item: 'una botella de vidrio de aceite', bin: 'Contenedor Verde' },
        { item: 'un frasco de perfume vacío de cristal', bin: 'Contenedor Verde' },
        { item: 'un bote de vidrio de conserva', bin: 'Contenedor Verde' },
        // Marrón: restos orgánicos
        { item: 'la piel de un plátano', bin: 'Contenedor Marrón' },
        { item: 'la cáscara de un huevo', bin: 'Contenedor Marrón' },
        { item: 'los restos de una manzana', bin: 'Contenedor Marrón' },
        { item: 'los posos de café o restos vegetales', bin: 'Contenedor Marrón' }
      ];
      const pick = wasteBank[Math.floor(Math.random() * wasteBank.length)];
      return {
        topic: 'U9: Separación de Residuos (ODS 11)',
        question: `¿En qué contenedor de reciclaje se debe depositar ${pick.item}?`,
        hint: `Azul: papel y cartón | Amarillo: envases de plástico, latas y briks | Verde: botellas y tarros de vidrio | Marrón: restos orgánicos.`,
        correct: pick.bin,
        options: this.shuffleArray(['Contenedor Azul', 'Contenedor Amarillo', 'Contenedor Verde', 'Contenedor Marrón']),
        type: 'quiz'
      };
    }
  }

  // =================================================================
  // MISIÓN ESPECIAL: TABLAS DE MULTIPLICAR (AFIANZAR Y DOMINAR)
  // Saberes: Tablas 1 al 12 (con foco en 6, 7, 8, 9), factores misteriosos,
  // cálculo relámpago con decenas, series numéricas y problemas rápidos.
  // =================================================================
  static generateTables(level = 2, tableFocus = 'all') {
    // 1. Determinar la tabla base (T)
    let T = 2;
    if (tableFocus === 'hard') {
      const hardTables = [6, 7, 8, 9];
      T = hardTables[Math.floor(Math.random() * hardTables.length)];
    } else if (typeof tableFocus === 'number' || (!isNaN(parseInt(tableFocus)) && tableFocus !== 'all')) {
      T = parseInt(tableFocus);
    } else {
      if (level === 1) {
        const basicTables = [2, 3, 4, 5, 10];
        T = basicTables[Math.floor(Math.random() * basicTables.length)];
      } else {
        // En niveles 2, 3 y 4 damos peso especial a 6, 7, 8 y 9
        const weightedTables = [2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10];
        T = weightedTables[Math.floor(Math.random() * weightedTables.length)];
      }
    }

    // Trucos didácticos de 4º de Primaria
    const tricks = {
      2: 'La tabla del 2 es el doble: sumas el número consigo mismo.',
      3: 'La tabla del 3 es el triple: sumas el número 3 veces.',
      4: '¡Truco del 4! Es el doble del doble (multiplicas por 2 y otra vez por 2).',
      5: '¡Truco del 5! Todos los resultados terminan en 0 o en 5.',
      6: 'Truco del 6: 6 × N es lo mismo que (5 × N) + N.',
      7: '¡El gran reto del 7! Recuerda: 7 × 8 = 56 (¡5, 6, 7, 8!) y 7 × 7 = 49.',
      8: '¡Truco del 8! Es el doble del doble del doble (¡tres veces el doble!).',
      9: '¡Mágico truco del 9! Las dos cifras siempre suman 9 (ej: 9×4=36, 3+6=9) y la decena es 1 menos.',
      10: '¡Súper fácil! Solo tienes que añadir un cero al final.',
      11: '¡Truco del 11! Para números de 1 cifra, repites el número dos veces (ej: 11 × 7 = 77).',
      12: '12 × N es lo mismo que (10 × N) + (2 × N).'
    };

    // Subtipos según nivel
    const subtopicsByLevel = {
      1: ['direct', 'commutative', 'visual_array'],
      2: ['direct', 'missing_factor', 'real_world'],
      3: ['missing_factor', 'inverse_division', 'table_series'],
      4: ['tens_hundreds', 'triple_product', 'mental_combined', 'missing_factor']
    };

    const allowed = subtopicsByLevel[level] || subtopicsByLevel[2];
    const mode = allowed[Math.floor(Math.random() * allowed.length)];

    if (mode === 'direct') {
      const K = Math.floor(Math.random() * 9) + 2; // 2 a 10
      const ans = T * K;
      const visual = (T <= 6 && K <= 6) ? this.renderTableArraySVG(T, K) : `<div class="table-chip">🎯 Tabla del ${T}</div>`;
      return {
        topic: `Tablas: Tabla del ${T} (Nivel ${level})`,
        question: `¿Cuánto es ${T} × ${K}?`,
        visual: visual,
        hint: tricks[T] || `Calcula ${T} veces ${K} o ${K} veces ${T}.`,
        correct: ans,
        options: this.makeOptions(ans, 4, Math.max(6, T)),
        type: 'quiz'
      };
    }

    if (mode === 'visual_array') {
      const rows = Math.min(T, 6);
      const cols = Math.floor(Math.random() * 5) + 2; // 2 a 6
      const ans = rows * cols;
      return {
        topic: `Tablas: Filas y Columnas (Nivel 1)`,
        question: `Observa la cuadrícula de arriba: Hay ${rows} filas con ${cols} fichas en cada fila. ¿Cuántas fichas hay en total?`,
        visual: this.renderTableArraySVG(rows, cols),
        hint: `Multiplica el número de filas (${rows}) por el número de columnas (${cols}): ${rows} × ${cols} = ${ans}.`,
        correct: ans,
        options: this.makeOptions(ans, 4, 6),
        type: 'quiz'
      };
    }

    if (mode === 'commutative') {
      const K = Math.floor(Math.random() * 9) + 2;
      const ans = T * K;
      return {
        topic: `Tablas: Propiedad Conmutativa (Nivel 1)`,
        question: `Si sabemos que ${K} × ${T} = ${ans}, ¿cuánto es ${T} × ${K}?`,
        visual: `<div class="table-chip">🔄 Conmutativa: ${K} × ${T} = ${T} × ${K}</div>`,
        hint: `¡Propiedad conmutativa! El orden de los factores no altera el resultado final.`,
        correct: ans,
        options: this.makeOptions(ans, 4, 6),
        type: 'quiz'
      };
    }

    if (mode === 'missing_factor') {
      const K = Math.floor(Math.random() * 9) + 2; // 2 a 10
      const ans = T * K;
      const isFirst = Math.random() > 0.5;
      const equation = isFirst ? `[ ? ] × ${K} = ${ans}` : `${T} × [ ? ] = ${ans}`;
      const missing = isFirst ? T : K;
      return {
        topic: `Tablas: Factor Misterioso (Nivel ${level})`,
        question: `Encuentra el número que falta en la multiplicación: ${equation}`,
        visual: `<div class="table-chip">🔍 ¡Factor Oculto!</div>`,
        hint: tricks[T] || `Piensa: ¿qué número multiplicado por ${isFirst ? K : T} da ${ans}? También puedes calcular ${ans} ÷ ${isFirst ? K : T}.`,
        correct: missing,
        options: this.makeOptions(missing, 4, 3),
        type: 'quiz'
      };
    }

    if (mode === 'real_world') {
      const K = Math.floor(Math.random() * 8) + 2;
      const ans = T * K;
      const stories = [
        { item: 'cajas de lápices', unit: 'lápices en cada caja', total: 'lápices' },
        { item: 'paquetes de cromos', unit: 'cromos en cada paquete', total: 'cromos' },
        { item: 'estanterías de libros', unit: 'libros en cada balda', total: 'libros' },
        { item: 'bolsas de canicas', unit: 'canicas en cada bolsa', total: 'canicas' },
        { item: 'bandejas de pastelitos', unit: 'pastelitos en cada bandeja', total: 'pastelitos' }
      ];
      const s = stories[Math.floor(Math.random() * stories.length)];
      return {
        topic: `Tablas: Problema Rápido (Nivel 2)`,
        question: `En clase hay ${T} ${s.item}. Si hay ${K} ${s.unit}, ¿cuántos ${s.total} hay en total?`,
        visual: `<div class="table-chip">📦 ${T} × ${K}</div>`,
        hint: `Para calcular el total, multiplica: ${T} × ${K} = ${ans}.`,
        correct: ans,
        options: this.makeOptions(ans, 4, Math.max(6, T)),
        type: 'quiz'
      };
    }

    if (mode === 'inverse_division') {
      const K = Math.floor(Math.random() * 9) + 2;
      const total = T * K;
      return {
        topic: `Tablas: Operación Inversa (Nivel 3)`,
        question: `Si sabemos que ${T} × ${K} = ${total}, ¿cuál es el resultado de ${total} ÷ ${T}?`,
        visual: `<div class="table-chip">➗ ${total} ÷ ${T}</div>`,
        hint: `La división es la operación inversa de la multiplicación: ${total} ÷ ${T} = ${K}.`,
        correct: K,
        options: this.makeOptions(K, 4, 3),
        type: 'quiz'
      };
    }

    if (mode === 'table_series') {
      const startMult = Math.floor(Math.random() * 4) + 1;
      const s1 = T * startMult;
      const s2 = T * (startMult + 1);
      const s3 = T * (startMult + 2);
      const s4 = T * (startMult + 3);
      const s5 = T * (startMult + 4);
      return {
        topic: `Tablas: Serie de la Tabla del ${T} (Nivel 3)`,
        question: `¿Qué número de la tabla del ${T} falta en esta serie: ${s1}, ${s2}, ${s3}, [ ? ], ${s5}?`,
        visual: `<div class="table-chip">⚡ Racha del ${T} (+${T})</div>`,
        hint: `En la tabla del ${T}, cada número aumenta de ${T} en ${T}: ${s3} + ${T} = ${s4}.`,
        correct: s4,
        options: this.makeOptions(s4, 4, T * 2),
        type: 'quiz'
      };
    }

    if (mode === 'tens_hundreds') {
      const K = Math.floor(Math.random() * 8) + 2;
      const multTen = Math.random() > 0.4 ? 10 : 100;
      const factor2 = K * multTen;
      const ans = T * factor2;
      return {
        topic: `Tablas: Cálculo Relámpago con Decenas (Nivel 4)`,
        question: `Calcula mentalmente: ${T} × ${factor2}`,
        visual: `<div class="table-chip">🚀 Cálculo Relámpago</div>`,
        hint: `Multiplica primero ${T} × ${K} = ${T * K}, y luego añade ${multTen === 10 ? 'un cero' : 'dos ceros'}.`,
        correct: ans,
        options: this.makeOptions(ans, 4, multTen === 10 ? 30 : 300),
        type: 'quiz'
      };
    }

    if (mode === 'triple_product') {
      const a = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
      const b = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
      const c = Math.floor(Math.random() * 4) + 2; // 2, 3, 4, 5
      const ans = a * b * c;
      return {
        topic: `Tablas: Producto Triple (Nivel 4)`,
        question: `Calcula mentalmente el triple producto: ${a} × ${b} × ${c}`,
        visual: `<div class="table-chip">⭐ (${a} × ${b}) × ${c}</div>`,
        hint: `Multiplica primero (${a} × ${b} = ${a * b}), y después multiplica ${a * b} × ${c} = ${ans}.`,
        correct: ans,
        options: this.makeOptions(ans, 4, 8),
        type: 'quiz'
      };
    }

    // fallback mental_combined
    const K = Math.floor(Math.random() * 8) + 2;
    const baseProd = T * K;
    const extra = Math.floor(Math.random() * 15) + 5;
    const isAdd = Math.random() > 0.5;
    const ans = isAdd ? baseProd + extra : baseProd - extra;
    return {
      topic: `Tablas: Reto Combinado Rápido (Nivel 4)`,
      question: `Resuelve mentalmente: (${T} × ${K}) ${isAdd ? '+' : '-'} ${extra}`,
      visual: `<div class="table-chip">🧠 Reto Combinado</div>`,
      hint: `Primero haz la multiplicación: ${T} × ${K} = ${baseProd}. Luego ${isAdd ? 'suma' : 'resta'} ${extra}.`,
      correct: ans,
      options: this.makeOptions(ans, 4, 10),
      type: 'quiz'
    };
  }

  static renderTableArraySVG(rows, cols) {
    const r = Math.min(Math.max(rows, 1), 7);
    const c = Math.min(Math.max(cols, 1), 7);
    const dotR = 8;
    const gap = 24;
    const width = c * gap + 30;
    const height = r * gap + 30;
    let circles = '';
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
    const fillColor = colors[(r + c) % colors.length];
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        const cx = 20 + j * gap;
        const cy = 20 + i * gap;
        circles += `<circle cx="${cx}" cy="${cy}" r="${dotR}" fill="${fillColor}" stroke="#1e293b" stroke-width="1.5"/>`;
      }
    }
    return `<div class="table-array-container">
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:block; margin: 0 auto;">
        ${circles}
      </svg>
      <div class="table-array-caption">${rows} filas con ${cols} fichas cada una = ${rows * cols}</div>
    </div>`;
  }

  // =================================================================
  // MÉTODOS RETROCOMPATIBLES
  // =================================================================
  static generateMultDiv(level = 2) {
    return Math.random() > 0.5 ? this.generateUnit3(level) : this.generateUnit4(level);
  }
  static generateFractionsDecimals(level = 2) {
    return this.generateUnit5(level);
  }
  static generateWordProblems(level = 2) {
    return this.generateUnit2(level);
  }
  static generateRomanNumbers(level = 2) {
    return this.generateUnit1(level);
  }
  static generateGeometryUnits(level = 2) {
    return this.generateUnit7(level);
  }

  // =================================================================
  // RENDERIZADORES DIDÁCTICOS VECTORIALES (SVG 100% AUTÓNOMOS)
  // =================================================================

  // 1. Fracción en Tarta/Pizza
  static renderFractionSVG(num, den) {
    const size = 130;
    const r = 52;
    const cx = size / 2;
    const cy = size / 2;
    let paths = '';

    for (let i = 0; i < den; i++) {
      const angle1 = (i * 2 * Math.PI) / den - Math.PI / 2;
      const angle2 = ((i + 1) * 2 * Math.PI) / den - Math.PI / 2;
      const x1 = cx + r * Math.cos(angle1);
      const y1 = cy + r * Math.sin(angle1);
      const x2 = cx + r * Math.cos(angle2);
      const y2 = cy + r * Math.sin(angle2);
      const color = i < num ? '#f97316' : '#f1f5f9';
      const stroke = '#cbd5e1';

      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
      paths += `<path d="${d}" fill="${color}" stroke="${stroke}" stroke-width="2" />`;
    }

    return `<svg class="math-svg-responsive" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${paths}</svg>`;
  }

  // 2. Cuadrícula de Coordenadas Cartesianas (X, Y)
  static renderCoordinateGridSVG(targetX, targetY, itemIcon = '💎', size = 5) {
    const w = 220;
    const h = 200;
    const padLeft = 32;
    const padBottom = 28;
    const gridW = w - padLeft - 15;
    const gridH = h - padBottom - 15;
    const stepX = gridW / size;
    const stepY = gridH / size;

    let lines = '';
    // Ejes y líneas
    for (let i = 0; i <= size; i++) {
      const gx = padLeft + i * stepX;
      const gy = h - padBottom - i * stepY;
      // Verticales
      lines += `<line x1="${gx}" y1="${15}" x2="${gx}" y2="${h - padBottom}" stroke="#e2e8f0" stroke-width="1.5" />`;
      // Horizontales
      lines += `<line x1="${padLeft}" y1="${gy}" x2="${w - 15}" y2="${gy}" stroke="#e2e8f0" stroke-width="1.5" />`;
      // Etiquetas numéricas
      if (i > 0) {
        lines += `<text x="${gx}" y="${h - 10}" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#64748b" text-anchor="middle">${i}</text>`;
        lines += `<text x="${padLeft - 10}" y="${gy + 4}" font-family="'Fredoka', sans-serif" font-size="12" font-weight="700" fill="#64748b" text-anchor="end">${i}</text>`;
      }
    }

    // Ejes principales destacados
    lines += `<line x1="${padLeft}" y1="${15}" x2="${padLeft}" y2="${h - padBottom}" stroke="#94a3b8" stroke-width="2.5" />`;
    lines += `<line x1="${padLeft}" y1="${h - padBottom}" x2="${w - 15}" y2="${h - padBottom}" stroke="#94a3b8" stroke-width="2.5" />`;
    lines += `<text x="${w - 10}" y="${h - 10}" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#0f172a">X</text>`;
    lines += `<text x="${padLeft - 10}" y="${15}" font-family="'Fredoka', sans-serif" font-size="12" font-weight="800" fill="#0f172a">Y</text>`;

    // Elemento en la coordenada
    const px = padLeft + targetX * stepX;
    const py = h - padBottom - targetY * stepY;
    const element = `
      <circle cx="${px}" cy="${py}" r="12" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
      <text x="${px}" y="${py + 6}" font-size="16" text-anchor="middle">${itemIcon}</text>
    `;

    return `<svg class="math-svg-responsive" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${lines}${element}</svg>`;
  }

  // 3. Gráfico de Barras Estadístico
  static renderBarChartSVG(labels, values) {
    const w = 260;
    const h = 150;
    const padLeft = 32;
    const padBottom = 26;
    const chartW = w - padLeft - 16;
    const chartH = h - padBottom - 20;
    const maxVal = Math.max(...values, 16);
    const barWidth = chartW / labels.length - 12;

    const barColors = ['#3b82f6', '#f59e0b', '#10b981', '#ec4899'];
    let content = '';

    // Eje horizontal y vertical
    content += `<line x1="${padLeft}" y1="${h - padBottom}" x2="${w - 10}" y2="${h - padBottom}" stroke="#94a3b8" stroke-width="2"/>`;
    content += `<line x1="${padLeft}" y1="12" x2="${padLeft}" y2="${h - padBottom}" stroke="#94a3b8" stroke-width="2"/>`;

    labels.forEach((lbl, idx) => {
      const val = values[idx];
      const bh = (val / maxVal) * chartH;
      const bx = padLeft + 8 + idx * (barWidth + 12);
      const by = h - padBottom - bh;
      const color = barColors[idx % barColors.length];

      // Barra
      content += `<rect x="${bx}" y="${by}" width="${barWidth}" height="${bh}" rx="4" fill="${color}" stroke="#1e293b" stroke-opacity="0.1" stroke-width="1"/>`;
      // Valor arriba
      content += `<text x="${bx + barWidth/2}" y="${by - 4}" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#1e293b" text-anchor="middle">${val}</text>`;
      // Etiqueta abajo
      const shortLbl = lbl.length > 5 ? lbl.slice(0, 4) + '..' : lbl;
      content += `<text x="${bx + barWidth/2}" y="${h - 10}" font-family="'Fredoka', sans-serif" font-size="10" font-weight="600" fill="#64748b" text-anchor="middle">${shortLbl}</text>`;
    });

    return `<svg class="math-svg-responsive" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${content}</svg>`;
  }

  // 4. Balanza en Equilibrio
  static renderBalanceSVG(leftWeight, rightKnown, unknownLabel = '?') {
    const w = 260;
    const h = 130;
    return `
      <svg class="math-svg-responsive" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <!-- Base de soporte -->
        <polygon points="130,55 116,110 144,110" fill="#475569" stroke="#334155" stroke-width="2"/>
        <rect x="100" y="110" width="60" height="8" rx="3" fill="#334155"/>
        <!-- Brazo horizontal en equilibrio -->
        <line x1="35" y1="55" x2="225" y2="55" stroke="#0284c7" stroke-width="5" stroke-linecap="round"/>
        <circle cx="130" cy="55" r="5" fill="#f59e0b"/>
        <!-- Cadenas izquierda -->
        <line x1="50" y1="55" x2="35" y2="85" stroke="#94a3b8" stroke-width="1.5"/>
        <line x1="50" y1="55" x2="65" y2="85" stroke="#94a3b8" stroke-width="1.5"/>
        <!-- Platillo izquierdo -->
        <path d="M 25 85 Q 50 96 75 85 Z" fill="#94a3b8"/>
        <!-- Pesa izquierda -->
        <rect x="36" y="65" width="28" height="20" rx="3" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5"/>
        <text x="50" y="79" font-family="'Fredoka', sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">${leftWeight}kg</text>

        <!-- Cadenas derecha -->
        <line x1="210" y1="55" x2="195" y2="85" stroke="#94a3b8" stroke-width="1.5"/>
        <line x1="210" y1="55" x2="225" y2="85" stroke="#94a3b8" stroke-width="1.5"/>
        <!-- Platillo derecho -->
        <path d="M 185 85 Q 210 96 235 85 Z" fill="#94a3b8"/>
        <!-- Pesa conocida derecha -->
        <rect x="190" y="68" width="22" height="17" rx="3" fill="#10b981" stroke="#059669" stroke-width="1.2"/>
        <text x="201" y="80" font-family="'Fredoka', sans-serif" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">${rightKnown}k</text>
        <!-- Caja misteriosa -->
        <rect x="216" y="63" width="22" height="22" rx="3" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/>
        <text x="227" y="79" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">${unknownLabel}</text>
      </svg>
    `;
  }

  // 5. Urna de Probabilidad con Bolas (Dibuja la cantidad exacta de bolas rojas y azules)
  static renderProbabilityUrnSVG(redCount = 7, blueCount = 3) {
    const w = 200;
    const h = 110;
    // Slots seguros dentro de la urna de cristal
    const availableSlots = [
      { x: 74, y: 82 }, { x: 92, y: 84 }, { x: 110, y: 84 }, { x: 128, y: 82 },
      { x: 68, y: 68 }, { x: 85, y: 69 }, { x: 101, y: 70 }, { x: 117, y: 69 }, { x: 134, y: 68 },
      { x: 72, y: 54 }, { x: 88, y: 55 }, { x: 104, y: 55 }, { x: 120, y: 54 }, { x: 132, y: 53 },
      { x: 78, y: 40 }, { x: 94, y: 41 }, { x: 110, y: 41 }, { x: 126, y: 40 }
    ];

    const ballColors = [];
    for (let i = 0; i < redCount; i++) ballColors.push({ fill: '#ef4444', stroke: '#b91c1c' });
    for (let i = 0; i < blueCount; i++) ballColors.push({ fill: '#3b82f6', stroke: '#1d4ed8' });

    // Mezclar para una apariencia natural
    for (let i = ballColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ballColors[i], ballColors[j]] = [ballColors[j], ballColors[i]];
    }

    let balls = '';
    const total = ballColors.length;
    for (let i = 0; i < total && i < availableSlots.length; i++) {
      const slot = availableSlots[i];
      const col = ballColors[i];
      balls += `<circle cx="${slot.x}" cy="${slot.y}" r="7" fill="${col.fill}" stroke="${col.stroke}" stroke-width="1.5" />`;
      balls += `<circle cx="${slot.x - 2}" cy="${slot.y - 2}" r="2" fill="#ffffff" fill-opacity="0.65" />`;
    }

    return `
      <svg class="math-svg-responsive" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <!-- Tarro o urna de cristal -->
        <path d="M 50 25 L 55 90 Q 100 105 145 90 L 150 25 Z" fill="#f0f9ff" fill-opacity="0.75" stroke="#38bdf8" stroke-width="3"/>
        <ellipse cx="100" cy="25" rx="50" ry="7" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
        ${balls}
      </svg>
    `;
  }

  // 6. Polígonos y Cuerpos Geométricos con Figura Ilustrada y Descripción Completa (100% visible)
  static renderPolygonSVG(type = 'pentágono') {
    const t = String(type).toLowerCase();
    let svg = '';
    let icon = '📐';
    let pillClass = 'pill-indigo';
    let desc = '';

    // 2D: Triángulos
    if (t.includes('equilátero') || t.includes('equilatero')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <polygon points="110,15 45,115 175,115" fill="#fce7f3" stroke="#db2777" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="110" cy="15" r="5" fill="#be185d"/>
        <circle cx="45" cy="115" r="5" fill="#be185d"/>
        <circle cx="175" cy="115" r="5" fill="#be185d"/>
        <line x1="74" y1="65" x2="81" y2="70" stroke="#be185d" stroke-width="2.5"/>
        <line x1="146" y1="65" x2="139" y2="70" stroke="#be185d" stroke-width="2.5"/>
        <line x1="110" y1="110" x2="110" y2="120" stroke="#be185d" stroke-width="2.5"/>
      </svg>`;
      icon = '🔺';
      pillClass = 'pill-pink';
      desc = 'Triángulo equilátero: 3 lados exactamente iguales';
    } else if (t.includes('isósceles') || t.includes('isosceles')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <polygon points="110,12 65,118 155,118" fill="#e0f2fe" stroke="#0284c7" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="110" cy="12" r="5" fill="#0369a1"/>
        <circle cx="65" cy="118" r="5" fill="#0369a1"/>
        <circle cx="155" cy="118" r="5" fill="#0369a1"/>
        <line x1="84" y1="63" x2="91" y2="69" stroke="#0369a1" stroke-width="2"/>
        <line x1="87" y1="60" x2="94" y2="66" stroke="#0369a1" stroke-width="2"/>
        <line x1="136" y1="63" x2="129" y2="69" stroke="#0369a1" stroke-width="2"/>
        <line x1="133" y1="60" x2="126" y2="66" stroke="#0369a1" stroke-width="2"/>
      </svg>`;
      icon = '🔺';
      pillClass = 'pill-blue';
      desc = 'Triángulo isósceles: 2 lados iguales y 1 diferente';
    } else if (t.includes('escaleno')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <polygon points="65,20 35,115 185,115" fill="#fef3c7" stroke="#d97706" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="65" cy="20" r="5" fill="#b45309"/>
        <circle cx="35" cy="115" r="5" fill="#b45309"/>
        <circle cx="185" cy="115" r="5" fill="#b45309"/>
      </svg>`;
      icon = '🔺';
      pillClass = 'pill-amber';
      desc = 'Triángulo escaleno: 3 lados de longitudes diferentes';
    } else if ((t.includes('rectángulo') || t.includes('rectangulo')) && (t.includes('tri') || t.includes('ángulo') || t.includes('angulo'))) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <polygon points="50,15 50,115 170,115" fill="#dcfce7" stroke="#16a34a" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="50" cy="15" r="5" fill="#15803d"/>
        <circle cx="50" cy="115" r="5" fill="#15803d"/>
        <circle cx="170" cy="115" r="5" fill="#15803d"/>
        <path d="M 50 100 L 65 100 L 65 115" fill="none" stroke="#15803d" stroke-width="2.5"/>
        <circle cx="57" cy="107" r="2" fill="#15803d"/>
      </svg>`;
      icon = '📐';
      pillClass = 'pill-green';
      desc = 'Triángulo rectángulo: tiene 1 ángulo recto de 90°';
    } else if (t.includes('triángulo') || t.includes('triangulo')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <polygon points="110,15 45,115 175,115" fill="#fce7f3" stroke="#db2777" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="110" cy="15" r="5" fill="#be185d"/>
        <circle cx="45" cy="115" r="5" fill="#be185d"/>
        <circle cx="175" cy="115" r="5" fill="#be185d"/>
      </svg>`;
      icon = '🔺';
      pillClass = 'pill-pink';
      desc = 'Triángulo: polígono de 3 lados y 3 vértices';
    }

    // 2D: Cuadriláteros
    else if (t.includes('cuadrado')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <rect x="65" y="18" width="90" height="90" rx="3" fill="#ede9fe" stroke="#7c3aed" stroke-width="3.5"/>
        <circle cx="65" cy="18" r="5" fill="#6d28d9"/>
        <circle cx="155" cy="18" r="5" fill="#6d28d9"/>
        <circle cx="155" cy="108" r="5" fill="#6d28d9"/>
        <circle cx="65" cy="108" r="5" fill="#6d28d9"/>
      </svg>`;
      icon = '🟦';
      pillClass = 'pill-purple';
      desc = 'Cuadrado: 4 lados iguales y 4 ángulos rectos de 90°';
    } else if (t.includes('rombo')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <polygon points="110,12 175,65 110,118 45,65" fill="#fef08a" stroke="#ca8a04" stroke-width="3.5" stroke-linejoin="round"/>
        <line x1="110" y1="12" x2="110" y2="118" stroke="#ca8a04" stroke-width="1.5" stroke-dasharray="3,3"/>
        <line x1="45" y1="65" x2="175" y2="65" stroke="#ca8a04" stroke-width="1.5" stroke-dasharray="3,3"/>
        <circle cx="110" cy="12" r="5" fill="#a16207"/>
        <circle cx="175" cy="65" r="5" fill="#a16207"/>
        <circle cx="110" cy="118" r="5" fill="#a16207"/>
        <circle cx="45" cy="65" r="5" fill="#a16207"/>
      </svg>`;
      icon = '🔶';
      pillClass = 'pill-amber';
      desc = 'Rombo: 4 lados iguales (sin ángulos rectos)';
    } else if (t.includes('trapecio')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <polygon points="75,22 145,22 180,108 40,108" fill="#fed7aa" stroke="#ea580c" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="75" cy="22" r="5" fill="#c2410c"/>
        <circle cx="145" cy="22" r="5" fill="#c2410c"/>
        <circle cx="180" cy="108" r="5" fill="#c2410c"/>
        <circle cx="40" cy="108" r="5" fill="#c2410c"/>
      </svg>`;
      icon = '⏢';
      pillClass = 'pill-orange';
      desc = 'Trapecio: 2 bases paralelas (mayor y menor)';
    } else if (t.includes('rectángulo') || t.includes('rectangulo') || t.includes('cuadrilátero') || t.includes('cuadrilatero')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <rect x="40" y="28" width="140" height="72" rx="3" fill="#e0e7ff" stroke="#4f46e5" stroke-width="3.5"/>
        <circle cx="40" cy="28" r="5" fill="#3730a3"/>
        <circle cx="180" cy="28" r="5" fill="#3730a3"/>
        <circle cx="180" cy="100" r="5" fill="#3730a3"/>
        <circle cx="40" cy="100" r="5" fill="#3730a3"/>
      </svg>`;
      icon = '▭';
      pillClass = 'pill-indigo';
      desc = 'Rectángulo: lados iguales 2 a 2 y 4 ángulos rectos';
    }

    // 2D: Otros Polígonos
    else if (t.includes('pentágono') || t.includes('pentagono')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <polygon points="110,14 175,56 150,114 70,114 45,56" fill="#fed7aa" stroke="#ea580c" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="110" cy="14" r="6" fill="#c2410c"/><text x="110" y="10" font-size="10" font-weight="900" fill="#c2410c" text-anchor="middle">1</text>
        <circle cx="175" cy="56" r="6" fill="#c2410c"/><text x="187" y="60" font-size="10" font-weight="900" fill="#c2410c">2</text>
        <circle cx="150" cy="114" r="6" fill="#c2410c"/><text x="160" y="124" font-size="10" font-weight="900" fill="#c2410c">3</text>
        <circle cx="70" cy="114" r="6" fill="#c2410c"/><text x="56" y="124" font-size="10" font-weight="900" fill="#c2410c">4</text>
        <circle cx="45" cy="56" r="6" fill="#c2410c"/><text x="32" y="60" font-size="10" font-weight="900" fill="#c2410c">5</text>
      </svg>`;
      icon = '🛑';
      pillClass = 'pill-orange';
      desc = 'Pentágono: polígono de 5 lados y 5 vértices';
    } else if (t.includes('hexágono') || t.includes('hexagono')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <polygon points="110,12 165,42 165,98 110,126 55,98 55,42" fill="#bbf7d0" stroke="#16a34a" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="110" cy="12" r="5" fill="#15803d"/>
        <circle cx="165" cy="42" r="5" fill="#15803d"/>
        <circle cx="165" cy="98" r="5" fill="#15803d"/>
        <circle cx="110" cy="126" r="5" fill="#15803d"/>
        <circle cx="55" cy="98" r="5" fill="#15803d"/>
        <circle cx="55" cy="42" r="5" fill="#15803d"/>
      </svg>`;
      icon = '⬡';
      pillClass = 'pill-green';
      desc = 'Hexágono: polígono de 6 lados y 6 vértices';
    } else if (t.includes('octógono') || t.includes('octogono')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <polygon points="80,14 140,14 175,49 175,99 140,134 80,134 45,99 45,49" fill="#fecdd3" stroke="#e11d48" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="80" cy="14" r="5" fill="#be185d"/>
        <circle cx="140" cy="14" r="5" fill="#be185d"/>
        <circle cx="175" cy="49" r="5" fill="#be185d"/>
        <circle cx="175" cy="99" r="5" fill="#be185d"/>
        <circle cx="140" cy="134" r="5" fill="#be185d"/>
        <circle cx="80" cy="134" r="5" fill="#be185d"/>
        <circle cx="45" cy="99" r="5" fill="#be185d"/>
        <circle cx="45" cy="49" r="5" fill="#be185d"/>
      </svg>`;
      icon = '🛑';
      pillClass = 'pill-pink';
      desc = 'Octógono: polígono de 8 lados y 8 vértices';
    }

    // 3D: Poliedros
    else if (t.includes('cube') || t.includes('cubo')) {
      svg = `<svg class="math-svg-responsive" width="220" height="135" viewBox="0 0 220 135">
        <polygon points="60,45 125,45 125,110 60,110" fill="#818cf8" stroke="#4338ca" stroke-width="2.5"/>
        <polygon points="60,45 88,20 153,20 125,45" fill="#c7d2fe" stroke="#4338ca" stroke-width="2.5"/>
        <polygon points="125,45 153,20 153,85 125,110" fill="#6366f1" stroke="#4338ca" stroke-width="2.5"/>
        <line x1="60" y1="110" x2="88" y2="85" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="3,3"/>
        <line x1="88" y1="20" x2="88" y2="85" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="3,3"/>
        <line x1="88" y1="85" x2="153" y2="85" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="3,3"/>
        <circle cx="60" cy="45" r="5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="125" cy="45" r="5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="125" cy="110" r="5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="60" cy="110" r="5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="88" cy="20" r="5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="153" cy="20" r="5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="153" cy="85" r="5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="88" cy="85" r="5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
      </svg>`;
      icon = '🧊';
      pillClass = 'pill-indigo';
      desc = 'Cubo: 6 caras cuadradas, 8 vértices y 12 aristas';
    } else if (t.includes('pyramid') || t.includes('pirámide') || t.includes('piramide')) {
      svg = `<svg class="math-svg-responsive" width="220" height="135" viewBox="0 0 220 135">
        <polygon points="50,105 125,115 170,95 95,85" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
        <line x1="50" y1="105" x2="95" y2="85" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3,3"/>
        <line x1="95" y1="85" x2="170" y2="95" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3,3"/>
        <line x1="110" y1="15" x2="95" y2="85" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3,3"/>
        <polygon points="110,15 50,105 125,115" fill="#fde047" fill-opacity="0.85" stroke="#b45309" stroke-width="2.5"/>
        <polygon points="110,15 125,115 170,95" fill="#eab308" fill-opacity="0.9" stroke="#b45309" stroke-width="2.5"/>
        <circle cx="110" cy="15" r="6" fill="#dc2626" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="50" cy="105" r="4.5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.2"/>
        <circle cx="125" cy="115" r="4.5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.2"/>
        <circle cx="170" cy="95" r="4.5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.2"/>
        <circle cx="95" cy="85" r="4.5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.2"/>
      </svg>`;
      icon = '🏛️';
      pillClass = 'pill-amber';
      desc = 'Pirámide cuadrangular: 1 base y 5 vértices (4 base + 1 cúspide)';
    } else if (t.includes('prisma_triangular')) {
      svg = `<svg class="math-svg-responsive" width="220" height="135" viewBox="0 0 220 135">
        <polygon points="50,35 25,105 95,105" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5"/>
        <polygon points="140,18 115,88 185,88" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5"/>
        <polygon points="50,35 140,18 185,88 95,105" fill="#7dd3fc" fill-opacity="0.85" stroke="#0284c7" stroke-width="2.5"/>
        <line x1="25" y1="105" x2="115" y2="88" stroke="#0284c7" stroke-width="2"/>
      </svg>`;
      icon = '📐';
      pillClass = 'pill-blue';
      desc = 'Prisma triangular: 2 bases triangulares paralelas y 3 caras laterales';
    } else if (t.includes('prisma_hexagonal') || t.includes('prisma')) {
      svg = `<svg class="math-svg-responsive" width="220" height="135" viewBox="0 0 220 135">
        <polygon points="90,15 130,15 150,26 130,37 90,37 70,26" fill="#c7d2fe" stroke="#4338ca" stroke-width="2"/>
        <polygon points="90,95 130,95 150,106 130,117 90,117 70,106" fill="#818cf8" stroke="#4338ca" stroke-width="2"/>
        <line x1="70" y1="26" x2="70" y2="106" stroke="#4338ca" stroke-width="2"/>
        <line x1="90" y1="37" x2="90" y2="117" stroke="#4338ca" stroke-width="2.5"/>
        <line x1="130" y1="37" x2="130" y2="117" stroke="#4338ca" stroke-width="2.5"/>
        <line x1="150" y1="26" x2="150" y2="106" stroke="#4338ca" stroke-width="2"/>
      </svg>`;
      icon = '🏢';
      pillClass = 'pill-indigo';
      desc = 'Prisma hexagonal: 2 bases hexagonales y 6 caras laterales';
    }

    // 3D: Cuerpos Redondos
    else if (t.includes('cilindro')) {
      svg = `<svg class="math-svg-responsive" width="220" height="135" viewBox="0 0 220 135">
        <path d="M 65 30 L 65 100 Q 110 120 155 100 L 155 30 Z" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5"/>
        <ellipse cx="110" cy="100" rx="45" ry="13" fill="#fdba74" stroke="#ea580c" stroke-width="2.5"/>
        <ellipse cx="110" cy="30" rx="45" ry="13" fill="#ffedd5" stroke="#ea580c" stroke-width="2.5"/>
      </svg>`;
      icon = '🥫';
      pillClass = 'pill-orange';
      desc = 'Cilindro: 2 bases circulares planas y superficie lateral curva';
    } else if (t.includes('cono')) {
      svg = `<svg class="math-svg-responsive" width="220" height="135" viewBox="0 0 220 135">
        <path d="M 110 15 L 65 102 Q 110 122 155 102 Z" fill="#fde68a" stroke="#d97706" stroke-width="2.5"/>
        <ellipse cx="110" cy="102" rx="45" ry="13" fill="#fef08a" stroke="#d97706" stroke-width="2.5"/>
        <circle cx="110" cy="15" r="5" fill="#dc2626"/>
      </svg>`;
      icon = '🍦';
      pillClass = 'pill-amber';
      desc = 'Cono: 1 base circular plana, superficie curva y cúspide';
    } else if (t.includes('esfera')) {
      svg = `<svg class="math-svg-responsive" width="220" height="135" viewBox="0 0 220 135">
        <circle cx="110" cy="65" r="48" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/>
        <ellipse cx="110" cy="65" rx="48" ry="15" fill="none" stroke="#e0f2fe" stroke-width="2" stroke-dasharray="4,3"/>
        <circle cx="95" cy="46" r="8" fill="#ffffff" fill-opacity="0.65"/>
      </svg>`;
      icon = '⚽';
      pillClass = 'pill-blue';
      desc = 'Esfera: cuerpo redondo de superficie curva continua';
    }

    // Apoyo visual para Simetría y Giros (U6)
    else if (t.includes('simetría') || t.includes('simetria')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <path d="M 110 25 C 90 8 50 16 50 52 C 50 85 90 102 110 118 C 130 102 170 85 170 52 C 170 16 130 8 110 25 Z" fill="#fbcfe8" stroke="#db2777" stroke-width="2.5"/>
        <line x1="110" y1="8" x2="110" y2="124" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="5,4"/>
      </svg>`;
      icon = '🦋';
      pillClass = 'pill-pink';
      desc = 'Eje de simetría: la mitad izquierda es idéntica a la derecha';
    } else if (t.includes('giro_oeste')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <circle cx="110" cy="65" r="48" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
        <text x="110" y="28" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#ef4444" text-anchor="middle">Norte (N)</text>
        <text x="65" y="69" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#3b82f6" text-anchor="middle">Oeste (O)</text>
        <line x1="110" y1="65" x2="110" y2="34" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round"/>
        <polygon points="110,28 105,37 115,37" fill="#ef4444"/>
        <path d="M 102 38 A 30 30 0 0 0 80 60" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="3,3"/>
        <polygon points="78,65 84,58 74,58" fill="#f59e0b"/>
      </svg>`;
      icon = '🧭';
      pillClass = 'pill-blue';
      desc = 'Giro de 90° a la izquierda en sentido antihorario (del Norte al Oeste)';
    } else if (t.includes('giro_sur')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <circle cx="110" cy="65" r="48" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
        <text x="110" y="28" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#ef4444" text-anchor="middle">Norte (N)</text>
        <text x="110" y="118" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#3b82f6" text-anchor="middle">Sur (S)</text>
        <line x1="110" y1="65" x2="110" y2="34" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round"/>
        <polygon points="110,28 105,37 115,37" fill="#ef4444"/>
        <path d="M 118 38 A 32 32 0 0 1 110 102" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="3,3"/>
        <polygon points="110,105 105,97 115,97" fill="#f59e0b"/>
      </svg>`;
      icon = '🧭';
      pillClass = 'pill-indigo';
      desc = 'Media vuelta de 180° (del Norte al Sur)';
    } else if (t.includes('giro') || t.includes('brujula')) {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130">
        <circle cx="110" cy="65" r="48" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
        <text x="110" y="28" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#ef4444" text-anchor="middle">Norte (N)</text>
        <text x="155" y="69" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#3b82f6">Este (E)</text>
        <line x1="110" y1="65" x2="110" y2="34" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round"/>
        <polygon points="110,28 105,37 115,37" fill="#ef4444"/>
        <path d="M 118 38 A 30 30 0 0 1 140 60" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="3,3"/>
        <polygon points="142,65 136,58 146,58" fill="#f59e0b"/>
      </svg>`;
      icon = '🧭';
      pillClass = 'pill-amber';
      desc = 'Giro de 90° a la derecha en sentido horario (del Norte al Este)';
    } else {
      svg = `<svg class="math-svg-responsive" width="220" height="130" viewBox="0 0 220 130"><rect x="50" y="25" width="120" height="80" rx="6" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/></svg>`;
      desc = 'Figura geométrica';
    }

    return `
      <div class="geometry-figure-card">
        ${svg}
        <div class="figure-caption-pill ${pillClass}">
          <span class="caption-icon">${icon}</span>
          <span class="caption-text">${desc}</span>
        </div>
      </div>
    `;
  }



  // Helper de opciones seguro
  static makeOptions(correctVal, count = 4, variance = 10) {
    const options = new Set([correctVal]);
    let attempts = 0;
    const maxAttempts = 40;

    if (typeof correctVal === 'number') {
      const v = Math.max(variance, count + 2);
      while (options.size < count && attempts < maxAttempts) {
        attempts++;
        const delta = Math.floor(Math.random() * (v * 2 + 1)) - v;
        const candidate = correctVal + delta;
        if (candidate > 0 && candidate !== correctVal) {
          options.add(candidate);
        }
      }

      let offset = 1;
      while (options.size < count) {
        if (!options.has(correctVal + offset)) options.add(correctVal + offset);
        if (options.size < count && correctVal - offset > 0 && !options.has(correctVal - offset)) {
          options.add(correctVal - offset);
        }
        offset++;
      }
    }

    return this.shuffleArray(Array.from(options).slice(0, count));
  }

  static shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}


// ===================================================================
// RENDERIZADOR DE AVATAR MODULAR VECTORIAL (SVG 100% AJUSTADO)
// ===================================================================

// ===================================================================
// SISTEMA DE TRANSFORMACIONES "GUERREROS DEL CÁLCULO" (ESTILO SHONEN)
// ===================================================================
const TRANSFORMATIONS = {
  1: {
    id: 'base',
    level: 1,
    name: 'Aprendiz del Cálculo',
    shortName: 'Aprendiz',
    subtitle: 'Poder Inicial (Base)',
    hairColor: '#262626',
    auraColor: null,
    auraGlow: 'none',
    minPower: 0,
    minCombo: 0,
    auraClass: 'aura-none',
    badge: '🥋 Aprendiz'
  },
  2: {
    id: 'destello',
    level: 2,
    name: 'Modo Destello',
    shortName: 'Destello',
    subtitle: 'Aura Dorada Brillante',
    hairColor: '#facc15',
    auraColor: '#fde047',
    auraGlow: '#facc15',
    minPower: 1000,
    minCombo: 3,
    auraClass: 'aura-destello',
    badge: '⚡ Destello'
  },
  3: {
    id: 'furia',
    level: 3,
    name: 'Modo Furia Solar',
    shortName: 'Furia Solar',
    subtitle: 'Aura Carmesí Vibrante',
    hairColor: '#ef4444',
    auraColor: '#f87171',
    auraGlow: '#dc2626',
    minPower: 3000,
    minCombo: 6,
    auraClass: 'aura-furia',
    badge: '🔥 Furia Solar'
  },
  4: {
    id: 'cosmico',
    level: 4,
    name: 'Modo Cósmico',
    shortName: 'Cósmico',
    subtitle: 'Pelo y Aura Azul Eléctrico',
    hairColor: '#00d2ff',
    auraColor: '#38bdf8',
    auraGlow: '#0284c7',
    minPower: 7000,
    minCombo: 9,
    auraClass: 'aura-cosmico',
    badge: '🌌 Cósmico'
  },
  5: {
    id: 'astral',
    level: 5,
    name: 'Modo Astral',
    shortName: 'Astral',
    subtitle: 'Aura Plateada Legendaria',
    hairColor: '#ffffff',
    auraColor: '#e2e8f0',
    auraGlow: '#f8fafc',
    minPower: 15000,
    minCombo: 12,
    auraClass: 'aura-astral',
    badge: '✨ Astral'
  }
};

// ===================================================================
// CATÁLOGO DE VILLANOS MATEMÁTICOS DE 4º DE PRIMARIA (EDELVIVES)
// ===================================================================
const VILLAIN_CATALOG = {
  unit1: {
    id: 'lord_cero',
    name: 'Lord Cero',
    title: 'El Ladrón de Cifras',
    unitTitle: '1. La Tierra en cifras',
    maxHp: 100,
    themeColor: '#7c3aed',
    quote: '¡Me quedaré con todos tus ceros posicionales!',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="v1-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#a855f7"/>
          <stop offset="100%" stop-color="#3b0764"/>
        </radialGradient>
      </defs>
      <circle cx="80" cy="80" r="74" fill="#1e1b4b" opacity="0.35"/>
      <!-- Capa de niebla oscura -->
      <path d="M 26 156 Q 16 110 38 72 L 122 72 Q 144 110 134 156 Z" fill="#2e1065" stroke="#581c87" stroke-width="2.5"/>
      <!-- Torso con Coraza Robótica -->
      <path d="M 44 104 Q 80 96 116 104 L 120 156 L 40 156 Z" fill="#3b0764" stroke="#581c87" stroke-width="2.5"/>
      <!-- Núcleo Vacío: El Cero Devorador -->
      <circle cx="80" cy="130" r="16" fill="#0f172a" stroke="#c084fc" stroke-width="3"/>
      <circle cx="80" cy="130" r="10" fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="4,2"/>
      <text x="80" y="136" font-family="'Fredoka', sans-serif" font-size="16" font-weight="900" fill="#f43f5e" text-anchor="middle">0</text>
      <!-- Cabeza con Cuernos Cibernéticos -->
      <path d="M 46 64 L 30 32 L 52 46 L 80 22 L 108 46 L 130 32 L 114 64 Z" fill="#581c87" stroke="#7c3aed" stroke-width="2"/>
      <ellipse cx="80" cy="74" rx="28" ry="24" fill="#1e1b4b" stroke="#6b21a8" stroke-width="2"/>
      <!-- Ojos Rojos Amenazantes -->
      <polygon points="62,72 74,75 64,79" fill="#ef4444"/>
      <polygon points="98,72 86,75 96,79" fill="#ef4444"/>
      <!-- Corona de Ceros -->
      <circle cx="80" cy="24" r="5" fill="#f43f5e"/>
    </svg>`
  },
  unit2: {
    id: 'dr_restas',
    name: 'Dr. Restas',
    title: 'El Sustractor Loco',
    unitTitle: '2. ¿Echamos una partida?',
    maxHp: 100,
    themeColor: '#0d9488',
    quote: '¡Restaré tus puntos hasta dejarte a cero!',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="74" fill="#042f2e" opacity="0.3"/>
      <!-- Pelo Electrizado Blanco -->
      <path d="M 36 68 L 20 36 L 42 48 L 40 18 L 62 36 L 80 8 L 98 36 L 120 18 L 118 48 L 140 36 L 124 68 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <!-- Bata de Laboratorio Turquesa -->
      <path d="M 44 104 Q 80 96 116 104 L 118 156 L 42 156 Z" fill="#0d9488" stroke="#115e59" stroke-width="2.5"/>
      <line x1="80" y1="104" x2="80" y2="156" stroke="#134e4a" stroke-width="2.5"/>
      <!-- Cabeza y Rasgos -->
      <ellipse cx="80" cy="74" rx="27" ry="26" fill="#fed7aa" stroke="#ea580c" stroke-width="1.8"/>
      <!-- Monóculo de Resta Láser en Ojo Izquierdo -->
      <circle cx="67" cy="73" r="11" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" stroke-width="2.5"/>
      <line x1="60" y1="73" x2="74" y2="73" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
      <line x1="67" y1="62" x2="74" y2="52" stroke="#64748b" stroke-width="2"/>
      <!-- Ojo derecho con ceja arqueada -->
      <circle cx="93" cy="73" r="3.2" fill="#1e293b"/>
      <path d="M 86 66 Q 93 61 100 66" stroke="#1e293b" stroke-width="2.2" fill="none"/>
      <!-- Sonrisa malvada de científico -->
      <path d="M 72 87 Q 80 94 88 86" stroke="#991b1b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Guantelete Eléctrico -->
      <circle cx="34" cy="136" r="10" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
      <line x1="28" y1="136" x2="40" y2="136" stroke="#ffffff" stroke-width="2.5"/>
    </svg>`
  },
  unit3: {
    id: 'general_multiplicon',
    name: 'General Multiplicón',
    title: 'El Coloso de Cuatro Brazos',
    unitTitle: '3. ¡Que empiece la función!',
    maxHp: 100,
    themeColor: '#d97706',
    quote: '¡Multiplico mis fuerzas por cuatro!',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="74" fill="#451a03" opacity="0.3"/>
      <!-- 4 Brazos Mecánicos -->
      <path d="M 38 116 L 16 90 L 26 84" stroke="#b45309" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M 122 116 L 144 90 L 134 84" stroke="#b45309" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M 38 132 L 18 144 L 26 150" stroke="#b45309" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M 122 132 L 142 144 L 134 150" stroke="#b45309" stroke-width="6" fill="none" stroke-linecap="round"/>
      <circle cx="26" cy="84" r="5" fill="#f59e0b"/>
      <circle cx="134" cy="84" r="5" fill="#f59e0b"/>
      <!-- Armadura Samurái Dorada -->
      <path d="M 42 102 Q 80 92 118 102 L 122 156 L 38 156 Z" fill="#b45309" stroke="#78350f" stroke-width="2.5"/>
      <polygon points="80,114 88,126 98,126 90,134 93,146 80,138 67,146 70,134 62,126 72,126" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
      <!-- Casco con Cresta en Cruz Multiplicadora X -->
      <path d="M 46 54 Q 80 26 114 54 L 110 74 Q 80 82 50 74 Z" fill="#d97706" stroke="#78350f" stroke-width="2.5"/>
      <line x1="70" y1="18" x2="90" y2="38" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
      <line x1="90" y1="18" x2="70" y2="38" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
      <!-- Visor de Batalla -->
      <rect x="58" y="60" width="44" height="9" rx="3" fill="#1e293b"/>
      <circle cx="72" cy="64.5" r="2.5" fill="#ef4444"/>
      <circle cx="88" cy="64.5" r="2.5" fill="#ef4444"/>
    </svg>`
  },
  unit4: {
    id: 'sombra_divisora',
    name: 'Sombra Divisora',
    title: 'El Ninja del Resto Cero',
    unitTitle: '4. Mensajes cifrados',
    maxHp: 100,
    themeColor: '#0284c7',
    quote: '¡Divido tus fuerzas y descifro tu código!',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="74" fill="#082f49" opacity="0.3"/>
      <!-- Bufanda Ondulante Azul -->
      <path d="M 46 94 Q 16 112 10 144 Q 24 136 42 106 Z" fill="#0284c7" opacity="0.85"/>
      <path d="M 114 94 Q 144 112 150 144 Q 136 136 118 106 Z" fill="#0284c7" opacity="0.85"/>
      <!-- Traje Ninja Cibernético -->
      <path d="M 44 104 Q 80 96 116 104 L 120 156 L 40 156 Z" fill="#0f172a" stroke="#0369a1" stroke-width="2.5"/>
      <line x1="48" y1="106" x2="80" y2="136" stroke="#0284c7" stroke-width="2"/>
      <line x1="112" y1="106" x2="80" y2="136" stroke="#0284c7" stroke-width="2"/>
      <!-- Máscara Ninja con Capucha -->
      <path d="M 46 68 Q 46 28 80 28 Q 114 28 114 68 L 108 92 Q 80 96 52 92 Z" fill="#1e293b" stroke="#0284c7" stroke-width="2"/>
      <!-- Visor de Ojos Cian Brillantes -->
      <path d="M 58 66 L 72 68 L 60 72 Z" fill="#00d2ff"/>
      <path d="M 102 66 L 88 68 L 100 72 Z" fill="#00d2ff"/>
      <!-- Shurikens de División -->
      <circle cx="28" cy="112" r="14" fill="#0f172a" stroke="#00d2ff" stroke-width="2"/>
      <line x1="20" y1="112" x2="36" y2="112" stroke="#00d2ff" stroke-width="2.5"/>
      <circle cx="28" cy="106" r="2" fill="#00d2ff"/>
      <circle cx="28" cy="118" r="2" fill="#00d2ff"/>
    </svg>`
  },
  unit5: {
    id: 'monstruo_fraccionario',
    name: 'Monstruo Fraccionario',
    title: 'El Devorador de Porciones',
    unitTitle: '5. ¡Toma tu parte!',
    maxHp: 100,
    themeColor: '#ea580c',
    quote: '¡Me falta un cuarto y vengo a por tu pizza!',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="74" fill="#431407" opacity="0.25"/>
      <!-- Cuerpo Redondo de Queso y Tarta Fraccionaria -->
      <circle cx="80" cy="82" r="44" fill="#f59e0b" stroke="#b45309" stroke-width="3"/>
      <!-- Porción Faltante (1/4 mordido) -->
      <path d="M 80 82 L 80 38 A 44 44 0 0 1 124 82 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2" stroke-dasharray="4,3"/>
      <text x="96" y="64" font-family="'Fredoka', sans-serif" font-size="11" font-weight="900" fill="#b45309">1/4</text>
      <!-- Ojos Saltones Divertidos -->
      <circle cx="62" cy="74" r="10" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
      <circle cx="62" cy="74" r="4.5" fill="#1e293b"/>
      <circle cx="88" cy="74" r="10" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
      <circle cx="86" cy="74" r="4.5" fill="#1e293b"/>
      <!-- Rodajas de Pepperoni con Fracciones -->
      <circle cx="56" cy="102" r="9" fill="#ef4444"/>
      <text x="56" y="105" font-family="'Fredoka', sans-serif" font-size="8" font-weight="900" fill="#ffffff" text-anchor="middle">1/2</text>
      <circle cx="94" cy="102" r="9" fill="#ef4444"/>
      <text x="94" y="105" font-family="'Fredoka', sans-serif" font-size="8" font-weight="900" fill="#ffffff" text-anchor="middle">3/4</text>
      <!-- Boca Abierta Comilona -->
      <path d="M 68 88 Q 80 100 92 88 Z" fill="#991b1b"/>
      <ellipse cx="80" cy="94" rx="4" ry="2" fill="#f43f5e"/>
    </svg>`
  },
  unit6: {
    id: 'baron_simetria',
    name: 'Barón Simetría',
    title: 'El Mago del Espejo Bipolar',
    unitTitle: '6. Patrones y formas',
    maxHp: 100,
    themeColor: '#0891b2',
    quote: '¡Invierto tus coordenadas y tu reflejo!',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="74" fill="#0e7490" opacity="0.25"/>
      <!-- Traje Bicolor Mitad Blanco / Mitad Negro -->
      <path d="M 44 104 Q 62 98 80 102 L 80 156 L 38 156 Z" fill="#0f172a"/>
      <path d="M 80 102 Q 98 98 116 104 L 122 156 L 80 156 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Eje Central de Simetría -->
      <line x1="80" y1="16" x2="80" y2="156" stroke="#06b6d4" stroke-width="3" stroke-dasharray="6,3"/>
      <!-- Cabeza Bicolor -->
      <path d="M 52 74 Q 52 46 80 46 L 80 98 Q 52 98 52 74 Z" fill="#1e293b"/>
      <path d="M 80 46 Q 108 46 108 74 Q 108 98 80 98 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Ojos Bipolares y Monóculo de Coordenadas -->
      <circle cx="66" cy="72" r="4.5" fill="#00d2ff"/>
      <circle cx="94" cy="72" r="4.5" fill="#f59e0b"/>
      <!-- Chistera Elegante Bicolor -->
      <path d="M 54 22 L 80 22 L 80 46 L 46 46 Z" fill="#0f172a"/>
      <path d="M 80 22 L 106 22 L 114 46 L 80 46 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="80" y="136" font-family="'Fredoka', sans-serif" font-size="10" font-weight="900" fill="#00d2ff" text-anchor="middle">(X, Y)</text>
    </svg>`
  },
  unit7: {
    id: 'titan_poliedro',
    name: 'Titán Poliedro',
    title: 'El Gólem de Cristal Geométrico',
    unitTitle: '7. Geometría urbana',
    maxHp: 100,
    themeColor: '#db2777',
    quote: '¡Mis caras, aristas y vértices son indestructibles!',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="74" fill="#831843" opacity="0.3"/>
      <!-- Hombros de Pirámide Dorada -->
      <polygon points="32,94 48,118 16,118" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
      <polygon points="128,94 144,118 112,118" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
      <!-- Torso Prisma Hexagonal -->
      <polygon points="56,104 104,104 116,146 80,156 44,146" fill="#be185d" stroke="#831843" stroke-width="2.5"/>
      <!-- Cabeza en Cubo Isométrico 3D -->
      <polygon points="80,32 110,48 80,64 50,48" fill="#f472b6" stroke="#9d174d" stroke-width="2"/>
      <polygon points="50,48 80,64 80,98 50,82" fill="#ec4899" stroke="#9d174d" stroke-width="2"/>
      <polygon points="80,64 110,48 110,82 80,98" fill="#db2777" stroke="#9d174d" stroke-width="2"/>
      <!-- Ojos Cúbicos Brillantes -->
      <rect x="58" y="66" width="7" height="7" fill="#fef08a"/>
      <rect x="92" y="66" width="7" height="7" fill="#fef08a"/>
      <!-- Vértices Luminosos -->
      <circle cx="80" cy="32" r="3.5" fill="#facc15"/>
      <circle cx="110" cy="48" r="3" fill="#facc15"/>
      <circle cx="50" cy="48" r="3" fill="#facc15"/>
    </svg>`
  },
  unit8: {
    id: 'conde_probabilis',
    name: 'Conde Probábilis',
    title: 'El Ilusionista del Azar',
    unitTitle: '8. Una población diversa',
    maxHp: 100,
    themeColor: '#7c3aed',
    quote: '¡Las probabilidades nunca están a tu favor!',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="74" fill="#4c1d95" opacity="0.3"/>
      <!-- Capa Mágica Púrpura con Estrellas -->
      <path d="M 38 104 Q 80 94 122 104 L 128 156 L 32 156 Z" fill="#581c87" stroke="#7c3aed" stroke-width="2"/>
      <polygon points="80,108 70,124 80,132 90,124" fill="#ec4899"/>
      <!-- Chistera con Ruleta de la Fortuna -->
      <rect x="56" y="24" width="48" height="34" rx="4" fill="#6d28d9" stroke="#4c1d95" stroke-width="2"/>
      <ellipse cx="80" cy="58" rx="36" ry="8" fill="#7c3aed" stroke="#4c1d95" stroke-width="2"/>
      <circle cx="80" cy="40" r="11" fill="#f59e0b" stroke="#1e1b4b" stroke-width="1.8"/>
      <line x1="80" y1="29" x2="80" y2="51" stroke="#ef4444" stroke-width="1.5"/>
      <line x1="69" y1="40" x2="91" y2="40" stroke="#ef4444" stroke-width="1.5"/>
      <!-- Cabeza y Bigote Estilizado -->
      <ellipse cx="80" cy="74" rx="26" ry="24" fill="#fed7aa"/>
      <circle cx="70" cy="72" r="3.5" fill="#1e293b"/>
      <circle cx="90" cy="72" r="3.5" fill="#1e293b"/>
      <path d="M 68 82 Q 74 86 80 82 Q 86 86 92 82 Q 98 88 88 88 Q 80 86 72 88 Z" fill="#1e293b"/>
      <!-- Dados del Azar Flotantes -->
      <rect x="22" y="118" width="15" height="15" rx="3" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="29.5" cy="125.5" r="2" fill="#ef4444"/>
      <rect x="122" y="118" width="15" height="15" rx="3" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="126" cy="122" r="1.5" fill="#1e293b"/>
      <circle cx="133" cy="129" r="1.5" fill="#1e293b"/>
    </svg>`
  },
  unit9: {
    id: 'megawatt_desperdicio',
    name: 'Megawatt Desperdicio',
    title: 'El Gólem de Chatarra Descalibrada',
    unitTitle: '9. Reduce, reutiliza y recicla',
    maxHp: 100,
    themeColor: '#059669',
    quote: '¡Descalibraré tu balanza ecológica!',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="74" fill="#064e3b" opacity="0.25"/>
      <!-- Chimenea con Humo -->
      <line x1="108" y1="46" x2="118" y2="24" stroke="#64748b" stroke-width="6" stroke-linecap="round"/>
      <circle cx="122" cy="18" r="6" fill="#cbd5e1" opacity="0.6"/>
      <circle cx="128" cy="10" r="8" fill="#cbd5e1" opacity="0.4"/>
      <!-- Cabeza de Chatarra Metálica -->
      <rect x="46" y="44" width="68" height="52" rx="8" fill="#475569" stroke="#1e293b" stroke-width="2.5"/>
      <!-- Ojos de Bombilla LED Brillantes -->
      <circle cx="62" cy="66" r="8.5" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
      <circle cx="90" cy="66" r="8.5" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
      <!-- Balanza en Desequilibrio en el Pecho -->
      <path d="M 44 104 Q 80 96 116 104 L 120 156 L 40 156 Z" fill="#334155" stroke="#1e293b" stroke-width="2.5"/>
      <line x1="52" y1="126" x2="108" y2="138" stroke="#10b981" stroke-width="3"/>
      <polygon points="80,132 76,146 84,146" fill="#047857"/>
      <rect x="46" y="120" width="14" height="11" rx="2" fill="#ef4444"/>
      <rect x="100" y="132" width="14" height="11" rx="2" fill="#3b82f6"/>
    </svg>`
  },
  tables: {
    id: 'kaiser_blitz',
    name: 'Káiser Blitz',
    title: 'El Señor del Rayo Multiplicador',
    unitTitle: 'Misión: Tablas de Multiplicar',
    maxHp: 120,
    themeColor: '#eab308',
    quote: '¡Nadie es más rápido que el trueno de mis tablas!',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="74" fill="#713f12" opacity="0.3"/>
      <!-- Relámpagos de Fondo -->
      <path d="M 24 30 L 36 60 L 28 66 L 42 96" stroke="#fef08a" stroke-width="3" fill="none" opacity="0.8"/>
      <path d="M 136 30 L 124 60 L 132 66 L 118 96" stroke="#fef08a" stroke-width="3" fill="none" opacity="0.8"/>
      <!-- Armadura Negra y Eléctrica -->
      <path d="M 44 104 Q 80 94 116 104 L 124 156 L 36 156 Z" fill="#0f172a" stroke="#eab308" stroke-width="2.5"/>
      <polygon points="80,112 88,124 98,124 90,132 93,144 80,136 67,144 70,132 62,124 72,124" fill="#fde047"/>
      <!-- Corona de Relámpagos -->
      <polygon points="48,52 56,22 66,38 80,14 94,38 104,22 112,52" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
      <ellipse cx="80" cy="74" rx="27" ry="24" fill="#1e293b"/>
      <!-- Ojos de Rayo Amarillo -->
      <polygon points="62,70 74,73 64,77" fill="#fef08a"/>
      <polygon points="98,70 86,73 96,77" fill="#fef08a"/>
      <!-- Rayos Multiplicadores en Manos -->
      <line x1="22" y1="92" x2="36" y2="106" stroke="#fde047" stroke-width="4" stroke-linecap="round"/>
      <line x1="36" y1="92" x2="22" y2="106" stroke="#fde047" stroke-width="4" stroke-linecap="round"/>
      <line x1="124" y1="92" x2="138" y2="106" stroke="#fde047" stroke-width="4" stroke-linecap="round"/>
      <line x1="138" y1="92" x2="124" y2="106" stroke="#fde047" stroke-width="4" stroke-linecap="round"/>
    </svg>`
  },
  daily: {
    id: 'rey_caos',
    name: 'Rey del Caos Numérico',
    title: 'El Soberano del Desorden Matemático',
    unitTitle: 'Sesión del Día',
    maxHp: 150,
    themeColor: '#dc2626',
    quote: '¡Demuestra si eres un verdadero Guerrero del Cálculo!',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="caos-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="100%" stop-color="#18181b"/>
        </radialGradient>
      </defs>
      <circle cx="80" cy="80" r="74" fill="#450a0a" opacity="0.35"/>
      <!-- Capa de Nebulosa Cósmica -->
      <path d="M 32 156 Q 14 104 38 66 L 122 66 Q 146 104 128 156 Z" fill="#18181b" stroke="#dc2626" stroke-width="2.5"/>
      <!-- Corona con los 4 Símbolos Matemáticos (+ - × ÷) -->
      <rect x="50" y="44" width="60" height="8" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
      <text x="58" y="38" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#fbbf24">+</text>
      <text x="72" y="38" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#fbbf24">-</text>
      <text x="86" y="38" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#fbbf24">×</text>
      <text x="100" y="38" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#fbbf24">÷</text>
      <!-- Rostro Cósmico Oscuro -->
      <ellipse cx="80" cy="74" rx="28" ry="25" fill="#09090b" stroke="#ef4444" stroke-width="2"/>
      <!-- Ojos Incandescentes Dorados -->
      <polygon points="62,70 74,74 64,78" fill="#facc15"/>
      <polygon points="98,70 86,74 96,78" fill="#facc15"/>
      <!-- Torso con Galaxia Giratoria -->
      <path d="M 44 104 Q 80 94 116 104 L 122 156 L 38 156 Z" fill="#18181b" stroke="#ef4444" stroke-width="2.5"/>
      <circle cx="80" cy="130" r="14" fill="url(#caos-grad)"/>
      <circle cx="80" cy="130" r="5" fill="#fef08a"/>
    </svg>`
  }
};

class VillainRenderer {
  static getVillain(topicOrUnit) {
    if (!topicOrUnit) return VILLAIN_CATALOG.daily;
    if (topicOrUnit === 'tables') return VILLAIN_CATALOG.tables;
    if (topicOrUnit === 'speed') return VILLAIN_CATALOG.tables;
    if (topicOrUnit === 'daily') return VILLAIN_CATALOG.daily;
    if (VILLAIN_CATALOG[topicOrUnit]) return VILLAIN_CATALOG[topicOrUnit];
    return VILLAIN_CATALOG.daily;
  }

  static renderVillainSVG(topicOrUnit) {
    const v = this.getVillain(topicOrUnit);
    return v ? v.svg : '';
  }
}


// ===================================================================
// ARQUETIPOS DE GUERREROS DEL CÁLCULO (AVATARES ANIME ORIGINALES)
// ===================================================================
const WARRIOR_AVATARS = {
  kaito: {
    id: 'kaito',
    name: 'Kaito',
    title: 'Guerrero Dragón',
    icon: '🐉',
    badge: 'Fuego',
    skin: '#ffd1a9',
    skinShadow: '#ea580c',
    hairBase: '#1c1917',
    hairBaseStroke: '#0a0a0a',
    hairBaseHighlight: '#44403c',
    dogiColor: '#ff6b00',
    dogiStroke: '#d94e00',
    beltColor: '#1e3a8a',
    beltStroke: '#172554',
    description: 'Valiente y disciplinado. Canaliza el fuego del cálculo y la perseverancia matemática.'
  },
  akira: {
    id: 'akira',
    name: 'Akira',
    title: 'Guerrera Relámpago',
    icon: '⚡',
    badge: 'Rayo',
    skin: '#ffe2d1',
    skinShadow: '#e07a5f',
    hairBase: '#0f172a',
    hairBaseStroke: '#020617',
    hairBaseHighlight: '#334155',
    dogiColor: '#7c3aed',
    dogiStroke: '#5b21b6',
    beltColor: '#ec4899',
    beltStroke: '#be185d',
    description: 'Veloz como el trueno. Resuelve problemas a la velocidad de la luz con reflejos felinos.'
  },
  ren: {
    id: 'ren',
    name: 'Ren',
    title: 'Guerrero Tigre',
    icon: '🐅',
    badge: 'Fuerza',
    skin: '#d99b66',
    skinShadow: '#b45309',
    hairBase: '#291e14',
    hairBaseStroke: '#170f08',
    hairBaseHighlight: '#453323',
    dogiColor: '#dc2626',
    dogiStroke: '#991b1b',
    beltColor: '#0f172a',
    beltStroke: '#020617',
    description: 'Feroz e incansable. Un luchador marcial con marcas de batalla que nunca se rinde.'
  },
  sakura: {
    id: 'sakura',
    name: 'Sakura',
    title: 'Guerrera Astral',
    icon: '✨',
    badge: 'Cosmos',
    skin: '#ffe4e6',
    skinShadow: '#f43f5e',
    hairBase: '#1e1b4b',
    hairBaseStroke: '#0f0e26',
    hairBaseHighlight: '#3730a3',
    dogiColor: '#0284c7',
    dogiStroke: '#0369a1',
    beltColor: '#facc15',
    beltStroke: '#ca8a04',
    description: 'Armoniosa y sabia. Canaliza los secretos geométricos y la simetría estelar del universo.'
  },
  ryu: {
    id: 'ryu',
    name: 'Ryu-01',
    title: 'Cíborg del Ki',
    icon: '🤖',
    badge: 'Cuántico',
    skin: '#e2e8f0',
    skinShadow: '#64748b',
    hairBase: '#334155',
    hairBaseStroke: '#1e293b',
    hairBaseHighlight: '#64748b',
    dogiColor: '#1e293b',
    dogiStroke: '#0f172a',
    beltColor: '#06b6d4',
    beltStroke: '#0891b2',
    description: 'Héroe tecnomarcial. Equipado con un sensor cuántico de cálculo y reactor de Ki puro.'
  }
};


class AvatarRenderer {
  static renderAvatar(equipped = {}, options = {}) {
    const hat = equipped.hat || null;
    const glasses = equipped.glasses || null;
    const suit = equipped.suit || null;
    const pet = equipped.pet || null;
    
    // Guerrero seleccionado
    let warriorId = 'kaito';
    if (options && options.warrior) {
      warriorId = options.warrior;
    } else if (window.app && window.app.state && window.app.state.warrior) {
      warriorId = window.app.state.warrior;
    }
    const warrior = WARRIOR_AVATARS[warriorId] || WARRIOR_AVATARS.kaito;

    // Nivel de Transformación (1 a 5)
    let transLevel = 1;
    if (options && options.transformation) {
      transLevel = options.transformation;
    } else if (window.app && typeof window.app.getActiveTransformation === 'function') {
      transLevel = window.app.getActiveTransformation();
    }
    const trans = TRANSFORMATIONS[transLevel] || TRANSFORMATIONS[1];

    // Capa de Aura Ki Trasera (para Modo Destello, Furia, Cósmico y Astral)
    let auraSVG = '';
    if (transLevel >= 2) {
      const aColor = trans.auraColor;
      const aGlow = trans.auraGlow;
      auraSVG = `
        <g class="ki-aura-backdrop">
          <!-- Llamas de energía exterior -->
          <path d="M 18 156 Q 6 92 30 52 Q 44 20 76 2 Q 108 20 122 52 Q 146 92 134 156 Z" fill="${aColor}" opacity="0.38"/>
          <!-- Núcleo ardiente de energía -->
          <path d="M 26 156 Q 16 100 38 64 Q 52 32 76 14 Q 100 32 114 64 Q 136 100 126 156 Z" fill="${aGlow}" opacity="0.55"/>
          ${transLevel >= 4 ? `
            <!-- Arcos de plasma y relámpagos cósmicos -->
            <path d="M 22 86 L 34 78 L 30 70 L 42 62" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M 130 86 L 118 78 L 122 70 L 110 62" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <circle cx="34" cy="46" r="3" fill="#ffffff"/>
            <circle cx="118" cy="46" r="3" fill="#ffffff"/>
            <circle cx="76" cy="8" r="3.5" fill="#ffffff"/>
          ` : ''}
        </g>
      `;
    }

    // 1. Capa trasera (si lleva capa)
    let capeSVG = '';
    if (suit === 'suit_super') {
      capeSVG = `<path d="M 36 108 L 20 158 L 132 158 L 116 108 Z" fill="#dc2626" stroke="#b91c1c" stroke-width="2"/>`;
    }

    // 2. Traje / Torso
    let bodySVG = '';
    if (suit === 'suit_super') {
      bodySVG = `
        <path d="M 46 106 Q 76 98 106 106 L 112 156 L 40 156 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="2.5"/>
        <polygon points="76,118 78,124 84,124 79,128 81,134 76,130 71,134 73,128 68,124 74,124" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      `;
    } else if (suit === 'suit_astro') {
      bodySVG = `
        <path d="M 44 104 Q 76 96 108 104 L 114 156 L 38 156 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
        <rect x="52" y="103" width="48" height="6" rx="3" fill="#cbd5e1"/>
        <circle cx="62" cy="125" r="6" fill="#38bdf8"/>
        <rect x="74" y="121" width="18" height="8" rx="2" fill="#334155"/>
        <line x1="77" y1="125" x2="89" y2="125" stroke="#4ade80" stroke-width="1.8"/>
      `;
    } else if (suit === 'suit_ninja') {
      bodySVG = `
        <path d="M 46 106 Q 76 98 106 106 L 112 156 L 40 156 Z" fill="#1e293b" stroke="#0f172a" stroke-width="2.5"/>
        <line x1="50" y1="106" x2="76" y2="136" stroke="#475569" stroke-width="2.2"/>
        <line x1="102" y1="106" x2="76" y2="136" stroke="#475569" stroke-width="2.2"/>
        <rect x="42" y="136" width="68" height="8" rx="2" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      `;
    } else if (suit === 'suit_chef') {
      bodySVG = `
        <path d="M 46 106 Q 76 98 106 106 L 112 156 L 40 156 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5"/>
        <polygon points="76,105 70,117 76,123 82,117" fill="#ef4444"/>
        <circle cx="70" cy="130" r="2.2" fill="#1e293b"/>
        <circle cx="82" cy="130" r="2.2" fill="#1e293b"/>
        <circle cx="70" cy="142" r="2.2" fill="#1e293b"/>
        <circle cx="82" cy="142" r="2.2" fill="#1e293b"/>
      `;
    } else {
      // MODO GUERRERO PURO: Traje / Dogi Auténtico según el Guerrero elegido
      if (warriorId === 'kaito') {
        bodySVG = `
          <!-- Dogi Naranja de Dragón de Kaito -->
          <path d="M 46 106 Q 76 98 106 106 L 112 156 L 40 156 Z" fill="#ff6b00" stroke="#d94e00" stroke-width="2.5"/>
          <polygon points="76,106 66,126 86,126" fill="#1e3a8a"/>
          <path d="M 68 106 Q 76 114 84 106" fill="none" stroke="${warrior.skin}" stroke-width="2.5"/>
          <!-- Emblema Dragón en el pecho -->
          <circle cx="62" cy="120" r="5" fill="#ffffff" stroke="#1e3a8a" stroke-width="1"/>
          <circle cx="62" cy="120" r="2.5" fill="#ef4444"/>
          <!-- Cinturón Marcial con caídas -->
          <rect x="42" y="136" width="68" height="9" rx="2" fill="#1e3a8a" stroke="#172554" stroke-width="1.5"/>
          <polygon points="76,144 71,156 81,156" fill="#1e3a8a"/>
        `;
      } else if (warriorId === 'akira') {
        bodySVG = `
          <!-- Dogi Relámpago Púrpura de Akira -->
          <path d="M 46 106 Q 76 98 106 106 L 112 156 L 40 156 Z" fill="#7c3aed" stroke="#5b21b6" stroke-width="2.5"/>
          <line x1="56" y1="106" x2="76" y2="128" stroke="#facc15" stroke-width="2.5"/>
          <line x1="96" y1="106" x2="76" y2="128" stroke="#facc15" stroke-width="2.5"/>
          <polygon points="76,106 66,120 86,120" fill="#1e1b4b"/>
          <path d="M 68 106 Q 76 112 84 106" fill="none" stroke="${warrior.skin}" stroke-width="2.5"/>
          <!-- Emblema Rayo Dorado -->
          <polygon points="62,118 60,123 63,123 61,127 65,121 62,121" fill="#facc15"/>
          <!-- Fajín Magenta -->
          <rect x="42" y="136" width="68" height="9" rx="2" fill="#ec4899" stroke="#be185d" stroke-width="1.5"/>
          <polygon points="76,144 71,156 81,156" fill="#ec4899"/>
        `;
      } else if (warriorId === 'ren') {
        bodySVG = `
          <!-- Dogi Tigre Rojo Carmesí de Ren -->
          <path d="M 46 106 Q 76 98 106 106 L 112 156 L 40 156 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2.5"/>
          <polygon points="76,106 64,130 88,130" fill="#18181b"/>
          <path d="M 68 106 Q 76 112 84 106" fill="none" stroke="${warrior.skin}" stroke-width="2.5"/>
          <!-- Emblema de Garra de Fuego -->
          <circle cx="60" cy="118" r="4.5" fill="#facc15" stroke="#b45309" stroke-width="1"/>
          <polygon points="60,115 58,121 62,121" fill="#dc2626"/>
          <!-- Cinturón Negro de Maestro -->
          <rect x="42" y="136" width="68" height="9" rx="2" fill="#0f172a" stroke="#020617" stroke-width="1.5"/>
          <polygon points="76,144 71,156 81,156" fill="#0f172a"/>
        `;
      } else if (warriorId === 'sakura') {
        bodySVG = `
          <!-- Túnica Marcial Astral Blanca y Celeste de Sakura -->
          <path d="M 46 106 Q 76 98 106 106 L 112 156 L 40 156 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
          <line x1="56" y1="106" x2="76" y2="128" stroke="#0284c7" stroke-width="2.5"/>
          <line x1="96" y1="106" x2="76" y2="128" stroke="#0284c7" stroke-width="2.5"/>
          <path d="M 68 106 Q 76 112 84 106" fill="none" stroke="${warrior.skin}" stroke-width="2.5"/>
          <!-- Emblema Estrella Astral en pecho -->
          <polygon points="62,116 63.5,119 66,120 63.5,121 62,124 60.5,121 58,120 60.5,119" fill="#0284c7"/>
          <!-- Fajín Celestial Dorado -->
          <rect x="42" y="136" width="68" height="9" rx="2" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
          <polygon points="76,144 71,156 81,156" fill="#facc15"/>
        `;
      } else {
        // Ryu (Cíborg del Ki)
        bodySVG = `
          <!-- Traje Táctico de Combate Mecha de Ryu -->
          <path d="M 46 106 Q 76 98 106 106 L 112 156 L 40 156 Z" fill="#1e293b" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="52" y="105" width="48" height="5" rx="2.5" fill="#334155"/>
          <!-- Reactor de Ki Cuántico en el pecho -->
          <circle cx="76" cy="120" r="7.5" fill="#0f172a" stroke="#00d2ff" stroke-width="2"/>
          <circle cx="76" cy="120" r="3.5" fill="#00d2ff"/>
          <circle cx="76" cy="120" r="1.5" fill="#ffffff"/>
          <!-- Cinturón de Plasma Turquesa -->
          <rect x="42" y="136" width="68" height="9" rx="2" fill="#06b6d4" stroke="#0891b2" stroke-width="1.5"/>
          <rect x="71" y="137" width="10" height="7" rx="1.5" fill="#cffafe"/>
        `;
      }
    }

    // 3. Colores de Cabello según Nivel de Transformación
    let hairCol = warrior.hairBase;
    let hairStroke = warrior.hairBaseStroke;
    let hairHigh = warrior.hairBaseHighlight;

    if (transLevel === 2) {
      hairCol = '#facc15';
      hairStroke = '#ca8a04';
      hairHigh = '#fef08a';
    } else if (transLevel === 3) {
      hairCol = '#ef4444';
      hairStroke = '#991b1b';
      hairHigh = '#fca5a5';
    } else if (transLevel === 4) {
      hairCol = '#0284c7';
      hairStroke = '#0369a1';
      hairHigh = '#cffafe';
    } else if (transLevel === 5) {
      hairCol = '#f8fafc';
      hairStroke = '#94a3b8';
      hairHigh = '#ffffff';
    }

    // 4. Silueta de Cabello según el Guerrero
    let hairSVG = '';
    if (hat !== 'hat_helmet') {
      if (warriorId === 'akira') {
        hairSVG = `
          <g id="avatar-hair">
            <!-- Coleta alta de guerrera -->
            <path d="M 76 40 C 58 14 64 2 76 0 C 88 0 94 14 84 38 Z" fill="${hairCol}" stroke="${hairStroke}" stroke-width="2"/>
            <ellipse cx="76" cy="38" rx="8" ry="4" fill="#fbbf24" stroke="#d97706" stroke-width="1.2"/>
            <!-- Mechones y flequillo estilizado -->
            <path d="M 40 68 Q 42 32 76 32 Q 110 32 112 68 Q 98 46 76 46 Q 54 46 40 68 Z" fill="${hairCol}" stroke="${hairStroke}" stroke-width="1.8"/>
            <path d="M 42 66 L 36 50 L 48 54 L 54 38 L 64 48" stroke="${hairCol}" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M 110 66 L 116 50 L 104 54 L 98 38 L 88 48" stroke="${hairCol}" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M 54 48 Q 76 38 98 48 Q 76 44 54 48 Z" fill="${hairHigh}" opacity="0.65"/>
          </g>
        `;
      } else if (warriorId === 'ren') {
        hairSVG = `
          <g id="avatar-hair">
            <!-- Pelo salvaje erizado lateral estilo tigre -->
            <path d="M 36 68 L 18 42 L 36 46 L 26 26 L 50 36 L 54 14 L 72 30 L 76 8 L 82 30 L 98 14 L 102 36 L 126 26 L 116 46 L 134 42 L 116 68 Z" fill="${hairCol}" stroke="${hairStroke}" stroke-width="2"/>
            <path d="M 42 60 L 28 44 L 42 48 L 36 32 L 56 40 L 60 22 L 76 32 L 92 22 L 96 40 L 116 32 L 110 48 L 124 44 L 110 60 Z" fill="${hairHigh}" opacity="0.65"/>
          </g>
        `;
      } else if (warriorId === 'sakura') {
        hairSVG = `
          <g id="avatar-hair">
            <!-- Doble rodete gemelo de combate -->
            <circle cx="48" cy="34" r="14" fill="${hairCol}" stroke="${hairStroke}" stroke-width="1.8"/>
            <circle cx="104" cy="34" r="14" fill="${hairCol}" stroke="${hairStroke}" stroke-width="1.8"/>
            <circle cx="48" cy="34" r="7" fill="${hairHigh}" opacity="0.5"/>
            <circle cx="104" cy="34" r="7" fill="${hairHigh}" opacity="0.5"/>
            <!-- Lazos de seda dorados -->
            <ellipse cx="48" cy="46" rx="7" ry="3.5" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
            <ellipse cx="104" cy="46" rx="7" ry="3.5" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
            <path d="M 46 48 C 38 54 34 64 38 70" stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M 106 48 C 114 54 118 64 114 70" stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round"/>
            <!-- Casquete y flequillo -->
            <path d="M 42 66 Q 44 34 76 34 Q 108 34 110 66 Q 96 46 76 46 Q 56 46 42 66 Z" fill="${hairCol}" stroke="${hairStroke}" stroke-width="1.8"/>
            <path d="M 64 46 Q 76 54 88 46" fill="${hairCol}"/>
          </g>
        `;
      } else if (warriorId === 'ryu') {
        hairSVG = `
          <g id="avatar-hair">
            <!-- Pelo angular cibernético con cortes geométricos -->
            <path d="M 38 68 L 30 40 L 46 44 L 52 24 L 68 34 L 76 14 L 84 34 L 100 24 L 106 44 L 122 40 L 114 68 Z" fill="${hairCol}" stroke="${hairStroke}" stroke-width="2"/>
            <path d="M 46 58 L 38 42 L 50 44 L 56 30 L 68 38 L 76 22 L 84 38 L 96 30 L 102 44 L 114 42 L 106 58 Z" fill="${hairHigh}" opacity="0.6"/>
          </g>
        `;
      } else {
        // Kaito (Pelo puntiagudo shonen clásico)
        hairSVG = `
          <g id="avatar-hair">
            <path d="M 38 68 L 26 36 L 44 46 L 46 22 L 64 34 L 76 10 L 88 34 L 106 22 L 108 46 L 126 36 L 114 68 Z" fill="${hairCol}" stroke="${hairStroke}" stroke-width="2"/>
            <path d="M 44 60 L 36 40 L 48 48 L 52 28 L 66 38 L 76 18 L 86 38 L 100 28 L 104 48 L 116 40 L 108 60 Z" fill="${hairHigh}" opacity="0.6"/>
            <polygon points="68,48 76,28 84,48" fill="${hairHigh}"/>
          </g>
        `;
      }
    }

    // 5. Detalles Faciales Únicos del Guerrero (Cintas, Marcas de Batalla, Pendientes, Óptica)
    let warriorTraitsSVG = '';
    if (hat === null) {
      if (warriorId === 'kaito') {
        warriorTraitsSVG += `
          <!-- Cinta Frontal Roja de Kaito -->
          <path d="M 44 55 Q 76 50 108 55 L 108 61 Q 76 56 44 61 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="1.2"/>
          <!-- Lazos laterales ondeando -->
          <path d="M 44 57 C 34 54 28 64 33 72 C 37 66 41 63 44 59 Z" fill="#dc2626"/>
          <path d="M 44 59 C 30 62 24 76 30 82 C 34 76 39 70 44 61 Z" fill="#b91c1c"/>
        `;
      } else if (warriorId === 'akira') {
        warriorTraitsSVG += `
          <!-- Pendientes Relámpago Dorados de Akira -->
          <polygon points="41,74 38,80 42,80 39,86 45,78 41,78" fill="#fbbf24" stroke="#d97706" stroke-width="0.8"/>
          <polygon points="111,74 108,80 112,80 109,86 114,78 111,78" fill="#fbbf24" stroke="#d97706" stroke-width="0.8"/>
        `;
      } else if (warriorId === 'ren') {
        warriorTraitsSVG += `
          <!-- Cinta Azul Zafiro de Ren -->
          <path d="M 44 54 Q 76 50 108 54 L 108 60 Q 76 56 44 60 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.2"/>
          <!-- Marcas tribales rojas de tigre en mejillas -->
          <line x1="50" y1="77" x2="59" y2="79" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round"/>
          <line x1="51" y1="82" x2="58" y2="84" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round"/>
          <line x1="102" y1="77" x2="93" y2="79" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round"/>
          <line x1="101" y1="82" x2="94" y2="84" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round"/>
          <!-- Vendaje anime en la nariz -->
          <rect x="71" y="73" width="10" height="4" rx="1.5" fill="#fef08a" stroke="#ca8a04" stroke-width="0.8" transform="rotate(-8 76 75)"/>
        `;
      } else if (warriorId === 'sakura') {
        warriorTraitsSVG += `
          <!-- Estrella Astral de la Armonía en la frente -->
          <polygon points="76,54 78,57.5 82,59 78,60.5 76,64 74,60.5 70,59 74,57.5" fill="#fbbf24" stroke="#d97706" stroke-width="0.7"/>
        `;
      } else if (warriorId === 'ryu') {
        warriorTraitsSVG += `
          <!-- Circuitos de Ki Cuántico en la sien -->
          <path d="M 47 64 L 54 64 L 57 72" fill="none" stroke="#00d2ff" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="57" cy="72" r="1.5" fill="#ffffff"/>
          <path d="M 49 84 L 54 84 L 58 80" fill="none" stroke="#00d2ff" stroke-width="1.5" stroke-linecap="round"/>
        `;
      }
    }

    // 6. Capa de Ojos Shonen Heroicos
    let eyesSVG = '';
    if (warriorId === 'ryu') {
      // Ojo derecho anime humano, ojo izquierdo sensor cibernético de plasma
      eyesSVG = `
        <circle cx="64" cy="70" r="3.5" fill="#1e293b"/>
        <circle cx="63" cy="68.5" r="1.3" fill="#ffffff"/>
        ${transLevel >= 3 ? `<circle cx="64" cy="70" r="1.8" fill="${trans.hairColor}" opacity="0.6"/>` : ''}
        <!-- Sensor cibernético ocular izquierdo -->
        <circle cx="88" cy="70" r="7.5" fill="#0f172a" stroke="#00d2ff" stroke-width="2"/>
        <circle cx="88" cy="70" r="3.5" fill="#00d2ff"/>
        <circle cx="88" cy="70" r="1.5" fill="#ffffff"/>
        <line x1="82" y1="70" x2="94" y2="70" stroke="#00d2ff" stroke-width="1" stroke-dasharray="2,2"/>
      `;
    } else {
      eyesSVG = `
        <circle cx="64" cy="70" r="3.5" fill="#1e293b"/>
        <circle cx="88" cy="70" r="3.5" fill="#1e293b"/>
        <circle cx="63" cy="68.5" r="1.3" fill="#ffffff"/>
        <circle cx="87" cy="68.5" r="1.3" fill="#ffffff"/>
        ${transLevel >= 3 ? `
          <circle cx="64" cy="70" r="1.8" fill="${trans.hairColor}" opacity="0.6"/>
          <circle cx="88" cy="70" r="1.8" fill="${trans.hairColor}" opacity="0.6"/>
        ` : ''}
      `;
    }

    // Cejas determinadas según el héroe
    let browsSVG = `
      <path d="M 57 64 L 70 65" stroke="${warrior.hairBaseStroke}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 95 64 L 82 65" stroke="${warrior.hairBaseStroke}" stroke-width="2.5" stroke-linecap="round"/>
    `;

    // 4. Capa de Gafas (colocadas exactamente sobre los ojos)
    let glassesSVG = '';
    if (glasses === 'glasses_cool') {
      glassesSVG = `
        <rect x="52" y="63" width="21" height="14" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.8"/>
        <rect x="79" y="63" width="21" height="14" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.8"/>
        <line x1="73" y1="68" x2="79" y2="68" stroke="#334155" stroke-width="2.5"/>
        <line x1="56" y1="65" x2="61" y2="74" stroke="#ffffff" stroke-width="1.2" opacity="0.75"/>
        <line x1="83" y1="65" x2="88" y2="74" stroke="#ffffff" stroke-width="1.2" opacity="0.75"/>
      `;
    } else if (glasses === 'glasses_star') {
      glassesSVG = `
        <polygon points="63,59 66,65 72,65 67,69 69,75 63,71 57,75 59,69 54,65 60,65" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
        <polygon points="89,59 92,65 98,65 93,69 95,75 89,71 83,75 85,69 80,65 86,65" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
        <line x1="72" y1="67" x2="80" y2="67" stroke="#ca8a04" stroke-width="2"/>
      `;
    } else if (glasses === 'glasses_nerd') {
      glassesSVG = `
        <circle cx="63" cy="70" r="9.5" fill="none" stroke="#1e293b" stroke-width="2.2"/>
        <circle cx="89" cy="70" r="9.5" fill="none" stroke="#1e293b" stroke-width="2.2"/>
        <line x1="72.5" y1="70" x2="79.5" y2="70" stroke="#1e293b" stroke-width="2.2"/>
      `;
    } else if (glasses === 'glasses_vr') {
      glassesSVG = `
        <rect x="50" y="61" width="52" height="17" rx="6" fill="#06b6d4" stroke="#0891b2" stroke-width="2"/>
        <line x1="54" y1="69" x2="98" y2="69" stroke="#cffafe" stroke-width="2" stroke-dasharray="6,3"/>
      `;
    }

    // 5. Capa de Sombreros / Casco Espacial (sobre la cabeza)
    let hatSVG = '';
    if (hat === 'hat_cap') {
      hatSVG = `
        <path d="M 44 48 Q 46 24 76 24 Q 106 24 108 48 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
        <path d="M 68 46 Q 106 43 120 52 Q 102 56 68 50 Z" fill="#1d4ed8" stroke="#1e40af" stroke-width="1.5"/>
        <circle cx="76" cy="24" r="2.5" fill="#f59e0b"/>
      `;
    } else if (hat === 'hat_crown') {
      hatSVG = `
        <path d="M 46 44 L 46 22 L 61 32 L 76 16 L 91 32 L 106 22 L 106 44 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
        <rect x="46" y="40" width="60" height="6" rx="2" fill="#d97706"/>
        <circle cx="76" cy="27" r="3" fill="#ef4444"/>
        <circle cx="58" cy="35" r="2.5" fill="#3b82f6"/>
        <circle cx="94" cy="35" r="2.5" fill="#10b981"/>
      `;
    } else if (hat === 'hat_wizard') {
      hatSVG = `
        <path d="M 38 46 Q 76 40 114 46 Q 76 52 38 46 Z" fill="#6d28d9" stroke="#4c1d95" stroke-width="2"/>
        <path d="M 50 44 Q 68 8 98 14 Q 84 28 102 44 Z" fill="#7c3aed" stroke="#5b21b6" stroke-width="2"/>
        <path d="M 48 42 Q 76 38 104 42" stroke="#fbbf24" stroke-width="3.5" fill="none"/>
        <polygon points="80,24 81,27 84,27 82,29 83,32 80,30 77,32 78,29 76,27 79,27" fill="#fde047"/>
      `;
    } else if (hat === 'hat_helmet') {
      hatSVG = `
        <!-- Burbuja exterior de cristal espacial -->
        <circle cx="76" cy="70" r="41" fill="rgba(56, 189, 248, 0.22)" stroke="#0284c7" stroke-width="3"/>
        <!-- Reflejo dorado de visera protectora -->
        <path d="M 48 60 Q 76 44 104 60 Q 76 72 48 60 Z" fill="#fbbf24" opacity="0.6"/>
        <!-- Arco brillante de reflejo del cristal -->
        <path d="M 44 62 A 38 38 0 0 1 88 34" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.85"/>
        <!-- Anillo hermético del cuello -->
        <rect x="42" y="96" width="68" height="10" rx="5" fill="#e2e8f0" stroke="#0284c7" stroke-width="2"/>
        <!-- Antena de comunicaciones lateral -->
        <line x1="117" y1="70" x2="124" y2="52" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="125" cy="50" r="3.5" fill="#ef4444"/>
      `;
    } else if (hat === 'hat_party') {
      hatSVG = `
        <polygon points="58,44 76,14 94,44" fill="#ec4899" stroke="#be185d" stroke-width="2"/>
        <line x1="63" y1="36" x2="89" y2="36" stroke="#facc15" stroke-width="2"/>
        <line x1="68" y1="26" x2="84" y2="26" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="76" cy="12" r="4.5" fill="#facc15"/>
      `;
    }

    // 6. Mascota compañera (a la derecha del personaje)
    let petSVG = '';
    if (pet === 'pet_dog') {
      petSVG = `
        <g id="pet-companion">
          <circle cx="136" cy="132" r="14" fill="#d97706"/>
          <ellipse cx="123" cy="127" rx="4" ry="9" fill="#b45309"/>
          <ellipse cx="149" cy="127" rx="4" ry="9" fill="#b45309"/>
          <circle cx="132" cy="130" r="2" fill="#1e293b"/>
          <circle cx="140" cy="130" r="2" fill="#1e293b"/>
          <circle cx="136" cy="135" r="2" fill="#1e293b"/>
          <ellipse cx="136" cy="139" rx="2" ry="3" fill="#f43f5e"/>
        </g>
      `;
    } else if (pet === 'pet_cat') {
      petSVG = `
        <g id="pet-companion">
          <circle cx="136" cy="132" r="13" fill="#f97316"/>
          <polygon points="124,125 128,114 134,122" fill="#ea580c"/>
          <polygon points="138,122 144,114 148,125" fill="#ea580c"/>
          <circle cx="132" cy="131" r="2" fill="#047857"/>
          <circle cx="140" cy="131" r="2" fill="#047857"/>
          <polygon points="135,135 137,135 136,137" fill="#fb7185"/>
          <line x1="124" y1="134" x2="131" y2="135" stroke="#fed7aa" stroke-width="1"/>
          <line x1="141" y1="135" x2="148" y2="134" stroke="#fed7aa" stroke-width="1"/>
        </g>
      `;
    } else if (pet === 'pet_dragon') {
      petSVG = `
        <g id="pet-companion">
          <circle cx="136" cy="132" r="13" fill="#10b981"/>
          <polygon points="126,124 123,112 131,121" fill="#f59e0b"/>
          <polygon points="141,121 149,112 146,124" fill="#f59e0b"/>
          <circle cx="132" cy="131" r="2" fill="#fbbf24"/>
          <circle cx="140" cy="131" r="2" fill="#fbbf24"/>
          <circle cx="144" cy="136" r="2" fill="#ef4444" opacity="0.8"/>
        </g>
      `;
    } else if (pet === 'pet_robot') {
      petSVG = `
        <g id="pet-companion">
          <rect x="124" y="120" width="24" height="22" rx="4" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
          <line x1="136" y1="120" x2="136" y2="113" stroke="#475569" stroke-width="2"/>
          <circle cx="136" cy="112" r="2.5" fill="#38bdf8"/>
          <rect x="128" y="125" width="6" height="5" rx="1" fill="#22c55e"/>
          <rect x="138" y="125" width="6" height="5" rx="1" fill="#22c55e"/>
          <line x1="129" y1="136" x2="143" y2="136" stroke="#334155" stroke-width="2"/>
        </g>
      `;
    } else if (pet === 'pet_unicorn') {
      petSVG = `
        <g id="pet-companion">
          <circle cx="136" cy="133" r="13" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <polygon points="133,123 136,106 139,123" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
          <path d="M 124 126 Q 118 134 124 142" stroke="#f472b6" stroke-width="4" fill="none"/>
          <path d="M 137 133 Q 140 130 143 133" stroke="#1e293b" stroke-width="1.8" fill="none"/>
        </g>
      `;
    }

    return `
      <svg class="${trans.auraClass}" viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="display: block; overflow: visible;">
        ${auraSVG}
        ${capeSVG}
        ${bodySVG}
        <!-- Cuello, orejas y cabeza con tono de piel del Guerrero -->
        <rect x="68" y="94" width="16" height="14" rx="4" fill="${warrior.skin}"/>
        <circle cx="45" cy="72" r="7" fill="${warrior.skin}" stroke="${warrior.skinShadow}" stroke-width="1.5"/>
        <circle cx="107" cy="72" r="7" fill="${warrior.skin}" stroke="${warrior.skinShadow}" stroke-width="1.5"/>
        <ellipse cx="76" cy="72" rx="32" ry="33" fill="${warrior.skin}" stroke="${warrior.skinShadow}" stroke-width="1.8"/>
        ${hairSVG}
        ${browsSVG}
        ${eyesSVG}
        ${warriorTraitsSVG}
        <!-- Mejillas con rubor heroico -->
        <ellipse cx="56" cy="79" rx="5" ry="3" fill="#f87171" opacity="0.45"/>
        <ellipse cx="96" cy="79" rx="5" ry="3" fill="#f87171" opacity="0.45"/>
        <circle cx="76" cy="74" r="1.5" fill="${warrior.skinShadow}" opacity="0.7"/>
        <path d="M 70 81 Q 76 88 82 81" fill="none" stroke="${warrior.skinShadow}" stroke-width="2.5" stroke-linecap="round"/>
        ${glassesSVG}
        ${hatSVG}
        ${petSVG}
      </svg>
    `;
  }

  static renderItemIcon(item) {
    switch (item.id) {
      case 'hat_cap':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><path d="M 12 40 Q 15 16 34 16 Q 50 16 52 40 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/><path d="M 28 38 Q 48 36 56 42 Q 46 45 28 41 Z" fill="#1d4ed8" stroke="#1e40af" stroke-width="1.5"/><circle cx="33" cy="16" r="2.5" fill="#f59e0b"/></svg>`;
      case 'hat_crown':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><path d="M 10 42 L 10 20 L 22 30 L 34 12 L 46 30 L 58 20 L 58 42 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2.5"/><rect x="10" y="38" width="48" height="6" rx="2" fill="#d97706"/><circle cx="34" cy="24" r="3.5" fill="#ef4444"/><circle cx="20" cy="32" r="2.5" fill="#3b82f6"/><circle cx="48" cy="32" r="2.5" fill="#10b981"/></svg>`;
      case 'hat_wizard':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><path d="M 6 46 Q 30 40 54 46 Q 30 52 6 46 Z" fill="#6d28d9" stroke="#4c1d95" stroke-width="2"/><path d="M 16 44 Q 28 10 48 14 Q 38 28 48 44 Z" fill="#7c3aed" stroke="#5b21b6" stroke-width="2"/><path d="M 15 42 Q 30 38 49 42" stroke="#fbbf24" stroke-width="3" fill="none"/><polygon points="34,26 35,29 38,29 36,31 37,34 34,32 31,34 32,31 30,29 33,29" fill="#fde047"/></svg>`;
      case 'hat_helmet':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><circle cx="30" cy="28" r="20" fill="rgba(56, 189, 248, 0.25)" stroke="#0284c7" stroke-width="2.5"/><path d="M 16 26 Q 30 18 44 26 Q 30 33 16 26 Z" fill="#fbbf24" opacity="0.75"/><path d="M 15 26 A 18 18 0 0 1 38 12" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.9"/><rect x="14" y="44" width="32" height="7" rx="3.5" fill="#e2e8f0" stroke="#0284c7" stroke-width="2"/><line x1="49" y1="28" x2="54" y2="16" stroke="#64748b" stroke-width="2" stroke-linecap="round"/><circle cx="55" cy="15" r="3" fill="#ef4444"/></svg>`;
      case 'hat_party':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><polygon points="16,46 30,12 44,46" fill="#ec4899" stroke="#be185d" stroke-width="2"/><line x1="20" y1="36" x2="40" y2="36" stroke="#facc15" stroke-width="2.5"/><line x1="24" y1="26" x2="36" y2="26" stroke="#38bdf8" stroke-width="2.5"/><circle cx="30" cy="10" r="4.5" fill="#facc15"/></svg>`;
      case 'glasses_cool':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><rect x="8" y="22" width="19" height="15" rx="5" fill="#0f172a" stroke="#334155" stroke-width="2"/><rect x="33" y="22" width="19" height="15" rx="5" fill="#0f172a" stroke="#334155" stroke-width="2"/><line x1="27" y1="28" x2="33" y2="28" stroke="#334155" stroke-width="3"/><line x1="12" y1="25" x2="17" y2="33" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/><line x1="37" y1="25" x2="42" y2="33" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/></svg>`;
      case 'glasses_star':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><polygon points="18,17 21,24 28,24 22,29 25,36 18,31 11,36 14,29 8,24 15,24" fill="#facc15" stroke="#ca8a04" stroke-width="2"/><polygon points="42,17 45,24 52,24 46,29 49,36 42,31 35,36 38,29 32,24 39,24" fill="#facc15" stroke="#ca8a04" stroke-width="2"/><line x1="26" y1="27" x2="34" y2="27" stroke="#ca8a04" stroke-width="2.5"/></svg>`;
      case 'glasses_nerd':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><circle cx="18" cy="30" r="11" fill="none" stroke="#1e293b" stroke-width="3"/><circle cx="42" cy="30" r="11" fill="none" stroke="#1e293b" stroke-width="3"/><line x1="29" y1="30" x2="31" y2="30" stroke="#1e293b" stroke-width="3"/></svg>`;
      case 'glasses_vr':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><rect x="8" y="21" width="44" height="18" rx="6" fill="#06b6d4" stroke="#0891b2" stroke-width="2.5"/><line x1="12" y1="30" x2="48" y2="30" stroke="#cffafe" stroke-width="2.5" stroke-dasharray="6,3"/></svg>`;
      case 'suit_super':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><path d="M 6 18 L 10 50 L 50 50 L 54 18 Z" fill="#dc2626" stroke="#b91c1c" stroke-width="2"/><path d="M 14 18 Q 30 14 46 18 L 48 48 L 12 48 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/><polygon points="30,24 32,29 37,29 33,32 35,37 30,34 25,37 27,32 23,29 28,29" fill="#fbbf24" stroke="#d97706" stroke-width="1"/></svg>`;
      case 'suit_astro':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><path d="M 12 18 Q 30 14 48 18 L 52 50 L 8 50 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><rect x="18" y="16" width="24" height="5" rx="2.5" fill="#cbd5e1"/>` +
               `<circle cx="23" cy="32" r="5" fill="#38bdf8"/><rect x="31" y="28" width="12" height="7" rx="2" fill="#334155"/>` +
               `<line x1="33" y1="31" x2="41" y2="31" stroke="#4ade80" stroke-width="1.5"/></svg>`;
      case 'suit_ninja':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><path d="M 12 18 Q 30 14 48 18 L 50 50 L 10 50 Z" fill="#1e293b" stroke="#0f172a" stroke-width="2"/><line x1="16" y1="18" x2="30" y2="38" stroke="#475569" stroke-width="2"/><line x1="44" y1="18" x2="30" y2="38" stroke="#475569" stroke-width="2"/><rect x="10" y="38" width="40" height="6" rx="2" fill="#ef4444"/></svg>`;
      case 'suit_chef':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><path d="M 12 18 Q 30 14 48 18 L 50 50 L 10 50 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/><polygon points="30,16 26,24 30,28 34,24" fill="#ef4444"/><circle cx="25" cy="34" r="2" fill="#1e293b"/><circle cx="35" cy="34" r="2" fill="#1e293b"/><circle cx="25" cy="42" r="2" fill="#1e293b"/><circle cx="35" cy="42" r="2" fill="#1e293b"/></svg>`;
      case 'pet_dog':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><circle cx="30" cy="30" r="16" fill="#d97706"/><ellipse cx="16" cy="26" rx="4" ry="10" fill="#b45309"/><ellipse cx="44" cy="26" rx="4" ry="10" fill="#b45309"/><circle cx="25" cy="28" r="2.5" fill="#1e293b"/><circle cx="35" cy="28" r="2.5" fill="#1e293b"/><circle cx="30" cy="34" r="2.5" fill="#1e293b"/><ellipse cx="30" cy="38" rx="2" ry="3.5" fill="#f43f5e"/></svg>`;
      case 'pet_cat':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><circle cx="30" cy="32" r="15" fill="#f97316"/><polygon points="16,24 20,10 28,20" fill="#ea580c"/><polygon points="32,20 40,10 44,24" fill="#ea580c"/><circle cx="25" cy="31" r="2.5" fill="#047857"/><circle cx="35" cy="31" r="2.5" fill="#047857"/><polygon points="28,36 32,36 30,38" fill="#fb7185"/></svg>`;
      case 'pet_dragon':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><circle cx="30" cy="32" r="15" fill="#10b981"/><polygon points="18,22 14,8 24,19" fill="#f59e0b"/><polygon points="36,19 46,8 42,22" fill="#f59e0b"/><circle cx="25" cy="31" r="2.5" fill="#fbbf24"/><circle cx="35" cy="31" r="2.5" fill="#fbbf24"/><circle cx="38" cy="38" r="3" fill="#ef4444" opacity="0.8"/></svg>`;
      case 'pet_robot':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><rect x="15" y="18" width="30" height="26" rx="5" fill="#94a3b8" stroke="#475569" stroke-width="2"/><line x1="30" y1="18" x2="30" y2="10" stroke="#475569" stroke-width="2.5"/><circle cx="30" cy="9" r="3.5" fill="#38bdf8"/><rect x="20" y="24" width="7" height="6" rx="1.5" fill="#22c55e"/><rect x="33" y="24" width="7" height="6" rx="1.5" fill="#22c55e"/><line x1="22" y1="37" x2="38" y2="37" stroke="#334155" stroke-width="2.5"/></svg>`;
      case 'pet_unicorn':
        return `<svg viewBox="0 0 60 60" width="48" height="48"><circle cx="30" cy="32" r="15" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/><polygon points="27,21 30,5 33,21" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/><path d="M 16,24 Q 10,32 16,42" stroke="#f472b6" stroke-width="4.5" fill="none"/><path d="M 31,32 Q 35,28 39,32" stroke="#1e293b" stroke-width="2" fill="none"/></svg>`;
      default:
        return `<span style="font-size: 2rem;">✨</span>`;
    }
  }
}

// ===================================================================
// CONTROLADOR PRINCIPAL SMARTICK
// ===================================================================
class SmartickApp {
  constructor() {
    this.sound = new SoundFX();
    this.confetti = new ConfettiManager('confetti-canvas');

    // Estado del Jugador (Persistente)
    this.state = this.loadState();

    // Estado de la Sesión de Juego
    this.session = {
      mode: 'daily',
      topic: null,
      currentIndex: 0,
      totalExercises: 12,
      currentExercise: null,
      selectedAnswer: null,
      correctCount: 0,
      streak: 0,
      maxStreak: 0,
      timerSeconds: 60,
      timerInterval: null,
      // Variables del algoritmo adaptativo
      currentLevel: this.state.adaptiveLevel || 2,
      levelStreak: 0,
      levelChangedInLastTurn: null // 'up' | 'down' | null
    };

    this.activeShopCategory = 'hat';
    this.mascotPhrases = [
      '¡Tú puedes con todo! 🚀',
      '¡Tu cerebro se adapta a cada reto! 🧠',
      '¡Me encanta entrenar contigo! 🐾',
      '¡A por el récord de hoy! 🏆',
      '¡Eres un genio de 4º de primaria! ✨',
      '¡Rasca detrás de mis orejitas! 😄'
    ];

    this.init();
  }

  loadState() {
    const defaultState = {
      name: 'Campeón/a',
      warrior: 'kaito', // Guerrero activo: 'kaito', 'akira', 'ren', 'sakura', 'ryu'
      stars: 0,
      coins: 0,
      streak: 0,
      lastPlayDate: null,
      powerLevel: 500, // Nivel de Poder inicial (Ki de combate)
      unlockedTransformation: 1, // 1: Aprendiz, 2: Destello, 3: Furia Solar, 4: Cósmico, 5: Astral
      activeTransformation: 1,
      defeatedVillains: [], // Lista de villanos derrotados
      unitStars: {}, // Progreso por unidad
      adaptiveLevel: 2, // 1 (Básico), 2 (Intermedio), 3 (Avanzado), 4 (Experto)
      inventory: ['hat_cap'],
      equipped: {
        hat: 'hat_cap',
        glasses: null,
        suit: null,
        pet: null
      },
      achievements: [],
      stats: {
        totalCorrect: 0,
        multCompleted: 0
      }
    };

    try {
      const saved = localStorage.getItem('mundomate_4_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = Object.assign({}, defaultState, parsed);
        merged.warrior = (parsed && parsed.warrior && WARRIOR_AVATARS[parsed.warrior]) ? parsed.warrior : 'kaito';
        merged.equipped = Object.assign({}, defaultState.equipped, parsed.equipped || {});
        merged.stats = Object.assign({}, defaultState.stats, parsed.stats || {});
        merged.defeatedVillains = Array.isArray(parsed.defeatedVillains) ? parsed.defeatedVillains : [];
        merged.unitStars = typeof parsed.unitStars === 'object' && parsed.unitStars ? parsed.unitStars : {};
        merged.inventory = Array.isArray(parsed.inventory) ? parsed.inventory : ['hat_cap'];
        merged.achievements = Array.isArray(parsed.achievements) ? parsed.achievements : [];
        merged.lastPlayDate = parsed.lastPlayDate || null;
        merged.streak = typeof parsed.streak === 'number' ? parsed.streak : 0;

        // Sincronizar transformación con Ki acumulado silenciosamente
        let transCalc = 1;
        if (merged.powerLevel >= 15000) transCalc = 5;
        else if (merged.powerLevel >= 7000) transCalc = 4;
        else if (merged.powerLevel >= 3000) transCalc = 3;
        else if (merged.powerLevel >= 1000) transCalc = 2;
        merged.unlockedTransformation = Math.max(merged.unlockedTransformation || 1, transCalc);
        if (!merged.activeTransformation) merged.activeTransformation = merged.unlockedTransformation;

        return merged;
      }
    } catch (e) {
      console.warn('No se pudo acceder a localStorage', e);
    }
    return defaultState;
  }

  saveState() {
    try {
      localStorage.setItem('mundomate_4_state', JSON.stringify(this.state));
    } catch (e) {}
    this.updateStatsUI();
  }

  init() {
    this.updateStatsUI();
    this.renderAvatar();
    this.renderAchievements();
    this.renderShop();
    this.renderWarriorSelector();
    this.updateHomeWarriorProfile();
    this.updateMissionCardsUI();
    this.renderTransformationTester();

    const nameInput = document.getElementById('player-name-input');
    if (nameInput) nameInput.value = this.state.name;
    const welcome = document.getElementById('welcome-msg');
    if (welcome) welcome.textContent = `¡Hola, ${this.state.name}! 🌟`;

    window.addEventListener('keydown', (e) => {
      if (this.session.currentExercise && this.session.currentExercise.type === 'numpad') {
        if (e.key >= '0' && e.key <= '9') {
          this.numpadAppend(e.key);
        } else if (e.key === 'Backspace') {
          this.numpadBackspace();
        } else if (e.key === 'Enter') {
          this.submitCurrentAnswer();
        }
      }
    });
  }

  showScreen(screenId) {
    this.sound.playPop();

    // 1. Limpiar SIEMPRE cualquier temporizador activo al cambiar de pantalla
    if (this.session && this.session.timerInterval) {
      clearInterval(this.session.timerInterval);
      this.session.timerInterval = null;
    }

    // 2. Cerrar cualquier modal o overlay que pueda estar bloqueando clics
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));

    // 3. Detener confeti inmediatamente al salir al menú principal o a la tienda
    if (screenId === 'home' || screenId === 'shop' || screenId === 'avatar') {
      if (this.confetti) this.confetti.stop();
    }

    // 4. Cambiar pantalla activa
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    const effectiveScreen = screenId === 'avatar' ? 'shop' : screenId;
    this.currentScreen = effectiveScreen;
    const target = document.getElementById(`screen-${effectiveScreen}`);
    if (target) {
      target.classList.add('active');
    } else {
      const home = document.getElementById('screen-home');
      if (home) home.classList.add('active');
    }

    if (effectiveScreen === 'shop') {
      this.renderWarriorSelector();
      this.renderShop();
      this.renderTransformationTester();
      this.renderAvatar();
    } else if (effectiveScreen === 'home') {
      this.renderAvatar();
      this.renderAchievements();
      this.updateHomeWarriorProfile();
      this.updateMissionCardsUI();
    }
  }


  // ===================================================================
  // MÉTODOS DEL SISTEMA DE GUERREROS DEL CÁLCULO (PODER Y TRANSFORMACIONES)
  // ===================================================================
  getActiveTransformation() {
    // Si estamos en sesión con racha alta, activar transformación de combate
    if (this.session && this.session.streak >= 3) {
      if (this.session.streak >= 12) return 5;
      if (this.session.streak >= 9) return 4;
      if (this.session.streak >= 6) return 3;
      if (this.session.streak >= 3) return 2;
    }
    return this.state.activeTransformation || this.state.unlockedTransformation || 1;
  }

  showTransformationToast(newUnlocked) {
    const toast = document.getElementById('level-toast');
    const icon = document.getElementById('level-toast-icon');
    const text = document.getElementById('level-toast-text');
    if (!toast) return;

    const t = TRANSFORMATIONS[newUnlocked] || TRANSFORMATIONS[1];
    if (icon) icon.textContent = newUnlocked === 5 ? '👑' : '⚡';
    if (text) text.textContent = `¡Despertar de Poder: ${t.name}!`;
    toast.style.borderColor = t.hairColor || '#ffd12d';

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  addPower(points) {
    if (!this.state.powerLevel) this.state.powerLevel = 550;
    this.state.powerLevel += points;

    // Calcular si desbloquea una nueva transformación permanente
    let newUnlocked = 1;
    if (this.state.powerLevel >= 15000) newUnlocked = 5;
    else if (this.state.powerLevel >= 7000) newUnlocked = 4;
    else if (this.state.powerLevel >= 3000) newUnlocked = 3;
    else if (this.state.powerLevel >= 1000) newUnlocked = 2;

    const currentUnlocked = this.state.unlockedTransformation || 1;
    if (newUnlocked > currentUnlocked) {
      this.state.unlockedTransformation = newUnlocked;
      this.state.activeTransformation = newUnlocked;
      this.showTransformationToast(newUnlocked);
      this.sound.playFanfare();
      if (this.confetti) this.confetti.burst(60);
    }

    this.saveState();
    this.updateHomeWarriorProfile();
    this.renderTransformationTester();
  }

  initCombatSession(topicOrMode) {
    const villain = VillainRenderer.getVillain(topicOrMode);
    this.session.villain = villain;
    this.session.villainMaxHp = villain.maxHp || 100;
    this.session.villainHp = villain.maxHp || 100;
    const totalEx = (this.session.mode === 'speed' ? 20 : (this.session.totalExercises || 10));
    this.session.damagePerHit = Math.ceil((villain.maxHp || 100) / totalEx);
  }

  updateCombatArenaUI() {
    const arena = document.getElementById('combat-arena');
    if (!arena || !this.session) return;

    // Villano de la sesión
    const villain = this.session.villain || VillainRenderer.getVillain(this.session.topic || this.session.mode);
    this.session.villain = villain;
    if (this.session.villainMaxHp === undefined) {
      this.session.villainMaxHp = villain.maxHp || 100;
      this.session.villainHp = villain.maxHp || 100;
      const totalEx = (this.session.mode === 'speed' ? 20 : (this.session.totalExercises || 10));
      this.session.damagePerHit = Math.ceil((villain.maxHp || 100) / totalEx);
    }

    // 1. Hero Avatar & Stats
    const heroAvatarEl = document.getElementById('arena-hero-avatar');
    const activeTrans = this.getActiveTransformation();
    const transDef = TRANSFORMATIONS[activeTrans] || TRANSFORMATIONS[1];

    if (heroAvatarEl) {
      heroAvatarEl.innerHTML = this.generateAvatarSVG({ transformation: activeTrans });
      heroAvatarEl.className = 'combatant-avatar-box hero-box';
      if (activeTrans === 2) heroAvatarEl.classList.add('aura-destello');
      else if (activeTrans === 3) heroAvatarEl.classList.add('aura-furia');
      else if (activeTrans === 4) heroAvatarEl.classList.add('aura-cosmico');
      else if (activeTrans === 5) heroAvatarEl.classList.add('aura-astral');
    }

    const heroNameEl = document.getElementById('arena-hero-name');
    if (heroNameEl) {
      heroNameEl.textContent = this.state.name || 'Guerrero/a';
    }

    const heroSubEl = document.getElementById('arena-hero-sub');
    if (heroSubEl) {
      heroSubEl.textContent = `⚡ Combo x${this.session.streak} · ${transDef.shortName}`;
    }

    const heroEnergyFill = document.getElementById('arena-hero-energy-fill');
    if (heroEnergyFill) {
      const energyPercent = Math.min(100, 20 + (this.session.streak * 16));
      heroEnergyFill.style.width = `${energyPercent}%`;
    }

    // 2. Villain Avatar & Stats
    const villainAvatarEl = document.getElementById('arena-villain-avatar');
    if (villainAvatarEl) {
      villainAvatarEl.innerHTML = villain.svg;
    }

    const villainNameEl = document.getElementById('arena-villain-name');
    if (villainNameEl) {
      villainNameEl.textContent = villain.name;
    }

    const villainHpFill = document.getElementById('arena-villain-hp-fill');
    const villainHpText = document.getElementById('arena-villain-hp-text');
    const currentHp = Math.max(0, this.session.villainHp !== undefined ? this.session.villainHp : villain.maxHp);
    const maxHp = this.session.villainMaxHp || villain.maxHp || 100;
    const hpPercent = Math.max(0, Math.min(100, Math.round((currentHp / maxHp) * 100)));

    if (villainHpFill) {
      villainHpFill.style.width = `${hpPercent}%`;
      if (hpPercent <= 25) {
        villainHpFill.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
      } else if (hpPercent <= 50) {
        villainHpFill.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
      } else {
        villainHpFill.style.background = 'linear-gradient(90deg, #ef4444, #f97316)';
      }
    }

    if (villainHpText) {
      villainHpText.textContent = `${currentHp} / ${maxHp} HP`;
    }
  }

  updateHomeWarriorProfile() {
    const powerVal = document.getElementById('home-power-val');
    const rankTitle = document.getElementById('home-rank-title');
    const fill = document.getElementById('home-power-fill');
    const sub = document.getElementById('home-power-sub');

    if (!powerVal || !rankTitle) return;

    const ki = this.state.powerLevel || 550;
    powerVal.textContent = `${ki.toLocaleString('es-ES')} Ki`;

    const unlocked = this.state.unlockedTransformation || 1;
    const trans = TRANSFORMATIONS[unlocked] || TRANSFORMATIONS[1];
    rankTitle.textContent = trans.name;

    let prevThreshold = 0;
    let nextThreshold = 1000;
    let nextName = 'Modo Destello';

    if (unlocked === 1) {
      prevThreshold = 0;
      nextThreshold = 1000;
      nextName = 'Modo Destello';
    } else if (unlocked === 2) {
      prevThreshold = 1000;
      nextThreshold = 3000;
      nextName = 'Modo Furia Solar';
    } else if (unlocked === 3) {
      prevThreshold = 3000;
      nextThreshold = 7000;
      nextName = 'Modo Cósmico';
    } else if (unlocked === 4) {
      prevThreshold = 7000;
      nextThreshold = 15000;
      nextName = 'Modo Astral';
    } else {
      prevThreshold = 15000;
      nextThreshold = 15000;
      nextName = '¡Maestro Absoluto!';
    }

    if (unlocked >= 5) {
      if (fill) fill.style.width = '100%';
      if (sub) sub.textContent = '🌟 ¡Poder Astral Legendario!';
    } else {
      const range = nextThreshold - prevThreshold;
      const currentInRange = Math.max(0, ki - prevThreshold);
      const pct = Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));
      if (fill) fill.style.width = `${pct}%`;
      if (sub) sub.textContent = `${ki.toLocaleString('es-ES')} / ${nextThreshold.toLocaleString('es-ES')} Ki para ${nextName}`;
    }

    const warriorTag = document.getElementById('home-warrior-archetype');
    if (warriorTag) {
      const w = WARRIOR_AVATARS[this.state.warrior || 'kaito'] || WARRIOR_AVATARS.kaito;
      warriorTag.innerHTML = `<span class="warrior-tag-badge">${w.icon} ${w.name}</span> <span class="warrior-tag-role">· ${w.title}</span>`;
    }
  }

  updateMissionCardsUI() {
    const units = [
      { key: 'tables', villain: 'tables', name: 'Káiser Blitz' },
      { key: 'unit1', villain: 'unit1', name: 'Lord Cero' },
      { key: 'unit2', villain: 'unit2', name: 'Dr. Restas' },
      { key: 'unit3', villain: 'unit3', name: 'General Multiplicón' },
      { key: 'unit4', villain: 'unit4', name: 'Sombra Divisora' },
      { key: 'unit5', villain: 'unit5', name: 'Monstruo Fraccionario' },
      { key: 'unit6', villain: 'unit6', name: 'Barón Simetría' },
      { key: 'unit7', villain: 'unit7', name: 'Titán Poliedro' },
      { key: 'unit8', villain: 'unit8', name: 'Conde Probábilis' },
      { key: 'unit9', villain: 'unit9', name: 'Megawatt Desperdicio' }
    ];

    if (!this.state.defeatedVillains) this.state.defeatedVillains = [];
    if (!this.state.unitStars) this.state.unitStars = {};

    units.forEach(u => {
      // 1. Mini-Villano y estado de combate
      const thumbEl = document.getElementById(`thumb-villain-${u.key}`);
      const stateEl = document.getElementById(`state-villain-${u.key}`);
      const vObj = VillainRenderer.getVillain(u.villain);

      if (thumbEl && vObj) {
        thumbEl.innerHTML = vObj.svg;
      }
      const isDefeated = vObj && (this.state.defeatedVillains.includes(vObj.id) || this.state.defeatedVillains.includes(u.villain));
      if (stateEl) {
        if (isDefeated) {
          stateEl.className = 'villain-badge-state defeated';
          stateEl.innerHTML = '🏆 ¡Derrotado!';
        } else {
          stateEl.className = 'villain-badge-state pending';
          stateEl.innerHTML = '⚔️ En combate';
        }
      }

      // 2. Barra de progreso de la unidad
      const barEl = document.getElementById(`prog-bar-${u.key}`);
      const labelEl = document.getElementById(`prog-label-${u.key}`);
      const completedCount = this.state.unitStars[u.key] || (isDefeated ? 8 : 0);
      const targetCount = u.key === 'tables' ? 10 : 8;
      const pct = Math.min(100, Math.round((completedCount / targetCount) * 100));

      if (barEl) barEl.style.width = `${pct}%`;
      if (labelEl) labelEl.textContent = isDefeated ? `Completada (${pct}%) ⭐` : `Progreso: ${pct}%`;
    });
  }

  renderTransformationTester() {
    const container = document.getElementById('tester-trans-buttons');
    if (!container) return;
    container.innerHTML = '';

    const highestUnlocked = this.state.unlockedTransformation || 1;
    const currentActive = this.state.activeTransformation || 1;

    for (let i = 1; i <= 5; i++) {
      const trans = TRANSFORMATIONS[i];
      const isUnlocked = i <= highestUnlocked;
      const isSelected = i === currentActive;

      const btn = document.createElement('button');
      btn.className = `trans-test-btn ${isSelected ? 'active' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`;
      btn.title = isUnlocked ? `Activar ${trans.name}` : `Bloqueado (${trans.name} requiere más Ki de combate)`;
      btn.style.setProperty('--btn-color', trans.hairColor);

      if (isUnlocked) {
        btn.innerHTML = `<span class="test-btn-icon">${i === 1 ? '🥋' : '⚡'}</span><span class="test-btn-label">${trans.shortName}</span>`;
        btn.onclick = () => {
          this.sound.playPop();
          this.state.activeTransformation = i;
          this.saveState();
          this.renderAvatar();
          this.renderTransformationTester();
          this.updateHomeWarriorProfile();
        };
      } else {
        btn.innerHTML = `<span class="test-btn-icon">🔒</span><span class="test-btn-label">${trans.shortName}</span>`;
        btn.onclick = () => {
          this.sound.playWrong();
          this.showToast(`¡${trans.name} aún está bloqueado! Gana más Ki en los entrenamientos para despertar este modo.`, '🔒', '#ff5252');
        };
      }
      container.appendChild(btn);
    }
  }

  generateAvatarSVG(options = {}) {
    const trans = options.transformation || this.getActiveTransformation();
    const warrior = options.warrior || this.state.warrior || 'kaito';
    return AvatarRenderer.renderAvatar(this.state.equipped, { transformation: trans, warrior: warrior });
  }

  updateStatsUI() {
    const starEl = document.getElementById('star-count');
    const coinEl = document.getElementById('coin-count');
    const shopCoinEl = document.getElementById('shop-coin-count');
    const streakEl = document.getElementById('streak-count');

    if (starEl) starEl.textContent = this.state.stars;
    if (coinEl) coinEl.textContent = this.state.coins;
    if (shopCoinEl) shopCoinEl.textContent = this.state.coins;
    if (streakEl) streakEl.textContent = this.state.streak;

    const powerEl = document.getElementById('power-level-count');
    if (powerEl) {
      const p = this.state.powerLevel || 550;
      powerEl.textContent = p.toLocaleString('es-ES');
    }

    // Actualizar botones de dificultad activos en Home
    document.querySelectorAll('.diff-btn').forEach(btn => {
      const bLvl = parseInt(btn.dataset.lvl);
      btn.classList.toggle('active', bLvl === this.state.adaptiveLevel);
    });

    // Actualizar badge de nivel en Home si existe
    const homeLevelBadge = document.getElementById('home-level-badge');
    if (homeLevelBadge) {
      const def = LEVEL_DEFINITIONS[this.state.adaptiveLevel] || LEVEL_DEFINITIONS[2];
      homeLevelBadge.textContent = `🎯 Nivel Adaptativo: ${def.stars} ${def.name}`;
    }
  }

  // SELECCIÓN MANUAL DE DIFICULTAD
  setDifficultyLevel(level, reloadCurrent = false) {
    level = Math.max(1, Math.min(4, parseInt(level) || 2));
    this.state.adaptiveLevel = level;
    this.saveState();

    // Actualizar botones de dificultad en Home
    document.querySelectorAll('.diff-btn').forEach(btn => {
      const bLvl = parseInt(btn.dataset.lvl);
      btn.classList.toggle('active', bLvl === level);
    });

    const homeLevelBadge = document.getElementById('home-level-badge');
    if (homeLevelBadge) {
      const def = LEVEL_DEFINITIONS[level];
      homeLevelBadge.textContent = `🎯 Nivel Seleccionado: ${def.stars} ${def.name}`;
    }

    // Si estamos en sesión activa, aplicar inmediatamente
    if (this.session) {
      this.session.currentLevel = level;
      this.session.levelStreak = 0;
      this.updateLevelPill();
      if (reloadCurrent && this.currentScreen === 'exercise') {
        this.loadNextExercise();
      }
    }

    const def = LEVEL_DEFINITIONS[level];
    this.sound.playLevelUp();
    this.showLevelToast('up', level);
  }

  cycleExerciseLevel() {
    if (!this.session) return;
    let nextLvl = (this.session.currentLevel % 4) + 1;
    this.setDifficultyLevel(nextLvl, true);
  }

  openTablesModal() {
    this.sound.playPop();
    const modal = document.getElementById('tables-modal');
    if (modal) modal.classList.add('active');
  }

  closeTablesModal() {
    this.sound.playPop();
    const modal = document.getElementById('tables-modal');
    if (modal) modal.classList.remove('active');
  }

  startTablesSession(tableFocus = 'all') {
    this.closeTablesModal();
    this.startTopicSession('tables', tableFocus);
  }

  toggleSound() {
    this.sound.enabled = !this.sound.enabled;
    const icon = document.getElementById('sound-icon');
    if (icon) icon.textContent = this.sound.enabled ? '🔊' : '🔇';
    if (this.sound.enabled) this.sound.playPop();
  }

  petMascot() {
    this.sound.playPop();
    const bubble = document.getElementById('mascot-speech');
    if (!bubble) return;
    const randomPhrase = this.mascotPhrases[Math.floor(Math.random() * this.mascotPhrases.length)];
    bubble.textContent = randomPhrase;
    bubble.style.animation = 'none';
    bubble.offsetHeight;
    bubble.style.animation = 'fadeIn 0.3s';
  }

  // Notificación visual flotante genérica
  showToast(message, iconChar = '💡', borderColor = '#3aa0ff') {
    const toast = document.getElementById('level-toast');
    const icon = document.getElementById('level-toast-icon');
    const text = document.getElementById('level-toast-text');
    if (!toast) return;
    if (icon) icon.textContent = iconChar;
    if (text) text.textContent = message;
    toast.style.borderColor = borderColor;
    toast.classList.add('show');
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Notificación visual flotante de nivel
  showLevelToast(type, newLevel) {
    const toast = document.getElementById('level-toast');
    const icon = document.getElementById('level-toast-icon');
    const text = document.getElementById('level-toast-text');
    if (!toast) return;

    const def = LEVEL_DEFINITIONS[newLevel];

    if (type === 'up') {
      icon.textContent = '🚀';
      text.textContent = `¡Subes a Nivel ${def.name}! (${def.stars})`;
      toast.style.borderColor = '#4cd964';
      this.sound.playLevelUp();
    } else {
      icon.textContent = '💡';
      text.textContent = `Ajustando a Nivel ${def.name} (${def.stars}) para reforzar`;
      toast.style.borderColor = '#3aa0ff';
    }

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  updateLevelPill() {
    const pill = document.getElementById('exercise-level-pill');
    if (!pill) return;
    const def = LEVEL_DEFINITIONS[this.session.currentLevel] || LEVEL_DEFINITIONS[2];
    pill.className = `level-pill ${def.class} interactive-level-pill`;
    pill.textContent = `${def.stars} Nivel ${this.session.currentLevel}: ${def.name} 🔄`;
    pill.title = '¡Haz clic para cambiar el nivel de dificultad en cualquier momento!';
  }

  // INICIO DE SESIONES
  startDailySession() {
    this.sound.playPop();
    if (this.session && this.session.timerInterval) {
      clearInterval(this.session.timerInterval);
      this.session.timerInterval = null;
    }
    if (this.confetti) this.confetti.stop();
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));

    this.session = {
      mode: 'daily',
      topic: null,
      currentIndex: 0,
      totalExercises: 12,
      currentExercise: null,
      selectedAnswer: null,
      correctCount: 0,
      streak: 0,
      maxStreak: 0,
      timerSeconds: 0,
      timerInterval: null,
      currentLevel: this.state.adaptiveLevel || 2,
      levelStreak: 0,
      levelChangedInLastTurn: null
    };

    const label = document.getElementById('session-type-label');
    if (label) label.textContent = 'Sesión del Día ⚡';
    const timerBadge = document.getElementById('exercise-timer-badge');
    if (timerBadge) timerBadge.style.display = 'none';

    this.initCombatSession('daily');
    this.showScreen('exercise');
    this.updateLevelPill();
    this.loadNextExercise();
  }

  startSpeedSession() {
    this.sound.playPop();
    if (this.session && this.session.timerInterval) {
      clearInterval(this.session.timerInterval);
      this.session.timerInterval = null;
    }
    if (this.confetti) this.confetti.stop();
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));

    this.session = {
      mode: 'speed',
      topic: null,
      currentIndex: 0,
      totalExercises: 999,
      currentExercise: null,
      selectedAnswer: null,
      correctCount: 0,
      streak: 0,
      maxStreak: 0,
      timerSeconds: 60,
      timerInterval: null,
      currentLevel: this.state.adaptiveLevel || 2,
      levelStreak: 0,
      levelChangedInLastTurn: null
    };

    const label = document.getElementById('session-type-label');
    if (label) label.textContent = 'Gimnasio Mental ⏱️';
    const timerBadge = document.getElementById('exercise-timer-badge');
    if (timerBadge) timerBadge.style.display = 'block';
    const timerCount = document.getElementById('timer-count');
    if (timerCount) timerCount.textContent = '60';

    this.initCombatSession('speed');
    this.showScreen('exercise');
    this.updateLevelPill();
    this.loadNextExercise();

    this.session.timerInterval = setInterval(() => {
      this.session.timerSeconds--;
      const tc = document.getElementById('timer-count');
      if (tc) tc.textContent = this.session.timerSeconds;
      if (this.session.timerSeconds <= 0) {
        clearInterval(this.session.timerInterval);
        this.session.timerInterval = null;
        this.sound.playFanfare();
        this.finishSession();
      }
    }, 1000);
  }

  startTopicSession(topic, tableFocus = null) {
    this.sound.playPop();
    if (this.session && this.session.timerInterval) {
      clearInterval(this.session.timerInterval);
      this.session.timerInterval = null;
    }
    if (this.confetti) this.confetti.stop();
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));

    const topicNames = {
      unit1: '1. La Tierra en cifras (ODS 15)',
      unit2: '2. ¿Echamos una partida? (ODS 16)',
      unit3: '3. ¡Que empiece la función! (ODS 4)',
      unit4: '4. Mensajes cifrados (ODS 17)',
      unit5: '5. ¡Toma tu parte! (ODS 5)',
      unit6: '6. Patrones y formas (ODS 8)',
      unit7: '7. Geometría urbana (ODS 9)',
      unit8: '8. Una población diversa (ODS 10)',
      unit9: '9. Reduce, reutiliza y recicla (ODS 11)',
      tables: 'Misión: Tablas de Multiplicar',
      mult_div: 'Multiplicación y División',
      fractions_decimals: 'Fracciones y Euros',
      word_problems: 'Problemas de Ingenio',
      roman_numbers: 'Números Romanos',
      geometry_units: 'Medidas y Perímetros'
    };

    let titleLabel = topicNames[topic] || 'Práctica';
    if (topic === 'tables') {
      if (tableFocus === 'hard') {
        titleLabel = '⚡ Reto: Tablas del 6, 7, 8 y 9';
      } else if (tableFocus && tableFocus !== 'all') {
        titleLabel = `🎯 Misión: Tabla del ${tableFocus}`;
      } else {
        titleLabel = '✖️⚡ Misión: Tablas de Multiplicar';
      }
    }

    this.session = {
      mode: 'topic',
      topic: topic,
      tableFocus: tableFocus || 'all',
      currentIndex: 0,
      totalExercises: topic === 'tables' ? 10 : 8,
      currentExercise: null,
      selectedAnswer: null,
      correctCount: 0,
      streak: 0,
      maxStreak: 0,
      timerSeconds: 0,
      timerInterval: null,
      currentLevel: this.state.adaptiveLevel || 2,
      levelStreak: 0,
      levelChangedInLastTurn: null
    };

    const label = document.getElementById('session-type-label');
    if (label) label.textContent = titleLabel;
    const timerBadge = document.getElementById('exercise-timer-badge');
    if (timerBadge) timerBadge.style.display = 'none';

    this.initCombatSession(topic);
    this.showScreen('exercise');
    this.updateLevelPill();
    this.loadNextExercise();
  }

  // Cargar Siguiente Ejercicio adaptado al nivel actual
  loadNextExercise() {
    if (this.session.mode !== 'speed' && this.session.currentIndex >= this.session.totalExercises) {
      this.finishSession();
      return;
    }

    this.session.selectedAnswer = null;
    const hintBox = document.getElementById('hint-box');
    if (hintBox) hintBox.style.display = 'none';

    this.updateLevelPill();
    this.updateCombatArenaUI();

    const lvl = this.session.currentLevel;
    let exercise = null;

    try {
      if (this.session.mode === 'daily') {
        const generators = [
          () => QuestionGenerator.generateUnit1(lvl),
          () => QuestionGenerator.generateUnit2(lvl),
          () => QuestionGenerator.generateUnit3(lvl),
          () => QuestionGenerator.generateUnit4(lvl),
          () => QuestionGenerator.generateUnit5(lvl),
          () => QuestionGenerator.generateUnit6(lvl),
          () => QuestionGenerator.generateUnit7(lvl),
          () => QuestionGenerator.generateUnit8(lvl),
          () => QuestionGenerator.generateUnit9(lvl)
        ];
        const gen = generators[this.session.currentIndex % generators.length];
        exercise = gen();
      } else if (this.session.mode === 'speed') {
        const speedGens = [
          () => QuestionGenerator.generateUnit1(lvl),
          () => QuestionGenerator.generateUnit2(lvl),
          () => QuestionGenerator.generateUnit3(lvl),
          () => QuestionGenerator.generateUnit4(lvl)
        ];
        exercise = speedGens[Math.floor(Math.random() * speedGens.length)]();
      } else {
        switch (this.session.topic) {
          case 'unit1': exercise = QuestionGenerator.generateUnit1(lvl); break;
          case 'unit2': exercise = QuestionGenerator.generateUnit2(lvl); break;
          case 'unit3': exercise = QuestionGenerator.generateUnit3(lvl); break;
          case 'unit4': exercise = QuestionGenerator.generateUnit4(lvl); break;
          case 'unit5': exercise = QuestionGenerator.generateUnit5(lvl); break;
          case 'unit6': exercise = QuestionGenerator.generateUnit6(lvl); break;
          case 'unit7': exercise = QuestionGenerator.generateUnit7(lvl); break;
          case 'unit8': exercise = QuestionGenerator.generateUnit8(lvl); break;
          case 'unit9': exercise = QuestionGenerator.generateUnit9(lvl); break;
          case 'tables': exercise = QuestionGenerator.generateTables(lvl, this.session.tableFocus); break;
          case 'mult_div': exercise = QuestionGenerator.generateUnit3(lvl); break;
          case 'fractions_decimals': exercise = QuestionGenerator.generateUnit5(lvl); break;
          case 'word_problems': exercise = QuestionGenerator.generateUnit2(lvl); break;
          case 'roman_numbers': exercise = QuestionGenerator.generateUnit1(lvl); break;
          case 'geometry_units': exercise = QuestionGenerator.generateUnit7(lvl); break;
          default: exercise = QuestionGenerator.generateUnit1(lvl);
        }
      }
    } catch (err) {
      console.error('Error generando ejercicio adaptativo, usando fallback:', err);
      exercise = QuestionGenerator.generateMultDiv(lvl);
    }

    this.session.currentExercise = exercise;

    const cur = this.session.currentIndex + 1;
    const tot = this.session.totalExercises;
    const progText = document.getElementById('progress-text');
    if (progText) {
      progText.textContent = this.session.mode === 'speed' ? `Aciertos: ${this.session.correctCount}` : `Pregunta ${cur} de ${tot}`;
    }
    const percent = this.session.mode === 'speed' ? 100 : (cur / tot) * 100;
    const progFill = document.getElementById('progress-fill');
    if (progFill) progFill.style.width = `${percent}%`;

    const topicBadge = document.getElementById('exercise-topic-badge');
    if (topicBadge) topicBadge.textContent = exercise.topic;
    const questEl = document.getElementById('exercise-question');
    if (questEl) questEl.textContent = exercise.question;

    const visualArea = document.getElementById('exercise-visual-area');
    if (visualArea) visualArea.innerHTML = exercise.visual || '';

    const inputArea = document.getElementById('exercise-input-area');
    if (!inputArea) return;
    inputArea.innerHTML = '';

    if (exercise.type === 'quiz') {
      const grid = document.createElement('div');
      grid.className = exercise.options.length === 3 ? 'options-grid grid-cols-3' : 'options-grid';
      exercise.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.textContent = opt;
        btn.onclick = () => {
          this.sound.playPop();
          document.querySelectorAll('.btn-option').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this.session.selectedAnswer = opt;
        };
        grid.appendChild(btn);
      });
      inputArea.appendChild(grid);
    } else {
      const container = document.createElement('div');
      container.className = 'numpad-container';

      const display = document.createElement('div');
      display.id = 'numpad-display';
      display.className = 'answer-display-box';
      display.textContent = '...';
      container.appendChild(display);

      const keysGrid = document.createElement('div');
      keysGrid.className = 'numpad-keys';
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].forEach(k => {
        const btn = document.createElement('button');
        btn.className = 'btn-numpad';
        btn.textContent = k;
        btn.onclick = () => this.numpadAppend(k);
        keysGrid.appendChild(btn);
      });

      const btnDel = document.createElement('button');
      btnDel.className = 'btn-numpad action-del';
      btnDel.textContent = '⌫ Borrar';
      btnDel.style.gridColumn = 'span 5';
      btnDel.onclick = () => this.numpadBackspace();
      keysGrid.appendChild(btnDel);

      container.appendChild(keysGrid);
      inputArea.appendChild(container);
    }
  }

  numpadAppend(digit) {
    this.sound.playPop();
    let current = this.session.selectedAnswer ? String(this.session.selectedAnswer) : '';
    if (current.length < 6) {
      current += digit;
      this.session.selectedAnswer = parseInt(current, 10);
      const disp = document.getElementById('numpad-display');
      if (disp) disp.textContent = current;
    }
  }

  numpadBackspace() {
    this.sound.playPop();
    let current = this.session.selectedAnswer ? String(this.session.selectedAnswer) : '';
    if (current.length > 0) {
      current = current.slice(0, -1);
      this.session.selectedAnswer = current.length > 0 ? parseInt(current, 10) : null;
      const disp = document.getElementById('numpad-display');
      if (disp) disp.textContent = current.length > 0 ? current : '...';
    }
  }

  showHint() {
    this.sound.playPop();
    const hintBtn = document.getElementById('btn-request-hint');
    if (hintBtn) hintBtn.classList.remove('hint-gentle-highlight');
    const box = document.getElementById('hint-box');
    const text = document.getElementById('hint-text');
    if (text) text.textContent = this.session.currentExercise.hint || '¡Tómate tu tiempo y revisa la operación!';
    if (box) box.style.display = 'block';
  }

  readCurrentProblem() {
    if (!('speechSynthesis' in window)) {
      this.showToast('Tu navegador no soporta síntesis de voz.', '🔇', '#f59e0b');
      return;
    }
    window.speechSynthesis.cancel();
    const ex = this.session.currentExercise;
    if (!ex) return;
    const utterance = new SpeechSynthesisUtterance(ex.question);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  // =================================================================
  // COMPROBACIÓN DE RESPUESTA CON AJUSTE DINÁMICO DE DIFICULTAD
  // =================================================================
  submitCurrentAnswer() {
    if (this.session.selectedAnswer === null || this.session.selectedAnswer === undefined) {
      this.sound.playWrong();
      this.showToast('¡Elige o escribe una respuesta antes de comprobar!', '⚠️', '#f59e0b');
      return;
    }

    const ex = this.session.currentExercise;
    const isCorrect = String(this.session.selectedAnswer).trim().toLowerCase() === String(ex.correct).trim().toLowerCase();

    let levelNotice = null;

    if (isCorrect) {
      this.sound.playCorrect();
      this.session.correctCount++;
      this.session.streak++;
      this.session.levelStreak++;

      if (this.session.streak > this.session.maxStreak) {
        this.session.maxStreak = this.session.streak;
      }
      const streakCountEl = document.getElementById('current-streak-count');
      if (streakCountEl) streakCountEl.textContent = `x${this.session.streak}`;

      // REGLA DE SUBIDA DE NIVEL:
      // Con 2 aciertos seguidos en el nivel actual, subimos de nivel (máx 4)
      if (this.session.levelStreak >= 2 && this.session.currentLevel < 4) {
        this.session.currentLevel++;
        this.session.levelStreak = 0;
        this.state.adaptiveLevel = this.session.currentLevel;
        const def = LEVEL_DEFINITIONS[this.session.currentLevel];
        levelNotice = `¡🚀 SUBES A ${def.full.toUpperCase()}! Los retos se adaptan a tu gran habilidad.`;
        this.showLevelToast('up', this.session.currentLevel);
      }

      const coinsEarned = 10 + (this.session.streak >= 3 ? 5 : 0) + (this.session.currentLevel * 2);
      this.state.coins += coinsEarned;
      this.state.stars += 1;
      this.state.stats.totalCorrect++;

      // Acumular Nivel de Poder (Ki de combate)
      const basePower = 50;
      const streakBonus = this.session.streak * 15;
      const levelBonus = this.session.currentLevel * 20;
      const powerEarned = basePower + streakBonus + levelBonus;
      this.addPower(powerEarned);

      // Feedback visual de combate ("Juice"): Rayo de energía y daño al villano
      const heroBox = document.getElementById('arena-hero-avatar');
      const energyBeam = document.getElementById('energy-beam');
      const villainBox = document.getElementById('arena-villain-avatar');
      const shieldBubble = document.getElementById('combat-shield-bubble');
      const hintBtn = document.getElementById('btn-request-hint');

      if (shieldBubble) shieldBubble.style.display = 'none';
      if (hintBtn) hintBtn.classList.remove('hint-gentle-highlight');

      if (heroBox) heroBox.classList.add('hero-attacking');
      if (energyBeam) energyBeam.classList.add('firing');

      const damage = this.session.damagePerHit || 15;
      this.session.villainHp = Math.max(0, (this.session.villainHp !== undefined ? this.session.villainHp : 100) - damage);

      if (this.session.villainHp <= 0 && this.session.villain) {
        if (!this.state.defeatedVillains) this.state.defeatedVillains = [];
        if (!this.state.defeatedVillains.includes(this.session.villain.id)) {
          this.state.defeatedVillains.push(this.session.villain.id);
        }
      }

      setTimeout(() => {
        if (heroBox) heroBox.classList.remove('hero-attacking');
        if (energyBeam) energyBeam.classList.remove('firing');
        if (villainBox) {
          villainBox.classList.add('villain-hit');
          setTimeout(() => {
            if (villainBox) villainBox.classList.remove('villain-hit');
          }, 500);
        }
        this.updateCombatArenaUI();
      }, 200);

      // Actualizar avatar dinámico si la racha activa una transformación Shonen
      this.renderAvatar();

      if (ex.topic && (ex.topic.includes('Multiplicación') || ex.topic.includes('Tablas'))) {
        this.state.stats.multCompleted++;
      }

      this.checkAchievements();
      this.saveState();

      if (this.session.mode === 'speed') {
        this.session.currentIndex++;
        setTimeout(() => this.loadNextExercise(), 350);
      } else {
        if (this.session.streak >= 3) {
          this.confetti.burst(50);
        }
        setTimeout(() => {
          this.showFeedbackModal(true, coinsEarned, levelNotice);
        }, 500);
      }
    } else {
      this.sound.playWrong();
      this.session.streak = 0;
      this.session.levelStreak = 0;
      this.renderAvatar();
      const streakCountEl = document.getElementById('current-streak-count');
      if (streakCountEl) streakCountEl.textContent = 'x0';

      // Feedback visual de combate al fallar: Escudo protector y resaltar pista
      const shieldBubble = document.getElementById('combat-shield-bubble');
      const hintBtn = document.getElementById('btn-request-hint');

      if (shieldBubble) {
        shieldBubble.style.display = 'flex';
        setTimeout(() => {
          if (shieldBubble) shieldBubble.style.display = 'none';
        }, 1200);
      }
      if (hintBtn) {
        hintBtn.classList.add('hint-gentle-highlight');
      }

      this.updateCombatArenaUI();

      // REGLA DE BAJADA DE NIVEL (REFUERZO):
      // Si falla y está en nivel 2, 3 o 4, se adapta bajando para afianzar conceptos
      if (this.session.currentLevel > 1) {
        this.session.currentLevel--;
        this.state.adaptiveLevel = this.session.currentLevel;
        const def = LEVEL_DEFINITIONS[this.session.currentLevel];
        levelNotice = `💡 Adaptando al ${def.full} para reforzar este paso y ganar confianza.`;
        this.showLevelToast('down', this.session.currentLevel);
      }

      this.saveState();

      if (this.session.mode === 'speed') {
        this.session.currentIndex++;
        setTimeout(() => this.loadNextExercise(), 350);
      } else {
        setTimeout(() => {
          this.showFeedbackModal(false, 0, levelNotice);
        }, 500);
      }
    }
  }

  showFeedbackModal(isCorrect, coinsEarned, levelNotice) {
    const modal = document.getElementById('feedback-modal');
    const icon = document.getElementById('feedback-icon');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-message');
    const reward = document.getElementById('feedback-reward');
    const levelBox = document.getElementById('feedback-level-change');

    if (!modal) return;

    if (levelBox) {
      if (levelNotice) {
        levelBox.style.display = 'block';
        levelBox.textContent = levelNotice;
      } else {
        levelBox.style.display = 'none';
      }
    }

    if (isCorrect) {
      if (icon) icon.textContent = '🎉';
      if (title) {
        title.textContent = '¡GENIAL! ¡CORRECTO!';
        title.style.color = 'var(--green-dark)';
      }
      if (msg) msg.textContent = '¡Has razonado como un auténtico matemático de 4º!';
      if (reward) {
        reward.style.display = 'inline-flex';
        reward.style.alignItems = 'center';
        reward.style.gap = '8px';
        reward.innerHTML = `+${coinsEarned} ${COIN_SVG}  +1 ⭐`;
      }
    } else {
      if (icon) icon.textContent = '💡';
      if (title) {
        title.textContent = '¡Casi lo tienes!';
        title.style.color = 'var(--orange-dark)';
      }
      if (msg) msg.textContent = `La respuesta correcta era: ${this.session.currentExercise.correct}. ¡Revisa la pista y sigue practicando!`;
      if (reward) reward.style.display = 'none';
    }

    modal.classList.add('active');
  }

  nextExercise() {
    this.sound.playPop();
    const modal = document.getElementById('feedback-modal');
    if (modal) modal.classList.remove('active');
    this.session.currentIndex++;
    this.loadNextExercise();
  }

  confirmExitExercise() {
    this.sound.playPop();
    const modal = document.getElementById('exit-confirm-modal');
    if (modal) {
      modal.classList.add('active');
    } else {
      this.executeExitExercise();
    }
  }

  closeExitModal() {
    this.sound.playPop();
    const modal = document.getElementById('exit-confirm-modal');
    if (modal) modal.classList.remove('active');
  }

  executeExitExercise() {
    this.closeExitModal();
    if (this.session && this.session.timerInterval) {
      clearInterval(this.session.timerInterval);
      this.session.timerInterval = null;
    }
    if (this.confetti) this.confetti.stop();
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    if (this.session) this.state.adaptiveLevel = this.session.currentLevel;
    this.saveState();
    this.showScreen('home');
  }

  finishSession() {
    // 1. Limpiar temporizador de sesión
    if (this.session && this.session.timerInterval) {
      clearInterval(this.session.timerInterval);
      this.session.timerInterval = null;
    }

    // 2. Cerrar cualquier modal que pudiera estar activo
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));

    this.sound.playFanfare();
    if (this.confetti) {
      this.confetti.stop();
      this.confetti.burst(80);
    }

    // Guardar el nivel adaptativo alcanzado en el estado general
    this.state.adaptiveLevel = this.session.currentLevel;

    // Registrar villano derrotado si su HP llegó a 0 o se acertaron la mayoría de preguntas
    if (this.session && this.session.villain) {
      if (!this.state.defeatedVillains) this.state.defeatedVillains = [];
      const isDefeated = this.session.villainHp <= 0 || (this.session.correctCount >= Math.floor((this.session.totalExercises || 10) * 0.6));
      if (isDefeated && !this.state.defeatedVillains.includes(this.session.villain.id)) {
        this.state.defeatedVillains.push(this.session.villain.id);
      }
    }

    // Registrar progreso de la unidad
    if (this.session && (this.session.topic || this.session.mode)) {
      const topicKey = this.session.topic || this.session.mode;
      if (!this.state.unitStars) this.state.unitStars = {};
      const targetCount = topicKey === 'tables' ? 10 : 8;
      this.state.unitStars[topicKey] = Math.min(targetCount, (this.state.unitStars[topicKey] || 0) + this.session.correctCount);
    }

    // Actualizar racha diaria real (streak)
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (this.state.lastPlayDate === todayStr) {
      if (!this.state.streak || this.state.streak < 1) this.state.streak = 1;
    } else if (this.state.lastPlayDate) {
      const lastDate = new Date(this.state.lastPlayDate + 'T00:00:00');
      const curDate = new Date(todayStr + 'T00:00:00');
      const diffDays = Math.round((curDate - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        this.state.streak = (this.state.streak || 0) + 1;
      } else {
        this.state.streak = 1;
      }
    } else {
      this.state.streak = 1;
    }
    this.state.lastPlayDate = todayStr;
    this.updateStatsUI();

    this.saveState();
    this.updateMissionCardsUI();
    this.updateHomeWarriorProfile();

    const accuracy = this.session.currentIndex > 0 
      ? Math.round((this.session.correctCount / this.session.currentIndex) * 100) 
      : 100;

    const sStars = document.getElementById('sum-stars');
    const sCoins = document.getElementById('sum-coins');
    const sAcc = document.getElementById('sum-accuracy');
    const sLevel = document.getElementById('sum-level');

    const def = LEVEL_DEFINITIONS[this.session.currentLevel] || LEVEL_DEFINITIONS[2];

    if (sStars) sStars.textContent = `+${this.session.correctCount}`;
    if (sCoins) sCoins.textContent = `+${this.session.correctCount * 10}`;
    if (sAcc) sAcc.textContent = `${accuracy}%`;
    if (sLevel) sLevel.textContent = `${def.stars} ${def.name}`;

    const headline = document.getElementById('summary-headline');
    const subline = document.getElementById('summary-subline');
    if (this.session && this.session.villain && (this.session.villainHp <= 0 || this.session.correctCount >= Math.floor((this.session.totalExercises || 10) * 0.6))) {
      if (headline) headline.textContent = `¡Has vencido a ${this.session.villain.name}! 💥`;
      if (subline) subline.textContent = '¡Tus cálculos matemáticos y tu Nivel de Poder han salvado el Reino de los Números!';
    } else {
      if (headline) headline.textContent = '¡Buen trabajo, Campeón!';
      if (subline) subline.textContent = 'Has entrenado tus neuronas de 4º de Primaria de forma fantástica.';
    }

    this.showScreen('summary');
  }

  renderAvatar() {
    const mini = document.getElementById('mini-avatar-display');
    const home = document.getElementById('home-avatar-canvas');
    const full = document.getElementById('full-avatar-display');
    const arena = document.getElementById('arena-hero-avatar');
    const profileModal = document.getElementById('profile-modal-avatar');

    const svg = this.generateAvatarSVG();
    if (mini) mini.innerHTML = svg;
    if (home) home.innerHTML = svg;
    if (full) full.innerHTML = svg;
    if (profileModal) profileModal.innerHTML = svg;
    if (arena) {
      arena.innerHTML = svg;
      const activeTrans = this.getActiveTransformation();
      arena.className = 'combatant-avatar-box hero-box';
      if (activeTrans === 2) arena.classList.add('aura-destello');
      else if (activeTrans === 3) arena.classList.add('aura-furia');
      else if (activeTrans === 4) arena.classList.add('aura-cosmico');
      else if (activeTrans === 5) arena.classList.add('aura-astral');
    }
  }

  renderShopItemIcon(item) {
    return AvatarRenderer.renderItemIcon(item);
  }

  savePlayerName(name) {
    if (name && name.trim()) {
      this.state.name = name.trim();
      this.saveState();
      const welcome = document.getElementById('welcome-msg');
      if (welcome) welcome.textContent = `¡Hola, ${this.state.name}! 🌟`;
      const nameInput = document.getElementById('player-name-input');
      if (nameInput) nameInput.value = this.state.name;
      const modalNameInput = document.getElementById('profile-modal-name-input');
      if (modalNameInput) modalNameInput.value = this.state.name;
      const arenaHeroName = document.getElementById('arena-hero-name');
      if (arenaHeroName) arenaHeroName.textContent = this.state.name;
    }
  }

  filterShop(category, btnElement) {
    this.sound.playPop();
    this.activeShopCategory = category;
    document.querySelectorAll('.shop-tab-btn').forEach(btn => btn.classList.remove('active'));
    
    if (btnElement) {
      btnElement.classList.add('active');
    } else {
      const allBtns = Array.from(document.querySelectorAll('.shop-tab-btn'));
      const found = allBtns.find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(category));
      if (found) found.classList.add('active');
    }

    this.renderShop();
  }

  selectWarrior(warriorId) {
    if (!WARRIOR_AVATARS[warriorId]) return;
    this.sound.playLevelUp();
    this.state.warrior = warriorId;
    this.saveState();
    this.renderWarriorSelector();
    this.renderAvatar();
    this.updateHomeWarriorProfile();
  }

  renderWarriorSelector() {
    const container = document.getElementById('warrior-select-buttons');
    const descBox = document.getElementById('warrior-desc-box');
    if (!container) return;
    container.innerHTML = '';

    const current = this.state.warrior || 'kaito';

    Object.values(WARRIOR_AVATARS).forEach(w => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `warrior-select-btn ${w.id === current ? 'active' : ''}`;
      btn.title = `${w.name} - ${w.title}`;
      btn.innerHTML = `
        <span class="warrior-btn-icon">${w.icon}</span>
        <span class="warrior-btn-name">${w.name}</span>
      `;
      btn.onclick = () => this.selectWarrior(w.id);
      container.appendChild(btn);
    });

    if (descBox) {
      const activeW = WARRIOR_AVATARS[current] || WARRIOR_AVATARS.kaito;
      descBox.innerHTML = `<strong>${activeW.icon} ${activeW.name} (${activeW.title}):</strong> ${activeW.description}`;
    }
  }

  unequipItem(type) {
    this.sound.playPop();
    if (this.state.equipped) {
      this.state.equipped[type] = null;
    }
    this.saveState();
    this.renderShop();
    this.renderAvatar();
  }

  unequipAll() {
    this.sound.playFanfare();
    if (this.state.equipped) {
      this.state.equipped.hat = null;
      this.state.equipped.glasses = null;
      this.state.equipped.suit = null;
      this.state.equipped.pet = null;
    }
    this.saveState();
    this.renderShop();
    this.renderAvatar();
    if (this.confetti) this.confetti.burst(30);
  }

  // ===================================================================
  // MENÚ DE PERFIL Y REINICIO DE PROGRESO
  // ===================================================================
  openProfileModal() {
    this.sound.playPop();
    const modal = document.getElementById('profile-modal');
    if (!modal) return;

    const avatarEl = document.getElementById('profile-modal-avatar');
    if (avatarEl) {
      avatarEl.innerHTML = this.generateAvatarSVG();
    }

    const nameInput = document.getElementById('profile-modal-name-input');
    if (nameInput) {
      nameInput.value = this.state.name || 'Campeón/a';
    }

    const warrior = WARRIOR_AVATARS[this.state.warrior || 'kaito'] || WARRIOR_AVATARS.kaito;
    const activeTrans = this.getActiveTransformation();
    const trans = TRANSFORMATIONS[activeTrans] || TRANSFORMATIONS[1];
    
    const warriorTag = document.getElementById('profile-modal-warrior-tag');
    if (warriorTag) {
      warriorTag.innerHTML = `<strong>${warrior.icon} ${warrior.name}</strong> · ${warrior.title} <span class="profile-trans-badge">(${trans.name})</span>`;
    }

    const statPower = document.getElementById('profile-stat-power');
    const statStars = document.getElementById('profile-stat-stars');
    const statCoins = document.getElementById('profile-stat-coins');
    const statStreak = document.getElementById('profile-stat-streak');
    const statVillains = document.getElementById('profile-stat-villains');
    const statLevel = document.getElementById('profile-stat-level');

    if (statPower) statPower.textContent = `${(this.state.powerLevel || 500).toLocaleString('es-ES')} Ki`;
    if (statStars) statStars.textContent = `${this.state.stars || 0} ⭐`;
    if (statCoins) statCoins.textContent = `${this.state.coins || 0} 💰`;
    if (statStreak) statStreak.textContent = `${this.state.streak || 0} días 🔥`;
    
    const defeatedCount = Array.isArray(this.state.defeatedVillains) ? this.state.defeatedVillains.length : 0;
    if (statVillains) statVillains.textContent = `${defeatedCount} / 11 🏆`;

    const def = LEVEL_DEFINITIONS[this.state.adaptiveLevel || 2] || LEVEL_DEFINITIONS[2];
    if (statLevel) statLevel.textContent = `${def.stars} ${def.name}`;

    modal.classList.add('active');
  }

  closeProfileModal() {
    this.sound.playPop();
    const modal = document.getElementById('profile-modal');
    if (modal) modal.classList.remove('active');
  }

  confirmResetProgress() {
    this.sound.playPop();
    const pinInput = document.getElementById('parent-pin-input');
    const confirmBtn = document.getElementById('btn-reset-confirm');
    if (pinInput) {
      pinInput.value = '';
    }
    if (confirmBtn) {
      confirmBtn.setAttribute('disabled', 'true');
    }
    const modal = document.getElementById('reset-confirm-modal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  checkParentPin(val) {
    const confirmBtn = document.getElementById('btn-reset-confirm');
    if (!confirmBtn) return;
    if (String(val).trim() === '2026') {
      confirmBtn.removeAttribute('disabled');
      confirmBtn.classList.add('unlocked');
    } else {
      confirmBtn.setAttribute('disabled', 'true');
      confirmBtn.classList.remove('unlocked');
    }
  }

  closeResetConfirmModal() {
    this.sound.playPop();
    const pinInput = document.getElementById('parent-pin-input');
    const confirmBtn = document.getElementById('btn-reset-confirm');
    if (pinInput) pinInput.value = '';
    if (confirmBtn) {
      confirmBtn.setAttribute('disabled', 'true');
      confirmBtn.classList.remove('unlocked');
    }
    const modal = document.getElementById('reset-confirm-modal');
    if (modal) modal.classList.remove('active');
  }

  resetProgress() {
    this.confirmResetProgress();
  }

  executeResetProgress() {
    this.closeResetConfirmModal();
    this.closeProfileModal();

    try {
      localStorage.removeItem('mundomate_4_state');
    } catch (e) {}

    // Restablecer a valores iniciales de Guerrero Aprendiz
    this.state = {
      name: 'Campeón/a',
      warrior: 'kaito',
      stars: 0,
      coins: 0,
      streak: 0,
      lastPlayDate: null,
      powerLevel: 500,
      unlockedTransformation: 1,
      activeTransformation: 1,
      defeatedVillains: [],
      unitStars: {},
      adaptiveLevel: 2,
      inventory: ['hat_cap'],
      equipped: {
        hat: null,
        glasses: null,
        suit: null,
        pet: null
      },
      achievements: [],
      stats: {
        totalCorrect: 0,
        multCompleted: 0
      }
    };

    this.saveState();
    this.sound.playFanfare();

    this.updateStatsUI();
    this.renderAvatar();
    this.renderAchievements();
    this.renderShop();
    this.renderWarriorSelector();
    this.updateHomeWarriorProfile();
    this.updateMissionCardsUI();
    this.renderTransformationTester();

    const nameInput = document.getElementById('player-name-input');
    if (nameInput) nameInput.value = this.state.name;
    const modalNameInput = document.getElementById('profile-modal-name-input');
    if (modalNameInput) modalNameInput.value = this.state.name;
    const welcome = document.getElementById('welcome-msg');
    if (welcome) welcome.textContent = `¡Hola, ${this.state.name}! 🌟`;

    this.showScreen('home');
    
    // Notificación visual de éxito con el toast del juego
    const toast = document.getElementById('level-toast');
    const toastIcon = document.getElementById('level-toast-icon');
    const toastText = document.getElementById('level-toast-text');
    if (toast && toastIcon && toastText) {
      toastIcon.textContent = '🔄';
      toastText.textContent = '¡Progreso reiniciado! Vuelves al Modo Aprendiz.';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }
  }

  renderShop() {
    const grid = document.getElementById('shop-items-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const category = this.activeShopCategory;
    const isCategoryEquipped = !!(this.state.equipped && this.state.equipped[category]);

    // Opción 1: Tarjeta para desequipar (Estilo Guerrero Puro)
    const unequipCard = document.createElement('div');
    unequipCard.className = `shop-item-card shop-unequip-card ${!isCategoryEquipped ? 'is-active-slot' : ''}`;

    let unequipTitle = 'Sin accesorio';
    let unequipDesc = 'Estilo Guerrero Puro';
    let unequipIcon = '🥋';
    if (category === 'hat') {
      unequipTitle = 'Pelo Libre (Sin Casco)';
      unequipDesc = 'Luce el peinado de tu guerrero';
      unequipIcon = '💇';
    } else if (category === 'glasses') {
      unequipTitle = 'Mirada Limpia (Sin Visor)';
      unequipDesc = 'Ojos enfocados en el cálculo';
      unequipIcon = '👀';
    } else if (category === 'suit') {
      unequipTitle = 'Dogi Puro (Sin Armadura)';
      unequipDesc = 'Tu kimono marcial auténtico';
      unequipIcon = '🥋';
    } else if (category === 'pet') {
      unequipTitle = 'Sin Compañero';
      unequipDesc = 'Enfrenta los retos en solitario';
      unequipIcon = '👤';
    }

    let unequipBtnHTML = '';
    if (!isCategoryEquipped) {
      unequipBtnHTML = `<button class="btn-equipped btn-slot-active">✓ Activo (Puro)</button>`;
    } else {
      const typeLabel = category === 'hat' ? 'Casco' : category === 'glasses' ? 'Visor' : category === 'suit' ? 'Armadura' : 'Mascota';
      unequipBtnHTML = `<button class="btn-unequip-card" onclick="app.unequipItem('${category}')">✕ Quitar ${typeLabel}</button>`;
    }

    unequipCard.innerHTML = `
      <div class="shop-item-icon unequip-icon-box">${unequipIcon}</div>
      <div class="shop-item-name">${unequipTitle}</div>
      <div class="shop-item-price" style="color: #64748b; font-size: 0.85rem;">${unequipDesc}</div>
      ${unequipBtnHTML}
    `;
    grid.appendChild(unequipCard);

    // Artículos de la tienda
    const items = SHOP_CATALOG.filter(i => i.type === category);

    items.forEach(item => {
      const isOwned = this.state.inventory.includes(item.id);
      const isEquipped = this.state.equipped && this.state.equipped[item.type] === item.id;

      const card = document.createElement('div');
      card.className = `shop-item-card ${isEquipped ? 'is-item-equipped' : ''}`;

      let buttonHTML = '';
      if (isEquipped) {
        buttonHTML = `<button class="btn-equipped btn-equipped-toggle" onclick="app.unequipItem('${item.type}')" title="Toca para desequipar">✓ Puesto (✕ Quitar)</button>`;
      } else if (isOwned) {
        buttonHTML = `<button class="btn-equip" onclick="app.equipItem('${item.id}', '${item.type}')">Equipar</button>`;
      } else {
        const canAfford = this.state.coins >= item.price;
        buttonHTML = `<button class="btn-buy" style="${canAfford ? '' : 'opacity: 0.6;'}" onclick="app.buyItem('${item.id}', ${item.price})">Comprar (${item.price} ${COIN_SVG})</button>`;
      }

      card.innerHTML = `
        <div class="shop-item-icon">${this.renderShopItemIcon(item)}</div>
        <div class="shop-item-name">${item.name}</div>
        <div class="shop-item-price">${isOwned ? '¡En propiedad!' : `${item.price} ${COIN_SVG}`}</div>
        ${buttonHTML}
      `;
      grid.appendChild(card);
    });
  }

  buyItem(id, price) {
    if (this.state.coins < price) {
      this.sound.playWrong();
      this.showToast('¡Aún no tienes suficientes monedas! Gana más completando retos.', '💰', '#f59e0b');
      return;
    }

    this.sound.playCoin();
    this.confetti.burst(40);
    this.state.coins -= price;
    this.state.inventory.push(id);

    const item = SHOP_CATALOG.find(i => i.id === id);
    if (item) {
      this.state.equipped[item.type] = item.id;
    }

    this.unlockAchievement('shopper');
    this.saveState();
    this.renderShop();
    this.renderAvatar();
  }

  equipItem(id, type) {
    this.sound.playPop();
    this.state.equipped[type] = id;
    this.saveState();
    this.renderShop();
    this.renderAvatar();
  }

  renderAchievements() {
    const container = document.getElementById('achievements-container');
    if (!container) return;
    container.innerHTML = '';

    let unlockedCount = 0;
    ACHIEVEMENTS_LIST.forEach(ach => {
      const isUnlocked = this.state.achievements.includes(ach.id);
      if (isUnlocked) unlockedCount++;

      const badge = document.createElement('div');
      badge.className = `achievement-badge-card ${isUnlocked ? 'unlocked' : ''}`;
      badge.innerHTML = `
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-title">${ach.title}</div>
        <div class="achievement-desc">${ach.desc}</div>
      `;
      container.appendChild(badge);
    });

    const countLabel = document.getElementById('achievements-count');
    if (countLabel) countLabel.textContent = `${unlockedCount}/${ACHIEVEMENTS_LIST.length} conseguidos`;
  }

  unlockAchievement(id) {
    if (!this.state.achievements.includes(id)) {
      this.state.achievements.push(id);
      this.sound.playFanfare();
      this.confetti.burst(60);
      this.saveState();
      this.renderAchievements();
    }
  }

  checkAchievements() {
    if (this.state.stats.totalCorrect >= 1) this.unlockAchievement('first_win');
    if (this.session.streak >= 5) this.unlockAchievement('streak_5');
    if (this.session.currentLevel >= 3) this.unlockAchievement('level_3');
    if (this.session.currentLevel >= 4) this.unlockAchievement('level_4');
    if (this.state.coins >= 100) this.unlockAchievement('rich_kid');
    if (this.state.stats.multCompleted >= 10) this.unlockAchievement('tables_master');
  }
}

// Inicializar la aplicación globalmente
window.QuestionGenerator = QuestionGenerator;
window.AvatarRenderer = AvatarRenderer;
window.TRANSFORMATIONS = TRANSFORMATIONS;
window.VILLAIN_CATALOG = VILLAIN_CATALOG;
window.VillainRenderer = VillainRenderer;
window.app = new SmartickApp();
