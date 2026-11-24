// ==========================================
// 1. CONFIGURACIÓN PERSONALIZABLE
// ==========================================
const CREDENCIALES = {
  usuario: "grinch",
  contrasena: "2530"
};

// Inicio real: 03 de mayo de 2025 (Mes 4 = Mayo)
const FECHA_INICIO = new Date(2025, 4, 3, 0, 0, 0);

// Música de fondo dedicada: John Legend - All of Me
const MUSICA_FONDO_SRC = "musica/John Legend - All of Me.mp3";

// Canciones base desde la carpeta "musica/"
const cancionesBase = [
  {
    titulo: "John Legend - All of Me",
    artista: "Nuestra canción especial 💙",
    src: MUSICA_FONDO_SRC
  },
  {
    titulo: "Jerry Rivera - Amores Como el Nuestro",
    artista: "Nuestra playlist especial 💖",
    src: "musica/Jerry Rivera - Amores Como el Nuestro (Audio).mp3"
  },
  {
    titulo: "Grupo Niche - Hagamos Lo Que Diga El Corazón",
    artista: "Para disfrutar juntos 🎶",
    src: "musica/Grupo Niche - Hagamos Lo Que Diga El Corazón (Audio).mp3"
  },
  {
    titulo: "El Amor De Mi Vida - La Adictiva (Carolina Ross Cover)",
    artista: "Nuestra playlist especial 💖",
    src: "musica/El Amor De Mi Vida - La Adictiva (Carolina Ross Cover).mp3"
  },
  {
    titulo: "Tu Me Haces Falta - Eddie Santiago",
    artista: "Para disfrutar juntos 🎶",
    src: "musica/Tu Me Haces Falta - Eddie Santiago.mp3"
  },
  {
    titulo: "Amor Cuanto Te Amo - Diego Y Su Grupo Galé",
    artista: "Nuestra playlist especial 💖",
    src: "musica/Amor Cuanto Te Amo, Diego Y Su Grupo Galé Live Anniversary.mp3"
  }
];

let canciones = [...cancionesBase];

// ==========================================
// MÚSICA DE FONDO: JOHN LEGEND - ALL OF ME
// ==========================================
const bgMusicPlayer = document.getElementById("bg-music-player");
const bgMusicToggleBtn = document.getElementById("bg-music-toggle-btn");
let bgMusicEnabled = false;

function actualizarBotonMusicaFondo() {
  if (!bgMusicToggleBtn) return;
  if (bgMusicEnabled && bgMusicPlayer && !bgMusicPlayer.paused) {
    bgMusicToggleBtn.textContent = "🎶 All of Me (Fondo): ON";
    bgMusicToggleBtn.classList.add("playing");
  } else {
    bgMusicToggleBtn.textContent = "🎶 All of Me (Fondo): OFF";
    bgMusicToggleBtn.classList.remove("playing");
  }
}

function reproducirMusicaFondo() {
  if (!bgMusicPlayer) return;
  if (!bgMusicPlayer.src || (!bgMusicPlayer.src.includes("All%20of%20Me") && !bgMusicPlayer.src.includes("All of Me"))) {
    bgMusicPlayer.src = MUSICA_FONDO_SRC;
    bgMusicPlayer.volume = 0.22;
  }
  bgMusicPlayer
    .play()
    .then(() => {
      bgMusicEnabled = true;
      actualizarBotonMusicaFondo();
    })
    .catch(() => {
      bgMusicEnabled = false;
      actualizarBotonMusicaFondo();
    });
}

function pausarMusicaFondo() {
  if (!bgMusicPlayer) return;
  bgMusicPlayer.pause();
  bgMusicEnabled = false;
  actualizarBotonMusicaFondo();
}

if (bgMusicToggleBtn) {
  bgMusicToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (bgMusicPlayer && !bgMusicPlayer.paused) {
      pausarMusicaFondo();
    } else {
      reproducirMusicaFondo();
    }
  });
}

// ==========================================
// MENSAJE DINÁMICO AL INICIAR LA PÁGINA WEB
// ==========================================
const openingSplash = document.getElementById("opening-splash");
const openingDynamicQuote = document.getElementById("opening-dynamic-quote");
const enterFromSplashBtn = document.getElementById("enter-from-splash-btn");

const FRASE_INICIAL =
  "Y aunque no tenga mucho, siempre trataré de darte mucho de lo poco que tengo 💙";

let openingTypeTimer = null;
let openingSparkleTimer = null;

function iniciarMensajeInicialDinamico() {
  if (!openingDynamicQuote) return;
  if (openingTypeTimer) clearInterval(openingTypeTimer);
  if (openingSparkleTimer) clearInterval(openingSparkleTimer);

  openingDynamicQuote.textContent = "";
  let i = 0;

  openingTypeTimer = setInterval(() => {
    openingDynamicQuote.textContent += FRASE_INICIAL.charAt(i);
    i++;
    if (i >= FRASE_INICIAL.length) {
      clearInterval(openingTypeTimer);
      openingTypeTimer = null;
    }
  }, 34);

  openingSparkleTimer = setInterval(() => {
    if (!openingSplash || openingSplash.classList.contains("hidden")) {
      clearInterval(openingSparkleTimer);
      return;
    }
    const cx = window.innerWidth * (0.25 + Math.random() * 0.5);
    const cy = window.innerHeight * (0.28 + Math.random() * 0.35);
    lanzarCorazones(cx, cy, 2);
  }, 1600);
}

function cerrarMensajeInicialYMostrarLogin(e) {
  if (e) {
    lanzarCorazones(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 8);
  }
  if (openingTypeTimer) clearInterval(openingTypeTimer);
  if (openingSparkleTimer) clearInterval(openingSparkleTimer);

  if (openingSplash) {
    openingSplash.classList.add("fade-out");
    setTimeout(() => {
      openingSplash.classList.add("hidden");
      openingSplash.classList.remove("fade-out");
    }, 650);
  }

  if (loginScreen) {
    loginScreen.classList.remove("hidden", "fade-out");
    loginScreen.style.display = "flex";
  }

  reproducirMusicaFondo();
}

if (enterFromSplashBtn) {
  enterFromSplashBtn.addEventListener("click", cerrarMensajeInicialYMostrarLogin);
}

iniciarMensajeInicialDinamico();

// ==========================================
// BASE LOCAL (INDEXEDDB) PARA GRABAR FOTOS Y MÚSICA
// ==========================================
function abrirBaseLocal() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      resolve(null);
      return;
    }
    const req = indexedDB.open("UniversoPrivadoDB", 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("fotos")) {
        db.createObjectStore("fotos", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("audios")) {
        db.createObjectStore("audios", { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });
}

async function guardarEnStore(storeName, item) {
  const db = await abrirBaseLocal();
  if (!db) return null;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const addReq = store.add(item);
    addReq.onsuccess = () => resolve(addReq.result);
    addReq.onerror = () => reject(addReq.error);
  });
}

async function obtenerDeStore(storeName) {
  const db = await abrirBaseLocal();
  if (!db) return [];
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const getAllReq = store.getAll();
    getAllReq.onsuccess = () => resolve(getAllReq.result || []);
    getAllReq.onerror = () => reject(getAllReq.error);
  });
}

// ==========================================
// EFECTO DE CORAZONES AL HACER CLIC
// ==========================================
function lanzarCorazones(x, y, cantidad = 5) {
  const emojis = ["💙", "❤️", "💖", "✨"];
  for (let i = 0; i < cantidad; i++) {
    const span = document.createElement("span");
    span.className = "click-heart";
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = `${x + (Math.random() - 0.5) * 40}px`;
    span.style.top = `${y + (Math.random() - 0.5) * 20}px`;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1100);
  }
}

// ==========================================
// 2. LÓGICA DEL LOGIN + ANIMACIÓN "BIENVENIDO MI AMOR"
// ==========================================
const loginForm = document.getElementById("login-form");
const loginScreen = document.getElementById("login-screen");
const mainContent = document.getElementById("main-content");
const errorMsg = document.getElementById("error-msg");
const lockIcon = document.getElementById("lock-icon");
const hintBtn = document.getElementById("hint-btn");
const hintText = document.getElementById("hint-text");
const logoutBtn = document.getElementById("logout-btn");

const welcomeIntro = document.getElementById("welcome-intro");
const welcomeCanvas = document.getElementById("welcome-canvas");
const skipWelcomeBtn = document.getElementById("skip-welcome-btn");

let welcomeAnimId = null;
let welcomeTimeoutId = null;

if (hintBtn && hintText) {
  hintBtn.addEventListener("click", () => {
    hintText.classList.toggle("hidden");
  });
}

function mostrarMainContent() {
  if (welcomeAnimId) cancelAnimationFrame(welcomeAnimId);
  if (welcomeTimeoutId) clearTimeout(welcomeTimeoutId);

  if (loginScreen) {
    loginScreen.classList.add("hidden");
    loginScreen.style.display = "none";
  }

  if (mainContent) {
    mainContent.classList.remove("hidden");
    mainContent.style.display = "block";
  }

  if (bgMusicToggleBtn) {
    bgMusicToggleBtn.classList.remove("hidden");
  }
  reproducirMusicaFondo();

  if (welcomeIntro) {
    welcomeIntro.classList.add("fade-out");
    setTimeout(() => {
      welcomeIntro.classList.add("hidden");
      welcomeIntro.classList.remove("fade-out");
    }, 800);
  }

  if (typeof initVortexScene === "function") {
    initVortexScene();
  }
}

function obtenerPuntosCorazonYTexto(width, height) {
  const offCanvas = document.createElement("canvas");
  offCanvas.width = width;
  offCanvas.height = height;
  const offCtx = offCanvas.getContext("2d");

  const cx = width / 2;
  const cy = height / 2;
  const escala = Math.min(width, height) * 0.0155;

  offCtx.beginPath();
  for (let t = 0; t <= Math.PI * 2; t += 0.015) {
    const x = cx + 16 * Math.pow(Math.sin(t), 3) * escala;
    const y =
      cy -
      (13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)) *
        escala;
    if (t === 0) offCtx.moveTo(x, y);
    else offCtx.lineTo(x, y);
  }
  offCtx.closePath();
  offCtx.strokeStyle = "#ffffff";
  offCtx.lineWidth = Math.max(6, escala * 0.45);
  offCtx.stroke();

  const fontSize = Math.max(20, Math.min(44, width * 0.042));
  offCtx.fillStyle = "#ffffff";
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.font = `800 ${fontSize}px 'Plus Jakarta Sans', Arial, sans-serif`;
  offCtx.fillText("BIENVENIDO MI AMOR", cx, cy + escala * 0.8);

  const imgData = offCtx.getImageData(0, 0, width, height).data;
  const puntos = [];
  const paso = width < 600 ? 6 : 5;

  for (let y = 0; y < height; y += paso) {
    for (let x = 0; x < width; x += paso) {
      const idx = (y * width + x) * 4;
      if (imgData[idx + 3] > 140) {
        puntos.push({ x, y });
      }
    }
  }
  return puntos;
}

