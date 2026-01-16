const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxpVkbtbh4Z5mQrnMniHrDHu-IE-9hs2Nc_FNjBkZ3dnLp9jDzOsWXI4VfDD8FwOcqMYA/exec";

let funcionamento = {};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("SCRIPT CARREGADO");
  await carregarFuncionamento();

  document.getElementById("data").addEventListener("change", validarDia);
  document.getElementById("refeicao").addEventListener("change", carregarHoras);
});

async function carregarFuncionamento() {
  const res = await fetch(SCRIPT_URL + "?action=getFuncionamento");
  funcionamento = await res.json();
  console.log("FUNCIONAMENTO RECEBIDO:", funcionamento);
}

function validarDia() {
  const dataInput = document.getElementById("data");
  const data = dataInput.value;
  if (!data) return;

  const dia = new Date(data + "T00:00:00").getDay(); // 0–6
  console.log("Dia escolhido:", dia);
  console.log("Funcionamento dia:", funcionamento[dia]);

  if (!funcionamento[dia] || !funcionamento[dia].aberto) {
    alert("O restaurante encontra-se encerrado neste dia.");
    dataInput.value = "";
    limparHoras();
    return;
  }

  carregarHoras();
}

async function carregarHoras() {
  const data = document.getElementById("data").value;
  const refeicao = document.getElementById("refeicao").value;
  const horaSelect = document.getElementById("hora");

  horaSelect.innerHTML = "";

  if (!data || !refeicao) return;

  try {
    const res = await fetch(
      `${SCRIPT_URL}?action=getHoras&data=${data}&refeicao=${refeicao}`
    );

    const horas = await res.json();
    console.log("Horas recebidas:", horas);

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
    console.error("Erro horários:", e);
    alert("Erro ao carregar horários");
  }
}

function limparHoras() {
  document.getElementById("hora").innerHTML = "";
}
