const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxpVkbtbh4Z5mQrnMniHrDHu-IE-9hs2Nc_FNjBkZ3dnLp9jDzOsWXI4VfDD8FwOcqMYA/exec";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("data").addEventListener("change", carregarHoras);
  document.getElementById("refeicao").addEventListener("change", carregarHoras);
  document.getElementById("form").addEventListener("submit", enviarReserva);
});

/*********************************
 * CARREGAR HORAS (ÚNICA VALIDAÇÃO)
 *********************************/
async function carregarHoras() {
  const data = document.getElementById("data").value;
  const refeicao = document.getElementById("refeicao").value;
  const horaSelect = document.getElementById("hora");

  horaSelect.innerHTML = "";

  if (!data || !refeicao) return;

  const res = await fetch(
    `${SCRIPT_URL}?action=getHoras&data=${data}&refeicao=${refeicao}&_=${Date.now()}`
  );

  const horas = await res.json();

  if (!Array.isArray(horas) || horas.length === 0) {
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

  const res = await fetch(SCRIPT_URL + "?action=novaReserva", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reserva)
  });

  const r = await res.json();

  if (r.erro) {
    alert(r.erro);
    return;
  }

  alert("Reserva efetuada com sucesso!");
  e.target.reset();
  document.getElementById("hora").innerHTML = "";
}
