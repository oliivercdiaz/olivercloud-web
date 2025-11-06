// wireguard.js — HUD version
const API_BASE = "https://olivercloud.es/api/wg"; // tu API real por Cloudflare Tunnel

async function updateWG() {
  const statusEl = document.getElementById("wg-status");
  const peersEl = document.getElementById("peers");
  if (!statusEl) return;

  statusEl.textContent = "🔄 Actualizando...";
  peersEl.innerHTML = "";

  try {
    // 1️⃣ Comprobamos si el contenedor WireGuard está activo
    const res = await fetch(`${API_BASE}/status`, {
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) throw new Error("Error al conectar con API");
    const data = await res.json();

    if (data.running) {
      statusEl.innerHTML = '<span style="color:#00ff9d;">🟢 Activo</span>';
    } else {
      statusEl.innerHTML = '<span style="color:#ff6060;">🔴 Inactivo</span>';
    }

    // 2️⃣ Obtenemos los peers
    const peersRes = await fetch(`${API_BASE}/peers`, {
      headers: { "Accept": "application/json" },
    });
    if (!peersRes.ok) throw new Error("No se pudieron cargar los peers");
    const peers = await peersRes.json();

    if (peers.length === 0) {
      peersEl.innerHTML = "<p style='color:#888'>Sin peers activos</p>";
    } else {
      peers.forEach(peer => {
        const lastSeen = peer.latestHandshake
          ? `⏱ Hace ${peer.latestHandshake}`
          : "Sin conexión";
        const color = peer.connected ? "#00ff9d" : "#ff6060";
        const html = `
          <div style="margin-top:8px; border:1px solid #00fff233; border-radius:8px; padding:6px;">
            <b style="color:${color}">${peer.name || peer.publicKey.slice(0, 6)}...</b><br>
            <span style="color:#aaa">${lastSeen}</span>
          </div>
        `;
        peersEl.innerHTML += html;
      });
    }
  } catch (err) {
    console.error(err);
    statusEl.innerHTML = '<span style="color:#ff6060;">Error de conexión</span>';
    peersEl.innerHTML = "<p style='color:#888'>No se pudo contactar con la API.</p>";
  }
}

// Actualización automática cada 15s
setInterval(updateWG, 15000);

// Cargar al abrir la página
window.addEventListener("DOMContentLoaded", updateWG);