function iniciarAnimacionBienvenida() {
  if (!welcomeIntro || !welcomeCanvas) {
    mostrarMainContent();
    return;
  }

  welcomeIntro.classList.remove("hidden");
  welcomeIntro.classList.remove("fade-out");

  const ctx = welcomeCanvas.getContext("2d");
  const width = (welcomeCanvas.width = window.innerWidth);
  const height = (welcomeCanvas.height = window.innerHeight);

  const objetivos = obtenerPuntosCorazonYTexto(width, height);
  const totalParticulas = Math.min(1400, Math.max(450, objetivos.length));
  const colores = ["#ff2a7a", "#ff758f", "#fff3b0", "#ff9ebb", "#ffffff", "#e056fd"];

  const particulas = [];
  for (let i = 0; i < totalParticulas; i++) {
    const destino = objetivos[i % objetivos.length] || { x: width / 2, y: height / 2 };
    particulas.push({
      x: Math.random() * width,
      y: Math.random() * height,
      tx: destino.x + (Math.random() - 0.5) * 2.5,
      ty: destino.y + (Math.random() - 0.5) * 2.5,
      size: Math.random() * 2.6 + 1.4,
      color: colores[Math.floor(Math.random() * colores.length)],
      ease: Math.random() * 0.035 + 0.035
    });
  }

  let frame = 0;
  function animar() {
    frame++;
    ctx.fillStyle = "rgba(10, 4, 15, 0.24)";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particulas.length; i++) {
      const p = particulas[i];
      p.x += (p.tx - p.x) * p.ease;
      p.y += (p.ty - p.y) * p.ease;

      const vibracion = frame > 55 ? Math.sin(frame * 0.08 + i) * 0.6 : 0;

      ctx.beginPath();
      ctx.arc(p.x + vibracion, p.y + vibracion, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    welcomeAnimId = requestAnimationFrame(animar);
  }

  animar();

  welcomeTimeoutId = setTimeout(() => {
    mostrarMainContent();
  }, 5200);
}

if (skipWelcomeBtn) {
  skipWelcomeBtn.addEventListener("click", mostrarMainContent);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    if (typeof pausarCancion === "function") {
      pausarCancion();
    }
    pausarMusicaFondo();
    if (bgMusicToggleBtn) {
      bgMusicToggleBtn.classList.add("hidden");
    }
    if (mediaModal) {
      mediaModal.classList.add("hidden");
      if (modalBody) modalBody.innerHTML = "";
    }
    if (mainContent) {
      mainContent.classList.add("hidden");
      mainContent.style.display = "none";
    }
    if (loginScreen) {
      loginScreen.classList.remove("hidden", "fade-out");
      loginScreen.style.display = "flex";
    }
    if (lockIcon) {
      lockIcon.textContent = "🔒";
      lockIcon.style.transform = "scale(1)";
    }
    const passInput = document.getElementById("password");
    if (passInput) passInput.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userInput = document.getElementById("username").value.trim().toLowerCase();
    const passInput = document.getElementById("password").value.trim();

    if (userInput === CREDENCIALES.usuario && passInput === CREDENCIALES.contrasena) {
      if (errorMsg) errorMsg.textContent = "";
      if (lockIcon) {
        lockIcon.textContent = "🔓";
        lockIcon.style.transform = "scale(1.25)";
      }
      lanzarCorazones(window.innerWidth / 2, window.innerHeight / 2, 12);
      reproducirMusicaFondo();

      setTimeout(() => {
        if (loginScreen) {
          loginScreen.classList.add("hidden");
          loginScreen.style.display = "none";
        }
        iniciarAnimacionBienvenida();
      }, 300);
    } else {
      if (errorMsg) {
        errorMsg.textContent = "Ups, esa no es la llave correcta. Intenta de nuevo ✨";
      }
      const box = document.querySelector(".login-box");
      if (box) {
        box.classList.remove("shake");
        void box.offsetWidth;
        box.classList.add("shake");
      }
    }
  });
}

// ==========================================
// 3. CONTADOR EN TIEMPO REAL + HITO 1 AÑO Y 7 MESES
// ==========================================
const FECHA_1ANIO_7MESES = new Date(2026, 11, 3, 0, 0, 0);

const MENSAJE_GRANDE_1ANIO_7MESES = `
  <div class="secret-note-box" style="text-align: center; padding: 22px;">
    <span class="milestone-tag">✨ HITO ÚNICO · 1 AÑO Y 7 MESES JUNTOS ✨</span>
    <h4 style="color: #fff3b0; font-family: 'Cormorant Garamond', serif; font-size: 2rem; margin: 10px 0 14px;">
      ¡1 Año y 7 Meses contigo, Grinch! 💚❤️
    </h4>
    <p style="font-size: 1.05rem; margin-bottom: 14px;">
      Hoy cumplimos <strong>1 año y 7 meses</strong> desde aquel 3 de mayo de 2025 en que todo comenzó a tomar un color distinto.
      A veces me detengo a pensar en todo lo que hemos vivido, en cada esfuerzo para vernos, en cada risa compartida y en lo bonito que se siente tenerte en mi vida.
    </p>
    <p style="font-size: 1.05rem; margin-bottom: 14px;">
      No eres solo una etapa ni una casualidad: eres mi persona favorita, mi cómplice y el lugar donde siempre quiero volver.
      Gracias por quedarte, por cuidarme a tu manera y por hacer que este camino valga cada segundo.
    </p>
    <p style="color: #fff3b0; font-weight: 700; font-size: 1.12rem; margin-top: 16px;">
      Te amo hoy, en cada día 3 y por todo lo que aún nos falta escribir juntos. 💖✨
    </p>
  </div>
`;

function obtenerMesesCompletos(inicio, fin) {
  let anios = fin.getFullYear() - inicio.getFullYear();
  let meses = fin.getMonth() - inicio.getMonth();
  if (fin.getDate() < inicio.getDate()) {
    meses--;
  }
  return anios * 12 + meses;
}

function calcularAniosYMeses(inicio, fin) {
  let anios = fin.getFullYear() - inicio.getFullYear();
  let meses = fin.getMonth() - inicio.getMonth();

  if (fin.getDate() < inicio.getDate()) {
    meses--;
  }
  if (meses < 0) {
    anios--;
    meses += 12;
  }

  const textoAnio = anios === 1 ? "1 año" : `${anios} años`;
  const textoMes = meses === 1 ? "1 mes" : `${meses} meses`;

  if (anios > 0 && meses > 0) return `Llevamos ${textoAnio} y ${textoMes} juntos ❤️`;
  if (anios > 0) return `Llevamos ${textoAnio} juntos ❤️`;
  return `Llevamos ${textoMes} juntos ❤️`;
}

function actualizarHito1Anio7Meses(ahora) {
  const mesesTotales = obtenerMesesCompletos(FECHA_INICIO, ahora);
  const bannerEl = document.getElementById("milestone-1y7m-banner");
  const countdownTextEl = document.getElementById("milestone-countdown-text");

  if (mesesTotales >= 19) {
    if (bannerEl) bannerEl.classList.remove("hidden");
    if (countdownTextEl) {
      countdownTextEl.textContent = "¡Ya cumplimos 1 año y 7 meses juntos! 🎉❤️";
    }
  } else {
    const diffMs = Math.max(0, FECHA_1ANIO_7MESES - ahora);
    const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (countdownTextEl) {
      countdownTextEl.textContent =
        diasRestantes === 0
          ? "¡Hoy es el gran día de nuestro 1 año y 7 meses! 💖"
          : `Faltan ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"} para cumplir 1 año y 7 meses (03 de diciembre de 2026).`;
    }
  }
}

function actualizarContador() {
  const ahora = new Date();
  const diferencia = Math.max(0, ahora - FECHA_INICIO);

  const resumenEl = document.getElementById("time-summary");
  if (resumenEl) {
    resumenEl.textContent = calcularAniosYMeses(FECHA_INICIO, ahora);
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / 1000 / 60) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (daysEl) daysEl.textContent = String(dias).padStart(2, "0");
  if (hoursEl) hoursEl.textContent = String(horas).padStart(2, "0");
  if (minutesEl) minutesEl.textContent = String(minutos).padStart(2, "0");
  if (secondsEl) secondsEl.textContent = String(segundos).padStart(2, "0");

  actualizarHito1Anio7Meses(ahora);
}
setInterval(actualizarContador, 1000);
actualizarContador();

