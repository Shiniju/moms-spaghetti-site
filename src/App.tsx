import React, { useMemo, useState } from 'react';

const characters = [
  'A futuristic cyberpunk hacker',
  'A wandering cosmic nomad',
  'An ancient celestial wizard',
  'A steampunk airship captain',
  'A majestic fantasy elven queen',
  'A neon-glowing android',
  'A mysterious noir detective',
  'A legendary samurai under falling cherry blossoms',
  'A deep-sea diver discovering an underwater city',
  'A cosmic deity weaving galaxies',
  'A cute fluffy space hamster in a tiny spacesuit',
  'A futuristic virtual reality idol performing on stage'
];

const situations = [
  'sitting in a cozy retro cafe during a rainy afternoon',
  'standing on a futuristic rooftop overlooking a neon metropolis at midnight',
  'discovering a hidden glowing cave filled with crystal formations',
  'navigating a bustling night market filled with holographic lanterns',
  'meditating beneath a massive glowing tree of life in a magical forest',
  'repairing a colossal broken robot in a steampunk hangar',
  'gazing at a massive swirling galaxy from a glass observatory',
  'walking down a wet reflection-heavy alleyway in cyberpunk Neo-Seoul',
  'floating inside a botanical space station',
  'searching for star fragments during a meteor shower',
  'crafting a glowing sword inside a volcanic forge',
  'crossing a rope bridge over a misty jungle canyon'
];

const cameraSpecs: Record<string, string> = {
  'Sony A7R V': 'Sony Alpha 7R V camera, ultra-high resolution, tack-sharp modern details, rich textures',
  'Canon EOS R5': 'Canon EOS R5 camera, vibrant skin tones, cinematic lifelike color rendering, commercial beauty photography style',
  'Leica M6 35mm': 'Leica M6 rangefinder, 35mm analog film look, organic nostalgic grain, warm muted color palette',
  'Polaroid SX-70': 'Polaroid SX-70 instant camera effect, faded pastel colors, soft glow, nostalgic instant photo texture',
  'iPhone 15 Pro': 'Apple iPhone 15 Pro Max camera shot, smart HDR tone-mapping, crisp modern mobile photograph style',
  'Galaxy S24 Ultra': 'Samsung Galaxy S24 Ultra camera, vivid color saturation, sharp digital detailing, ultra-wide mobile look',
  'Motorola Razr V3': 'Year 2004 Motorola Razr V3 flip phone camera, pixelated VGA quality, compression noise, low-fidelity mobile sensor'
};

const stylePresets: Record<string, string> = {
  Cinematic: 'high-end cinema look, dramatic mood, photorealistic textures, anamorphic lens feeling',
  'Anime / Webtoon': 'vibrant anime style, clean cel shading, expressive hand-drawn aesthetics, magical lighting',
  '3D Render / Game': 'Unreal Engine 5 style, stylized 3D character, advanced materials, game cinematic polish',
  'Fantasy Painting': 'oil-painting texture, rich brushstrokes, ethereal fantasy lighting, classical composition',
  'Pixel Art': 'retro pixel art, limited color palette, clean grid alignment, nostalgic game aesthetic'
};

type PromptData = {
  subject_details: {
    main_subject: { identity: string; pose: string; expression: string; micro_details: string };
    attire_and_style: { clothing: string; materials: string; accessories: string };
  };
  environment_and_background: {
    location: string;
    background_elements: string[];
    depth_layers: { foreground: string; midground: string; background: string };
  };
  composition_and_camera: { shot_type: string; camera_angle: string; lens_spec: string; framing_rule: string };
  lighting_and_atmosphere: {
    primary_light: string;
    secondary_light: string;
    rim_light: string;
    mood: string;
    color_palette: { primary_hex: string; secondary_hex: string; accent_hex: string; background_hex: string };
  };
  rendering_and_quality: { art_style: string; texture_quality: string; engine_modifiers: string; negative_prompt: string };
};

