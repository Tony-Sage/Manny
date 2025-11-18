// search.js
document.addEventListener('DOMContentLoaded', () => {
  // Active nav highlight
  (function() {
    const links = document.querySelectorAll('.nav-link');
    const path = window.location.pathname.split('/').pop() || 'store.html';
    links.forEach(a => {
      const href = (a.getAttribute('href') || '').split('/').pop();
      if (!href) return;
      if (href === path) a.classList.add('active');
      else a.classList.remove('active');
    });
  })();

  // Mobile sidebar (optional)
  (function() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('#mobileSidebar');
    if (!hamburger || !sidebar) return;

    const closeBtn = sidebar.querySelector('.mobile-close');

    function openSidebar() {
      sidebar.classList.add('open');
      sidebar.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
    }
    function closeSidebar() {
      sidebar.classList.remove('open');
      sidebar.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
    }
    function toggleSidebar(e) { e && e.stopPropagation(); sidebar.classList.contains('open') ? closeSidebar() : openSidebar(); }

    hamburger.addEventListener('click', toggleSidebar);
    if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeSidebar(); });

    document.addEventListener('click', (e) => {
      if (!sidebar.classList.contains('open')) return;
      if (sidebar.contains(e.target) || hamburger.contains(e.target)) return;
      closeSidebar();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
    });

    sidebar.addEventListener('click', (e) => e.stopPropagation());
  })();
});