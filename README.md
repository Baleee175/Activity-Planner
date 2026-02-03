---

# ⚡ Smart Activity Planner

**Smart Activity Planner** adalah aplikasi web produktivitas modern berbasis **Vanilla JavaScript** dengan konsep **Plan • Track • Reflect**, dilengkapi notifikasi deadline pintar dan dukungan **Progressive Web App (PWA)**.

---

## ✨ Preview Singkat

✔️ Planner & riwayat aktivitas
✔️ Deadline otomatis & urutan pintar
✔️ Notifikasi H-24 jam (anti spam)
✔️ Responsive mobile / tablet / desktop
✔️ Bisa di-install seperti aplikasi

---

## 🚀 Fitur Utama

### 📅 Manajemen Aktivitas

* Tambah **Planner** (rencana kegiatan)
* Tambah **History** (riwayat kegiatan yang sudah dilakukan)
* Field:

  * Nama kegiatan
  * Tugas
  * Deadline (tanggal & jam)
  * Catatan
  * Link kegiatan

---

### ⏱️ Smart Deadline System

* Aktivitas **deadline terdekat otomatis tampil di atas**
* Indikator warna deadline:

  * 🟢 Hijau → masih lama
  * 🟡 Kuning → < 3 hari
  * 🔴 Merah → < 24 jam / terlewat

---

### 🔔 Notifikasi Pintar (H-24 Jam)

* Muncul **24 jam sebelum deadline**
* Tidak menumpuk (menggunakan `tag`)
* Bisa muncul sebagai:

  * 🔔 Notifikasi sistem
  * 🔔 Popup di dalam aplikasi
* Ikon notifikasi di header dengan badge jumlah

---

### ✏️ Edit & 🗑️ Delete

* Edit aktivitas tanpa membuat data baru
* Hapus aktivitas kapan saja
* Scroll otomatis ke form saat edit

---

### 📱 Responsive & UX

* Tampilan **desktop-first**
* Mobile & tablet otomatis menyesuaikan

---

### 📦 Progressive Web App (PWA)

* Bisa di-install ke HP / Desktop
* Icon custom (192px & 512px)
* Offline ringan (cached assets)
* Notifikasi tetap aktif via Service Worker

---

## 🧠 Cara Kerja Notifikasi

Notifikasi muncul jika:
* Deadline ≤ 24 jam
* Aktivitas belum selesai
* Belum pernah dinotifikasi

---

## 💻 Cara Menjalankan

1. Download / clone repository
2. Buka `index.html` di browser
3. Izinkan notifikasi
4. Klik **Install App** (Chrome / Edge)

📌 Disarankan: **Chrome, Edge, Opera**

---

## ⚠️ Catatan Teknis

* Data disimpan menggunakan **LocalStorage**
* Tidak membutuhkan backend
* Notifikasi aktif jika app pernah dibuka
* Cocok untuk personal planner

---

## 🔮 Rencana Pengembangan (Opsional)

* 🔊 Bunyi alert custom
* 📊 Grafik statistik
* 📤 Export / Import JSON
* 🌗 Dark / Light mode
* ☁️ Sinkronisasi cloud

---

## 👤 Author

**Iqbal Julyansyah**
Smart Activity Planner © 2026