const initialPromptData: PromptData = {
  subject_details: {
    main_subject: {
      identity: 'A majestic mechanical guardian owl',
      pose: 'perched on an ancient moss-covered marble pillar',
      expression: 'sharp and vigilant, brass eyes glowing with wisdom',
      micro_details: 'etched golden runes on feathers, complex brass joints, steam rising slightly'
    },
    attire_and_style: {
      clothing: 'ornate obsidian armor chestplate',
      materials: 'brushed copper, weathered granite, glowing turquoise core',
      accessories: 'a small clockwork telescope attached to its right eye'
    }
  },
  environment_and_background: {
    location: 'A forgotten ancient library overgrown with giant ferns',
    background_elements: ['cascading dust motes', 'broken stone archways', 'shelves with decaying books', 'sunbeams cutting through the mist'],
    depth_layers: {
      foreground: 'vibrant green hanging ivy dripping with dew',
      midground: 'the guardian owl sitting proudly on its pillar base',
      background: 'endless towering bookshelves fading into dark shadows'
    }
  },
  composition_and_camera: {
    shot_type: 'Cinematic Medium Portrait',
    camera_angle: 'Low-angle heroic view',
    lens_spec: cameraSpecs['Sony A7R V'],
    framing_rule: 'Symmetrical centerpiece with organic golden spiral flow'
  },
  lighting_and_atmosphere: {
    primary_light: 'Divine golden morning light from high cathedral windows',
    secondary_light: 'Turquoise bioluminescent glow from moss below',
    rim_light: 'Soft halo rim light accentuating the mechanical feathers',
    mood: 'Mystical, grand, quiet, lost in eternal time',
    color_palette: {
      primary_hex: '#ffb938',
      secondary_hex: '#14b8a6',
      accent_hex: '#f59e0b',
      background_hex: '#061b18'
    }
  },
  rendering_and_quality: {
    art_style: 'High-fidelity photorealistic concept art',
    texture_quality: 'Microscopic detail, sharp focus on mechanical engraving, 8k resolution',
    engine_modifiers: 'Unreal Engine 5 path-tracer, global illumination, atmospheric fog depth',
    negative_prompt: 'blurry, generic, plastic, low contrast, deformed anatomy, extra limbs, watermark'
  }
};

function createFallbackData(seed: string, style: string, camera: string): PromptData {
  const cleanSeed = seed.trim() || 'A luminous dreamlike character in a cinematic world';
  return {
    subject_details: {
      main_subject: {
        identity: cleanSeed,
        pose: 'posed as the clear central hero of the scene',
        expression: 'focused, emotionally vivid, and visually memorable',
        micro_details: 'fine surface textures, expressive silhouette, carefully described symbolic details'
      },
      attire_and_style: {
        clothing: 'style-appropriate layered outfit with premium visual detail',
        materials: 'contrasting matte and glossy materials, tactile fabric, metal and glass accents',
        accessories: 'one distinctive prop that reinforces the story of the image'
      }
    },
    environment_and_background: {
      location: 'a richly staged cinematic environment tailored to the prompt concept',
      background_elements: ['atmospheric particles', 'layered architecture', 'soft environmental haze', 'subtle story objects'],
      depth_layers: {
        foreground: 'soft framing elements with shallow depth of field',
        midground: 'the main subject with crisp focus and strong silhouette',
        background: 'large-scale scenery fading into color-rich atmospheric depth'
      }
    },
    composition_and_camera: {
      shot_type: 'Cinematic portrait composition',
      camera_angle: 'slightly low angle with confident subject presence',
      lens_spec: cameraSpecs[camera],
      framing_rule: 'balanced rule-of-thirds composition with a strong leading-line flow'
    },
    lighting_and_atmosphere: {
      primary_light: 'soft directional key light with cinematic contrast',
      secondary_light: 'colored ambient bounce light from the environment',
      rim_light: 'thin rim light separating the subject from the background',
      mood: stylePresets[style],
      color_palette: {
        primary_hex: '#f6c15a',
        secondary_hex: '#18b7a6',
        accent_hex: '#8b5cf6',
        background_hex: '#07111f'
      }
    },
    rendering_and_quality: {
      art_style: `${style} image prompt, ${stylePresets[style]}`,
      texture_quality: 'high detail, polished production quality, crisp textures, readable visual hierarchy',
      engine_modifiers: 'global illumination, volumetric light, depth of field, cinematic color grading',
      negative_prompt: 'blurry, low quality, malformed hands, distorted face, extra limbs, watermark, text artifacts'
    }
  };
}

