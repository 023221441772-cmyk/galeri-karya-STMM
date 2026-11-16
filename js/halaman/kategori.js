/* Logika layar Kategori */

const SEMUA_KATEGORI = ['Semua', ...DAFTAR_KATEGORI]; // ['Semua', 'Film', 'Video', 'Podcast', 'Foto', 'Gim']

// 1) Ambil kategori dari parameter URL (?k=...)
let kategoriAktif = ambilParameter('k') || 'Semua';
if (!SEMUA_KATEGORI.includes(kategoriAktif)) {
  kategoriAktif = 'Semua';
}

let urutanAktif = 'terbaru';
const LABEL_URUT = {
  terbaru: 'Terbaru',
  terlama: 'Terlama',
  judul: 'Judul (A-Z)'
};

// 2) Render deret chip
const wadahChip = document.getElementById('daftar-chip-kategori');
function renderChips() {
  wadahChip.innerHTML = SEMUA_KATEGORI.map((kat) => `
    <button type="button" class="chip" data-kategori="${kat}" aria-pressed="${kat === kategoriAktif ? 'true' : 'false'}">
      ${kat}
    </button>
  `).join('');
}

// 3) Filter dan urutkan data karya
function ambilKaryaTerfilter() {
  let hasil = kategoriAktif === 'Semua'
    ? [...KARYA]
    : KARYA.filter((k) => k.kategori === kategoriAktif);

  if (urutanAktif === 'terbaru') {
    hasil.sort((a, b) => b.id - a.id);
  } else if (urutanAktif === 'terlama') {
    hasil.sort((a, b) => a.id - b.id);
  } else if (urutanAktif === 'judul') {
    hasil.sort((a, b) => a.judul.localeCompare(b.judul));
  }

  return hasil;
}

// 4) Render info jumlah dan grid karya
const infoJumlah = document.getElementById('info-jumlah');
const gridKarya = document.getElementById('grid-karya');

function renderKarya() {
  const daftar = ambilKaryaTerfilter();
  const teksKategori = kategoriAktif === 'Semua' ? '' : ` · ${kategoriAktif}`;
  infoJumlah.textContent = `${daftar.length} karya${teksKategori}`;

  if (daftar.length === 0) {
    gridKarya.innerHTML = `
      <div class="pesan-kosong" style="grid-column: 1 / -1;">
        <strong>Belum Ada Karya</strong>
        <p class="teks-redup">Belum ada karya untuk kategori ${aman(kategoriAktif)}.</p>
      </div>`;
  } else {
    gridKarya.innerHTML = daftar.map((k) => kartuKarya(k)).join('');
  }
}

// 5) Event listener klik chip filter
wadahChip.addEventListener('click', (e) => {
  const tombol = e.target.closest('.chip');
  if (!tombol) return;

  const targetKategori = tombol.dataset.kategori;
  if (targetKategori === kategoriAktif) return;

  kategoriAktif = targetKategori;

  // Perbarui status chip
  wadahChip.querySelectorAll('.chip').forEach((c) => {
    c.setAttribute('aria-pressed', c.dataset.kategori === kategoriAktif ? 'true' : 'false');
  });

  // Perbarui URL tanpa reload
  const urlBaru = kategoriAktif === 'Semua'
    ? 'kategori.html'
    : `kategori.html?k=${encodeURIComponent(kategoriAktif)}`;
  window.history.pushState({ k: kategoriAktif }, '', urlBaru);

  renderKarya();
});

// Dukungan tombol Back/Forward browser
window.addEventListener('popstate', () => {
  kategoriAktif = ambilParameter('k') || 'Semua';
  if (!SEMUA_KATEGORI.includes(kategoriAktif)) kategoriAktif = 'Semua';
  wadahChip.querySelectorAll('.chip').forEach((c) => {
    c.setAttribute('aria-pressed', c.dataset.kategori === kategoriAktif ? 'true' : 'false');
  });
  renderKarya();
});

// 6) Kontrol Menu Pengurutan
const tombolUrut = document.getElementById('tombol-urut');
const labelUrut = document.getElementById('label-urut');
const menuUrut = document.getElementById('menu-urut');

tombolUrut.addEventListener('click', (e) => {
  e.stopPropagation();
  const terbuka = !menuUrut.hidden;
  menuUrut.hidden = terbuka;
  tombolUrut.setAttribute('aria-expanded', String(!terbuka));
});

menuUrut.addEventListener('click', (e) => {
  const item = e.target.closest('.menu-urut__item');
  if (!item) return;

  urutanAktif = item.dataset.urut;
  labelUrut.textContent = LABEL_URUT[urutanAktif] || 'Terbaru';

  menuUrut.querySelectorAll('.menu-urut__item').forEach((i) => {
    i.setAttribute('aria-selected', i.dataset.urut === urutanAktif ? 'true' : 'false');
  });

  menuUrut.hidden = true;
  tombolUrut.setAttribute('aria-expanded', 'false');
  renderKarya();
});

document.addEventListener('click', () => {
  if (!menuUrut.hidden) {
    menuUrut.hidden = true;
    tombolUrut.setAttribute('aria-expanded', 'false');
  }
});

// 7) Inisialisasi awal
renderChips();
renderKarya();
