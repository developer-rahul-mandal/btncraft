import BtnCraft, { group, icons } from '../src/index.js';

// All 30 Animation Effects in BtnCraft V2
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
  { id: 'floating-effect', label: 'Floating Effect', hint: 'Continuous levitation with soft shadow' },
  // V2 New
  { id: 'particle-burst', label: 'Particle Burst', hint: 'V2: Multi-colored confetti spark burst' },
  { id: 'circular-reveal', label: 'Circular Reveal', hint: 'V2: Expanding radial color fill from pointer' },
  { id: 'text-scramble', label: 'Text Scramble', hint: 'V2: Matrix-style character scrambling' },
  { id: 'click-shockwave', label: 'Click Shockwave', hint: 'V2: High-speed sonic pressure ring on click' },
  { id: 'neon-border-pulse', label: 'Neon Border Pulse', hint: 'V2: Rhythmic perimeter glow flash' },
  { id: 'elastic-stretch', label: 'Elastic Stretch', hint: 'V2: Directional momentum squash & stretch' },
  { id: 'magnetic-snap', label: 'Magnetic Snap', hint: 'V2: Spring-loaded snap attraction physics' },
  { id: 'flip-button', label: 'Flip Button', hint: 'V2: 3D perspective card flip on hover' },
  { id: 'liquid-morph', label: 'Liquid Morph', hint: 'V2: Organic oscillating fluid contour' },
  { id: 'elastic-border', label: 'Elastic Border', hint: 'V2: Morphing responsive SVG stroke contour' }
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
const btnToggleDestroy = document.getElementById('btn-toggle-destroy');

let isAllDestroyed = false;
let declarativeController = null;
let segmentedGroup = null;
let multiGroup = null;
let stateInstance = null;
let iconInstance = null;

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

    const isNew = idx >= 20;

    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `
      <span class="card-title">${anim.label} ${isNew ? '<span class="card-v2-tag">V2</span>' : ''}</span>
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

  // Initialize Declarative section
  if (declarativeController) {
    declarativeController.destroy();
  }
  declarativeController = BtnCraft.init();

  // Initialize V2 Feature Workbench
  initV2Workbenches();
}

function initV2Workbenches() {
  // 1. State Engine Workbench
  const stateBtn = document.getElementById('state-demo-btn');
  const stateBadge = document.getElementById('state-status-badge');

  if (stateInstance) {
    stateInstance.destroy();
  }
  stateInstance = BtnCraft.create(stateBtn, { animation: 'ripple-click', variant: 'gradient' });

  stateInstance.on('statechange', ({ state }) => {
    stateBadge.textContent = `state: ${state}`;
    stateBadge.setAttribute('data-state', state);
  });

  document.getElementById('btn-state-exec').onclick = () => {
    stateInstance.execute(async () => {
      await new Promise((r) => setTimeout(r, 1400));
      // 80% success probability for interactive demo
      if (Math.random() > 0.25) {
        return 'Success';
      }
      throw new Error('Simulation error');
    }, {
      loadingText: 'Contacting Gateway...',
      successText: 'Payment Approved! ($49)',
      errorText: 'Card Declined. Retry.',
      timeout: 2200
    });
  };

  document.getElementById('btn-state-loading').onclick = () => stateInstance.loading(true);
  document.getElementById('btn-state-success').onclick = () => stateInstance.success({ text: 'Order Saved!' });
  document.getElementById('btn-state-error').onclick = () => stateInstance.error({ text: 'Failed to Save' });
  document.getElementById('btn-state-reset').onclick = () => stateInstance.reset();

  // 2. Button Groups Workbench
  if (segmentedGroup) segmentedGroup.destroy();
  if (multiGroup) multiGroup.destroy();

  const groupValBadge = document.getElementById('group-val-badge');

  segmentedGroup = group('#demo-segmented-group', {
    type: 'segmented',
    defaultValue: 'month',
    onChange: (val) => {
      groupValBadge.textContent = `val: "${val}"`;
    }
  });

  multiGroup = group('#demo-multi-group', {
    type: 'multiple',
    defaultValue: ['bold', 'underline']
  });

  // 3. Icon & Content System Workbench
  const iconBtn = document.getElementById('icon-demo-btn');
  if (iconInstance) iconInstance.destroy();
  iconInstance = BtnCraft.create(iconBtn, { animation: 'shimmer', variant: 'primary' });

  let isSpinnerActive = false;

  document.getElementById('btn-icon-rotate').onclick = () => {
    iconInstance.rotateIcon({ angle: 180, duration: 300 });
  };

  document.getElementById('btn-icon-slide').onclick = () => {
    iconInstance.slideIcon({ direction: 'right', distance: 8 });
  };

  document.getElementById('btn-icon-spinner').onclick = () => {
    isSpinnerActive = !isSpinnerActive;
    iconInstance.iconToSpinner(isSpinnerActive);
  };

  document.getElementById('btn-icon-text').onclick = () => {
    iconInstance.setText('Copied to Clipboard!', { transition: 'slide-up', duration: 220 });
    setTimeout(() => {
      iconInstance.setText('Continue', { transition: 'slide-down', duration: 220 });
    }, 2000);
  };
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
    if (segmentedGroup) segmentedGroup.destroy();
    if (multiGroup) multiGroup.destroy();
    if (stateInstance) stateInstance.destroy();
    if (iconInstance) iconInstance.destroy();

    isAllDestroyed = true;
    btnToggleDestroy.textContent = 'Re-Init All';
  }
});

// Initial boot
initButtons();
