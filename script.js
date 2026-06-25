/* ============================
   GENERATE STARS
   ============================ */
(function generateStars() {
  const container = document.getElementById('stars');
  for (let i = 0; i < 120; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      --d: ${(Math.random() * 3 + 2).toFixed(1)}s;
      --delay: -${(Math.random() * 4).toFixed(1)}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(star);
  }
})();


/* ============================
   PASSWORD STRENGTH LOGIC
   ============================ */

// All 7 bar elements
const bars = [1, 2, 3, 4, 5, 6, 7].map(n => document.getElementById('b' + n));

// Strength label element
const labelEl = document.getElementById('strengthLabel');

// Maps check key → criteria list item ID
const criteriaIds = {
  len:     'c-len',
  upper:   'c-upper',
  lower:   'c-lower',
  num:     'c-num',
  special: 'c-special'
};

// Strength levels: label, CSS class, bar class, how many bars to fill
const levels = [
  { label: '',            cls: '',        barCls: '',              count: 0 },
  { label: 'Very Weak',  cls: 'weak',    barCls: 'active-weak',   count: 1 },
  { label: 'Weak',       cls: 'weak',    barCls: 'active-weak',   count: 2 },
  { label: 'Fair',       cls: 'fair',    barCls: 'active-fair',   count: 3 },
  { label: 'Good',       cls: 'good',    barCls: 'active-good',   count: 4 },
  { label: 'Strong',     cls: 'strong',  barCls: 'active-strong', count: 5 },
  { label: 'Very Strong',cls: 'vstrong', barCls: 'active-vstrong',count: 7 },
];

function checkPassword() {
  const pw = document.getElementById('pwInput').value;

  // Check each rule using Regex
  const checks = {
    len:     pw.length >= 8,
    upper:   /[A-Z]/.test(pw),
    lower:   /[a-z]/.test(pw),
    num:     /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };

  // Update criteria list (add/remove .met class)
  for (const [key, passed] of Object.entries(checks)) {
    const li = document.getElementById(criteriaIds[key]);
    li.classList.toggle('met', passed);
  }

  // Count how many rules passed
  const score = Object.values(checks).filter(Boolean).length;

  // Determine strength level index
  let levelIdx;
  if (!pw.length)    levelIdx = 0;
  else if (score <= 1) levelIdx = 1;
  else if (score === 2) levelIdx = 2;
  else if (score === 3) levelIdx = 3;
  else if (score === 4) levelIdx = 4;
  else levelIdx = pw.length >= 12 ? 6 : 5; // 5 rules + long = Very Strong

  const level = levels[levelIdx];

  // Update bars: fill N bars with the correct color class
  bars.forEach((bar, index) => {
    bar.className = 'bar' + (index < level.count ? ' ' + level.barCls : '');
  });

  // Update strength label text and color
  if (!pw.length) {
    labelEl.textContent = 'Enter a password';
    labelEl.className   = 'strength-label';
  } else {
    labelEl.textContent = level.label;
    labelEl.className   = 'strength-label ' + level.cls;
  }

  // Extra glow on shield when password is fully strong
  const shield = document.getElementById('shieldWrap');
  shield.style.filter = score === 5
    ? 'drop-shadow(0 0 16px rgba(255, 80, 80, 0.9))'
    : '';
}


/* ============================
   SHOW / HIDE PASSWORD
   ============================ */
function toggleEye() {
  const input = document.getElementById('pwInput');
  const icon  = document.getElementById('eyeIcon');
  if (input.type === 'password') {
    input.type       = 'text';
    icon.textContent = '👁️';
  } else {
    input.type       = 'password';
    icon.textContent = '🙈';
  }
}


/* ============================
   TRY DEMO BUTTON
   ============================ */
function focusInput() {
  document.getElementById('pwInput').focus();
}


/* ============================
   DEMO STATE ON PAGE LOAD
   (shows "Very Strong" by default)
   ============================ */
window.addEventListener('load', () => {
  bars.forEach(b => b.className = 'bar active-vstrong');
  labelEl.textContent = 'Very Strong';
  labelEl.className   = 'strength-label vstrong';
  document.querySelectorAll('.criteria li').forEach(li => li.classList.add('met'));
});