const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxAQIi25t1ea_glXaF4HMVEkBTDdfao62jayjSWvFCav1K062Wp-oVoSfuwD_eu2zIk/exec";

let reservas = [];
let config = {};

document.addEventListener("DOMContentLoaded", () => {
  const loginDiv = document.getElementById("login");
  const painelDiv = document.getElementById("painel");
  const passwordInput = document.getElementById("password");

  // Login automático se já existir sessão
  if (sessionStorage.getItem("admin") === "ok") {
    loginDiv.style.display = "none";
    painelDiv.style.display = "block";
    carregarReservas();
  }

  // LOGIN
  window.login = async function () {
    try {
      const res = await fetch(SCRIPT_URL + "?action=getConfig");
      config = await res.json();

      if (passwordInput.value === config.admin.password) {
        sessionStorage.setItem("admin", "ok");
        loginDiv.style.display = "none";
        painelDiv.style.display = "block";
        carregarReservas();
      } else {
        alert("Password incorreta");
      }
    } catch (e) {
      alert("Erro ao ligar ao servidor");
    }
  };

  // RESERVA MANUAL
  document
    .getElementById("manualForm")
    .addEventListener("submit", async e => {
      e.preventDefault();

      const reserva = {
        nome: m_nome.value,
        telefone: m_telefone.value,
        email: "",
        data: m_data.value,
        refeicao: m_refeicao.value,
        hora: m_hora.value,
        pessoas: parseInt(m_pessoas.value),
        observacoes: "",
        origem: "manual",
        mesas: []
      };

      await fetch(SCRIPT_URL + "?action=novaReserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva)
      });

      carregarReservas();
      e.target.reset();
    });
});

/* =========================
   RESERVAS
========================= */

async function carregarReservas() {
  const res = await fetch(SCRIPT_URL + "?action=getReservas");
  reservas = await res.json();
  renderReservas();
}

function renderReservas() {
  const div = document.getElementById("listaReservas");
  div.innerHTML = "";

  reservas.forEach((r, i) => {
    div.innerHTML += `
      <div class="card">
        <div class="card-info">
          <strong>${r.pessoas} ${r.nome}</strong>
          <span>
            ${r.data} · ${r.hora} · ${r.refeicao}<br>
            Mesas: ${r.mesas && r.mesas.length ? r.mesas.join(", ") : "-"}
          </span>
        </div>

        <div class="card-icon">
          ${r.origem === "cliente" ? "🍽" : "✍️"}
        </div>

        <button onclick="cancelar(${i})">❌ Cancelar</button>
      </div>
    `;
  });
}

async function cancelar(index) {
  if (!confirm("Cancelar esta reserva?")) return;

  await fetch(SCRIPT_URL + "?action=cancelarReserva", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(index)
  });

  carregarReservas();
}
