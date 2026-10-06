const fs = require('fs');
const path = require('path');

// Paths - Adjusted for a 'scripts' subdirectory
// This assumes your structure is:
// /project-root
//   /sponsors (contains folders like pit-podcast/)
//   /json (where the final sponsors.json will go)
//   /scripts (where this script lives)
const sponsorsDir = path.join(__dirname, '../sponsors');
const outputFilePath = path.join(__dirname, '../json/sponsors.json');

function buildSponsors() {
    const allSponsors = [];

    if (!fs.existsSync(sponsorsDir)) {
        console.error(`Error: Directory ${sponsorsDir} does not exist.`);
        process.exit(1);
    }

    const folders = fs.readdirSync(sponsorsDir);

    folders.forEach(folder => {
        const folderPath = path.join(sponsorsDir, folder);
        
        if (fs.lstatSync(folderPath).isDirectory()) {
            const files = fs.readdirSync(folderPath);
            
            files.forEach(file => {
                if (file.endsWith('.json')) {
                    const filePath = path.join(folderPath, file);
                    try {
                        let sponsorData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                        
                        // AUTOMATIC PATH RESOLUTION:
                        // If the imagePath is just "pit-podcast.png", 
                        // this turns it into "sponsors/pit--podcast/pit-podcast.png"
                        if (sponsorData.imagePath && !sponsorData.imagePath.startsWith('http')) {
                            // Only prepend if it's not already a full path or relative to root
                            if (!sponsorData.imagePath.includes('/')) {
                                sponsorData.imagePath = `sponsors/${folder}/${sponsorData.imagePath}`;
                            }
                        }

                        allSponsors.push(sponsorData);
                    } catch (e) {
                        console.error(`Error parsing ${filePath}:`, e);
                    }
                }
            });
        }
    });

    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(allSponsors, null, 2));
    console.log(`Successfully compiled ${allSponsors.length} sponsors into ${outputFilePath}`);
}

buildSponsors();