function compilePromptString(data: PromptData, platform: string, aspectRatio: string) {
  const sub = data.subject_details;
  const env = data.environment_and_background;
  const cam = data.composition_and_camera;
  const light = data.lighting_and_atmosphere;
  const rend = data.rendering_and_quality;

  const parts = [
    `${rend.art_style} of ${sub.main_subject.identity}, ${sub.main_subject.pose}, expression: ${sub.main_subject.expression}, ${sub.main_subject.micro_details}`,
    `wearing ${sub.attire_and_style.clothing}, made of ${sub.attire_and_style.materials}, accessorized with ${sub.attire_and_style.accessories}`,
    `set in ${env.location}, with ${env.background_elements.join(', ')}`,
    `depth layers: foreground ${env.depth_layers.foreground}, midground ${env.depth_layers.midground}, background ${env.depth_layers.background}`,
    `${cam.shot_type}, ${cam.camera_angle}, shot on ${cam.lens_spec}, ${cam.framing_rule}`,
    `lighting: ${light.primary_light}, ${light.secondary_light}, ${light.rim_light}; mood: ${light.mood}`,
    `color palette: ${Object.values(light.color_palette).join(', ')}`,
    `${rend.texture_quality}, ${rend.engine_modifiers}`
  ];

  const compiled = parts.join('. ').replace(/\s+/g, ' ').trim();
  if (platform === 'Midjourney') return `${compiled} --ar ${aspectRatio} --style raw --v 6.1`;
  if (platform === 'Stable Diffusion') return `${compiled}, extremely detailed, masterwork. Negative prompt: ${rend.negative_prompt}`;
  return compiled;
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export default function App() {
  const [userPrompt, setUserPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Cinematic');
  const [selectedCamera, setSelectedCamera] = useState('Sony A7R V');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [platform, setPlatform] = useState('Midjourney');
  const [promptData, setPromptData] = useState<PromptData>(initialPromptData);
  const [tab, setTab] = useState<'prompt' | 'json'>('prompt');
  const [toast, setToast] = useState('');

  const compiledPrompt = useMemo(() => compilePromptString(promptData, platform, aspectRatio), [promptData, platform, aspectRatio]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  }

  function randomize() {
    const character = characters[Math.floor(Math.random() * characters.length)];
    const situation = situations[Math.floor(Math.random() * situations.length)];
    setUserPrompt(`${character} ${situation}.`);
    showToast('새 아이디어가 조합되었습니다.');
  }

  function generatePrompt() {
    const next = createFallbackData(userPrompt, selectedStyle, selectedCamera);
    setPromptData(next);
    showToast('구조화 프롬프트가 생성되었습니다.');
  }

  async function handleCopy(text: string, message: string) {
    try {
      await copyText(text);
      showToast(message);
    } catch {
      showToast('클립보드 복사 권한이 필요합니다.');
    }
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(promptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'promptai_schema.json';
    anchor.click();
    URL.revokeObjectURL(url);
    showToast('JSON 파일을 내보냈습니다.');
  }

  return (
    <main className="app-shell">
      <style>{css}</style>
      {toast && <div className="toast">{toast}</div>}

      <section className="hero panel">
        <div className="brand-row">
          <div className="logo-mark">P</div>
          <div>
            <h1>Promptai PRO Studio</h1>
            <p>이미지 생성 프롬프트를 구조화 JSON과 자연어 프롬프트로 변환합니다.</p>
          </div>
        </div>

        <label className="label">Concept Seed</label>
        <textarea
          value={userPrompt}
          onChange={(event) => setUserPrompt(event.target.value)}
          placeholder="예: 네온 사인이 반짝이는 우천 속 사이버펑크 골목길에서 홀로 라멘을 먹고 있는 고양이 안드로이드"
        />

        <div className="toolbar">
          <button className="ghost" onClick={randomize}>랜덤 아이디어 셔플</button>
          <button className="primary" onClick={generatePrompt}>구조화 프롬프트 컴파일</button>
        </div>

        <div className="control-grid">
          <div>
            <label className="label">Camera Signature</label>
            <select value={selectedCamera} onChange={(event) => setSelectedCamera(event.target.value)}>
              {Object.keys(cameraSpecs).map((camera) => <option key={camera}>{camera}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Style</label>
            <select value={selectedStyle} onChange={(event) => setSelectedStyle(event.target.value)}>
              {Object.keys(stylePresets).map((style) => <option key={style}>{style}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Aspect Ratio</label>
            <select value={aspectRatio} onChange={(event) => setAspectRatio(event.target.value)}>
              {['1:1', '16:9', '9:16', '4:3', '3:2'].map((ratio) => <option key={ratio}>{ratio}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Platform</label>
            <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
              {['Midjourney', 'Stable Diffusion', 'Normal'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="workspace panel">
        <div className="workspace-header">
          <div>
            <span className="eyebrow">Holographic Workspace</span>
            <h2>Output Console</h2>
          </div>
          <div className="tabs">
            <button className={tab === 'prompt' ? 'active' : ''} onClick={() => setTab('prompt')}>자연어</button>
            <button className={tab === 'json' ? 'active' : ''} onClick={() => setTab('json')}>JSON</button>
          </div>
        </div>

        {tab === 'prompt' ? (
          <pre className="output">{compiledPrompt}</pre>
        ) : (
          <pre className="output json">{JSON.stringify(promptData, null, 2)}</pre>
        )}

        <div className="toolbar bottom">
          <button className="ghost" onClick={() => handleCopy(compiledPrompt, '자연어 프롬프트를 복사했습니다.')}>프롬프트 복사</button>
          <button className="ghost" onClick={() => handleCopy(JSON.stringify(promptData, null, 2), 'JSON 구조를 복사했습니다.')}>JSON 복사</button>
          <button className="primary" onClick={downloadJson}>JSON 내보내기</button>
        </div>
      </section>
    </main>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
:root { color-scheme: light; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; color: #0f172a; background: radial-gradient(circle at top left, #d1fae5, transparent 32rem), linear-gradient(135deg, #f8fafc, #ecfdf5); }
button, textarea, select { font: inherit; }
.app-shell { min-height: 100vh; display: grid; grid-template-columns: minmax(320px, 0.9fr) minmax(320px, 1.1fr); gap: 24px; padding: 28px; }
.panel { border: 1px solid rgba(15, 118, 110, 0.12); background: rgba(255, 255, 255, 0.86); backdrop-filter: blur(18px); box-shadow: 0 30px 90px rgba(15, 23, 42, 0.09); border-radius: 32px; }
.hero { padding: 34px; display: flex; flex-direction: column; gap: 22px; }
.brand-row { display: flex; gap: 16px; align-items: center; }
.logo-mark { width: 50px; height: 50px; border-radius: 18px; display: grid; place-items: center; background: #052e2b; color: #6ee7b7; font-weight: 900; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
h1, h2 { margin: 0; letter-spacing: -0.04em; }
h1 { font-size: clamp(28px, 4vw, 46px); }
h2 { font-size: 26px; }
p { margin: 8px 0 0; color: #64748b; line-height: 1.7; }
.label { display: block; margin-bottom: 8px; font-size: 12px; color: #0f766e; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
textarea { min-height: 220px; width: 100%; resize: vertical; border: 1px solid #dbeafe; outline: none; border-radius: 24px; padding: 18px; background: #fbfffd; color: #0f172a; line-height: 1.7; box-shadow: inset 0 1px 0 rgba(255,255,255,.8); }
textarea:focus, select:focus { border-color: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, .12); }
.toolbar { display: flex; flex-wrap: wrap; gap: 12px; }
button { border: 0; cursor: pointer; border-radius: 999px; padding: 12px 18px; font-weight: 800; transition: transform .16s ease, box-shadow .16s ease, background .16s ease; }
button:hover { transform: translateY(-1px); }
.primary { background: #064e3b; color: white; box-shadow: 0 12px 28px rgba(6, 78, 59, .24); }
.primary:hover { background: #022c22; }
.ghost { background: #ecfdf5; color: #065f46; border: 1px solid rgba(16, 185, 129, .22); }
.control-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: auto; }
select { width: 100%; border: 1px solid #dbeafe; border-radius: 16px; padding: 12px 14px; color: #0f172a; background: white; outline: none; }
.workspace { padding: 28px; display: flex; flex-direction: column; min-height: 0; }
.workspace-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; border-bottom: 1px solid rgba(16, 185, 129, .18); padding-bottom: 18px; }
.eyebrow { display: inline-flex; margin-bottom: 8px; color: #047857; font-size: 11px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
.tabs { background: #f1f5f9; padding: 5px; border-radius: 999px; display: flex; gap: 4px; }
.tabs button { padding: 8px 14px; background: transparent; color: #64748b; }
.tabs button.active { background: white; color: #047857; box-shadow: 0 6px 18px rgba(15,23,42,.08); }
.output { flex: 1; min-height: 420px; overflow: auto; white-space: pre-wrap; margin: 20px 0; padding: 22px; border-radius: 24px; background: #061b18; color: #d1fae5; line-height: 1.75; font-size: 14px; box-shadow: inset 0 0 0 1px rgba(110, 231, 183, .14); }
.output.json { color: #bfdbfe; }
.bottom { justify-content: flex-end; border-top: 1px solid rgba(16, 185, 129, .18); padding-top: 18px; }
.toast { position: fixed; z-index: 10; top: 18px; left: 50%; transform: translateX(-50%); background: #020617; color: white; padding: 12px 18px; border-radius: 999px; font-size: 13px; font-weight: 800; box-shadow: 0 18px 42px rgba(2,6,23,.25); }
@media (max-width: 900px) { .app-shell { grid-template-columns: 1fr; padding: 14px; } .control-grid { grid-template-columns: 1fr; } .workspace-header { align-items: flex-start; flex-direction: column; } .output { min-height: 320px; } }
`;
