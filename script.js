const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxAQIi25t1ea_glXaF4HMVEkBTDdfao62jayjSWvFCav1K062Wp-oVoSfuwD_eu2zIk/exec";

let funcionamento = {};

document.addEventListener("DOMContentLoaded", async () => {
  await carregarFuncionamento();

  document.getElementById("data").addEventListener("change", validarData);
  document.getElementById("refeicao").addEventListener("change", atualizarHoras);
  document.getElementById("form").addEventListener("submit", enviarReserva);
});

/* =========================
   FUNCIONAMENTO
========================= */
async function carregarFuncionamento() {
  const res = await fetch(SCRIPT_URL + "?action=getFuncionamento");
  funcionamento = await res.json();
}

/* =========================
   DATA
========================= */
function diaSemana(data) {
  const dias = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado"
  ];

  return dias[new Date(data + "T00:00:00").getDay()];
}


function validarData() {
  const dataInput = document.getElementById("data");
  const data = dataInput.value;
  const horaSelect = document.getElementById("hora");

  horaSelect.innerHTML = "";

  if (!data) return;

  const dia = diaSemana(data);

  if (!funcionamento[dia]?.aberto) {

    alert("O restaurante encontra-se encerrado neste dia.");
    dataInput.value = "";
    return;
  }

  atualizarHoras();
}

/* =========================
   HORAS DISPONÍVEIS
========================= */
async function atualizarHoras() {
  hora.innerHTML = "";

  const dataEscolhida = document.getElementById("data").value;
  const refeicaoEscolhida = refeicao.value;

  if (!dataEscolhida || !refeicaoEscolhida) {
    hora.innerHTML = `<option>Escolhe a data</option>`;
    return;
  }

  try {
    const res = await fetch(
      `${SCRIPT_URL}?action=getHoras&data=${dataEscolhida}&refeicao=${refeicaoEscolhida}`
    );

    const horas = await res.json();

    if (!horas.length) {
      hora.innerHTML = `<option>Sem disponibilidade</option>`;
      return;
    }

    horas.forEach(h => {
      const o = document.createElement("option");
      o.value = h;
      o.textContent = h;
      hora.appendChild(o);
    });

  } catch (err) {
    console.error(err);
    hora.innerHTML = `<option>Erro ao carregar horários</option>`;
  }
}
/* =========================
   ENVIAR RESERVA
========================= */
async function enviarReserva(e) {
  e.preventDefault();

  const reserva = {
    nome: nome.value.trim(),
    telefone: telefone.value.trim(),
    data: data.value,
    refeicao: refeicao.value,
    hora: hora.value,
    pessoas: parseInt(pessoas.value),
    origem: "cliente"
  };

  if (
    !reserva.nome ||
    !reserva.telefone ||
    !reserva.data ||
    !reserva.refeicao ||
    !reserva.hora ||
    !reserva.pessoas
  ) {
    alert("Preenche todos os campos");
    return;
  }

  try {
    const res = await fetch(SCRIPT_URL + "?action=novaReserva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reserva)
    });

    const r = await res.json();

    if (!r.ok) throw new Error("Falha");

    alert("Reserva confirmada!");
    document.getElementById("form").reset();
    document.getElementById("hora").innerHTML = "";

  } catch (err) {
    alert("Não foi possível concluir a reserva.");
    console.error(err);
  }
}