// ==========================================
// 4. GALERÍA POLAROID + FOTOS GRABADAS EN INDEXEDDB
// ==========================================
const polaroidGrid = document.getElementById("polaroid-grid");
const mediaModal = document.getElementById("media-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.getElementById("close-modal-btn");

function abrirModal(titulo, contenidoHTML) {
  if (!mediaModal || !modalTitle || !modalBody) return;
  modalTitle.textContent = titulo;
  modalBody.innerHTML = contenidoHTML;
  mediaModal.classList.remove("hidden");
}

function crearPolaroidElemento({ src, caption, likes = 1, guardada = false, prepend = true }) {
  if (!polaroidGrid) return;
  const div = document.createElement("div");
  div.className = "polaroid";
  div.dataset.caption = caption;
  div.innerHTML = `
    ${guardada ? `<span class="saved-badge">💾 Guardada</span>` : ""}
    <div class="polaroid-img-wrap">
      <img src="${src}" alt="${caption}" />
    </div>
    <p class="polaroid-caption">${caption}</p>
    <button type="button" class="like-pill" data-likes="${likes}">❤️ <span>${likes}</span></button>
  `;
  if (prepend) polaroidGrid.prepend(div);
  else polaroidGrid.appendChild(div);
}

async function cargarFotosGuardadas() {
  try {
    const guardadas = await obtenerDeStore("fotos");
    guardadas.forEach((foto) => {
      if (!foto.blob) return;
      const url = URL.createObjectURL(foto.blob);
      crearPolaroidElemento({
        src: url,
        caption: foto.caption || "Recuerdo guardado 💖",
        likes: foto.likes || 1,
        guardada: true,
        prepend: true
      });
    });
  } catch (err) {
    console.warn("No se pudieron cargar fotos guardadas:", err);
  }
}

const openMilestoneModalBtn = document.getElementById("open-milestone-modal-btn");
const previewMilestoneBtn = document.getElementById("preview-milestone-btn");

if (openMilestoneModalBtn) {
  openMilestoneModalBtn.addEventListener("click", (e) => {
    lanzarCorazones(e.clientX, e.clientY, 10);
    abrirModal("👑 1 Año y 7 Meses Juntos", MENSAJE_GRANDE_1ANIO_7MESES);
  });
}

if (previewMilestoneBtn) {
  previewMilestoneBtn.addEventListener("click", (e) => {
    lanzarCorazones(e.clientX, e.clientY, 10);
    abrirModal("👑 Mensaje Especial · 1 Año y 7 Meses", MENSAJE_GRANDE_1ANIO_7MESES);
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    mediaModal.classList.add("hidden");
    modalBody.innerHTML = "";
  });
}

if (mediaModal) {
  mediaModal.addEventListener("click", (e) => {
    if (e.target === mediaModal && closeModalBtn) {
      closeModalBtn.click();
    }
  });
}

if (polaroidGrid) {
  polaroidGrid.addEventListener("click", (e) => {
    const likeBtn = e.target.closest(".like-pill");
    if (likeBtn) {
      e.stopPropagation();
      const span = likeBtn.querySelector("span");
      const count = Number(span.textContent || 0) + 1;
      span.textContent = count;
      lanzarCorazones(e.clientX, e.clientY, 6);
      return;
    }

    const card = e.target.closest(".polaroid");
    if (!card) return;
    const imgSrc = card.querySelector("img").src;
    const captionEl = card.querySelector(".polaroid-caption");
    const caption = (card.dataset.caption && !card.dataset.caption.startsWith("[Mensaje"))
      ? card.dataset.caption
      : (captionEl ? captionEl.textContent : "Nuestro recuerdo ❤️");
    abrirModal(caption, `<img src="${imgSrc}" alt="${caption}" />`);
  });
}

const photoUpload = document.getElementById("photo-upload");
if (photoUpload && polaroidGrid) {
  photoUpload.addEventListener("change", async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const caption = prompt(`Escribe el mensaje para la foto "${file.name}":`) || "Un momento especial juntos 💖";
      const url = URL.createObjectURL(file);
      crearPolaroidElemento({
        src: url,
        caption,
        likes: 1,
        guardada: true,
        prepend: true
      });
      try {
        await guardarEnStore("fotos", {
          blob: file,
          caption,
          likes: 1,
          fecha: Date.now()
        });
      } catch (err) {
        console.warn("No se pudo guardar la foto en IndexedDB:", err);
      }
    }
    photoUpload.value = "";
  });
}

cargarFotosGuardadas();

// ==========================================
// 5. SALA DE VIDEOS Y MODO CINE
// ==========================================
const videosGrid = document.getElementById("videos-grid");
const videoUpload = document.getElementById("video-upload");

if (videosGrid) {
  videosGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".cinema-btn");
    if (!btn) return;
    const videoSrc = btn.dataset.video;
    const title = btn.dataset.title || "Nuestro Video Especial";
    abrirModal(`🍿 ${title}`, `<video src="${videoSrc}" controls autoplay></video>`);
  });
}

if (videoUpload && videosGrid) {
  videoUpload.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const titulo = prompt(`Título para el video "${file.name}":`) || file.name.replace(/\.[^/.]+$/, "");
      const card = document.createElement("div");
      card.className = "video-card glass-card";
      card.innerHTML = `
        <video src="${url}" controls preload="metadata"></video>
        <div class="video-card-footer">
          <div>
            <h4>${titulo}</h4>
            <p>Video agregado con mucho amor 💕</p>
          </div>
          <button type="button" class="btn-secondary cinema-btn" data-video="${url}" data-title="${titulo}">🍿 Modo Cine</button>
        </div>
      `;
      videosGrid.prepend(card);
    });
  });
}

// ==========================================
// 6. REPRODUCTOR MUSICAL INTERACTIVO
// ==========================================
const audioPlayer = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");
const vinylDisc = document.getElementById("vinyl-disc");
const playlistEl = document.getElementById("playlist");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationTimeEl = document.getElementById("duration-time");

let currentTrackIndex = 0;

function renderPlaylist() {
  if (!playlistEl) return;
  playlistEl.innerHTML = "";
  canciones.forEach((song, index) => {
    const li = document.createElement("li");
    li.className = index === currentTrackIndex ? "active" : "";
    const tag = song.guardada ? "💾 " : "🎵 ";
    li.innerHTML = `<span>${tag}${song.titulo}</span><small>${song.artista}</small>`;
    li.addEventListener("click", () => {
      cargarCancion(index);
      reproducirCancion();
    });
    playlistEl.appendChild(li);
  });
}

function cargarCancion(index) {
  if (!audioPlayer || !canciones.length || !canciones[index]) return;
  currentTrackIndex = index;
  const song = canciones[index];
  if (trackTitle) trackTitle.textContent = song.titulo;
  if (trackArtist) trackArtist.textContent = song.artista;
  audioPlayer.src = song.src;
  renderPlaylist();
}

function reproducirCancion() {
  if (!audioPlayer || !canciones.length) return;
  pausarMusicaFondo();
  if (!audioPlayer.src) {
    cargarCancion(0);
  }
  audioPlayer.play().then(() => {
    if (playBtn) playBtn.textContent = "⏸️";
    if (vinylDisc) vinylDisc.classList.add("spinning");
  }).catch(() => {
    alert("Revisa que el archivo .mp3 exista dentro de la carpeta 'musica/' con el mismo nombre escrito en script.js.");
  });
}

function pausarCancion() {
  if (!audioPlayer) return;
  audioPlayer.pause();
  if (playBtn) playBtn.textContent = "▶️";
  if (vinylDisc) vinylDisc.classList.remove("spinning");
}

if (playBtn) {
  playBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
      reproducirCancion();
    } else {
      pausarCancion();
    }
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (!canciones.length) return;
    currentTrackIndex = (currentTrackIndex - 1 + canciones.length) % canciones.length;
    cargarCancion(currentTrackIndex);
    reproducirCancion();
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    if (!canciones.length) return;
    currentTrackIndex = (currentTrackIndex + 1) % canciones.length;
    cargarCancion(currentTrackIndex);
    reproducirCancion();
  });
}

if (audioPlayer) {
  audioPlayer.addEventListener("timeupdate", () => {
    if (audioPlayer.duration && progressBar) {
      const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBar.style.width = `${percent}%`;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
      if (durationTimeEl) durationTimeEl.textContent = formatTime(audioPlayer.duration);
    }
  });

  audioPlayer.addEventListener("ended", () => {
    if (nextBtn) nextBtn.click();
  });
}

if (progressContainer) {
  progressContainer.addEventListener("click", (e) => {
    if (audioPlayer && audioPlayer.duration) {
      const width = progressContainer.clientWidth;
      const clickX = e.offsetX;
      audioPlayer.currentTime = (clickX / width) * audioPlayer.duration;
    }
  });
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

async function cargarAudiosGuardados() {
  try {
    const guardados = await obtenerDeStore("audios");
    if (guardados.length) {
      const extraSongs = guardados
        .filter((a) => a.blob)
        .map((a) => ({
          titulo: a.titulo || "Canción guardada",
          artista: a.artista || "Guardada en nuestra playlist 💖",
          src: URL.createObjectURL(a.blob),
          guardada: true
        }));
      canciones = [...cancionesBase, ...extraSongs];
      renderPlaylist();
    }
  } catch (err) {
    console.warn("No se pudieron cargar canciones guardadas:", err);
  }
}

const audioUpload = document.getElementById("audio-upload");
if (audioUpload) {
  audioUpload.addEventListener("change", async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const primerIndiceNuevo = canciones.length;
    for (const file of files) {
      const titulo = file.name.replace(/\.[^/.]+$/, "");
      const artista = "Guardada en nuestra playlist 💖";
      const url = URL.createObjectURL(file);

      canciones.push({
        titulo,
        artista,
        src: url,
        guardada: true
      });

      try {
        await guardarEnStore("audios", {
          blob: file,
          titulo,
          artista,
          fecha: Date.now()
        });
      } catch (err) {
        console.warn("No se pudo guardar el audio en IndexedDB:", err);
      }
    }

    cargarCancion(primerIndiceNuevo);
    reproducirCancion();
    audioUpload.value = "";
  });
}

cargarCancion(0);
cargarAudiosGuardados();

// ==========================================
// 7. 101 RAZONES INTERACTIVAS
// ==========================================
const razonesBaseDetalle = [
  {
    titulo: "Porque me cuidas con todo el corazón",
    texto: "Por tu forma tan linda de estar pendiente de mí, incluso en los pequeños detalles del día a día."
  },
  {
    titulo: "Porque haces único cualquier plan",
    texto: "Porque contigo una tarde sencilla o un paseo improvisado se vuelven inolvidables."
  },
  {
    titulo: "Porque me haces reír hasta en modo Grinch",
    texto: "Por tu paciencia, tu humor y esa chispa tuya que siempre logra sacarme una sonrisa."
  },
  {
    titulo: "Porque cada kilómetro vale la pena",
    texto: "Por cada ruta, esfuerzo y tiempo compartido para acortar la distancia entre nosotros."
  },
  {
    titulo: "Porque eres mi paz y mi refugio",
    texto: "Porque a tu lado me siento segura, tranquila y feliz de ser quien soy."
  },
  {
    titulo: "Porque compartimos risas espontáneas",
    texto: "Por las ocurrencias y carcajadas que nacen de la nada cuando estamos juntos."
  },
  {
    titulo: "Porque siempre estás cuando importo",
    texto: "Por escucharme, acompañarme y apoyarme cuando más lo necesito."
  },
  {
    titulo: "Porque cada detalle habla de ti",
    texto: "Por cada palabra, gesto y momento que guardo como un tesoro."
  },
  {
    titulo: "Porque cada día 3 se siente especial",
    texto: "Por celebrar cada mes como una nueva página bonita de nuestra historia."
  },
  {
    titulo: "Porque llegaste a cambiar mi vida",
    texto: "Simplemente por ser tú, por quedarte y por hacer que cada día valga más."
  }
];

