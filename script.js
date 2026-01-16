const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxpVkbtbh4Z5mQrnMniHrDHu-IE-9hs2Nc_FNjBkZ3dnLp9jDzOsWXI4VfDD8FwOcqMYA/exec";

let funcionamento = {};

document.addEventListener("DOMContentLoaded", async () => {
  await carregarFuncionamento();

  document.getElementById("data").addEventListener("change", validarDia);
  document.getElementById("refeicao").addEventListener("change", carregarHoras);
  document.getElementById("form").addEventListener("submit", enviarReserva);
});

/*********************************
 * FUNCIONAMENTO
 *********************************/
async function carregarFuncionamento() {
  const res = await fetch(SCRIPT_URL + "?action=getFuncionamento");
  funcionamento = await res.json();
}

/*********************************
 * VALIDAR DIA
 *********************************/
function validarDia() {
  const dataInput = document.getElementById("data");
  const data = dataInput.value;
  if (!data) return;

  const dia = new Date(data + "T00:00:00").getDay();

  if (!funcionamento[dia]?.aberto) {
    alert("O restaurante encontra-se encerrado neste dia.");
    dataInput.value = "";
    limparHoras();
    return;
  }

  carregarHoras();
}

/*********************************
 * CARREGAR HORAS
 *********************************/
async function carregarHoras() {
  const data = document.getElementById("data").value;
  const refeicao = document.getElementById("refeicao").value;
  const horaSelect = document.getElementById("hora");

  horaSelect.innerHTML = "";

  if (!data || !refeicao) return;

  const res = await fetch(
    `${SCRIPT_URL}?action=getHoras&data=${data}&refeicao=${refeicao}`
  );
  const horas = await res.json();

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
}

function limparHoras() {
  document.getElementById("hora").innerHTML = "";
}

/*********************************
 * ENVIAR RESERVA
 *********************************/
async function enviarReserva(e) {
  e.preventDefault();

  const reserva = {
    nome: nome.value.trim(),
    telefone: telefone.value.trim(),
    data: data.value,
    refeicao: refeicao.value,
    hora: hora.value,
    pessoas: parseInt(pessoas.value, 10)
  };

  if (!reserva.nome || !reserva.telefone || !reserva.data || !reserva.hora) {
    alert("Preenche todos os campos");
    return;
  }

  await fetch(SCRIPT_URL + "?action=novaReserva", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reserva)
  });

  alert("Reserva efetuada com sucesso!");
  e.target.reset();
  limparHoras();
}
