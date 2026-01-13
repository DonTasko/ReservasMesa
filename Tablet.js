const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxAQIi25t1ea_glXaF4HMVEkBTDdfao62jayjSWvFCav1K062Wp-oVoSfuwD_eu2zIk/exec";

document.addEventListener("DOMContentLoaded", carregar);

async function carregar() {
  const res = await fetch(SCRIPT_URL + "?action=getReservasHoje");
  const reservas = await res.json();

  const div = document.getElementById("lista");
  div.innerHTML = "";

  reservas.forEach((r, i) => {
    div.innerHTML += `
      <div class="card">
        <strong>${r.hora} – ${r.pessoas} ${r.nome}</strong><br>
        Mesas: ${r.mesas.join(", ")}<br><br>

        <button onclick="estado(${i}, 'chegou')">✅ Chegou</button>
        <button onclick="estado(${i}, 'faltou')">❌ Faltou</button>
      </div>
    `;
  });
}

async function estado(i, estado) {
  await fetch(SCRIPT_URL + "?action=estadoReserva", {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({ index: i, estado })
  });
  carregar();
}
