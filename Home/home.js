// home.js

document.addEventListener('DOMContentLoaded', () => {
  // --- Active nav highlighting (page-based)
  (function highlightNav() {
    const links = document.querySelectorAll('.nav-link');
    const current = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(a => {
      const href = (a.getAttribute('href') || '').split('/').pop();
      if (!href) return;
      if (href === current || (current === '' && href === 'index.html')) a.classList.add('active');
      else a.classList.remove('active');
    });
  })();

  // --- Hamburger & mobile sidebar (optional)
  (function wireSidebar() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('#mobileSidebar');
    if (!hamburger || !sidebar) return;

    const closeBtn = sidebar.querySelector('.mobile-close');

    const open = () => {
      sidebar.classList.add('open');
      sidebar.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
    };
    const close = () => {
      sidebar.classList.remove('open');
      sidebar.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
    };
    const toggle = (ev) => {
      if (ev) ev.stopPropagation();
      sidebar.classList.contains('open') ? close() : open();
    };

    hamburger.addEventListener('click', toggle);
    if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); close(); });

    // clicking outside closes sidebar (but ignore clicks on hamburger)
    document.addEventListener('click', (e) => {
      if (!sidebar.classList.contains('open')) return;
      if (sidebar.contains(e.target) || hamburger.contains(e.target)) return;
      close();
    });

    // Esc closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) close();
    });

    // prevent accidental propagation from inside sidebar
    sidebar.addEventListener('click', (e) => e.stopPropagation());
  })();
});
