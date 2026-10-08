document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("footer");

    if (container && typeof fetch !== 'undefined') {
        fetch("components/footer.html")
            .then(response => response.text())
            .then(html => {
                container.innerHTML = html;
            })
            .catch(error => {
                console.error("Error loading footer:", error);
            });
    }

    // Update current year in footer dynamically
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
});
