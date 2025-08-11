fetch('html/nav.html')
    .then(response => response.text())
    .then(htmlContent => {
        const container = document.getElementById('nav');
        container.innerHTML = htmlContent;
    })
    .catch(error => console.error('Error loading external content:', error));