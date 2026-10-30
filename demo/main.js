import BtnCraft from '../src/index.js';

// The 20 Animation Effects to test
const animations = [
  { id: 'gradient-shift', label: 'Gradient Shift', hint: 'Smooth shifting multi-stop gradient' },
  { id: 'neon-glow', label: 'Neon Glow', hint: 'Radiant layered cyber glow' },
  { id: 'border-runner', label: 'Border Runner', hint: 'Perimeter light beam tracer' },
  { id: 'liquid-fill', label: 'Liquid Fill', hint: 'Rising liquid wave fill on hover' },
  { id: 'magnetic-hover', label: 'Magnetic Hover', hint: 'Cursor attraction physics' },
  { id: '3d-press', label: '3D Press', hint: 'Tactile mechanical depth depression' },
  { id: 'ripple-click', label: 'Ripple Click', hint: 'Pointer-coordinate expanding ripple' },
  { id: 'shimmer', label: 'Shimmer', hint: 'Pearlescent light sweep across face' },
  { id: 'spotlight', label: 'Spotlight', hint: 'Interactive cursor flashlight tracking' },
  { id: 'pulse-glow', label: 'Pulse Glow', hint: 'Breathing radiant halo ring' },
  { id: 'sliding-bg', label: 'Sliding Background', hint: 'Sliding backdrop sheet overlay' },
  { id: 'glitch', label: 'Glitch', hint: 'Cyberpunk RGB chromatic aberration' },
  { id: 'rainbow-border', label: 'Rainbow Border', hint: 'Rotating rainbow spectrum border' },
  { id: 'expand-hover', label: 'Expand Hover', hint: 'Elastic scale & letter-spacing expand' },
  { id: 'rotating-icon', label: 'Rotating Icon', hint: 'Rotational transition on icon hover' },
  { id: 'gradient-border', label: 'Gradient Border', hint: 'Dual-layer animated border mask' },
  { id: 'bounce', label: 'Bounce', hint: 'Elastic squash-and-stretch jelly bounce' },
  { id: 'loading-state', label: 'Loading State', hint: 'Accessible spinner and busy state' },
  { id: 'shine-sweep', label: 'Shine Sweep', hint: 'Specular highlight flash sweep' },
  { id: 'floating-effect', label: 'Floating Effect', hint: 'Continuous levitation with soft shadow' }
];

const grid = document.getElementById('animation-grid');
const instances = [];

// Controls
const colorInput = document.getElementById('ctrl-color');
const variantSelect = document.getElementById('ctrl-variant');
const radiusSelect = document.getElementById('ctrl-radius');
const sizeSelect = document.getElementById('ctrl-size');
const durationInput = document.getElementById('ctrl-duration');
const durationVal = document.getElementById('duration-val');
const btnReset = document.getElementById('btn-reset');
const btnToggleLoading = document.getElementById('btn-toggle-loading');
const btnToggleDestroy = document.getElementById('btn-toggle-destroy');

let isLoading = false;
let isAllDestroyed = false;
let declarativeController = null;

function getCurrentOptions() {
  const opts = {
    color: colorInput.value,
    duration: `${durationInput.value}ms`
  };

  if (variantSelect.value) {
    opts.variant = variantSelect.value;
  }
  if (radiusSelect.value) {
    opts.radius = radiusSelect.value;
  }
  if (sizeSelect.value) {
    opts.size = sizeSelect.value;
  }

  return opts;
}

function initButtons() {
  instances.length = 0;
  grid.innerHTML = '';

  const baseOptions = getCurrentOptions();

  animations.forEach((anim, idx) => {
    const card = document.createElement('div');
    card.className = 'demo-card';

    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `
      <span class="card-title">${anim.label}</span>
      <span class="card-num">#${(idx + 1).toString().padStart(2, '0')}</span>
    `;

    const body = document.createElement('div');
    body.className = 'card-body';

    const btn = document.createElement('button');
    btn.textContent = `${anim.label}`;
    body.appendChild(btn);

    const footer = document.createElement('div');
    footer.className = 'card-footer';
    footer.textContent = anim.hint;

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);
    grid.appendChild(card);

    // Instantiate with BtnCraft
    const inst = BtnCraft.create(btn, {
      ...baseOptions,
      animation: anim.id
    });

    if (inst) {
      instances.push(inst);
    }
  });

  // Also initialize declarative section
  if (declarativeController) {
    declarativeController.destroy();
  }
  declarativeController = BtnCraft.init();
}

function updateAllInstances() {
  const current = getCurrentOptions();
  for (const inst of instances) {
    inst.update(current);
  }
}

// Event Listeners for Controls
colorInput.addEventListener('input', updateAllInstances);
variantSelect.addEventListener('change', updateAllInstances);
radiusSelect.addEventListener('change', updateAllInstances);
sizeSelect.addEventListener('change', updateAllInstances);

durationInput.addEventListener('input', () => {
  durationVal.textContent = `${durationInput.value}ms`;
  updateAllInstances();
});

btnReset.addEventListener('click', () => {
  colorInput.value = '#6366f1';
  variantSelect.value = '';
  radiusSelect.value = '8';
  sizeSelect.value = 'md';
  durationInput.value = '300';
  durationVal.textContent = '300ms';
  updateAllInstances();
});

btnToggleLoading.addEventListener('click', () => {
  isLoading = !isLoading;
  btnToggleLoading.textContent = isLoading ? 'Clear Loading' : 'Toggle Loading';
  for (const inst of instances) {
    BtnCraft.setLoading(inst.element, isLoading, 'Processing...');
  }
});

btnToggleDestroy.addEventListener('click', () => {
  if (isAllDestroyed) {
    initButtons();
    isAllDestroyed = false;
    btnToggleDestroy.textContent = 'Destroy All';
  } else {
    for (const inst of instances) {
      inst.destroy();
    }
    if (declarativeController) {
      declarativeController.destroy();
    }
    isAllDestroyed = true;
    btnToggleDestroy.textContent = 'Re-Init All';
  }
});

// Initial boot
initButtons();
