const CALENDAR_ID = "primary"; // ou email do calendário
const SHEET_NAME = "Reservas";

let reservas = [];

/* ===================== WEB APP ===================== */
function doGet(e) {
  const action = e.parameter.action || "getConfig";

  if (action === "getConfig") return json(getConfig());
  if (action === "getReservas") return json(getReservas());

  return json({ ok: true });
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = e.parameter.action;

  if (action === "novaReserva") novaReserva(data);
  if (action === "cancelarReserva") cancelarReserva(data);
  if (action === "estadoReserva") estadoReserva(data);

  return json({ ok: true });
}

/* ===================== CONFIG ===================== */
function getConfig() {
  return {
    admin: { password: "1234" },
    mesas: [
      { id: 1, lugares: 6 },
      { id: 2, lugares: 4 },
      { id: 4, lugares: 4 },
      { id: 5, lugares: 5 },
      { id: 6, lugares: 4 },
      { id: 7, lugares: 4 },
      { id: 8, lugares: 4 },
      { id: 9, lugares: 4, prioridade: "baixa" }
    ]
  };
}

/* ===================== RESERVAS ===================== */
function getReservas() {
  carregarReservas();
  return reservas;
}

function novaReserva(r) {
  carregarReservas();

  const titulo =
    r.pessoas + " " + r.nome + (r.origem === "cliente" ? " 🍽" : " ✍️");

  const inicio = new Date(r.data + "T" + r.hora);
  const fim = new Date(
    inicio.getTime() + (r.refeicao === "almoco" ? 90 : 120) * 60000
  );

  const cal = CalendarApp.getCalendarById(CALENDAR_ID);
  const ev = cal.createEvent(titulo, inicio, fim, {
    description: r.telefone
  });

  r.eventId = ev.getId();
  r.estado = "reservado";

  reservas.push(r);
  guardarReservas();
}

function cancelarReserva(index) {
  carregarReservas();
  const r = reservas[index];

  if (r.eventId) {
    const cal = CalendarApp.getCalendarById(CALENDAR_ID);
    const ev = cal.getEventById(r.eventId);
    if (ev) ev.deleteEvent();
  }

  reservas.splice(index, 1);
  guardarReservas();
}

function estadoReserva(data) {
  carregarReservas();

  const r = reservas[data.index];
  r.estado = data.estado;

  if (r.eventId) {
    const cal = CalendarApp.getCalendarById(CALENDAR_ID);
    const ev = cal.getEventById(r.eventId);
    if (ev) {
      ev.setTitle(
        r.pessoas +
          " " +
          r.nome +
          (data.estado === "chegou" ? " ✅" : " ❌")
      );
    }
  }

  guardarReservas();
}

/* ===================== STORAGE ===================== */
function carregarReservas() {
  const p = PropertiesService.getScriptProperties().getProperty(SHEET_NAME);
  reservas = p ? JSON.parse(p) : [];
}

function guardarReservas() {
  PropertiesService.getScriptProperties().setProperty(
    SHEET_NAME,
    JSON.stringify(reservas)
  );
}

/* ===================== UTIL ===================== */
function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(
    ContentService.MimeType.JSON
  );
}
