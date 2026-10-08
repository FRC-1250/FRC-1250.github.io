document.addEventListener("DOMContentLoaded", function () {
  // Fetch and display sponsors based on their tier level (diamond, gold, silver, bronze)
  function fetchAndDisplaySponsors(containerElement, level) {
    // Fetch sponsor data from JSON file
    fetch('json/sponsors.json')
      .then(response => response.json())
      .then(data => {
        // Filter sponsors based on tier and activity status
        const sponsors = (data || []).filter(sponsor => {
          if (!sponsor.sponsorships || !Array.isArray(sponsor.sponsorships)) {
            return false;
          }

          // Check if sponsor matches the requested tier level
          for (const sponsorship of sponsor.sponsorships) {
            const isCorrectTier = sponsorship.tier === level;

            // Determine if the sponsor is currently active
            let isActive = false;
            if (sponsorship.year === -1) {
              // Permanent sponsors are always active
              isActive = true;
            } else if (typeof sponsorship.year === 'number') {
              // Year X means: Sept 1, Year X to Aug 31, Year X+1
              const start = new Date(sponsorship.year, 8, 1); // Month 8 is September
              const end = new Date(sponsorship.year + 1, 8, 1);
              isActive = new Date() >= start && new Date() < end;
            }

            if (isCorrectTier && isActive) {
              return true;
            }
          }
          return false;
        });

        // Clear the main container and prepare to inject the new row
        containerElement.innerHTML = '';

        if (sponsors.length > 0) {
          const heading = document.createElement('h2');
          heading.className = "border-bottom p-2 mb-4";
          heading.textContent = level.charAt(0).toUpperCase() + level.slice(1);
          containerElement.appendChild(heading);

          const rowDiv = document.createElement('div');
          rowDiv.className = "row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4 mb-5";

          // Process each sponsor and generate appropriate HTML
          sponsors.forEach(function(sponsor) {
            if (!sponsor.name) {
              return;
            }

            // Validate if the sponsor has a legitimate image path
            const imagePath = sponsor.imagePath;
            const isValidImage =
              imagePath !== null &&
              imagePath !== undefined &&
              typeof imagePath === 'string' &&
              imagePath.trim() !== '';

            // Determine which HTML template to use based on image availability
            let sponsorHTML;

            if (isValidImage) {
              // Generate HTML for sponsors with logos
              const safeName = sponsor.name.replace(/\s+/g, '-');
              const altText = "logo of " + sponsor.name;

              sponsorHTML = `
                <div class="col">
                  <div class="sponsor-card" id="image-sponsor-${safeName} has-image" style="display: flex; align-items: center; justify-content: center; min-height: 250px;">
                    <img src="${imagePath}" alt="${altText}">
                  </div>
                </div>
              `;
            } else {
              // Generate HTML for sponsors without images (text only)
              const safeName = sponsor.name.replace(/\s+/g, '-');

              sponsorHTML = `
                <div class="col">
                  <div class="sponsor-card" id="text-sponsor-${safeName}" style="display: flex; align-items: center; justify-content: center; min-height: 250px;">
                    <h3 class="text-uppercase" id="${safeName}">${sponsor.name}</h3>
                  </div>
                </div>
              `;
            }

            rowDiv.innerHTML += sponsorHTML;
          });

          containerElement.appendChild(rowDiv);
        }
      })
      .catch(function(error) {
        console.error("Error fetching " + level + " sponsorship data:", error);
      });
  }

  // Find all container elements with the sponsor-level attribute and display sponsors for each
  document.querySelectorAll('[data-sponsor-level]').forEach(function(container) {
    const sponsorLevel = container.dataset.sponsorLevel;
    fetchAndDisplaySponsors(container, sponsorLevel);
  });
});
