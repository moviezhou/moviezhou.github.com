import fs from 'node:fs';

const store = fs.readFileSync('.astro/data-store.json', 'utf8');
console.log('chinese title in cache:', store.includes('站在这堵墙'));
console.log('english slug title in cache:', store.includes('make change'));
console.log('chinese dream title in cache:', store.includes('梦见韩寒徐静蕾'));
