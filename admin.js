const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxAQIi25t1ea_glXaF4HMVEkBTDdfao62jayjSWvFCav1K062Wp-oVoSfuwD_eu2zIk/exec";

let reservas = [];

document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("admin") === "ok") {
    login.style.display = "none";
    painel.style.display = "block";
    carregarTudo();
  }
});

async function loginAdmin() {
  const res = await fetch(SCRIPT_URL + "?action=getConfig");
  const cfg = await res.json();

  if (password.value === cfg.admin.password) {
    sessionStorage.setItem("admin", "ok");
    login.style.display = "none";
    painel.style.display = "block";
    carregarTudo();
  } else {
    alert("Password incorreta");
  }
}

async function carregarTudo() {
  await carregarLotacao();
  await carregarReservas();
}

/* ===== LOTAÇÃO ===== */

async function carregarLotacao() {
  const res = await fetch(SCRIPT_URL + "?action=getLotacao");
  const l = await res.json();

  lotacao.innerHTML = `
    <div class="card">
      <strong>Lotação Hoje</strong><br><br>
      🍽 Almoço: ${l.almoco} / ${l.total}
      <br>🌙 Jantar: ${l.jantar} / ${l.total}
    </div>
  `;
}

/* ===== RESERVAS ===== */

async function carregarReservas() {
  const res = await fetch(SCRIPT_URL + "?action=getReservas");
  reservas = await res.json();
  renderReservas();
}

function renderReservas() {
  listaReservas.innerHTML = "";

  reservas.forEach((r, i) => {
    listaReservas.innerHTML += `
      <div class="card">
        <div>
          <strong>${r.pessoas} ${r.nome}</strong><br>
          ${r.data} · ${r.hora} · ${r.refeicao}
        </div>
        <button onclick="cancelar(${i})">❌</button>
      </div>
    `;
  });
}

async function cancelar(i) {
  if (!confirm("Cancelar reserva?")) return;

  await fetch(SCRIPT_URL + "?action=cancelarReserva", {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(i)
  });

  carregarTudo();
}
