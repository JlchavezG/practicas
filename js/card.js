document.addEventListener('DOMContentLoaded', () => {
    const cardNumber = document.getElementById('cardNumber');
    const cardHolder = document.getElementById('cardHolder');
    const expiry = document.getElementById('expiry');
    const cvv = document.getElementById('cvv');

    const previewNumber = document.getElementById('previewNumber');
    const previewHolder = document.getElementById('previewHolder');
    const previewExpiry = document.getElementById('previewExpiry');
    const previewCvv = document.getElementById('previewCvv');
    const cardPreview = document.getElementById('cardPreview');
    const cardLogo = document.getElementById('cardLogo');
    const cardFlipContainer = document.getElementById('cardFlipContainer');
    const qrcodeDiv = document.getElementById('qrcode');
    const exportBtn = document.getElementById('exportBtn');
    const cardWrapper = document.getElementById('cardWrapper');

    // activar efecto Flip
    cardWrapper.addEventListener('click', () => {
        cardFlipContainer.classList.toggle('flipped');
    });

    // efecto 3D Mouse
    cardWrapper.addEventListener('mousemove', (e) => {
        if (cardFlipContainer.classList.contains('flipped')) return;
        const rect = cardWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 6;
        const rotateX = ((centerY - y) / centerY) * 6;
        cardPreview.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    cardWrapper.addEventListener('mouseleave', () => {
        if (!cardFlipContainer.classList.contains('flipped')) {
            cardPreview.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
    });

    // Validaciones
    const validators = {
        number: v => { const c = v.replace(/\s/g, ''); return c.length === 16 && /^\d+$/.test(c); },
        holder: v => v.trim().length >= 3 && /^[A-Z\sÑÁÉÍÓÚÜ]+$/i.test(v),
        expiry: v => {
            const p = v.split('/');
            if (p.length !== 2) return false;
            const mm = parseInt(p[0], 10), yy = parseInt(p[1], 10);
            return !isNaN(mm) && !isNaN(yy) && mm >= 1 && mm <= 12 && yy >= 0 && yy <= 99;
        },
        cvv: v => v.length === 3 && /^\d{3}$/.test(v)
    };

    const updateMsg = (id, valid, ok, fail) => {
        const el = document.getElementById(id + 'Msg');
        el.className = 'validation-message ' + (valid ? 'valid' : 'invalid');
        el.innerHTML = `<i class="fas ${valid ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${valid ? ok : fail}`;
    };

    const detectCardType = (num) => {
        cardPreview.className = 'card-side card-front';
        cardLogo.innerHTML = '💳';
        if (/^4/.test(num)) {
            cardPreview.classList.add('visa');
            cardLogo.innerHTML = '<i class="fab fa-cc-visa"></i>';
        } else if (/^(5[1-5]|2[2-7])/.test(num)) {
            cardPreview.classList.add('mastercard');
            cardLogo.innerHTML = '<i class="fab fa-cc-mastercard"></i>';
        } else if (/^3[47]/.test(num)) {
            cardPreview.classList.add('amex');
            cardLogo.innerHTML = '<i class="fab fa-cc-amex"></i>';
        } else if (num) {
            cardPreview.classList.add('generic');
        }
    };

    const updateQR = () => {
        const n = cardNumber.value.replace(/\s/g, '');
        const h = cardHolder.value.trim();
        const e = expiry.value;

        // Limpiar contenedor
        qrcodeDiv.innerHTML = '';

        if (n && h && e) {
            //  Usar la librería oficial desde CDN qr 
            new QRCode(qrcodeDiv, {
                text: `Tarjeta: ${n}\nTitular: ${h}\nVence: ${e}`,
                width: 140,
                height: 140,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            qrcodeDiv.innerHTML = 'Completa los datos';
        }
    };

    // Eventos
    cardNumber.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 16);
        e.target.value = v.match(/.{1,4}/g)?.join(' ') || '';
        previewNumber.textContent = v ? e.target.value : '•••• •••• •••• ••••';
        const valid = validators.number(e.target.value);
        updateMsg('number', valid, 'Número válido', '16 dígitos requeridos');
        detectCardType(v);
        updateQR();
    });

    cardHolder.addEventListener('input', () => {
        const v = cardHolder.value;
        previewHolder.textContent = v.trim() ? v.toUpperCase() : 'TITULAR';
        const valid = validators.holder(v);
        updateMsg('holder', valid, 'Nombre válido', 'Mínimo 3 letras');
        updateQR();
    });

    expiry.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
        e.target.value = v;
        previewExpiry.textContent = v || 'MM/AA';
        const valid = validators.expiry(v);
        updateMsg('expiry', valid, 'Fecha válida', 'Formato MM/AA');
        updateQR();
    });

    cvv.addEventListener('input', () => {
        const v = cvv.value.replace(/\D/g, '').substring(0, 3);
        cvv.value = v;
        previewCvv.textContent = v || '•••';
        const valid = validators.cvv(v);
        updateMsg('cvv', valid, 'CVV válido', '3 dígitos');
        updateQR();
    });

    // Exportar
    exportBtn.addEventListener('click', () => {
        const side = cardFlipContainer.classList.contains('flipped')
            ? cardFlipContainer.querySelector('.card-back')
            : cardPreview;
        const originalTransform = side.style.transform;
        side.style.transform = 'rotateX(0deg) rotateY(0deg)';

        html2canvas(side, { backgroundColor: null, scale: 2 }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'tarjeta-premium.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            side.style.transform = originalTransform;
        }).catch(() => {
            alert('No se pudo exportar. Intenta en Chrome.');
            side.style.transform = originalTransform;
        });
    });

    // Iniciar 
    updateQR();
});