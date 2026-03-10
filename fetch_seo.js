const http = require('http');
const fs = require('fs');

http.get('http://asilmedia.org/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
        const descMatch = data.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) || data.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
        const keysMatch = data.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i) || data.match(/<meta\s+content=["']([^"']+)["']\s+name=["']keywords["']/i);

        // look for img with logo in src or class or alt
        const imgs = data.match(/<img[^>]+>/g) || [];
        let logoImg = imgs.find(img => img.toLowerCase().includes('logo'));

        const ogImage = data.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);

        const result = {
            title: titleMatch ? titleMatch[1] : 'none',
            description: descMatch ? descMatch[1] : 'none',
            keywords: keysMatch ? keysMatch[1] : 'none',
            logo: logoImg ? logoImg : 'none',
            ogImage: ogImage ? ogImage[1] : 'none'
        };

        fs.writeFileSync('asilmedia_seo.json', JSON.stringify(result, null, 2));
        console.log("Done. Saved to asilmedia_seo.json");
    });
}).on('error', err => console.error(err));
