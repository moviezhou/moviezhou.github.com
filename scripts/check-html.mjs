import fs from 'node:fs';

const html = fs.readFileSync(0, 'utf8');
const checks = [
  '站在这堵墙前，做哪怕是一点点的改变',
  '梦见韩寒徐静蕾',
  '这样长久的僵持究竟是为了什么？',
  'make change',
  'yet another dream',
];
for (const s of checks) {
  console.log(`${s}: ${html.includes(s)}`);
}
