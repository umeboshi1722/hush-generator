let currentHash = '';

async function runHash() {
  const raw = document.getElementById('inputText').value;
  if (raw === '') {
    setResult('', null);
    return;
  }

  const encoded = new TextEncoder().encode(raw);
  const hashBuf = await crypto.subtle.digest('SHA-512', encoded);
  const bytes = new Uint8Array(hashBuf);

  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);

  currentHash = base64;
  setResult(base64, getTrimmed(base64));
}

function updateTrim() {
  if (!currentHash) return;
  const trimEl = document.getElementById('trimText');
  const box = document.getElementById('trimResult');
  const trimmed = getTrimmed(currentHash);
  if (trimmed !== null) {
    trimEl.textContent = trimmed;
    box.classList.remove('empty');
  } else {
    trimEl.textContent = '—';
    box.classList.add('empty');
  }
}

function getTrimmed(hash) {
  const val = parseInt(document.getElementById('trimLen').value, 10);
  if (!val || val < 1) return null;
  return hash.slice(0, val);
}

function setResult(full, trimmed) {
  const fullEl = document.getElementById('fullText');
  const fullBox = document.getElementById('fullResult');
  if (full) {
    fullEl.textContent = full;
    fullBox.classList.remove('empty');
  } else {
    fullEl.textContent = '—';
    fullBox.classList.add('empty');
  }

  const trimEl = document.getElementById('trimText');
  const trimBox = document.getElementById('trimResult');
  if (trimmed !== null && trimmed !== '') {
    trimEl.textContent = trimmed;
    trimBox.classList.remove('empty');
  } else {
    trimEl.textContent = '—';
    trimBox.classList.add('empty');
  }
}

function copyText(spanId, btnId) {
  const text = document.getElementById(spanId).textContent;
  if (!text || text === '—') return;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById(btnId);
    btn.classList.add('copied');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      コピー完了`;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        コピー`;
    }, 1800);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputText').addEventListener('keydown', e => {
    if (e.key === 'Enter') runHash();
  });
});
