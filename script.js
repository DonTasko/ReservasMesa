const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyLVll7EUtcWYKCEnxaFSXWAlr4jmx6lBWyMmGI0BhFQ2pRRw5y8Q1DqGUm0V-TFTioTg/exec";

/* =========================
   VARIÁVEIS
========================= */
let funcionamento = {};

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 Sistema iniciado");

  await carregarFuncionamento();

  document.getElementById("data").addEventListener("change", validarDia);
  document.getElementById("refeicao").addEventListener("change", carregarHoras);

  const form = document.getElementById("form");
  if (!form) {
    console.error("❌ FORM NÃO ENCONTRADO");
    return;
  }

  form.addEventListener("submit", enviarReserva);
});

/* =========================
   FUNCIONAMENTO
========================= */
async function carregarFuncionamento() {
  const url = `${SCRIPT_URL}?action=getFuncionamento`;
  console.log("📡 GET FUNCIONAMENTO:", url);

  const res = await fetch(url);
  const dados = await res.json();

  console.log("📥 FUNCIONAMENTO:", dados);
  funcionamento = dados;
}


/* =========================
   VALIDAR DIA
========================= */
function validarDia() {
  const dataInput = document.getElementById("data");
  const data = dataInput.value;
  if (!data) return;

  const dia = new Date(data + "T00:00:00").getDay();

  if (!funcionamento[dia]?.aberto) {
    alert("❌ Restaurante encerrado neste dia.");
    dataInput.value = "";
    limparHoras();
    return;
  }

  carregarHoras();
}

/* =========================
   HORAS
========================= */
async function carregarHoras() {
  const data = document.getElementById("data").value;
  const refeicao = document.getElementById("refeicao").value;
  const horaSelect = document.getElementById("hora");

  horaSelect.innerHTML = "";

  if (!data || !refeicao) return;

  try {
    const url = `${SCRIPT_URL}?action=getHoras&data=${data}&refeicao=${refeicao}`;
    console.log("⏱ GET HORAS:", url);

    const res = await fetch(url);
    const horas = await res.json();

    console.log("🕐 HORAS RECEBIDAS:", horas);

    if (!horas.length) {
      const opt = document.createElement("option");
      opt.textContent = "Sem disponibilidade";
      opt.disabled = true;
      opt.selected = true;
      horaSelect.appendChild(opt);
      return;
    }

    horas.forEach(h => {
      const o = document.createElement("option");
      o.value = h;
      o.textContent = h;
      horaSelect.appendChild(o);
    });

  } catch (e) {
    console.error("❌ Erro horários:", e);
    alert("Erro ao carregar horários");
  }
}

function limparHoras() {
  document.getElementById("hora").innerHTML = "";
}

/* =========================
   ENVIAR RESERVA
========================= */
async function enviarReserva(e) {
  e.preventDefault();

  const params = new URLSearchParams({
    action: "novaReserva",
    nome: nome.value,
    telefone: telefone.value,
    data: data.value,
    refeicao: refeicao.value,
    hora: hora.value,
    pessoas: pessoas.value
  });

  const url = `${SCRIPT_URL}?${params.toString()}`;
  console.log("📡 ENVIAR:", url);

  const res = await fetch(url, { method: "POST" });
  const json = await res.json();

  console.log("📥 RESPOSTA:", json);

  if (json.ok) {
    alert("✅ Reserva confirmada!");
  } else {
    alert(json.erro || "Erro ao enviar reserva");
  }
}
