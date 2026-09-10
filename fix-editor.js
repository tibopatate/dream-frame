const fs = require('fs');
let content = fs.readFileSync('components/page-builder/ShopifyThemeEditor.tsx', 'utf8');

content = content.replace(/bg-\[#050504\]/g, 'bg-slate-100');
content = content.replace(/text-white/g, 'text-slate-900');
content = content.replace(/bg-neutral-950/g, 'bg-white');
content = content.replace(/border-neutral-800/g, 'border-slate-200');
content = content.replace(/bg-neutral-900\/50/g, 'bg-slate-50');
content = content.replace(/bg-neutral-900/g, 'bg-white');
content = content.replace(/text-neutral-400/g, 'text-slate-500');
content = content.replace(/border-neutral-700/g, 'border-slate-300');
content = content.replace(/hover:bg-neutral-800/g, 'hover:bg-slate-50');
content = content.replace(/text-amber-400/g, 'text-red-600');
content = content.replace(/bg-amber-400/g, 'bg-red-600');
content = content.replace(/border-amber-400/g, 'border-red-600');

fs.writeFileSync('components/page-builder/ShopifyThemeEditor.tsx', content);
