export function uid(){ return Math.random().toString(36).slice(2)+Date.now().toString(36) }
export function esc(v){ return String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;') }
