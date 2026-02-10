// Elementos
const lampScene = document.querySelector('.lamp-scene');
const bulb = document.getElementById('bulb');
const loginContainer = document.getElementById('loginContainer');
const lightBeam = document.getElementById('lightBeam');
const switchSound = document.getElementById('switchSound');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const validIcon = document.querySelector('.validation-feedback.valid');
const invalidIcon = document.querySelector('.validation-feedback.invalid');
const lampMessage = document.getElementById('lampMessage');

let isOn = false;

function playSwitchSound() {
  switchSound.currentTime = 0;
  switchSound.play().catch(() => {
    console.warn('Audio bloqueado o no soportado.');
  });
}

function togglePasswordVisibility() {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  const icon = togglePassword.querySelector('i');
  icon.className = isPassword ? 'far fa-eye-slash' : 'far fa-eye';
}

togglePassword.addEventListener('click', togglePasswordVisibility);
togglePassword.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    togglePasswordVisibility();
  }
});

passwordInput.addEventListener('input', () => {
  const value = passwordInput.value;
  passwordInput.classList.remove('valid', 'invalid');
  validIcon.classList.remove('show');
  invalidIcon.classList.remove('show');

  if (value.length === 0) return;

  if (value.length >= 6) {
    passwordInput.classList.add('valid');
    validIcon.classList.add('show');
  } else {
    passwordInput.classList.add('invalid');
    invalidIcon.classList.add('show');
  }
});

document.getElementById('forgotLink').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Se enviará un enlace de recuperación a tu correo.');
});

function toggleLamp() {
  isOn = !isOn;
  playSwitchSound();

  if (isOn) {
    // Encender lámpara
    bulb.classList.add('flicker');
    setTimeout(() => {
      bulb.classList.remove('flicker');
      bulb.classList.add('on');
      lightBeam.classList.add('active');
      lampMessage.classList.add('off'); // 👁️‍🗨️ Mensaje se apaga
      setTimeout(() => {
        loginContainer.classList.add('visible');
      }, 350);
    }, 800);
  } else {
    // Apagar lámpara
    loginContainer.classList.remove('visible');
    setTimeout(() => {
      lightBeam.classList.remove('active');
      bulb.classList.remove('on');
      lampMessage.classList.remove('off'); // 💡 Mensaje vuelve a encenderse
    }, 300);
  }
}

lampScene.addEventListener('click', toggleLamp);
lampScene.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleLamp();
  }
});

document.getElementById('loginFormEl').addEventListener('submit', (e) => {
  e.preventDefault();
  const pass = passwordInput.value;
  if (pass.length < 6) {
    passwordInput.classList.add('invalid');
    invalidIcon.classList.add('show');
    validIcon.classList.remove('show');
    return;
  }
  alert('¡Bienvenido! La sesión se ha iniciado.');
});