const plantillasDetalle = [
  {
    titulo: "Porque eres mi paz en medio del ruido",
    texto: "Por la calma que siento cuando estamos juntos y todo lo demás pasa a segundo plano."
  },
  {
    titulo: "Porque me haces creer en la magia de lo real",
    texto: "Por demostrarme que el cariño sincero se nota en los hechos y en la constancia."
  },
  {
    titulo: "Porque tu forma tan linda de ser enamora",
    texto: "Por lo auténtico que eres, con tus luces, tus bromas y esa forma tan tuya de querer."
  },
  {
    titulo: "Porque eres el sueño más bonito hecho realidad",
    texto: "Porque nunca imaginé encontrar a alguien con quien conectara de una forma tan especial."
  },
  {
    titulo: "Porque imagino un futuro lleno de nosotros",
    texto: "Por los planes, viajes y metas que me ilusiona construir contigo paso a paso."
  },
  {
    titulo: "Porque cada reencuentro tiene sabor a alegría",
    texto: "Por cómo se ilumina todo cuando volvemos a vernos y a compartir tiempo juntos."
  }
];

const categoriasCiclo = ["ternura", "momentos", "futuro"];

const RAZONES_101 = Array.from({ length: 101 }, (_, idx) => {
  const num = idx + 1;
  const item =
    idx < razonesBaseDetalle.length
      ? razonesBaseDetalle[idx]
      : plantillasDetalle[(idx - razonesBaseDetalle.length) % plantillasDetalle.length];
  const categoria = categoriasCiclo[idx % categoriasCiclo.length];
  return {
    num,
    titulo: item.titulo,
    texto: item.texto,
    categoria
  };
});

const reasonsGridEl = document.getElementById("reasons-grid");
const reasonsFiltersEl = document.getElementById("reasons-filters");
const reasonsSearchInput = document.getElementById("reasons-search-input");
const randomReasonBtn = document.getElementById("random-reason-btn");
const reasonsCountLabel = document.getElementById("reasons-count-label");
const loadMoreReasonsBtn = document.getElementById("load-more-reasons-btn");
const showAllReasonsBtn = document.getElementById("show-all-reasons-btn");

let activeReasonCategory = "all";
let reasonSearchQuery = "";
let visibleReasonsLimit = 18;
let highlightedReasonNum = null;

function obtenerRazonesFiltradas() {
  const q = reasonSearchQuery.trim().toLowerCase();
  return RAZONES_101.filter((r) => {
    const matchCat = activeReasonCategory === "all" || r.categoria === activeReasonCategory;
    const matchQuery =
      !q ||
      String(r.num).includes(q) ||
      `razón ${r.num}`.includes(q) ||
      `razon ${r.num}`.includes(q) ||
      r.titulo.toLowerCase().includes(q) ||
      r.texto.toLowerCase().includes(q) ||
      r.categoria.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });
}

function renderRazones101() {
  if (!reasonsGridEl) return;
  const filtradas = obtenerRazonesFiltradas();
  const visibles = filtradas.slice(0, visibleReasonsLimit);

  if (reasonsCountLabel) {
    reasonsCountLabel.textContent = `Mostrando ${visibles.length} de ${filtradas.length} razones (total: 101)`;
  }

  if (loadMoreReasonsBtn) {
    loadMoreReasonsBtn.classList.toggle("hidden", visibles.length >= filtradas.length);
  }

  if (!visibles.length) {
    reasonsGridEl.innerHTML = `
      <div class="glass-card" style="grid-column: 1 / -1; padding: 24px; text-align: center;">
        <p>No encontré ninguna razón con ese filtro. ¡Prueba otra palabra o borra la búsqueda! ✨</p>
      </div>
    `;
    return;
  }

  reasonsGridEl.innerHTML = visibles
    .map(
      (r) => `
      <article class="reason-card ${highlightedReasonNum === r.num ? "highlighted-reason" : ""}" data-num="${r.num}">
        <div class="reason-top-row">
          <span class="reason-num-title">RAZÓN ${r.num}</span>
          <span class="reason-cat">${r.categoria}</span>
        </div>
        <h4 class="reason-headline">${r.titulo}</h4>
        <p class="reason-text">${r.texto}</p>
      </article>
    `
    )
    .join("");
}

if (reasonsFiltersEl) {
  reasonsFiltersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-pill");
    if (!btn) return;
    reasonsFiltersEl.querySelectorAll(".filter-pill").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeReasonCategory = btn.dataset.category || "all";
    visibleReasonsLimit = 18;
    renderRazones101();
  });
}

if (reasonsSearchInput) {
  reasonsSearchInput.addEventListener("input", (e) => {
    reasonSearchQuery = e.target.value || "";
    visibleReasonsLimit = 101;
    renderRazones101();
  });
}

if (loadMoreReasonsBtn) {
  loadMoreReasonsBtn.addEventListener("click", () => {
    visibleReasonsLimit = Math.min(101, visibleReasonsLimit + 18);
    renderRazones101();
  });
}

if (showAllReasonsBtn) {
  showAllReasonsBtn.addEventListener("click", () => {
    visibleReasonsLimit = 101;
    renderRazones101();
  });
}

