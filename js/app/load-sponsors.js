document.addEventListener("DOMContentLoaded", function () {
  function fetchAndDisplaySponsors(containerElement, level) {
    fetch('json/sponsors.json')
      .then(response => response.json())
      .then(data => {
        // Filter the list based on tier and date logic
        const sponsors = (data || []).filter(sponsor => {
          if (!sponsor.sponsorships || !Array.isArray(sponsor.sponsorships)) {
            return false;
          }

          // A sponsor is included if they have a matching tier AND are currently active
          return sponsor.sponsorships.some(s => {
            const isCorrectTier = s.tier === level;
            let isYearActive = false;

            if (s.year === -1) {
              // Permanent sponsors are always active
              isYearActive = true;
            } else if (typeof s.year === 'number') {
              // A year X means: Sept 1, Year X to Aug 31, Year X+1
              const start = new Date(s.year, 8, 1); // Month 8 is September
              const end = new Date(s.year + 1, 8, 1);
              const now = new Date();
              isYearActive = now >= start && now < end;
            }

            return isCorrectTier && isYearActive;
          });
        });

        // Clear the main container and prepare to inject the new row
        containerElement.innerHTML = '';

        if (sponsors.length > 0) {
          const heading = document.createElement('h2');
          heading.className = "display-6 border-bottom text-center p-2 mb-4";
          heading.textContent = `${level.charAt(0).toUpperCase() + level.slice(1)}`;
          containerElement.appendChild(heading);

          const rowDiv = document.createElement('div');
          rowDiv.className = "row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5";

          sponsors.forEach(sponsor => {
            if (!sponsor.name) return;

            let imageHtml = '';
            // Logic to determine which image/link to show
            if (sponsor.website && sponsor.imagePath) {
              imageHtml = `<a href="${sponsor.website}" target="_blank"><img src="${sponsor.imagePath}" class="card-img-top" alt="${sponsor.name} logo"></a>`;
            } else if (sponsor.website) {
              imageHtml = `<a href="${sponsor.website}" target="_blank"><img src="images/logos/gator-bots.png" class="card-img-top" alt="${sponsor.name} logo"></a>`;
            } else if (sponsor.imagePath) {
              imageHtml = `<img src="${sponsor.imagePath}" class="card-img-top" alt="${sponsor.name} logo">`;
            } else {
              imageHtml = `<img src="images/logos/gator-bots.png" class="card-img-top" alt="${sponsor.name} logo">`;
            }

            const sponsorHtml = `
              <div class="col">
                <div class="card h-100 shadow border-0">
                  ${imageHtml}
                  <div class="card-body">
                    <hr>
                    <h5 class="card-title">${sponsor.name}</h5>
                    <p class="card-text">${sponsor.description}</p>
                  </div>
                </div>
              </div>`;
            rowDiv.innerHTML += sponsorHtml;
          });

          containerElement.appendChild(rowDiv);
        }
      })
      .catch(error => console.error(`Error fetching ${level} sponsorship data:`, error));
  }

  document.querySelectorAll('[data-sponsor-level]').forEach(container => {
    const sponsorLevel = container.dataset.sponsorLevel;
    fetchAndDisplaySponsors(container, sponsorLevel);
  });
});
