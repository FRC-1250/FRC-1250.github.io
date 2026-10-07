const fs = require('fs');
const path = require('path');

const sponsorsDir = 'sponsors';
const outputFilePath = 'json/sponsors.json';

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

                        if (sponsorData.imagePath && !sponsorData.imagePath.startsWith('http')) {
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