if (randomReasonBtn) {
  randomReasonBtn.addEventListener("click", (e) => {
    const elegida = RAZONES_101[Math.floor(Math.random() * RAZONES_101.length)];
    activeReasonCategory = "all";
    reasonSearchQuery = "";
    if (reasonsSearchInput) reasonsSearchInput.value = "";
    if (reasonsFiltersEl) {
      reasonsFiltersEl.querySelectorAll(".filter-pill").forEach((b, idx) => {
        b.classList.toggle("active", idx === 0);
      });
    }
    highlightedReasonNum = elegida.num;
    visibleReasonsLimit = Math.max(visibleReasonsLimit, elegida.num);
    renderRazones101();
    lanzarCorazones(e.clientX, e.clientY, 8);

    const targetCard = reasonsGridEl?.querySelector(`.reason-card[data-num="${elegida.num}"]`);
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

if (reasonsGridEl) {
  reasonsGridEl.addEventListener("click", (e) => {
    const card = e.target.closest(".reason-card");
    if (!card) return;
    const num = Number(card.dataset.num);
    const razon = RAZONES_101.find((item) => item.num === num);
    if (!razon) return;
    highlightedReasonNum = razon.num;
    lanzarCorazones(e.clientX, e.clientY, 6);
    abrirModal(
      `💘 RAZÓN ${razon.num} DE 101`,
      `
      <div class="secret-note-box" style="text-align: center; padding: 24px;">
        <span class="milestone-tag" style="text-transform: uppercase;">${razon.categoria}</span>
        <h4 style="color: #fff3b0; font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; margin: 12px 0;">
          ${razon.titulo}
        </h4>
        <p style="font-size: 1.06rem; color: #ffffff;">
          ${razon.texto}
        </p>
      </div>
      `
    );
  });
}

renderRazones101();

// ==========================================
// DOS JUEGOS ROMÁNTICOS Y DIDÁCTICOS (10 DE CADA UNO)
// ==========================================
const PREGUNTAS_TRIVIA = [
  {
    pregunta: "1. ¿En qué día de cada mes celebramos nuestro capítulo especial?",
    opciones: ["El día 1 de cada mes", "El día 3 de cada mes", "El día 15 de cada mes"],
    correcta: 1,
    explicacion: "Cada día 3 celebramos un mes más desde el 03 de mayo de 2025: los pequeños rituales constantes mantienen viva la cercanía."
  },
  {
    pregunta: "2. ¿Qué representa nuestra distancia entre Comas y San Juan de Miraflores?",
    opciones: ["Un obstáculo imposible", "Kilómetros que hacen más valioso cada reencuentro", "Un motivo para dejar de vernos"],
    correcta: 1,
    explicacion: "La distancia física enseña paciencia y esfuerzo mutuo; cada encuentro se disfruta con más cariño y gratitud."
  },
  {
    pregunta: "3. ¿Cuál es el valor que más importa en lo que construimos día a día?",
    opciones: ["El cariño sincero, el cuidado y estar presentes", "Solo los regalos costosos", "Hablar sin escucharnos"],
    correcta: 0,
    explicacion: "Dar de lo poco que se tiene con nobleza, escucha y apoyo real crea vínculos mucho más sólidos que lo material."
  },
  {
    pregunta: "4. ¿Qué celebramos el 03 de diciembre de 2026 al llegar al mes 19?",
    opciones: ["1 año y 7 meses juntos", "Solo 6 meses", "2 años exactos"],
    correcta: 0,
    explicacion: "Desde mayo de 2025 hasta diciembre de 2026 pasan 19 meses: 1 año completo (12 meses) más 7 meses adicionales."
  },
  {
    pregunta: "5. ¿Qué hace que un plan sencillo se vuelva inolvidable cuando estamos juntos?",
    opciones: ["La compañía, las risas y la buena vibra", "Que sea muy caro", "Ir con prisa y sin conversar"],
    correcta: 0,
    explicacion: "El valor de un momento está en con quién lo compartes y en cómo te hace sentir."
  },
  {
    pregunta: "6. ¿Por qué admiro tanto el esfuerzo y la historia de mi Grinch?",
    opciones: ["Por su resiliencia, trabajo y amor a su familia", "Porque nunca tiene retos", "Porque evita esforzarse"],
    correcta: 0,
    explicacion: "Admirar la constancia, el respeto por las raíces y el cariño familiar fortalece la admiración mutua en una relación."
  },
  {
    pregunta: "7. ¿Qué es lo más bonito de compartir música y baile en nuestra historia?",
    opciones: ["Crear recuerdos alegres y conectar sin palabras", "Competir por quién baila mejor", "Ignorar la letra y el ritmo"],
    correcta: 0,
    explicacion: "La música y el baile ayudan a liberar tensiones y anclan emociones felices a momentos concretos."
  },
  {
    pregunta: "8. ¿Cómo se cuidan mejor las emociones cuando hay días pesados?",
    opciones: ["Con empatía, paciencia y palabras sinceras", "Guardando rencor en silencio", "Ignorando lo que el otro siente"],
    correcta: 0,
    explicacion: "La empatía y la comunicación calmada permiten acompañar al otro sin sumar más peso a un mal día."
  },
  {
    pregunta: "9. ¿Qué simboliza nuestro álbum de recuerdos y fotos?",
    opciones: ["Memoria afectiva de etapas vividas juntos", "Solo imágenes guardadas sin historia", "Un archivo olvidado"],
    correcta: 0,
    explicacion: "Guardar fotos con su historia ayuda a recordar de dónde venimos y cuánto hemos crecido juntos."
  },
  {
    pregunta: "10. ¿Qué proyectamos para todo lo que aún nos falta escribir?",
    opciones: ["Seguir caminando de la mano con cariño y metas", "Dejar todo al azar sin cuidar el vínculo", "Detenernos en el pasado"],
    correcta: 0,
    explicacion: "Proyectar el futuro juntos implica cultivar el presente con ternura, respeto y ganas de construir."
  }
];

const triviaProgressEl = document.getElementById("trivia-progress");
const triviaQuestionEl = document.getElementById("trivia-question");
const triviaOptionsEl = document.getElementById("trivia-options");
const triviaFeedbackEl = document.getElementById("trivia-feedback");
const triviaScoreBadgeEl = document.getElementById("trivia-score-badge");
const nextTriviaBtn = document.getElementById("next-trivia-btn");
const restartTriviaBtn = document.getElementById("restart-trivia-btn");

let triviaIndex = 0;
let triviaScore = 0;
let triviaRespondida = false;

function renderTrivia() {
  if (!triviaQuestionEl || !triviaOptionsEl) return;
  const actual = PREGUNTAS_TRIVIA[triviaIndex];
  triviaRespondida = false;

  if (triviaProgressEl) {
    triviaProgressEl.textContent = `Pregunta ${triviaIndex + 1} de ${PREGUNTAS_TRIVIA.length}`;
  }
  if (triviaScoreBadgeEl) {
    triviaScoreBadgeEl.textContent = `⭐ ${triviaScore} pts`;
  }
  triviaQuestionEl.textContent = actual.pregunta;
  triviaOptionsEl.innerHTML = "";

  if (triviaFeedbackEl) {
    triviaFeedbackEl.classList.add("hidden");
    triviaFeedbackEl.textContent = "";
  }
  if (nextTriviaBtn) {
    nextTriviaBtn.classList.add("hidden");
    nextTriviaBtn.textContent =
      triviaIndex < PREGUNTAS_TRIVIA.length - 1 ? "Siguiente pregunta ➡️" : "Ver resultado final 💖";
  }

  actual.opciones.forEach((op, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "trivia-option-btn";
    btn.textContent = op;
    btn.addEventListener("click", (e) => seleccionarOpcionTrivia(idx, btn, e));
    triviaOptionsEl.appendChild(btn);
  });
}

function seleccionarOpcionTrivia(idx, clickedBtn, e) {
  if (triviaRespondida) return;
  triviaRespondida = true;

  const actual = PREGUNTAS_TRIVIA[triviaIndex];
  const allBtns = triviaOptionsEl.querySelectorAll(".trivia-option-btn");
  allBtns.forEach((b) => (b.disabled = true));

  const esCorrecta = idx === actual.correcta;
  if (esCorrecta) {
    triviaScore += 25;
    clickedBtn.classList.add("correct");
    if (typeof lanzarCorazones === "function") lanzarCorazones(e.clientX, e.clientY, 7);
  } else {
    clickedBtn.classList.add("wrong");
    if (allBtns[actual.correcta]) {
      allBtns[actual.correcta].classList.add("correct");
    }
  }

  if (triviaScoreBadgeEl) {
    triviaScoreBadgeEl.textContent = `⭐ ${triviaScore} pts`;
  }
  if (triviaFeedbackEl) {
    triviaFeedbackEl.classList.remove("hidden");
    triviaFeedbackEl.innerHTML = `
      <strong>${esCorrecta ? "¡Muy bien, mi Grinch! 💚" : "Casi, pero aquí va el dato didáctico: ✨"}</strong><br/>
      💡 ${actual.explicacion}
    `;
  }
  if (nextTriviaBtn) {
    nextTriviaBtn.classList.remove("hidden");
  }
}

if (nextTriviaBtn) {
  nextTriviaBtn.addEventListener("click", () => {
    if (triviaIndex < PREGUNTAS_TRIVIA.length - 1) {
      triviaIndex++;
      renderTrivia();
    } else {
      const maxPts = PREGUNTAS_TRIVIA.length * 25;
      if (typeof abrirModal === "function") {
        abrirModal(
          "💘 Resultado de Nuestra Trivia Didáctica",
          `
          <div class="secret-note-box" style="text-align: center; padding: 22px;">
            <span class="milestone-tag">🏆 PUNTAJE FINAL: ${triviaScore} / ${maxPts} PTS</span>
            <h4 style="color: #fff3b0; font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; margin: 12px 0;">
              ¡Completaste las 10 preguntas juntos! 💖
            </h4>
            <p style="font-size: 1.03rem;">
              Cada respuesta fue un pretexto bonito para recordar lo que valoramos, aprendemos y compartimos en nuestra historia.
            </p>
          </div>
          `
        );
      }
      triviaIndex = 0;
      triviaScore = 0;
      renderTrivia();
    }
  });
}

if (restartTriviaBtn) {
  restartTriviaBtn.addEventListener("click", () => {
    triviaIndex = 0;
    triviaScore = 0;
    renderTrivia();
  });
}

renderTrivia();

const FRASES_PUZZLE = [
  {
    pista: "💡 Pista 1: Comienza con el cariño sincero que no necesita grandes lujos para entregarse.",
    piezas: ["Siempre trataré", "de darte mucho", "de lo poco", "que tengo 💙"]
  },
  {
    pista: "💡 Pista 2: Habla de cómo tu compañía transforma cualquier día común en algo especial.",
    piezas: ["A tu lado", "cada momento", "se vuelve", "mi lugar favorito ✨"]
  },
  {
    pista: "💡 Pista 3: Une el tiempo compartido con la ilusión de lo que aún viene.",
    piezas: ["Cada día 3", "celebra nuestra historia", "y todo lo bonito", "que nos espera 💖"]
  },
  {
    pista: "💡 Pista 4: Expresa calma y tranquilidad cuando estamos juntos.",
    piezas: ["Cuando estoy contigo", "siento paz", "y el mundo", "se queda en calma 🌿"]
  },
  {
    pista: "💡 Pista 5: Destaca el valor de cada kilómetro recorrido para vernos.",
    piezas: ["Cada kilómetro", "que nos separa", "hace más valioso", "nuestro reencuentro 🌌"]
  },
  {
    pista: "💡 Pista 6: Celebra las risas espontáneas que nacen sin planearlas.",
    piezas: ["Tus bromas", "y tu sonrisa", "iluminan hasta", "los días cansados 💚"]
  },
  {
    pista: "💡 Pista 7: Reconoce el esfuerzo y la nobleza de tu caminar.",
    piezas: ["Admiro tu esfuerzo", "tu nobleza", "y el gran corazón", "que llevas dentro ✨"]
  },
  {
    pista: "💡 Pista 8: Habla de caminar de la mano en las buenas y en las pruebas.",
    piezas: ["Caminar de tu mano", "me enseña", "que el cariño real", "se cuida cada día ❤️"]
  },
  {
    pista: "💡 Pista 9: Resalta la gratitud por cada mes que sumamos juntos.",
    piezas: ["Cada mes cumplido", "es un regalo", "que guardo", "en mi memoria 💖"]
  },
  {
    pista: "💡 Pista 10: Cierra con la promesa de seguir eligiéndonos con amor.",
    piezas: ["Hoy, mañana", "y en cada día 3", "te elijo", "con todo mi amor 💙"]
  }
];

const puzzleHintEl = document.getElementById("puzzle-hint");
const puzzleBuiltArea = document.getElementById("puzzle-built-area");
const puzzleBankArea = document.getElementById("puzzle-bank-area");
const puzzleStatusEl = document.getElementById("puzzle-status");
const puzzleLevelBadgeEl = document.getElementById("puzzle-level-badge");
const clearPuzzleBtn = document.getElementById("clear-puzzle-btn");
const nextPuzzleBtn = document.getElementById("next-puzzle-btn");

let puzzleIndex = 0;
let seleccionadasPuzzle = [];
let bancoMezclado = [];

function mezclarArray(arr) {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function iniciarPuzzle(idx) {
  puzzleIndex = idx % FRASES_PUZZLE.length;
  const actual = FRASES_PUZZLE[puzzleIndex];
  seleccionadasPuzzle = [];
  bancoMezclado = mezclarArray(actual.piezas);

  if (puzzleLevelBadgeEl) {
    puzzleLevelBadgeEl.textContent = `💫 Frase ${puzzleIndex + 1} de ${FRASES_PUZZLE.length}`;
  }
  if (puzzleHintEl) {
    puzzleHintEl.textContent = actual.pista;
  }
  if (puzzleStatusEl) {
    puzzleStatusEl.textContent = "";
  }
  renderPuzzle();
}

function renderPuzzle() {
  if (!puzzleBuiltArea || !puzzleBankArea) return;
  const actual = FRASES_PUZZLE[puzzleIndex];

  puzzleBuiltArea.innerHTML = "";
  if (!seleccionadasPuzzle.length) {
    const ph = document.createElement("span");
    ph.style.color = "rgba(255,255,255,0.65)";
    ph.style.fontSize = "0.84rem";
    ph.textContent = "Toca las piezas de abajo en orden para formar la frase...";
    puzzleBuiltArea.appendChild(ph);
  } else {
    seleccionadasPuzzle.forEach((pieza, pos) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "word-chip";
      chip.textContent = pieza;
      chip.title = "Quitar fragmento";
      chip.addEventListener("click", () => {
        seleccionadasPuzzle.splice(pos, 1);
        if (puzzleStatusEl) puzzleStatusEl.textContent = "";
        renderPuzzle();
      });
      puzzleBuiltArea.appendChild(chip);
    });
  }

  puzzleBankArea.innerHTML = "";
  bancoMezclado.forEach((pieza) => {
    const yaUsada = seleccionadasPuzzle.includes(pieza);
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `word-chip ${yaUsada ? "used" : ""}`;
    chip.textContent = pieza;
    chip.addEventListener("click", (e) => {
      if (yaUsada || seleccionadasPuzzle.length >= actual.piezas.length) return;
      seleccionadasPuzzle.push(pieza);
      renderPuzzle();
      evaluarPuzzle(e);
    });
    puzzleBankArea.appendChild(chip);
  });
}

function evaluarPuzzle(e) {
  const actual = FRASES_PUZZLE[puzzleIndex];
  if (seleccionadasPuzzle.length < actual.piezas.length) return;

  const esOrdenCorrecto = seleccionadasPuzzle.every((p, i) => p === actual.piezas[i]);
  if (esOrdenCorrecto) {
    if (puzzleStatusEl) {
      puzzleStatusEl.style.color = "#86efac";
      puzzleStatusEl.textContent = `💖 ¡Frase ${puzzleIndex + 1} completa! "${actual.piezas.join(" ")}"`;
    }
    if (e && typeof lanzarCorazones === "function") lanzarCorazones(e.clientX, e.clientY, 10);
  } else {
    if (puzzleStatusEl) {
      puzzleStatusEl.style.color = "#fde047";
      puzzleStatusEl.textContent = "✨ Casi queda perfecta: toca un fragmento arriba para moverlo o presiona Limpiar.";
    }
  }
}

if (clearPuzzleBtn) {
  clearPuzzleBtn.addEventListener("click", () => {
    seleccionadasPuzzle = [];
    if (puzzleStatusEl) puzzleStatusEl.textContent = "";
    renderPuzzle();
  });
}

if (nextPuzzleBtn) {
  nextPuzzleBtn.addEventListener("click", () => {
    iniciarPuzzle(puzzleIndex + 1);
  });
}

iniciarPuzzle(0);

// ==========================================
// 8. CÁPSULA DEL TIEMPO & RULETA INTERACTIVA + BAÚL DE ARCHIVOS
// ==========================================
const PLANES_RULETA = [
  "🏍️ Ruta en moto con nuestra playlist favorita",
  "💃 Baile improvisado solo tú y yo",
  "🌅 Atardecer juntos para conversar sin prisa",
  "📸 Sesión de fotos espontáneas para el álbum",
  "🍰 Gustito dulce o cena especial de Día 3",
  "✨ Plan sorpresa elegido por ti, Grinch"
];

const CAPSULA_DESEO_KEY = "universo_capsula_deseo_v1";

function abrirCapsulaYRuleta() {
  const deseoGuardado = localStorage.getItem(CAPSULA_DESEO_KEY) || "";
  const planInicial = PLANES_RULETA[Math.floor(Math.random() * PLANES_RULETA.length)];

  abrirModal(
    "⏳ Cápsula del Tiempo & Ruleta de Planes",
    `
    <div class="secret-note-box" style="padding: 22px; text-align: center;">
      <span class="milestone-tag">💘 RUMBO AL 03 DE DICIEMBRE · 1 AÑO Y 7 MESES</span>
      <h4 style="color: #fff3b0; font-family: 'Cormorant Garamond', serif; font-size: 1.85rem; margin: 10px 0 14px;">
        ¿Qué toca sortear hoy para nosotros?
      </h4>

      <div id="ruleta-resultado-box" style="background: rgba(255, 255, 255, 0.08); border: 1px dashed rgba(255, 243, 176, 0.55); border-radius: 16px; padding: 16px; margin-bottom: 14px;">
        <p id="ruleta-plan-texto" style="font-size: 1.15rem; font-weight: 700; color: #fff3b0; margin: 0;">
          ${planInicial}
        </p>
      </div>

      <button type="button" id="girar-ruleta-btn" class="btn-primary" style="width: auto; margin: 0 auto 20px; padding: 10px 22px;">
        🎲 Girar ruleta de planes
      </button>

      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.14); margin: 16px 0;" />

      <h4 style="color: #fff3b0; font-family: 'Cormorant Garamond', serif; font-size: 1.55rem; margin-bottom: 8px;">
        💌 Tu mensaje secreto en la cápsula
      </h4>
      <p style="font-size: 0.94rem; margin-bottom: 10px;">
        Escribe un deseo, promesa o lo que te haga ilusión para este 3 de diciembre:
      </p>
      <textarea id="capsula-deseo-input" rows="3" placeholder="Escribe aquí tu deseo o mensaje..." style="width: 100%; border-radius: 12px; padding: 10px 12px; background: rgba(15, 7, 25, 0.65); color: #fff; border: 1px solid rgba(255,255,255,0.22); font-family: inherit; resize: vertical;">${deseoGuardado}</textarea>

      <div style="margin-top: 12px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button type="button" id="guardar-capsula-btn" class="btn-secondary">💾 Guardar en la cápsula</button>
      </div>
      <p id="capsula-guardado-msg" style="color: #86efac; font-size: 0.9rem; margin-top: 8px; min-height: 20px;"></p>
    </div>
    `
  );

  const girarBtn = document.getElementById("girar-ruleta-btn");
  const planTexto = document.getElementById("ruleta-plan-texto");
  const guardarBtn = document.getElementById("guardar-capsula-btn");
  const deseoInput = document.getElementById("capsula-deseo-input");
  const guardadoMsg = document.getElementById("capsula-guardado-msg");

  if (girarBtn && planTexto) {
    girarBtn.addEventListener("click", (e) => {
      girarBtn.disabled = true;
      let pasos = 0;
      const maxPasos = 14;
      const intervalo = setInterval(() => {
        pasos++;
        const azar = PLANES_RULETA[Math.floor(Math.random() * PLANES_RULETA.length)];
        planTexto.textContent = azar;
        if (pasos >= maxPasos) {
          clearInterval(intervalo);
          girarBtn.disabled = false;
          lanzarCorazones(e.clientX, e.clientY, 10);
        }
      }, 75);
    });
  }

  if (guardarBtn && deseoInput && guardadoMsg) {
    guardarBtn.addEventListener("click", (e) => {
      const texto = deseoInput.value.trim();
      localStorage.setItem(CAPSULA_DESEO_KEY, texto);
      guardadoMsg.textContent = texto
        ? "¡Guardado en nuestra cápsula del tiempo! 💖"
        : "Cápsula actualizada.";
      lanzarCorazones(e.clientX, e.clientY, 6);
    });
  }
}

document.addEventListener("click", (e) => {
  const capsuleBtn = e.target.closest(".open-capsule-btn");
  const capsuleCard = e.target.closest('.file-card[data-type="capsule"]');
  if (capsuleBtn || capsuleCard) {
    e.preventDefault();
    e.stopPropagation();
    abrirCapsulaYRuleta();
  }
});

const filesGrid = document.getElementById("files-grid");

if (filesGrid) {
  filesGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".open-file-btn");
    if (!btn) return;

    const card = btn.closest(".file-card");
    const type = card.dataset.type;
    const src = card.dataset.src;
    const title = card.dataset.title;

    if (type === "capsule") {
      abrirCapsulaYRuleta();
    } else if (type === "uploaded-pdf") {
      abrirModal(title, `<iframe src="${src}"></iframe>`);
    } else if (type === "video") {
      abrirModal(title, `<video src="${src}" controls autoplay></video>`);
    } else if (type === "image") {
      abrirModal(title, `<img src="${src}" alt="${title}" />`);
    }
  });
}

