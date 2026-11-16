/* Logika layar Cari Karya */

// 1) Ikon pada kolom pencarian
const wadahIkon = document.getElementById('ikon-cari');
if (wadahIkon) wadahIkon.innerHTML = ikon('cari', 20, 2);

const inputCari = document.getElementById('input-cari');
const tombolHapus = document.getElementById('tombol-hapus-cari');
const wadahChip = document.getElementById('daftar-chip-cari');
const labelHasil = document.getElementById('label-hasil');
const wadahHasil = document.getElementById('daftar-hasil-cari');

let kataKunci = '';
let kategoriDipilih = null;

// 2) Render deret chip kategori bergaris
function renderChips() {
  wadahChip.innerHTML = DAFTAR_KATEGORI.map((kat) => `
    <button type="button" class="chip chip--garis" data-kategori="${kat}" aria-pressed="false">
      ${kat}
    </button>
  `).join('');
}

// 3) Filter karya berdasarkan kata kunci dan kategori
function saringKarya() {
  const q = kataKunci.trim().toLowerCase();

  // Bila belum mencari apa pun dan belum memilih filter, tampilkan 6 karya awal seperti mockup
  if (!q && !kategoriDipilih) {
    return KARYA.slice(0, 6);
  }

  return KARYA.filter((k) => {
    const kreator = cariKreator(k.kreatorId);
    const namaKreator = kreator ? kreator.nama.toLowerCase() : '';
    const judul = k.judul.toLowerCase();

    const cocokTeks = !q || judul.includes(q) || namaKreator.includes(q);
    const cocokKategori = !kategoriDipilih || k.kategori === kategoriDipilih;

    return cocokTeks && cocokKategori;
  });
}

// 4) Render hasil pencarian (daftar baris karya)
function renderHasil() {
  const hasil = saringKarya();
  const q = kataKunci.trim();

  if (!q && !kategoriDipilih) {
    labelHasil.textContent = 'Karya terbaru';
  } else {
    labelHasil.textContent = `Hasil pencarian (${hasil.length} karya)`;
  }

  if (hasil.length === 0) {
    wadahHasil.innerHTML = `
      <div class="pesan-kosong" style="padding: 48px var(--jarak-4);">
        <strong>Karya Tidak Ditemukan</strong>
        <p class="teks-redup">Coba kata kunci lain atau periksa ejaanmu.</p>
      </div>`;
    return;
  }

  wadahHasil.innerHTML = hasil.map((k) => {
    const kreator = cariKreator(k.kreatorId);
    const namaKreator = kreator ? kreator.nama : 'Mahasiswa STMM';
    const isiThumb = k.thumbnail
      ? `<img src="${aman(k.thumbnail)}" alt="">`
      : ikon(k.kategori, 22, 1.8);

    return `
      <a class="baris-karya" href="detail.html?id=${k.id}">
        <div class="baris-karya__thumb" style="${gayaKategori(k.kategori)}">
          ${isiThumb}
        </div>
        <div class="baris-karya__info">
          <div class="baris-karya__judul">${aman(k.judul)}</div>
          <div class="baris-karya__sub">${aman(namaKreator)} · ${aman(k.kategori)}</div>
        </div>
      </a>`;
  }).join('');
}

// 5) Event input teks pencarian
inputCari.addEventListener('input', (e) => {
  kataKunci = e.target.value;
  tombolHapus.hidden = !kataKunci;
  renderHasil();
});

// 6) Tombol bersihkan teks pencarian
tombolHapus.addEventListener('click', () => {
  inputCari.value = '';
  kataKunci = '';
  tombolHapus.hidden = true;
  inputCari.focus();
  renderHasil();
});

// 7) Event klik chip filter kategori
wadahChip.addEventListener('click', (e) => {
  const tombol = e.target.closest('.chip');
  if (!tombol) return;

  const targetKategori = tombol.dataset.kategori;

  // Toggle pilihan: jika diklik lagi, batalkan filter
  if (kategoriDipilih === targetKategori) {
    kategoriDipilih = null;
  } else {
    kategoriDipilih = targetKategori;
  }

  // Update tampilan tombol chip
  wadahChip.querySelectorAll('.chip').forEach((c) => {
    c.setAttribute('aria-pressed', c.dataset.kategori === kategoriDipilih ? 'true' : 'false');
  });

  renderHasil();
});

// 8) Inisialisasi awal
renderChips();

// Cek apakah ada parameter awal ?q=... di URL
const qAwal = ambilParameter('q');
if (qAwal) {
  inputCari.value = qAwal;
  kataKunci = qAwal;
  tombolHapus.hidden = false;
}

renderHasil();
