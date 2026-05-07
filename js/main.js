// ── CURSOR ──
const cur = document.getElementById('cur'), ring = document.getElementById('ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = (mx - 5) + 'px'; cur.style.top = (my - 5) + 'px'; });
(function anim() { rx += (mx - rx) * .1; ry += (my - ry) * .1; ring.style.left = (rx - 16) + 'px'; ring.style.top = (ry - 16) + 'px'; requestAnimationFrame(anim); })();
document.querySelectorAll('a,button,.pc,.fi,.val-item,.an-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.style.transform = 'scale(2.5)'; ring.style.transform = 'scale(1.6)'; ring.style.borderColor = 'var(--hot)'; });
    el.addEventListener('mouseleave', () => { cur.style.transform = 'scale(1)'; ring.style.transform = 'scale(1)'; ring.style.borderColor = 'rgba(255,45,135,.5)'; });
});

// Cursor en botón WhatsApp
document.querySelectorAll('.wa-fab').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cur.style.transform = 'scale(2.5)';
        ring.style.transform = 'scale(1.6)';
        ring.style.borderColor = '#25d366';
    });
    el.addEventListener('mouseleave', () => {
        cur.style.transform = 'scale(1)';
        ring.style.transform = 'scale(1)';
        ring.style.borderColor = 'rgba(255,45,135,.5)';
    });
});

// ── TALLAS HOODIE ──
document.querySelectorAll('.sz').forEach(p => {
    p.addEventListener('click', () => {
        document.querySelectorAll('.sz').forEach(x => x.classList.remove('active'));
        p.classList.add('active');
    });
});

// ── REVEAL ON SCROLL ──
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── CARRITO ──
const cart = [];

const cartFab     = document.getElementById('cartFab');
const cartPanel   = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose   = document.getElementById('cartClose');
const cartCount   = document.getElementById('cartCount');
const cartItems   = document.getElementById('cartItems');
const cartEmpty   = document.getElementById('cartEmpty');
const cartFooter  = document.getElementById('cartFooter');
const cartTotal   = document.getElementById('cartTotal');
const cartClear   = document.getElementById('cartClear');
const cartCheckout = document.getElementById('cartCheckout');

// Abrir / cerrar panel
cartFab.addEventListener('click', () => {
    cartPanel.classList.add('open');
    cartOverlay.classList.add('open');
});
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function closeCart() {
    cartPanel.classList.remove('open');
    cartOverlay.classList.remove('open');
}

// Seleccionar talla en tarjetas de producto
document.querySelectorAll('.pc-sz').forEach(sz => {
    sz.addEventListener('click', () => {
        sz.closest('.pc-sizes').querySelectorAll('.pc-sz').forEach(s => s.classList.remove('selected'));
        sz.classList.add('selected');
    });
});

// Agregar al carrito
document.querySelectorAll('.pc-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const info = btn.closest('.pc-info');
        const szEl = info.querySelector('.pc-sz.selected');

        if (!szEl) {
            btn.textContent = '⚠ Elige una talla';
            btn.classList.add('shake');
            setTimeout(() => {
                btn.textContent = '+ Agregar al carrito';
                btn.classList.remove('shake');
            }, 1500);
            return;
        }

        const name  = btn.dataset.name;
        const price = parseInt(btn.dataset.price);
        const size  = szEl.dataset.size;
        const key   = name + '-' + size;

        const existing = cart.find(i => i.key === key);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ key, name, price, size, qty: 1 });
        }

        btn.textContent = '✓ Agregado';
        setTimeout(() => btn.textContent = '+ Agregar al carrito', 1500);

        renderCart();
        cartPanel.classList.add('open');
        cartOverlay.classList.add('open');
    });
});

// Vaciar carrito
cartClear.addEventListener('click', () => {
    cart.length = 0;
    renderCart();
});

// Renderizar carrito
function renderCart() {
    // Contador del ícono
    const total_qty = cart.reduce((s, i) => s + i.qty, 0);
    cartCount.textContent = total_qty;

    // Estado vacío
    cartEmpty.style.display  = cart.length === 0 ? 'flex' : 'none';
    cartFooter.style.display = cart.length === 0 ? 'none' : 'flex';

    // Limpiar items anteriores
    cartItems.querySelectorAll('.cart-item').forEach(el => el.remove());

    // Renderizar cada item
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-size">Talla: ${item.size}</div>
                <div class="cart-item-price">$${item.price} MXN c/u</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" data-key="${item.key}" data-action="minus">−</button>
                    <span class="qty-num">${item.qty}</span>
                    <button class="qty-btn" data-key="${item.key}" data-action="plus">+</button>
                </div>
            </div>
            <button class="cart-item-remove" data-key="${item.key}">✕</button>
        `;
        cartItems.appendChild(div);
    });

    // Total
    const sum = cart.reduce((s, i) => s + i.price * i.qty, 0);
    cartTotal.textContent = '$' + sum.toLocaleString('es-MX') + ' MXN';

    // Link Instagram DM con resumen del pedido
    const msg = cart.map(i =>
        `• ${i.name} | Talla: ${i.size} x${i.qty} — $${i.price * i.qty} MXN`
    ).join('\n');
    const fullMsg = encodeURIComponent(
        `Hola! Quiero hacer un pedido 🛍️\n\n${msg}\n\nTotal: $${sum.toLocaleString('es-MX')} MXN`
    );
    // Botón checkout — copiar + abrir IG
    cartCheckout.onclick = () => {
        const msg = cart.map(i =>
            `• ${i.name} | Talla: ${i.size} x${i.qty} — $${i.price * i.qty} MXN`
        ).join('\n');
        const fullMsg = `Hola! Quiero hacer un pedido 🛍️\n\n${msg}\n\nTotal: $${sum.toLocaleString('es-MX')} MXN`;

        // Copiar al portapapeles
        navigator.clipboard.writeText(fullMsg).then(() => {
            cartCheckout.textContent = '✓ Mensaje copiado — abriendo IG...';
            setTimeout(() => {
                cartCheckout.textContent = 'Pedir por Instagram DM ↗';
                window.open('https://ig.me/m/jp__exclusive', '_blank');
            }, 1200);
        }).catch(() => {
            // Fallback si el navegador bloquea clipboard
            window.open('https://ig.me/m/jp__exclusive', '_blank');
        });
    };

    // Listeners qty y remove
    cartItems.querySelectorAll('.qty-btn').forEach(b => {
        b.addEventListener('click', () => {
            const item = cart.find(i => i.key === b.dataset.key);
            if (!item) return;
            if (b.dataset.action === 'plus') {
                item.qty++;
            } else {
                item.qty--;
                if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
            }
            renderCart();
        });
    });

    cartItems.querySelectorAll('.cart-item-remove').forEach(b => {
        b.addEventListener('click', () => {
            const idx = cart.findIndex(i => i.key === b.dataset.key);
            if (idx > -1) cart.splice(idx, 1);
            renderCart();
        });
    });
}