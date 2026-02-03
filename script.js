let data = JSON.parse(localStorage.getItem("activities")) || [];
let currentTab = "planner";
let editingId = null;

const list = document.getElementById("list");
const statText = document.getElementById("statText");
const notifBtn = document.getElementById("notifBtn");
const notifPopup = document.getElementById("notifPopup");
const notifList = document.getElementById("notifList");
const notifBadge = document.getElementById("notifBadge");
const notifySound = new Audio("assets/notify.wav");
notifySound.volume = 0.4;


/* =========================
   NOTIFICATION
========================= */
function getUpcomingDeadlines() {
  const now = Date.now();
  const oneDay = 86400000;

  return data.filter(d =>
    d.type === "planner" &&
    !d.done &&
    !d.notified &&
    getDeadline(d) - now <= oneDay &&
    getDeadline(d) - now > 0
  );
}

function checkNotifications() {
  const upcoming = getUpcomingDeadlines();

  if (upcoming.length === 0) {
    notifBadge.classList.add("hidden");
    return;
  }

  notifBadge.innerText = upcoming.length;
  notifBadge.classList.remove("hidden");

  upcoming.forEach(item => {
    item.notified = true;

    if (Notification.permission === "granted") {
      new Notification("⏰ Deadline Mendekat", {
        body: item.title + " • kurang dari 24 jam",
      });
    }
  });

  save();
}

function renderNotifPopup() {
  notifList.innerHTML = "";

  const notifiedItems = data.filter(d => d.notified && !d.done);

  if (notifiedItems.length === 0) {
    notifList.innerHTML = "<small>Tidak ada deadline dekat</small>";
    return;
  }

  notifiedItems.forEach(d => {
    const div = document.createElement("div");
    div.className = "notif-item";
    div.innerHTML = `
      <strong>${d.title}</strong><br>
      <small>${d.date} ${d.time || ""}</small>
    `;
    notifList.appendChild(div);
  });
}

notifBtn.onclick = () => {
  notifPopup.classList.toggle("hidden");
  renderNotifPopup();
};

if ("Notification" in window) {
  Notification.requestPermission();
}

setInterval(checkNotifications, 60000); // cek tiap 1 menit
checkNotifications();

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
  if (!title.value) return alert("Nama kegiatan wajib diisi");
  if (editingId) {
    const item = data.find(d => d.id === editingId);
    if (!item) return;

    item.type = type.value;
    item.title = title.value;
    item.task = task.value;
    item.date = date.value;
    item.time = time.value;
    item.link = link.value;
    item.note = note.value;
    item.notified = false; // 🔔 RESET NOTIF JIKA DEADLINE DIUBAH

    editingId = null;
    document.getElementById("addBtn").innerText = "Tambah Aktivitas";

  } else {
    data.push({
      id: Date.now(),
      type: type.value,
      title: title.value,
      task: task.value,
      date: date.value,
      time: time.value,
      link: link.value,
      note: note.value,
      done: type.value === "history",
      notified: false // 🔔 PENANDA NOTIFIKASI
    });
  }

  clearForm();
  save();
};
/* =========================
   FUNCTION EDIT
========================= */
function editItem(id) {
  const item = data.find(d => d.id === id);
  if (!item) return;

  type.value = item.type;
  title.value = item.title;
  task.value = item.task;
  date.value = item.date;
  time.value = item.time;
  link.value = item.link;
  note.value = item.note;

  editingId = id;
  document.getElementById("addBtn").innerText = "Update Aktivitas";
  window.scrollTo({ top: 0, behavior: "smooth" });
}
/* =========================
   FUNCTION DELETE
========================= */
function deleteItem(id) {
  if (!confirm("Yakin ingin menghapus kegiatan ini?")) return;
  data = data.filter(d => d.id !== id);
  save();
}
/* =========================
   FUNCTION CLEAR FORM
========================= */
function clearForm() {
  type.value = "planner";
  title.value = "";
  task.value = "";
  date.value = "";
  time.value = "";
  link.value = "";
  note.value = "";
}

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

    <div class="card-actions">
      <button onclick="editItem(${d.id})">✏️ Edit</button>
      <button onclick="deleteItem(${d.id})">🗑️ Hapus</button>
    </div>
  `;


    list.appendChild(card);
  });

  renderStats();
}

render();

/* =========================
   🔔 NOTIFICATION SYSTEM
========================= */

// Minta izin notifikasi
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

function checkDeadlineNotifications() {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  data.forEach(item => {
    if (
      item.type === "planner" &&
      !item.done &&
      !item.notified &&
      item.date
    ) {
      const diff = getDeadline(item) - Date.now();

      // 🔥 NOTIF H-24 JAM
      if (diff > 0 && diff <= 86400000) {
        new Notification("⏰ Deadline Mendekat!", {
          body: `${item.title}\nKurang dari 24 jam lagi`,
          icon: "https://cdn-icons-png.flaticon.com/512/1827/1827370.png"
        });

        item.notified = true;
        save();
      }
    }
  });
}

/* =========================
   DEADLINE NOTIFICATION
========================= */
function checkUpcomingDeadlines() {
  const now = new Date();

  data.forEach(d => {
    if (!d.date || d.done) return;

    const deadline = new Date(`${d.date} ${d.time || "23:59"}`);
    const diff = deadline - now;

    if (diff > 0 && diff <= 24 * 60 * 60 * 1000 && !d.notified) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification("⏰ Deadline Mendekat", {
          body: `${d.title} - kurang dari 24 jam`,
          tag: `deadline-${d.id}`, // anti tumpuk
          renotify: false,
          icon: "assets/icon-192.png"
        });
      });

      d.notified = true;
      save();
    }
  });
}

function playNotifySound() {
  notifySound.currentTime = 0;
  notifySound.play().catch(() => {});
}

playNotifySound();
checkDeadlineNotifications();
setInterval(checkDeadlineNotifications, 60000);
setInterval(checkUpcomingDeadlines, 60000);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("✅ Service Worker registered"))
    .catch(err => console.error("SW error:", err));
}