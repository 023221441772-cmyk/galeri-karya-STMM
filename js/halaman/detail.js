/* Logika layar Detail Karya */

// 1) Tombol kembali & tombol bagikan bilah atas
pasangTombolKembali('tombol-kembali');
const tombolBagikanAtas = document.getElementById('tombol-bagikan-atas');
tombolBagikanAtas.innerHTML = ikon('bagikan', 22);

// 2) Ambil parameter id dari alamat (?id=...)
const id = ambilParameter('id');
const karya = id ? cariKarya(id) : null;

const wadahPemutar = document.getElementById('wadah-pemutar');
const kontenDetail = document.getElementById('konten-detail');

// 3) Penanganan jika karya tidak ditemukan atau id kosong
if (!karya) {
  tombolBagikanAtas.style.display = 'none';
  wadahPemutar.innerHTML = '';
  kontenDetail.innerHTML = `
    <div class="pesan-kosong">
      <strong>Karya Tidak Ditemukan</strong>
      <p class="teks-redup">Karya yang kamu cari tidak ada atau tautan mungkin salah.</p>
      <a class="tombol tombol--utama" href="index.html" style="margin-top: var(--jarak-3);">Kembali ke Beranda</a>
    </div>`;
} else {
  // Update judul halaman
  document.title = `${karya.judul} · Galeri Karya STMM`;

  const kreator = cariKreator(karya.kreatorId);
  const infoKategori = KATEGORI[karya.kategori] || KATEGORI.Film;
  const labelKategori = karya.kategori === 'Film' ? 'Film Pendek' : karya.kategori;
  const satuan = infoKategori.satuan || 'Durasi';

  // URL YouTube: jika ada youtubeId arahkan ke video, bila kosong ke pencarian judul di YouTube
  const tautanYouTube = karya.youtubeId
    ? `https://www.youtube.com/watch?v=${encodeURIComponent(karya.youtubeId)}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(karya.judul)}`;

  // 4) Tampilkan Pemutar Media
  wadahPemutar.innerHTML = `
    <div class="pemutar" id="pemutar-media">
      <button type="button" class="pemutar__putar" id="tombol-putar" aria-label="Putar video">
        ${IKON_PUTAR}
      </button>
      <span class="pemutar__keterangan">Video tersemat dari YouTube</span>
    </div>`;

  const tombolPutar = document.getElementById('tombol-putar');
  if (tombolPutar) {
    tombolPutar.addEventListener('click', () => {
      if (karya.youtubeId) {
        document.getElementById('pemutar-media').innerHTML = `
          <iframe src="https://www.youtube-nocookie.com/embed/${aman(karya.youtubeId)}?autoplay=1"
                  title="${aman(karya.judul)}"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen></iframe>`;
      } else {
        window.open(tautanYouTube, '_blank', 'noopener,noreferrer');
      }
    });
  }

  // 5) Cari karya lain dari kreator yang sama (selain karya ini)
  const karyaLain = kreator ? karyaMilik(kreator.id).filter((k) => String(k.id) !== String(karya.id)) : [];
  const seksiKaryaLain = karyaLain.length > 0 ? `
    <section class="bagian seksi-karya-lain">
      <h2 class="judul-bagian">Karya Lain dari Kreator</h2>
      <div class="grid-2" id="karya-lain">
        ${karyaLain.map((k) => kartuKarya(k, { tampilkanKreator: false })).join('')}
      </div>
    </section>` : '';

  // 6) Render Konten Detail
  kontenDetail.innerHTML = `
    <section class="detail-header">
      <div class="deret-tag">
        <span class="tag tag--kategori" style="${gayaKategori(karya.kategori)}">${aman(labelKategori)}</span>
        <span class="tag tag--genre">${aman(karya.genre)}</span>
      </div>
      <h2 class="detail__judul">${aman(karya.judul)}</h2>
    </section>

    <div class="kreator-kartu">
      <div class="kreator-kartu__avatar">
        ${kreator ? aman(inisial(kreator.nama)) : '?'}
      </div>
      <div class="kreator-kartu__info">
        <div class="kreator-kartu__nama">${kreator ? aman(kreator.nama) : 'Mahasiswa STMM'}</div>
        <div class="kreator-kartu__sub">${kreator ? `${aman(kreator.prodi)} · Angkatan ${aman(kreator.angkatan)}` : '-'}</div>
      </div>
      <a class="kreator-kartu__tautan" href="kreator.html?id=${encodeURIComponent(karya.kreatorId)}">Profil</a>
    </div>

    <p class="detail__sinopsis">${aman(karya.sinopsis)}</p>

    <div class="meta-grid">
      <div class="meta-kotak">
        <span class="meta-kotak__label">Tahun</span>
        <span class="meta-kotak__nilai">${aman(karya.tahun)}</span>
      </div>
      <div class="meta-kotak">
        <span class="meta-kotak__label">${aman(satuan)}</span>
        <span class="meta-kotak__nilai">${aman(karya.durasi)}</span>
      </div>
      <div class="meta-kotak">
        <span class="meta-kotak__label">Mata Kuliah</span>
        <span class="meta-kotak__nilai">${aman(karya.mataKuliah)}</span>
      </div>
    </div>

    <div class="deret-tombol">
      <button type="button" class="tombol tombol--utama" id="tombol-bagikan-karya">Bagikan Karya</button>
      <a class="tombol tombol--garis" href="${tautanYouTube}" target="_blank" rel="noopener noreferrer">Buka di YouTube</a>
    </div>

    ${seksiKaryaLain}
  `;

  // 7) Hubungkan tombol Bagikan ke fungsi bagikanKarya(karya)
  tombolBagikanAtas.addEventListener('click', () => bagikanKarya(karya));
  const tombolBagikanKarya = document.getElementById('tombol-bagikan-karya');
  if (tombolBagikanKarya) {
    tombolBagikanKarya.addEventListener('click', () => bagikanKarya(karya));
  }
}
