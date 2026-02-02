let data = JSON.parse(localStorage.getItem("activities")) || [];
let currentTab = "planner";

const list = document.getElementById("list");
const statText = document.getElementById("statText");

/* =========================
   HELPER DEADLINE
========================= */
function getDeadline(item) {
  if (!item.date) return Infinity;
  return new Date(`${item.date}T${item.time || "23:59"}`).getTime();
}

function getDeadlineColor(item) {
  const diff = getDeadline(item) - Date.now();

  if (diff < 0) return "deadline-red";        // lewat
  if (diff < 86400000) return "deadline-red"; // < 1 hari
  if (diff < 259200000) return "deadline-yellow"; // < 3 hari
  return "deadline-green";
}

/* =========================
   ADD ACTIVITY
========================= */
document.getElementById("addBtn").onclick = () => {
  const item = {
    id: Date.now(),
    type: type.value,
    title: title.value,
    task: task.value,
    date: date.value,
    time: time.value,
    link: link.value,
    note: note.value,
    done: type.value === "history"
  };

  data.push(item);
  save();
};

/* =========================
   TAB SWITCH
========================= */
document.querySelectorAll(".tabs button").forEach(btn => {
  btn.onclick = () => {
    document.querySelector(".tabs .active").classList.remove("active");
    btn.classList.add("active");
    currentTab = btn.dataset.tab;
    render();
  };
});

/* =========================
   TOGGLE DONE
========================= */
function toggleDone(id) {
  const item = data.find(d => d.id === id);
  if (!item) return;
  item.done = !item.done;
  save();
}

/* =========================
   SAVE & RENDER
========================= */
function save() {
  localStorage.setItem("activities", JSON.stringify(data));
  render();
}

function render() {
  list.innerHTML = "";

  let filtered = data.filter(d => {
    if (currentTab === "planner") return !d.done && d.type === "planner";
    if (currentTab === "done") return d.done && d.type === "planner";
    return d.type === "history";
  });

  /* 🔥 SORT DEADLINE PALING MEPET DI ATAS */
  filtered.sort((a, b) => getDeadline(a) - getDeadline(b));

  filtered.forEach(d => {
    const card = document.createElement("div");
    card.className = `card ${d.done ? "done" : ""} ${getDeadlineColor(d)}`;

    card.innerHTML = `
      <div class="card-header">
        ${d.type === "planner" ? `
          <input
            class="checkbox"
            type="checkbox"
            ${d.done ? "checked" : ""}
            onchange="toggleDone(${d.id})"
          >
        ` : ""}
        <strong>${d.title}</strong>
      </div>

      <small>${d.task || ""}</small><br>
      <small>${d.date || ""} ${d.time || ""}</small><br>

      ${d.link ? `<a href="${d.link}" target="_blank">🔗 Link</a>` : ""}
      <p>${d.note || ""}</p>
    `;

    list.appendChild(card);
  });

  renderStats();
}

render();