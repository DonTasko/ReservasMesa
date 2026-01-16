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

  if (!data || !refeicao) {
    return;
  }

  try {
    const url = `${SCRIPT_URL}?action=getHoras&data=${data}&refeicao=${refeicao}`;
    console.log("GET HORAS:", url);

    const res = await fetch(url);
    const horas = await res.json();

    console.log("HORAS RECEBIDAS:", horas);

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

  } catch (e) {
    console.error("Erro getHoras:", e);
    alert("Erro ao carregar horários");
  }
}

/* =========================
   ENVIAR RESERVA
========================= */
async function enviarReserva(e) {
  e.preventDefault();

  const reserva = {
    nome: document.getElementById("nome").value.trim(),
    telefone: document.getElementById("telefone").value.trim(),
    data: document.getElementById("data").value,
    refeicao: document.getElementById("refeicao").value,
    hora: document.getElementById("hora").value,
    pessoas: Number(document.getElementById("pessoas").value),
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
    const res = await fetch(
      SCRIPT_URL + "?action=novaReserva",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva)
      }
    );

    const json = await res.json();
    console.log("RESPOSTA BACKEND:", json);

    if (!json.ok) {
      alert(json.erro || "Erro ao criar reserva");
      return;
    }

    alert("Reserva confirmada com sucesso 🍽️");
    document.getElementById("form").reset();
    limparHoras();

  } catch (err) {
    console.error("ERRO FETCH:", err);
    alert("Erro ao enviar reserva");
  }
}