const fileUpload = document.getElementById("file-upload");
if (fileUpload && filesGrid) {
  fileUpload.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      let type = file.type === "application/pdf" ? "uploaded-pdf" : "pdf";
      let icon = "📄";
      if (file.type.startsWith("video/")) {
        type = "video";
        icon = "🎬";
      } else if (file.type.startsWith("image/")) {
        type = "image";
        icon = "🖼️";
      }

      const card = document.createElement("div");
      card.className = "file-card glass-card";
      card.dataset.type = type;
      card.dataset.src = url;
      card.dataset.title = file.name;
      card.innerHTML = `
        <span class="file-icon">${icon}</span>
        <h4>${file.name}</h4>
        <p>Archivo agregado por ti</p>
        <button type="button" class="btn-secondary open-file-btn">Abrir archivo</button>
      `;
      filesGrid.prepend(card);
    });
  });
}

// ==========================================
// 9. SOBRE Y CARTA INTERACTIVA DINÁMICA
// ==========================================
const envelope = document.getElementById("envelope");
const envelopeWrapper = document.getElementById("envelope-wrapper");
const letterPaper = document.getElementById("letter-paper");
const closeLetterBtn = document.getElementById("close-letter-btn");
const replayLetterBtn = document.getElementById("replay-letter-btn");
const expandLetterBtn = document.getElementById("expand-letter-btn");
const typewriterLetterEl = document.getElementById("typewriter-letter-text");

const TEXTO_CARTA_DINAMICA =
  "Quise hacer algo diferente, un lugar en internet que fuera únicamente nuestro, donde cada rincón guarde un pedacito de lo que somos. " +
  "A veces las palabras habladas se quedan cortas para explicar todo lo que siento cuando estoy contigo, " +
  "cada viaje, cada ruta compartida, cada risa espontánea y cada momento que se vuelve inolvidable.\n\n" +
  "Me encanta cómo logras transformar un día común en algo especial, cómo me escuchas, cómo me cuidas a tu manera " +
  "y cómo incluso cuando nos toca estar separados por kilómetros, sigo sintiendo tu presencia cerca.\n\n" +
  "Gracias por tu paciencia, por acompañarme, por hacerme reír incluso en los días pesados y por caminar a mi lado " +
  "celebrando cada mes como una nueva página de nuestra historia.\n\n" +
  "Me enamora profundamente tu esencia, tu historia y la nobleza con la que enfrentas la vida.\n\n" +
  "Admiro el hombre trabajador, resiliente y dedicado que eres, alguien que lleva consigo el orgullo de sus raíces y el amor inquebrantable por su familia, por tu madre que tanto luchó por sacarlos adelante y por los tuyos que siguen en tu corazón a pesar de la distancia.\n\n" +
  "Y aunque no tenga mucho, siempre trataré de darte mucho de lo poco que tengo 💙.\n\n" +
  "Este es solo el comienzo de todo lo bonito que nos espera.";

let letterTypewriterTimer = null;

