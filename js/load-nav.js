fetch('html/nav.html')
    .then(response => response.text())
    .then(htmlContent => {
        const container = document.getElementById('nav');
        container.innerHTML = htmlContent;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = container.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }

            link.addEventListener('click', () => {
                const navbarCollapse = document.getElementById('collapsibleNavbar');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            });
        });
    })
    .catch(error => console.error('Error loading external content:', error));