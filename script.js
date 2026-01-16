const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwzEyIUG0SGMD6myPiUw4wH77fNT0tois8VzavcC2X_X2yVGEkeT_FFjb9v6Sx66WvFXw/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const dataInput = document.getElementById("data");
  const refeicao = document.getElementById("refeicao");
  const hora = document.getElementById("hora");

  dataInput.addEventListener("change", carregarHoras);
  refeicao.addEventListener("change", carregarHoras);
  form.addEventListener("submit", enviarReserva);
});

/* =========================
   CARREGAR HORAS
========================= */
async function carregarHoras() {
  const data = document.getElementById("data").value;
  const refeicao = document.getElementById("refeicao").value;
  const horaSelect = document.getElementById("hora");

  horaSelect.innerHTML = "";

  if (!data || !refeicao) return;

  const optLoading = document.createElement("option");
  optLoading.textContent = "A carregar horários...";
  optLoading.disabled = true;
  optLoading.selected = true;
  horaSelect.appendChild(optLoading);

  try {
    const res = await fetch(
      `${SCRIPT_URL}?action=getHoras&data=${data}&refeicao=${refeicao}`
    );
    const horas = await res.json();

    horaSelect.innerHTML = "";

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
    alert("Erro ao carregar horários");
    console.error(e);
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

  if (!reserva.nome || !reserva.telefone || !reserva.data || !reserva.hora) {
    alert("Preenche todos os campos");
    return;
  }

  try {
    const res = await fetch(`${SCRIPT_URL}?action=novaReserva`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reserva)
    });

    const r = await res.json();

    if (r.ok) {
      alert("Reserva confirmada!");
      document.getElementById("form").reset();
      document.getElementById("hora").innerHTML = "";
    } else {
      alert(r.erro || "Erro na reserva");
    }

  } catch (err) {
    alert("Erro ao enviar reserva");
    console.error(err);
  }
}
