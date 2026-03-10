const http = require('http');

http.get('http://asilmedia.org/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
        const descMatch = data.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) || data.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
        const keysMatch = data.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i) || data.match(/<meta\s+content=["']([^"']+)["']\s+name=["']keywords["']/i);
        const logoImg = data.match(/<img[^>]+src=["']([^"']+logo[^"']+)["'][^>]*>/i) || data.match(/<img[^>]+src=["']([^"']+)["'][^>]*class=["'][^"']*logo[^"']*["']/i);
        const ogImage = data.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);

        console.log("TITLE:", titleMatch ? titleMatch[1] : 'none');
        console.log("DESCRIPTION:", descMatch ? descMatch[1] : 'none');
        console.log("KEYWORDS:", keysMatch ? keysMatch[1] : 'none');
        console.log("LOGO SRC:", logoImg ? logoImg[1] : 'none');
        console.log("OG IMAGE:", ogImage ? ogImage[1] : 'none');

        // Fallback: print first 5 image tags if no logo found
        if (!logoImg) {
            const imgs = data.match(/<img[^>]+>/g) || [];
            console.log("OTHER IMGS:", imgs.slice(0, 5).join('\n'));
        }
    });
}).on('error', err => console.error(err));