function escribirCartaAnimada() {
  if (!typewriterLetterEl) return;
  if (letterTypewriterTimer) clearInterval(letterTypewriterTimer);
  typewriterLetterEl.textContent = "";
  let idx = 0;

  letterTypewriterTimer = setInterval(() => {
    typewriterLetterEl.textContent += TEXTO_CARTA_DINAMICA.charAt(idx);
    idx++;
    if (idx % 24 === 0) {
      const rect = letterPaper?.getBoundingClientRect();
      if (rect) {
        lanzarCorazones(
          rect.left + rect.width * (0.25 + Math.random() * 0.5),
          rect.top + 40,
          2
        );
      }
    }
    if (idx >= TEXTO_CARTA_DINAMICA.length) {
      clearInterval(letterTypewriterTimer);
      letterTypewriterTimer = null;
    }
  }, 10);
}

if (envelope && envelopeWrapper && letterPaper) {
  envelope.addEventListener("click", (e) => {
    lanzarCorazones(e.clientX, e.clientY, 14);
    envelopeWrapper.classList.add("hidden");
    letterPaper.classList.remove("hidden");
    letterPaper.scrollIntoView({ behavior: "smooth", block: "center" });
    escribirCartaAnimada();
  });
}

if (replayLetterBtn) {
  replayLetterBtn.addEventListener("click", (e) => {
    lanzarCorazones(e.clientX, e.clientY, 8);
    escribirCartaAnimada();
  });
}

if (expandLetterBtn) {
  expandLetterBtn.addEventListener("click", () => {
    abrirModal(
      "💌 Carta Completa para ti, Grinch",
      `
      <div class="secret-note-box" style="padding: 24px; font-size: 1.05rem;">
        <h4 style="color: #fff3b0; font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; margin-bottom: 14px;">
          Para ti, mi Grinch, con todo mi corazón:
        </h4>
        <p>${TEXTO_CARTA_DINAMICA.replace(/\n\n/g, "</p><p>")}</p>
        <p style="color: #fff3b0; font-weight: 700; margin-top: 16px;">Con todo mi amor ❤️✨</p>
      </div>
      `
    );
  });
}

if (closeLetterBtn && envelopeWrapper && letterPaper) {
  closeLetterBtn.addEventListener("click", () => {
    if (letterTypewriterTimer) clearInterval(letterTypewriterTimer);
    letterPaper.classList.add("hidden");
    envelopeWrapper.classList.remove("hidden");
  });
}

// ==========================================
// 10. VALES CANJEABLES
// ==========================================
document.querySelectorAll(".btn-coupon").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    if (!this.classList.contains("redeemed")) {
      this.classList.add("redeemed");
      this.textContent = "¡Canjeado! ✅";
      lanzarCorazones(e.clientX, e.clientY, 10);
    }
  });
});

// ==========================================
// 11. CALENDARIO INTERACTIVO DÍA 3 + CORAZÓN DEL 3 DE DICIEMBRE
// ==========================================
const calendarMonthLabel = document.getElementById("calendar-month-label");
const calendarDaysEl = document.getElementById("calendar-days");
const prevMonthBtn = document.getElementById("prev-month-btn");
const nextMonthBtn = document.getElementById("next-month-btn");
const day3StatusText = document.getElementById("day3-status-text");
const selectedDayTitleEl = document.getElementById("selected-day-title");
const selectedDayNoteEl = document.getElementById("selected-day-note");
const saveDayNoteBtn = document.getElementById("save-day-note-btn");

const NOTAS_KEY = "universo_notas_calendario_v1";
let notasCalendario = {};
try {
  notasCalendario = JSON.parse(localStorage.getItem(NOTAS_KEY) || "{}");
} catch {
  notasCalendario = {};
}

let calYear = 2026;
let calMonth = 11;
let selectedDayKey = "2026-12-3";

function actualizarPanelDia(year, month, day, nombreMes) {
  const key = `${year}-${month + 1}-${day}`;
  selectedDayKey = key;

  const esDia3 = day === 3;
  const es3Diciembre = month === 11 && day === 3;

  if (selectedDayTitleEl) {
    selectedDayTitleEl.textContent = es3Diciembre
      ? `💘 ${day} de ${nombreMes} · ¡1 Año y 7 Meses Juntos!`
      : esDia3
      ? `❤️ ${day} de ${nombreMes} · Nuestro Día 3`
      : `✨ ${day} de ${nombreMes}`;
  }

  if (selectedDayNoteEl) {
    if (notasCalendario[key]) {
      selectedDayNoteEl.textContent = notasCalendario[key];
    } else if (es3Diciembre) {
      selectedDayNoteEl.textContent =
        "Día remarcado con corazoncito: cumplimos 1 año y 7 meses desde el 03 de mayo de 2025. ¡Un capítulo inolvidable!";
    } else if (esDia3) {
      selectedDayNoteEl.textContent =
        "Cada día 3 celebramos un mes más de nuestra historia y de todo lo bonito que construimos juntos.";
    } else {
      selectedDayNoteEl.textContent =
        "Aún no hay nota guardada en este día. Puedes escribir un recuerdo o mensaje especial.";
    }
  }
}

function renderCalendarioDia3() {
  if (!calendarDaysEl || !calendarMonthLabel) return;

  const fechaVista = new Date(calYear, calMonth, 1);
  const nombreMes = fechaVista.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric"
  });
  calendarMonthLabel.textContent = nombreMes;

  const primerDiaSemana = (fechaVista.getDay() + 6) % 7;
  const totalDiasMes = new Date(calYear, calMonth + 1, 0).getDate();

  const hoy = new Date();
  const esMesActual = hoy.getFullYear() === calYear && hoy.getMonth() === calMonth;

  calendarDaysEl.innerHTML = "";

  for (let i = 0; i < primerDiaSemana; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "cal-day empty";
    calendarDaysEl.appendChild(emptyDiv);
  }

  for (let dia = 1; dia <= totalDiasMes; dia++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "cal-day";
    dayDiv.textContent = dia;

    const key = `${calYear}-${calMonth + 1}-${dia}`;
    const es3Diciembre = calMonth === 11 && dia === 3;

    if (dia === 3) {
      dayDiv.classList.add("special-day3");
      dayDiv.title = `Nuestro Día 3 (${dia} de ${nombreMes})`;
    }

    if (es3Diciembre) {
      dayDiv.classList.add("dec3-heart-marked");
      dayDiv.title = "💘 3 de diciembre: ¡Corazoncito especial por 1 año y 7 meses!";
    }

    if (notasCalendario[key]) {
      dayDiv.classList.add("has-note-dot");
    }

    if (key === selectedDayKey) {
      dayDiv.classList.add("selected-day");
    }

    if (esMesActual && hoy.getDate() === dia) {
      dayDiv.classList.add("today-ring");
    }

    dayDiv.addEventListener("click", (e) => {
      selectedDayKey = key;
      if (es3Diciembre) {
        lanzarCorazones(e.clientX, e.clientY, 10);
      } else if (dia === 3) {
        lanzarCorazones(e.clientX, e.clientY, 6);
      }
      renderCalendarioDia3();
      actualizarPanelDia(calYear, calMonth, dia, nombreMes);
    });

    calendarDaysEl.appendChild(dayDiv);
  }

  const partesSeleccion = selectedDayKey.split("-");
  const selDia = Number(partesSeleccion[2] || 3);
  actualizarPanelDia(calYear, calMonth, selDia, nombreMes);

  if (day3StatusText) {
    day3StatusText.textContent =
      calMonth === 11
        ? "💘 El 3 de diciembre brilla con corazoncito remarcado por 1 año y 7 meses."
        : `Marcado en rosa: el 3 de ${nombreMes} es nuestro día especial.`;
  }
}

if (saveDayNoteBtn) {
  saveDayNoteBtn.addEventListener("click", () => {
    const actual = notasCalendario[selectedDayKey] || "";
    const nuevaNota = prompt(`Escribe una nota para la fecha (${selectedDayKey}):`, actual);
    if (nuevaNota === null) return;
    if (nuevaNota.trim() === "") {
      delete notasCalendario[selectedDayKey];
    } else {
      notasCalendario[selectedDayKey] = nuevaNota.trim();
    }
    localStorage.setItem(NOTAS_KEY, JSON.stringify(notasCalendario));
    renderCalendarioDia3();
  });
}

if (prevMonthBtn) {
  prevMonthBtn.addEventListener("click", () => {
    calMonth--;
    if (calMonth < 0) {
      calMonth = 11;
      calYear--;
    }
    selectedDayKey = `${calYear}-${calMonth + 1}-3`;
    renderCalendarioDia3();
  });
}

if (nextMonthBtn) {
  nextMonthBtn.addEventListener("click", () => {
    calMonth++;
    if (calMonth > 11) {
      calMonth = 0;
      calYear++;
    }
    selectedDayKey = `${calYear}-${calMonth + 1}-3`;
    renderCalendarioDia3();
  });
}

renderCalendarioDia3();

// ==========================================
// 12. GALAXIA DE AMOR Y DISTANCIA ENTRE DIRECCIONES
// ==========================================
const PUNTO_COMAS = { lat: -11.9365, lon: -77.0585 };
const PUNTO_SJM = { lat: -12.1555, lon: -76.9825 };

