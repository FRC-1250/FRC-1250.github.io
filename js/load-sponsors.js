// Partially created by Google Gemini
document.addEventListener("DOMContentLoaded", function () {
  function fetchAndDisplaySponsors(containerElement, level) {
    fetch('json/sponsors.json')
      .then(response => response.json())
      .then(data => {
        const sponsors = data[level];

        // Clear the main container and prepare to inject the new row
        containerElement.innerHTML = '';

        if (sponsors && sponsors.length > 0) {
          // Create and append the h1 heading for the sponsor level
          const heading = document.createElement('h1');
          heading.textContent = `${level.charAt(0).toUpperCase() + level.slice(1)} Sponsors`;
          containerElement.appendChild(heading);

          // Create the parent div with the specified classes
          const rowDiv = document.createElement('div');
          rowDiv.className = "row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4";

          sponsors.forEach(sponsor => {
            const imageHtml = sponsor.website ?
              `<a href="${sponsor.website}" target="_blank">
                <img src="${sponsor.imagePath}" class="card-img-top" alt="${sponsor.name} logo">
              </a>` :
              `<img src="${sponsor.imagePath}" class="card-img-top" alt="${sponsor.name} logo">`;

            const sponsorHtml = `
              <div class="col">
                <div class="card border border-5 border-black h-100">
                  ${imageHtml}
                  <div class="card-body">
                  <hr>
                    <h5 class="card-title">${sponsor.name}</h5>
                    <p class="card-text">${sponsor.description}</p>
                  </div>
                </div>
              </div>
            `;
            // Append each sponsor card directly to the new rowDiv
            rowDiv.innerHTML += sponsorHtml;
          });

          // Append the complete row with all cards to the main container
          containerElement.appendChild(rowDiv);

        }
      })
      .catch(error => console.error(`Error fetching ${level} sponsorship data:`, error));
  }

  // Find all sponsor containers and load content based on their data-sponsor-level attribute
  document.querySelectorAll('[data-sponsor-level]').forEach(container => {
    const sponsorLevel = container.dataset.sponsorLevel;
    fetchAndDisplaySponsors(container, sponsorLevel);
  });
});