/* Logika layar Profil Kreator */

const wadah = document.getElementById('wadah-kreator');

// 1) Ambil parameter id dari alamat (?id=...)
const id = ambilParameter('id');
const kreator = id ? cariKreator(id) : null;

// 2) Penanganan jika kreator tidak ditemukan
if (!kreator) {
  wadah.innerHTML = `
    <header class="bilah-atas bilah-atas--tengah">
      <a class="ikon-tombol" href="index.html" id="tombol-kembali" aria-label="Kembali ke Beranda"></a>
      <h1 class="bilah-atas__judul">Profil Kreator</h1>
      <span style="width: 44px;"></span>
    </header>
    <main class="konten">
      <div class="pesan-kosong">
        <strong>Kreator Tidak Ditemukan</strong>
        <p class="teks-redup">Profil kreator yang kamu cari tidak ada atau tautan mungkin salah.</p>
        <a class="tombol tombol--utama" href="index.html" style="margin-top: var(--jarak-3);">Kembali ke Beranda</a>
      </div>
    </main>`;
  pasangTombolKembali('tombol-kembali');
} else {
  // Update judul dokumen
  document.title = `${kreator.nama} · Galeri Karya STMM`;

  // 3) Ambil karya milik kreator & hitung statistik
  const daftarKarya = karyaMilik(kreator.id);
  const totalKarya = daftarKarya.length;
  const totalKategori = new Set(daftarKarya.map((k) => k.kategori)).size;
  const tahunBergabung = kreator.angkatan;
  const subJudul = kreator.prodi
    ? `${aman(kreator.prodi)} · Angkatan ${aman(kreator.angkatan)}`
    : `Angkatan ${aman(kreator.angkatan)}`;

  // 4) Render tampilan profil
  wadah.innerHTML = `
    <section class="profil-banner">
      <div class="profil-nav">
        <a class="ikon-tombol" href="index.html" id="tombol-kembali" aria-label="Kembali"></a>
        <span class="profil-nav__judul">Profil Kreator</span>
        <span class="profil-nav__kosong"></span>
      </div>

      <div class="profil-avatar">
        ${aman(inisial(kreator.nama))}
      </div>

      <h1 class="profil-nama">${aman(kreator.nama)}</h1>
      <p class="profil-sub">${subJudul}</p>
    </section>

    <!-- Kartu Statistik Mengambang -->
    <div class="stat-grid">
      <div class="stat-kartu">
        <span class="stat-kartu__nilai">${totalKarya}</span>
        <span class="stat-kartu__label">Karya</span>
      </div>
      <div class="stat-kartu">
        <span class="stat-kartu__nilai">${totalKategori}</span>
        <span class="stat-kartu__label">Kategori</span>
      </div>
      <div class="stat-kartu">
        <span class="stat-kartu__nilai">${tahunBergabung}</span>
        <span class="stat-kartu__label">Bergabung</span>
      </div>
    </div>

    <!-- Konten Utama: Bio & Grid Karya -->
    <main class="profil-konten">
      <section class="bagian">
        <h2 class="judul-bagian">Tentang Kreator</h2>
        <p class="teks-isi">${aman(kreator.bio)}</p>
      </section>

      <section class="bagian">
        <h2 class="judul-bagian">Karya</h2>
        <div class="grid-2" id="grid-karya">
          ${daftarKarya.map((k) => kartuKarya(k, { tampilkanKreator: false })).join('')}
        </div>
      </section>
    </main>
  `;

  // 5) Pasang tombol kembali
  pasangTombolKembali('tombol-kembali');
}
