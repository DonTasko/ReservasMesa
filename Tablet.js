const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxAQIi25t1ea_glXaF4HMVEkBTDdfao62jayjSWvFCav1K062Wp-oVoSfuwD_eu2zIk/exec";

async function carregar() {
  const res = await fetch(SCRIPT_URL + "?action=getReservas");
  const reservas = await res.json();

  const hoje = new Date().toISOString().slice(0, 10);

  almoco.innerHTML = "";
  jantar.innerHTML = "";

  reservas
    .filter(r => r.data === hoje)
    .forEach((r, i) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="card-info">
          <strong>${r.pessoas} ${r.nome}</strong>
          <span>${r.hora} · Mesas ${r.mesas?.join(", ") || ""}</span>
          <div style="margin-top:10px; display:flex; gap:10px;">
            <button onclick="estado(${i}, 'chegou')">Chegou</button>
            <button onclick="estado(${i}, 'faltou')">Faltou</button>
          </div>
        </div>
        <div class="card-icon">
          ${r.origem === "cliente" ? "🍽" : "✍️"}
        </div>
      `;

      (r.refeicao === "almoco" ? almoco : jantar).appendChild(card);
    });
}

async function estado(index, estado) {
  await fetch(SCRIPT_URL + "?action=estadoReserva", {
    method: "POST",
    body: JSON.stringify({ index, estado })
  });
  carregar();
}

carregar();
setInterval(carregar, 30000);
