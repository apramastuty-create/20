/* ==========================================================================
   PCC Public Site — app.js
   Memuat data/posts.json dan render ke galeri + cerita.
   ========================================================================== */

(function () {
  const POSTS_URL = 'data/posts.json';
  const galleryGrid = document.getElementById('galleryGrid');
  const storiesGrid = document.getElementById('storiesGrid');

  // Set tahun di footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // State
  let posts = [];

  // Fetch data
  async function loadPosts() {
    try {
      const res = await fetch(POSTS_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('Gagal memuat data postingan');
      posts = await res.json();
      render();
      syncStatTargets();
      initCounters();
    } catch (err) {
      console.error(err);
      // Tampilkan placeholder kosong yang ramah agar tidak error total
      if (galleryGrid) galleryGrid.innerHTML = emptyState('Belum ada foto. Silakan tambah melalui halaman Admin.');
      if (storiesGrid) storiesGrid.innerHTML = emptyState('Belum ada cerita. Silakan tambah melalui halaman Admin.');
    }
  }

  function emptyState(msg) {
    return `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#64748b;">${msg}</div>`;
  }

  // Format tanggal Indonesia
  function formatDateISO(iso) {
    if (!iso) return '-';
    const d = new Date(iso + 'T00:00:00');
    const opts = { day: 'numeric', month: 'long', year: 'numeric' };
    return d.toLocaleDateString('id-ID', opts);
  }

  function render() {
    renderGallery();
    renderStories();
  }

  function renderGallery() {
    if (!galleryGrid) return;
    if (posts.length === 0) {
      galleryGrid.innerHTML = emptyState('Belum ada foto di galeri.');
      return;
    }

    galleryGrid.innerHTML = posts.map((p, i) => {
      const img = p.image || 'assets/images/placeholder.svg';
      return `
        <article class="gallery-item" style="animation-delay: ${i * 0.08}s">
          <img src="${img}" alt="${escapeHtml(p.title)}" loading="lazy" />
          <div class="overlay">
            <div class="date">${formatDateISO(p.date)}</div>
            <div class="title">${escapeHtml(p.title)}</div>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderStories() {
    if (!storiesGrid) return;
    if (posts.length === 0) {
      storiesGrid.innerHTML = emptyState('Belum ada cerita kegiatan.');
      return;
    }

    storiesGrid.innerHTML = posts.map((p, i) => {
      const img = p.image || 'assets/images/placeholder.svg';
      return `
        <article class="story-card" style="animation-delay: ${i * 0.08}s">
          <div class="story-img">
            <img src="${img}" alt="${escapeHtml(p.title)}" loading="lazy" />
          </div>
          <div class="story-body">
            <div class="story-meta">
              <span>${formatDateISO(p.date)}</span>
              <span>${p.tipe || 'Kegiatan'}</span>
            </div>
            <h3 class="story-title">${escapeHtml(p.title)}</h3>
            <p class="story-text">${escapeHtml(p.cerita || '')}</p>
            <a href="#" class="story-read">Baca selengkapnya →</a>
          </div>
        </article>
      `;
    }).join('');
  }

  // Escape HTML agar aman dari XSS sederhana saat menampilkan data JSON
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  // Sinkronkan target counter "Kegiatan" dengan jumlah postingan nyata
  function syncStatTargets() {
    document.querySelectorAll('.stat-card').forEach((card) => {
      const label = card.querySelector('.stat-label');
      const num = card.querySelector('.stat-number');
      if (!label || !num) return;
      if (label.textContent.includes('Kegiatan')) {
        num.setAttribute('data-target', String(posts.length));
        num.textContent = '0';
        delete num.dataset.counted;
      }
    });
  }

  // Animasi counter statistik (hitung naik dari 0 ke data-target)
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (el.dataset.counted === '1') return;
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          const duration = 1200;
          const startTime = performance.now();
          function step(now) {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            el.textContent = Math.round(eased * target).toLocaleString('id-ID');
            if (t === 1) {
              el.dataset.counted = '1';
              observer.unobserve(el);
            } else {
              requestAnimationFrame(step);
            }
          }
          requestAnimationFrame(step);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => observer.observe(c));
  }

  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // Inisialisasi
  document.addEventListener('DOMContentLoaded', loadPosts);
})();