function calcularDistanciaKm(p1, p2) {
  const R = 6371;
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLon = ((p2.lon - p1.lon) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

const distanceKmEl = document.getElementById("distance-km");
if (distanceKmEl) {
  distanceKmEl.textContent = `${calcularDistanciaKm(PUNTO_COMAS, PUNTO_SJM)} km`;
}

const galaxyCanvas = document.getElementById("galaxy-canvas");
if (galaxyCanvas) {
  const gCtx = galaxyCanvas.getContext("2d");
  let stars = [];

  function resizeGalaxy() {
    const parent = galaxyCanvas.parentElement;
    if (!parent) return;
    galaxyCanvas.width = parent.clientWidth;
    galaxyCanvas.height = parent.clientHeight;
  }
  window.addEventListener("resize", resizeGalaxy);
  resizeGalaxy();

  const galaxyColors = ["#ffffff", "#ff758f", "#fff3b0", "#e056fd", "#ff2a7a"];
  for (let i = 0; i < 120; i++) {
    stars.push({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * Math.max(galaxyCanvas.width, galaxyCanvas.height) * 0.45 + 20,
      speed: (Math.random() * 0.002 + 0.0008) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 2.4 + 0.8,
      color: galaxyColors[Math.floor(Math.random() * galaxyColors.length)]
    });
  }

  function animateGalaxy() {
    gCtx.fillStyle = "rgba(12, 4, 20, 0.25)";
    gCtx.fillRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);

    const cx = galaxyCanvas.width / 2;
    const cy = galaxyCanvas.height / 2;

    stars.forEach((s) => {
      s.angle += s.speed;
      const x = cx + Math.cos(s.angle) * s.radius;
      const y = cy + Math.sin(s.angle) * (s.radius * 0.65);

      gCtx.beginPath();
      gCtx.arc(x, y, s.size, 0, Math.PI * 2);
      gCtx.fillStyle = s.color;
      gCtx.fill();
    });

    requestAnimationFrame(animateGalaxy);
  }
  animateGalaxy();
}

// ==========================================
// 13. FONDO ROMÁNTICO DE CORAZONES Y DESTELLOS
// ==========================================
const canvas = document.getElementById("stars-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const simbolos = ["❤", "✨", "💖", "✦"];

  for (let i = 0; i < 65; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 14 + 8,
      speedY: Math.random() * 0.7 + 0.25,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.55 + 0.25,
      symbol: simbolos[Math.floor(Math.random() * simbolos.length)]
    });
  }

  function animateRomanticBg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px Arial`;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(p.symbol, p.x, p.y);

      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < -20) {
        p.y = canvas.height + 20;
        p.x = Math.random() * canvas.width;
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animateRomanticBg);
  }
  animateRomanticBg();
}

// ==========================================
// 14. CORAZÓN DE PARTÍCULAS ASCENDENTES + FRASES SEPARADAS EN ÓRBITA
// ==========================================
const vortexCanvas = document.getElementById("vortex-canvas");
const vortexBox = document.getElementById("vortex-box");
const vortexWordsEl = document.getElementById("vortex-floating-words");
const toggleVortexPulseBtn = document.getElementById("toggle-vortex-pulse-btn");
const addVortexPhraseBtn = document.getElementById("add-vortex-phrase-btn");

let initVortexScene = null;

function redistribuirAngulosFrases() {
  if (!vortexWordsEl) return;
  const phrases = Array.from(vortexWordsEl.querySelectorAll(".orbit-phrase"));
  if (!phrases.length) return;
  const step = (Math.PI * 2) / phrases.length;
  phrases.forEach((el, idx) => {
    el.dataset.angle = String(idx * step);
    el.dataset.rx = String(0.39 + (idx % 2) * 0.035);
    el.dataset.ry = String(0.33 + (idx % 2) * 0.045);
  });
}

if (vortexCanvas && vortexBox) {
  const vCtx = vortexCanvas.getContext("2d");
  let vortexBoost = 1;
  let vortexTime = 0;

  let bgStars = [];
  let risingParticles = [];
  let heartTargets = [];

  function calcularPuntoCorazon3D(t, escala, zDepth) {
    const hx = 16 * Math.pow(Math.sin(t), 3) * escala;
    const hy =
      -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      ) * escala;
    const perspective = 1 + zDepth * 0.28;
    return {
      x: hx * perspective,
      y: hy * perspective,
      depth: zDepth
    };
  }

  initVortexScene = function () {
    const w = Math.max(320, vortexBox.clientWidth || 820);
    const h = Math.max(450, vortexBox.clientHeight || 540);
    vortexCanvas.width = w;
    vortexCanvas.height = h;

    const cx = w / 2;
    const heartCy = h * 0.39;
    const baseY = h * 0.86;
    const heartScale = Math.min(w, h) * 0.0068;

    bgStars = [];
    for (let i = 0; i < 140; i++) {
      bgStars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.35,
        alpha: Math.random() * 0.7 + 0.15
      });
    }

    heartTargets = [];
    const totalTargets = 920;
    const palette = ["#e0f7ff", "#7dd3fc", "#38bdf8", "#60a5fa", "#818cf8", "#c084fc", "#ffffff"];

    for (let i = 0; i < totalTargets; i++) {
      const t = Math.random() * Math.PI * 2;
      const isContour = i % 3 === 0;
      const shell = isContour ? 0.96 + Math.random() * 0.06 : 0.35 + Math.random() * 0.62;
      const zDepth = (Math.random() - 0.5) * 2;
      const pt = calcularPuntoCorazon3D(t, heartScale * shell, zDepth);
      heartTargets.push({
        tx: cx + pt.x,
        ty: heartCy + pt.y,
        color: palette[Math.floor(Math.random() * palette.length)],
        size: isContour ? Math.random() * 1.8 + 0.9 : Math.random() * 1.4 + 0.65
      });
    }

    risingParticles = [];
    const totalRising = 820;
    for (let i = 0; i < totalRising; i++) {
      const target = heartTargets[i % heartTargets.length];
      const spawnX = cx + (Math.random() - 0.5) * (w * 0.68);
      const spawnY = baseY + (Math.random() - 0.5) * 28;
      risingParticles.push({
        x: spawnX,
        y: spawnY,
        startX: spawnX,
        startY: spawnY,
        tx: target.tx,
        ty: target.ty,
        progress: Math.random(),
        speed: 0.0042 + Math.random() * 0.0068,
        swirlPhase: Math.random() * Math.PI * 2,
        size: target.size,
        color: target.color
      });
    }

    redistribuirAngulosFrases();
  };

  window.addEventListener("resize", initVortexScene);
  initVortexScene();

  if (toggleVortexPulseBtn) {
    toggleVortexPulseBtn.addEventListener("click", (e) => {
      vortexBoost = vortexBoost > 1.2 ? 1 : 2.15;
      lanzarCorazones(e.clientX, e.clientY, 8);
    });
  }

  if (addVortexPhraseBtn && vortexWordsEl) {
    addVortexPhraseBtn.addEventListener("click", () => {
      const nuevaFrase = prompt("Escribe una frase corta para que gire en el universo:");
      if (!nuevaFrase || !nuevaFrase.trim()) return;

      const span = document.createElement("span");
      span.className = "orbit-phrase";
      span.dataset.speed = String(0.0034 + Math.random() * 0.0005);
      span.textContent = nuevaFrase.trim();
      vortexWordsEl.appendChild(span);
      redistribuirAngulosFrases();
    });
  }

  function actualizarFrasesEnOrbita(w, h) {
    if (!vortexWordsEl) return;
    const phrases = vortexWordsEl.querySelectorAll(".orbit-phrase");
    const centerYRatio = 0.42;
    phrases.forEach((el) => {
      let angle = Number(el.dataset.angle || 0);
      const rx = Number(el.dataset.rx || 0.41);
      const ry = Number(el.dataset.ry || 0.35);
      const speed = Number(el.dataset.speed || 0.0035);

      angle += speed * vortexBoost;
      el.dataset.angle = String(angle);

      const x = Math.cos(angle) * w * rx;
      const y = (h * (centerYRatio - 0.5)) + Math.sin(angle) * h * ry;
      const depthScale = 0.94 + ((Math.sin(angle) + 1) / 2) * 0.1;
      const depthOpacity = 0.9 + ((Math.sin(angle) + 1) / 2) * 0.1;

      el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${depthScale.toFixed(3)})`;
      el.style.opacity = depthOpacity.toFixed(2);
    });
  }

  function renderVortex() {
    vortexTime += 0.03 * vortexBoost;
    const w = vortexCanvas.width;
    const h = vortexCanvas.height;
    const cx = w / 2;
    const baseY = h * 0.86;
    const heartCenterY = h * 0.39;

    vCtx.fillStyle = "rgba(3, 7, 18, 0.28)";
    vCtx.fillRect(0, 0, w, h);

    bgStars.forEach((st) => {
      vCtx.globalAlpha = st.alpha;
      vCtx.beginPath();
      vCtx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      vCtx.fillStyle = "#bae6fd";
      vCtx.fill();
    });
    vCtx.globalAlpha = 1;

    const baseGlow = vCtx.createRadialGradient(cx, baseY, 8, cx, baseY, w * 0.38);
    baseGlow.addColorStop(0, "rgba(224, 242, 254, 0.82)");
    baseGlow.addColorStop(0.32, "rgba(56, 189, 248, 0.28)");
    baseGlow.addColorStop(1, "rgba(3, 7, 18, 0)");
    vCtx.fillStyle = baseGlow;
    vCtx.beginPath();
    vCtx.ellipse(cx, baseY, w * 0.36, 26, 0, 0, Math.PI * 2);
    vCtx.fill();

    const heartGlow = vCtx.createRadialGradient(cx, heartCenterY, 8, cx, heartCenterY, Math.min(w, h) * 0.28);
    heartGlow.addColorStop(0, "rgba(56, 189, 248, 0.25)");
    heartGlow.addColorStop(0.55, "rgba(129, 140, 248, 0.09)");
    heartGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    vCtx.fillStyle = heartGlow;
    vCtx.beginPath();
    vCtx.arc(cx, heartCenterY, Math.min(w, h) * 0.28, 0, Math.PI * 2);
    vCtx.fill();

    const beat = 1 + Math.sin(vortexTime * 2.1) * 0.035;
    const swayX = Math.sin(vortexTime * 0.8) * 6;

    risingParticles.forEach((p) => {
      p.progress += p.speed * vortexBoost;
      if (p.progress >= 1) {
        p.progress = 0;
        p.startX = cx + (Math.random() - 0.5) * (w * 0.68);
        p.startY = baseY + (Math.random() - 0.5) * 24;
      }

      const ease = 1 - Math.pow(1 - p.progress, 2.25);
      const goalX = cx + swayX + (p.tx - cx) * beat;
      const goalY = heartCenterY + (p.ty - heartCenterY) * beat;

      const swirlAmp = (1 - p.progress) * 16;
      const swirlX = Math.cos(vortexTime * 3.1 + p.swirlPhase) * swirlAmp;

      const curX = p.startX + (goalX - p.startX) * ease + swirlX;
      const curY = p.startY + (goalY - p.startY) * ease;

      vCtx.beginPath();
      vCtx.arc(curX, curY, p.size, 0, Math.PI * 2);
      vCtx.fillStyle = p.color;
      vCtx.fill();
    });

    for (let i = 0; i < 55; i++) {
      const bx = cx + Math.sin(vortexTime * 1.4 + i * 1.7) * (w * 0.32);
      const by = baseY + Math.cos(vortexTime * 2.2 + i) * 7;
      vCtx.beginPath();
      vCtx.arc(bx, by, 1.35, 0, Math.PI * 2);
      vCtx.fillStyle = "#e0f2fe";
      vCtx.fill();
    }

    actualizarFrasesEnOrbita(w, h);

    requestAnimationFrame(renderVortex);
  }

  renderVortex();
}