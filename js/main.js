// =============================
// Oliver Cloud Systems - main.js
// =============================

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  loadSection("wireguard"); // carga inicial
});

// =============================
// 🌐 Navegación entre secciones
// =============================

function initNavbar() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      loadSection(target);

      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

// =============================
// 🔄 Cargar sección dinámica
// =============================

function loadSection(section) {
  const content = document.getElementById("content");
  content.classList.add("fade-out");

  setTimeout(() => {
    if (section === "wireguard") {
      renderWireGuard();
    } else if (section === "bots") {
      renderBots();
    } else if (section === "sistema") {
      renderSistema();
    }
    content.classList.remove("fade-out");
  }, 300);
}

// =============================
// 🟢 WireGuard Monitor
// =============================

function renderWireGuard() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="panel">
      <h2 class="neon">WireGuard Monitor</h2>
      <div id="wg-content" class="wg-box">
        <p><span class="dot yellow"></span> Cargando...</p>
      </div>
    </div>
  `;

  fetch("https://api.olivercloud.es/api/wg/status")
    .then(r => r.json())
    .then(data => {
      const box = document.getElementById("wg-content");

      const isRunning = data.status === "ok" && data.running === true;
      if (isRunning) {
        const activePeers = data.peers_active || 0;
        const totalPeers = data.peers_total || 0;
        const rx = data.rx || "0 B";
        const tx = data.tx || "0 B";
        const handshake = data.last_handshake || "never";

        let peersHTML = "";
        if (data.peers && data.peers.length > 0) {
          peersHTML = `
            <hr>
            ${data.peers
              .map(
                p => `
              <div class="peer">
                <p><strong>${p.public_key.substring(0, 10)}...</strong></p>
                <p>IP: ${p.allowed_ips}</p>
                <p>Endpoint: ${p.endpoint || "N/A"}</p>
                <p>Handshake: ${p.last_handshake}</p>
                <p>RX/TX: ${p.rx} / ${p.tx}</p>
              </div>
            `
              )
              .join("")}
          `;
        }

        box.innerHTML = `
          <p><span class="dot green"></span> Activo</p>
          <p>Último handshake: ${handshake}</p>
          <p>Tráfico RX: ${rx} / TX: ${tx}</p>
          <p>Peers activos: ${activePeers}/${totalPeers}</p>
          ${peersHTML}
        `;
      } else {
        box.innerHTML = `
          <p><span class="dot red"></span> Inactivo</p>
          <p>No se ha detectado actividad de WireGuard.</p>
        `;
      }
    })
    .catch(err => {
      console.error("Error al obtener estado de WireGuard:", err);
      const box = document.getElementById("wg-content");
      box.innerHTML = `
        <p><span class="dot red"></span> Error</p>
        <p>No se pudo conectar al servidor.</p>
      `;
    });
}

// =============================
// 🤖 Bots
// =============================

function renderBots() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="panel">
      <h2 class="neon">Telegram Bots</h2>
      <p>📡 Próximamente: estadísticas y control remoto de bots activos.</p>
    </div>
  `;
}

// =============================
// 🖥️ Sistema
// =============================

function renderSistema() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="panel">
      <h2 class="neon">Estado del Sistema</h2>
      <p>🧠 Monitorizando CPU, RAM y Disco...</p>
    </div>
  `;
}

// =============================
// ✨ Animaciones suaves
// =============================

const style = document.createElement("style");
style.textContent = `
  .fade-out {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .panel {
    background: #0d1018;
    padding: 1.5em;
    border-radius: 1em;
    box-shadow: 0 0 20px #00fff233;
    color: #e5e7eb;
    width: 70%;
    margin: 2em auto;
    text-align: left;
  }
  .neon {
    color: #2dd4bf;
    text-shadow: 0 0 10px #00fff2;
    margin-bottom: 1em;
  }
  .dot {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    display: inline-block;
  }
  .dot.green { background: #00ff80; box-shadow: 0 0 8px #00ff80; }
  .dot.red { background: #ff0040; box-shadow: 0 0 8px #ff0040; }
  .dot.yellow { background: #ffcc00; box-shadow: 0 0 8px #ffcc00; }
  hr {
    border: none;
    border-top: 1px solid #2dd4bf33;
    margin: 1em 0;
  }
  .peer {
    background: rgba(255,255,255,0.03);
    padding: 0.8em;
    border-radius: 0.5em;
    margin-bottom: 0.5em;
  }
`;
document.head.appendChild(style);

// ===============================
// SISTEMA MONITOR (Oliver Cloud)
// ===============================
async function loadSystemStatus() {
  const url = "https://api.olivercloud.es/api/system/status";
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "ok") throw new Error("API error");

    document.getElementById("cpu").textContent = `${data.cpu}%`;
    document.getElementById("ram").textContent = `${data.ram_used} / ${data.ram_total}`;
    document.getElementById("disk").textContent = `${data.disk_used} / ${data.disk_total}`;
    document.getElementById("temp").textContent = `${data.temp} °C`;
    document.getElementById("uptime").textContent = data.uptime;
  } catch (err) {
    console.error("Error sistema:", err);
  }
}

// Refresco cada 10s
setInterval(loadSystemStatus, 10000);
window.addEventListener("DOMContentLoaded", loadSystemStatus);
