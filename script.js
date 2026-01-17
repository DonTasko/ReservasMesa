const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyVJtdGsApy4ZQNNKi1ytrkfAyRovMMUICy9lOtte7wq3odb3kGqPcNb52kvSM-yociXQ/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  if (!form) {
    console.error("FORM NÃO ENCONTRADO");
    return;
  }

  const dataInput = document.getElementById("data");
  const refeicaoInput = document.getElementById("refeicao");
  const horaSelect = document.getElementById("hora");

  dataInput.addEventListener("change", carregarHoras);
  refeicaoInput.addEventListener("change", carregarHoras);
  form.addEventListener("submit", enviarReserva);

  async function carregarHoras() {
    horaSelect.innerHTML = "";

    if (!dataInput.value || !refeicaoInput.value) return;

    const url =
      `${SCRIPT_URL}?action=getHoras&data=${dataInput.value}&refeicao=${refeicaoInput.value}`;

    try {
      const res = await fetch(url);
      const horas = await res.json();

      if (!horas.length) {
        const o = document.createElement("option");
        o.textContent = "Sem disponibilidade";
        o.disabled = true;
        o.selected = true;
        horaSelect.appendChild(o);
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

  async function enviarReserva(e) {
    e.preventDefault();

    const reserva = {
      nome: document.getElementById("nome").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      data: dataInput.value,
      refeicao: refeicaoInput.value,
      hora: horaSelect.value,
      pessoas: parseInt(document.getElementById("pessoas").value)
    };

    try {
      const res = await fetch(
        `${SCRIPT_URL}?action=novaReserva`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reserva)
        }
      );

      const text = await res.text();
      console.log("RESPOSTA RAW:", text);

      const json = text ? JSON.parse(text) : {};

      if (!json.ok) {
        alert(json.erro || "Erro ao enviar reserva");
        return;
      }

      alert("Reserva confirmada 🍽️");
      form.reset();
      horaSelect.innerHTML = "";

    } catch (err) {
      console.error("ERRO FETCH:", err);
      alert("Erro de ligação ao servidor");
    }
  }
});
