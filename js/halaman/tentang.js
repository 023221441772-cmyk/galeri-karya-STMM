/* Logika layar Tentang */

// 1) Pasang ikon panah pada grup menu
document.querySelectorAll('.grup-menu__ikon').forEach((el) => {
  el.innerHTML = ikon('panah', 18, 2.2);
});

// 2) Data modal informasi menu
const DATA_INFO = {
  kebijakan: {
    judul: 'Kebijakan Karya & Hak Cipta',
    isi: 'Hak cipta dan kepemilikan setiap karya sepenuhnya tetap menjadi milik kreator masing-masing. Galeri Karya STMM berfungsi sebagai etalase publik dan wadah kurasi resmi untuk mengapresiasi karya mahasiswa.'
  },
  tim: {
    judul: 'Tim Pengembang',
    isi: 'Platform ini dikembangkan oleh mahasiswa program studi Mobile Computing STMM Yogyakarta untuk mendukung portofolio dan distribusi karya lintas program studi.'
  },
  kontak: {
    judul: 'Kontak & Informasi',
    isi: 'Untuk pertanyaan, kurasi karya, atau kerjasama, hubungi tim pengelola melalui email galeri@stmm.ac.id atau kunjungi kampus STMM Yogyakarta.'
  }
};

const modal = document.getElementById('modal-info');
const modalJudul = document.getElementById('modal-judul');
const modalIsi = document.getElementById('modal-isi');
const modalTutup = document.getElementById('modal-tutup');

function bukaModal(kunci) {
  const data = DATA_INFO[kunci];
  if (!data) return;
  modalJudul.textContent = data.judul;
  modalIsi.textContent = data.isi;
  modal.hidden = false;
}

function tutupModal() {
  modal.hidden = true;
}

// 3) Event listener grup menu
const grupMenu = document.getElementById('grup-menu-info');
if (grupMenu) {
  grupMenu.addEventListener('click', (e) => {
    const tombol = e.target.closest('.grup-menu__item');
    if (!tombol) return;
    const infoKey = tombol.dataset.info;
    bukaModal(infoKey);
  });
}

modalTutup.addEventListener('click', tutupModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) tutupModal();
});

// 4) Tombol Ajukan Karya
const tombolAjukan = document.getElementById('tombol-ajukan');
if (tombolAjukan) {
  tombolAjukan.addEventListener('click', () => {
    const subject = encodeURIComponent('Pengajuan Karya · Galeri Karya STMM');
    const body = encodeURIComponent(
      'Halo Tim Kurator Galeri Karya STMM,\n\n' +
      'Saya ingin mengajukan karya untuk ditampilkan di Galeri Karya STMM:\n' +
      '- Nama Kreator:\n' +
      '- Program Studi / Angkatan:\n' +
      '- Judul Karya:\n' +
      '- Kategori (Film/Video/Podcast/Foto/Gim):\n' +
      '- Tautan Video / File:\n' +
      '- Sinopsis Singkat:\n\n' +
      'Terima kasih!'
    );
    window.location.href = `mailto:galeri@stmm.ac.id?subject=${subject}&body=${body}`;
  });
}
