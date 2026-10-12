// Helper function to sanitize URLs
function sanitizeUrl(url) {
  try {
    return new URL(url).toString();
  } catch (e) {
    return url;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Fetch and display sponsors based on their tier level (diamond, gold, silver, bronze)
  function fetchAndDisplaySponsors(containerElement, level) {
    // Fetch sponsor data from JSON file
    fetch('json/sponsors.json')
      .then(response => response.json())
      .then(data => {
        // Get the specific tier array
        const sponsors = data[level];

        // Clear the main container and prepare to inject the new row
        containerElement.innerHTML = '';

        if (sponsors.length > 0) {
          const heading = document.createElement('h2');
          heading.className = "border-bottom p-2 mb-4";
          heading.textContent = level.charAt(0).toUpperCase() + level.slice(1);
          containerElement.appendChild(heading);

          const rowDiv = document.createElement('div');
          rowDiv.className = "row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-5 mb-5";

          // Process each sponsor and generate DOM elements
          sponsors.forEach(function(sponsor) {
            // Skip if no name
            if (!sponsor.name) {
              return;
            }

            const hasImage = !!sponsor.imagePath && sponsor.imagePath.trim() !== '';
            const hasWebsite = !!sponsor.website && sponsor.website.trim() !== '';

            console.log("Processing:", sponsor.name, "| hasImage:", hasImage, "| hasWebsite:", hasWebsite);

            let linkElement = null;
            let imgElement = null;
            let h3Element = null;

            // Case 1: Has image AND website - logo links to website URL
            if (hasImage && hasWebsite) {
              console.log("Case 1:", sponsor.name, "creating linked logo");
              const imagePath = 'images/sponsor-logos/' + sponsor.imagePath;
              const safeName = sponsor.name.replace(/\s+/g, '-');
              const altText = "logo of " + sponsor.name;

              linkElement = document.createElement('a');
              linkElement.href = sponsor.website;
              linkElement.target = "_blank";
              linkElement.rel = "noopener noreferrer";

              imgElement = document.createElement('img');
              imgElement.src = imagePath;
              imgElement.alt = altText;

              linkElement.appendChild(imgElement);

              const card = document.createElement('div');
              card.className = "sponsor-card card-body-standard";
              card.id = "image-sponsor-" + safeName;
              card.style.cssText = "display: flex; align-items: center; justify-content: center; min-height: 250px;";

              const container = document.createElement('div');
              container.className = "col";
              container.appendChild(card);
              card.appendChild(linkElement);
              rowDiv.appendChild(container);
            }

            // Case 2: No image, HAS website - clickable name link
            else if (!hasImage && hasWebsite) {
              console.log("Case 2:", sponsor.name, "creating linked text");
              const safeName = sponsor.name.replace(/\s+/g, '-');

              linkElement = document.createElement('a');
              linkElement.href = sponsor.website;
              linkElement.target = "_blank";
              linkElement.rel = "noopener noreferrer";
              linkElement.className = "text-link";

              h3Element = document.createElement('h3');
              h3Element.className = "text-uppercase";
              h3Element.textContent = sponsor.name;

              linkElement.appendChild(h3Element);

              const card = document.createElement('div');
              card.className = "sponsor-card card-body-standard";
              card.id = "text-sponsor-" + safeName;
              card.style.cssText = "display: flex; align-items: center; justify-content: center; min-height: 250px;";

              const container = document.createElement('div');
              container.className = "col";
              container.appendChild(card);
              card.appendChild(h3Element);  // Append h3 to card
              rowDiv.appendChild(container);
            }

            // Case 3: Has image, NO website - plain logo only
            else if (hasImage && !hasWebsite) {
              const imagePath = 'images/sponsor-logos/' + sponsor.imagePath;
              const safeName = sponsor.name.replace(/\s+/g, '-');
              const altText = "logo of " + sponsor.name;

              imgElement = document.createElement('img');
              imgElement.src = imagePath;
              imgElement.alt = altText;

              const card = document.createElement('div');
              card.className = "sponsor-card card-body-standard";
              card.id = "image-sponsor-" + safeName;
              card.style.cssText = "display: flex; align-items: center; justify-content: center; min-height: 250px;";

              const container = document.createElement('div');
              container.className = "col";
              container.appendChild(card);
              card.appendChild(imgElement);  // Append image to card
              rowDiv.appendChild(container);            }

            // Case 4: No image, no website - plain text only
            else {
              const safeName = sponsor.name.replace(/\s+/g, '-');

              h3Element = document.createElement('h3');
              h3Element.className = "text-uppercase";
              h3Element.textContent = sponsor.name;

              const card = document.createElement('div');
              card.className = "sponsor-card card-body-standard";
              card.id = "text-sponsor-" + safeName;
              card.style.cssText = "display: flex; align-items: center; justify-content: center; min-height: 250px;";

              const container = document.createElement('div');
              container.className = "col";
              container.appendChild(card);
              card.appendChild(h3Element);  // Append h3 to card
              rowDiv.appendChild(container);
            }
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
