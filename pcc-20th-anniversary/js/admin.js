/* ==========================================================================
   PCC Admin — admin.js
   CRUD postingan dengan localStorage, impor/ekspor JSON.
   ========================================================================== */

(function () {
  const STORAGE_KEY = 'pcc_posts_v1';

  const secUpload = document.getElementById('sec-upload');
  const secManage = document.getElementById('sec-manage');
  const secTools = document.getElementById('sec-tools');
  const titleSection = document.getElementById('sectionTitle');

  const formUpload = document.getElementById('formUpload');
  const inpJudul = document.getElementById('inpJudul');
  const inpTanggal = document.getElementById('inpTanggal');
  const inpCerita = document.getElementById('inpCerita');
  const inpFoto = document.getElementById('inpFoto');
  const btnPilih = document.getElementById('btnPilih');
  const previewBox = document.getElementById('previewBox');
  const previewImg = document.getElementById('previewImg');
  const placeholder = previewBox.querySelector('.placeholder');

  const listPosts = document.getElementById('listPosts');

  const btnExport = document.getElementById('btnExport');
  const btnImportFile = document.getElementById('btnImportFile');
  const inpImport = document.getElementById('inpImport');
  const btnClear = document.getElementById('btnClear');

  let posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  let selectedImageData = null;

  const ADMIN_PASSWORD = 'ajeng'; // <-- Ganti password kamu di sini

  const loginOverlay = document.getElementById('loginOverlay');
  const loginForm = document.getElementById('loginForm');
  const inpPassword = document.getElementById('inpPassword');
  const loginError = document.getElementById('loginError');

  // --- Auth sederhana (sesi via sessionStorage) ---
  const AUTH_KEY = 'pcc_admin_auth';

  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === '1';
  }

  function checkAuth() {
    if (!loginOverlay) return;
    if (isAuthenticated()) {
      loginOverlay.style.display = 'none';
      showSection('upload');
    } else {
      loginOverlay.style.display = 'flex';
      [secUpload, secManage, secTools].forEach((s) => (s.style.display = 'none'));
    }
  }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (inpPassword.value === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1');
      loginError.style.display = 'none';
      inpPassword.value = '';
      checkAuth();
    } else {
      loginError.style.display = 'block';
      inpPassword.focus();
    }
  });

  window.logoutAdmin = function () {
    sessionStorage.removeItem(AUTH_KEY);
    checkAuth();
  };

  function initDate() {
    const today = new Date().toISOString().split('T')[0];
    inpTanggal.value = inpTanggal.value || today;
  }

  window.showSection = function (name) {
    [secUpload, secManage, secTools].forEach(s => (s.style.display = 'none'));
    if (name === 'upload') {
      secUpload.style.display = 'block';
      titleSection.textContent = 'Upload Cerita Baru';
    } else if (name === 'manage') {
      secManage.style.display = 'block';
      titleSection.textContent = 'Kelola Postingan';
      renderList();
    } else if (name === 'tools') {
      secTools.style.display = 'block';
      titleSection.textContent = 'Impor / Ekspor Data';
    }
  };

  checkAuth();

  btnPilih.addEventListener('click', () => inpFoto.click());

  inpFoto.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto maksimal 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (ev) {
      selectedImageData = ev.target.result;
      previewImg.src = selectedImageData;
      previewImg.style.display = 'block';
      placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  });

  formUpload.addEventListener('submit', function (e) {
    e.preventDefault();
    const judul = inpJudul.value.trim();
    const tanggal = inpTanggal.value;
    const cerita = inpCerita.value.trim();
    if (!judul || !tanggal || !cerita) {
      alert('Harap isi semua field.');
      return;
    }

    const post = {
      id: Date.now().toString(),
      title: judul,
      date: tanggal,
      cerita: cerita,
      image: selectedImageData || null,
      tipe: 'Kegiatan',
      createdAt: new Date().toISOString(),
    };

    posts.unshift(post);
    savePosts();
    renderList();

    formUpload.reset();
    initDate();
    selectedImageData = null;
    previewImg.src = '';
    previewImg.style.display = 'none';
    placeholder.style.display = 'block';
    inpFoto.value = '';

    window.showSection('manage');
    alert('Postingan berhasil disimpan.');
  });

  function savePosts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  function renderList() {
    if (!listPosts) return;
    if (posts.length === 0) {
      listPosts.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Belum ada postingan. Silakan tambah melalui tab Upload Cerita.</p>
        </div>
      `;
      return;
    }

    listPosts.innerHTML = posts.map(p => `
      <div class="post-item">
        ${p.image ? `<img src="${p.image}" alt="${escapeHtml(p.title)}" />` : `<div style="width:80px;height:80px;border-radius:8px;background:#e2e8f0;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:0.8rem;">Tanpa Foto</div>`}
        <div class="post-content">
          <h4 class="post-title">${escapeHtml(p.title)}</h4>
          <p class="post-date">${formatDate(p.date)}</p>
          <p class="post-text">${escapeHtml(p.cerita || '')}</p>
        </div>
        <div class="post-actions">
          <button class="btn-sm btn-del" onclick="hapusPosting('${escapeJs(p.id)}')">Hapus</button>
        </div>
      </div>
    `).join('');
  }

  window.hapusPosting = function (id) {
    if (!confirm('Yakin ingin menghapus postingan ini?')) return;
    posts = posts.filter(p => p.id !== id);
    savePosts();
    renderList();
  };

  btnExport.addEventListener('click', function () {
    const dataStr = JSON.stringify(posts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'posts.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('File posts.json telah diunduh. Simpan ke folder data/ lalu commit ke GitHub.');
  });

  btnImportFile.addEventListener('click', () => inpImport.click());

  inpImport.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      try {
        const imported = JSON.parse(ev.target.result);
        if (!Array.isArray(imported)) throw new Error('Format JSON tidak valid.');
        posts = imported;
        savePosts();
        renderList();
        alert('Data berhasil diimpor.');
      } catch (err) {
        alert('Gagal mengimpor: ' + err.message);
      }
    };
    reader.readAsText(file);
  });

  btnClear.addEventListener('click', function () {
    if (!confirm('Yakin ingin menghapus SEMUA postingan di browser ini? Tindakan ini tidak dapat dibatalkan.')) return;
    posts = [];
    savePosts();
    renderList();
    alert('Semua postingan lokal telah dihapus.');
  });

  function formatDate(iso) {
    if (!iso) return '-';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  function escapeJs(str) {
    return String(str).replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
  }
})();