import React, { useMemo, useState } from 'react';

const cameraSpecs: Record<string, string> = {
  'Sony A7R V': 'Sony Alpha 7R V camera, ultra-high resolution, tack-sharp modern details, rich textures',
  'Canon EOS R5': 'Canon EOS R5 camera, vibrant skin tones, cinematic lifelike color rendering',
  'Leica M6 35mm': 'Leica M6 rangefinder, 35mm analog film look, organic nostalgic grain',
  'iPhone 15 Pro': 'Apple iPhone 15 Pro Max camera shot, smart HDR tone-mapping, crisp mobile photo style'
};

const styles: Record<string, string> = {
  Cinematic: 'high-end cinema look, dramatic mood, photorealistic textures',
  'Anime / Webtoon': 'vibrant anime style, clean cel shading, expressive hand-drawn aesthetics',
  '3D Render / Game': 'Unreal Engine 5 style, stylized 3D character, advanced materials',
  'Fantasy Painting': 'oil-painting texture, rich brushstrokes, ethereal fantasy lighting',
  'Pixel Art': 'retro pixel art, limited color palette, nostalgic game aesthetic'
};

function buildPrompt(seed: string, style: string, camera: string, ratio: string, platform: string) {
  const subject = seed.trim() || 'A majestic mechanical guardian owl perched in an ancient overgrown library';
  const base = [
    `${styles[style]} of ${subject}`,
    'clear central subject, expressive silhouette, intricate micro-details, premium composition',
    `shot on ${cameraSpecs[camera]}`,
    'layered foreground, midground and background, atmospheric haze, cinematic depth of field',
    'soft directional key light, colored ambient bounce, thin rim light, polished color grading',
    'high detail, sharp focus, readable visual hierarchy, production quality image prompt'
  ].join('. ');

  if (platform === 'Midjourney') return `${base} --ar ${ratio} --style raw --v 6.1`;
  if (platform === 'Stable Diffusion') return `${base}, masterwork. Negative prompt: blurry, low quality, malformed hands, distorted face, extra limbs, watermark, text artifacts`;
  return base;
}

export default function App() {
  const [seed, setSeed] = useState('');
  const [style, setStyle] = useState('Cinematic');
  const [camera, setCamera] = useState('Sony A7R V');
  const [ratio, setRatio] = useState('16:9');
  const [platform, setPlatform] = useState('Midjourney');
  const [toast, setToast] = useState('');

  const prompt = useMemo(() => buildPrompt(seed, style, camera, ratio, platform), [seed, style, camera, ratio, platform]);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setToast('프롬프트를 복사했습니다.');
    window.setTimeout(() => setToast(''), 2000);
  }

  function randomSeed() {
    const seeds = [
      'A cyberpunk cat android eating ramen alone in a rainy neon alley',
      'A cosmic gardener planting a glowing blue seed on a ruined moon',
      'A quiet librarian walking through a floating library full of holographic books',
      'A steampunk airship captain watching sunrise over a cloud ocean'
    ];
    setSeed(seeds[Math.floor(Math.random() * seeds.length)]);
  }

  return (
    <main className="shell">
      <style>{css}</style>
      {toast && <div className="toast">{toast}</div>}
      <section className="panel left">
        <div className="brand"><div className="mark">ip</div><div><h1>image-prompter</h1><p>이미지 생성 프롬프트를 빠르게 설계하고 복사하는 스튜디오입니다.</p></div></div>
        <label>Concept Seed</label>
        <textarea value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="예: 네온 사인이 반짝이는 우천 속 사이버펑크 골목길에서 홀로 라멘을 먹고 있는 고양이 안드로이드" />
        <div className="buttons"><button onClick={randomSeed}>랜덤 아이디어</button><button className="primary" onClick={copyPrompt}>프롬프트 복사</button></div>
        <div className="grid">
          <Control label="Style" value={style} onChange={setStyle} options={Object.keys(styles)} />
          <Control label="Camera" value={camera} onChange={setCamera} options={Object.keys(cameraSpecs)} />
          <Control label="Aspect Ratio" value={ratio} onChange={setRatio} options={['1:1', '16:9', '9:16', '4:3']} />
          <Control label="Platform" value={platform} onChange={setPlatform} options={['Midjourney', 'Stable Diffusion', 'Normal']} />
        </div>
      </section>
      <section className="panel right"><span>Output Console</span><h2>Generated Prompt</h2><pre>{prompt}</pre></section>
    </main>
  );
}

function Control({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <div><label>{label}</label><select value={value} onChange={(e) => onChange(e.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></div>;
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap');
*{box-sizing:border-box}body{margin:0;font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:radial-gradient(circle at top left,#d1fae5,transparent 34rem),linear-gradient(135deg,#f8fafc,#ecfdf5);color:#0f172a}.shell{min-height:100vh;display:grid;grid-template-columns:minmax(320px,.9fr) minmax(320px,1.1fr);gap:24px;padding:28px}.panel{border:1px solid rgba(15,118,110,.14);background:rgba(255,255,255,.88);box-shadow:0 30px 90px rgba(15,23,42,.09);border-radius:32px;padding:32px}.left{display:flex;flex-direction:column;gap:22px}.brand{display:flex;gap:16px;align-items:center}.mark{width:54px;height:54px;border-radius:18px;display:grid;place-items:center;background:#052e2b;color:#6ee7b7;font-weight:900}h1,h2{margin:0;letter-spacing:-.04em}h1{font-size:clamp(32px,5vw,56px)}p{margin:8px 0 0;color:#64748b;line-height:1.7}label{display:block;margin-bottom:8px;font-size:12px;color:#0f766e;font-weight:800;letter-spacing:.08em;text-transform:uppercase}textarea{min-height:240px;width:100%;resize:vertical;border:1px solid #dbeafe;outline:0;border-radius:24px;padding:18px;background:#fbfffd;color:#0f172a;line-height:1.7}select{width:100%;border:1px solid #dbeafe;border-radius:16px;padding:12px 14px;background:white;outline:0}textarea:focus,select:focus{border-color:#10b981;box-shadow:0 0 0 4px rgba(16,185,129,.12)}.buttons{display:flex;flex-wrap:wrap;gap:12px}button{border:0;cursor:pointer;border-radius:999px;padding:12px 18px;font-weight:800;background:#ecfdf5;color:#065f46;border:1px solid rgba(16,185,129,.22)}button.primary{background:#064e3b;color:white;box-shadow:0 12px 28px rgba(6,78,59,.24)}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.right{display:flex;flex-direction:column}.right span{color:#047857;font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.right h2{font-size:30px;margin-top:8px}pre{flex:1;min-height:480px;overflow:auto;white-space:pre-wrap;margin:22px 0 0;padding:24px;border-radius:24px;background:#061b18;color:#d1fae5;line-height:1.75;font-size:14px}.toast{position:fixed;z-index:10;top:18px;left:50%;transform:translateX(-50%);background:#020617;color:white;padding:12px 18px;border-radius:999px;font-size:13px;font-weight:800;box-shadow:0 18px 42px rgba(2,6,23,.25)}@media(max-width:900px){.shell{grid-template-columns:1fr;padding:14px}.grid{grid-template-columns:1fr}pre{min-height:320px}}
`;
