const products = [
    {
        id: 1,
        name: "Velvet Rouge Lip Cream",
        category: "Lipstik",
        price: 125000,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
        shades: [
            { name: "01 Rosewood", hex: "#B56565" },
            { name: "02 Terracotta", hex: "#A85241" },
            { name: "03 Nude Blush", hex: "#D6948A" }
        ],
        description: "Lip cream bertekstur ringan dengan hasil akhir matte lembut yang tahan lama hingga 12 jam tanpa membuat bibir kering."
    },
    {
        id: 2,
        name: "Luminous Silk Cushion",
        category: "Complexion",
        price: 195000,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
        shades: [
            { name: "10W Ivory", hex: "#F2D5B8" },
            { name: "20N Natural Beige", hex: "#E2BA95" },
            { name: "30W Warm Honey", hex: "#C9986E" }
        ],
        description: "Cushion dengan coverage medium-to-full yang menyamarkan noda hitam sekaligus memberikan kilau sehat alami."
    },
    {
        id: 3,
        name: "Sunset Muse Eyeshadow Palette",
        category: "Mata",
        price: 220000,
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80",
        shades: [
            { name: "Warm Amber", hex: "#C87D55" },
            { name: "Champagne Shimmer", hex: "#E8C6A8" }
        ],
        description: "Palet 9 warna kombinasi matte dan shimmer dengan pigmentasi tinggi yang mudah dibaurkan untuk riasan siang maupun malam."
    },
    {
        id: 4,
        name: "Petal Dew Liquid Blush",
        category: "Pipi",
        price: 110000,
        image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80",
        shades: [
            { name: "Peach Bloom", hex: "#EC8C78" },
            { name: "Soft Berry", hex: "#C95B72" }
        ],
        description: "Perona pipi cair yang menyatu sempurna di atas bedak maupun foundation untuk rona segar alami sepanjang hari."
    },
    {
        id: 5,
        name: "Satin Glow Lipstick",
        category: "Lipstik",
        price: 135000,
        image: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=600&q=80",
        shades: [
            { name: "Caramel Nude", hex: "#B97A63" },
            { name: "Classic Crimson", hex: "#9E2A2B" }
        ],
        description: "Diperkaya dengan Vitamin E dan Shea Butter untuk menjaga kelembapan bibir dengan kilau satin mewah."
    },
    {
        id: 6,
        name: "Airy Matte Setting Powder",
        category: "Complexion",
        price: 165000,
        image: "https://images.unsplash.com/photo-1631730486784-5456119f69ae?auto=format&fit=crop&w=600&q=80",
        shades: [
            { name: "Translucent", hex: "#F7EAE1" },
            { name: "Medium Sand", hex: "#DFB899" }
        ],
        description: "Bedak tabur mikro-halus yang mengunci riasan dan menahan minyak berlebih tanpa menyumbat pori-pori."
    }
];

let cart = [];
let activeCategory = "Semua";
let selectedModalShade = "";

// DOM Elements
const productGrid = document.getElementById("productGrid");
const categoryTabs = document.querySelectorAll(".tab-btn");
const searchInput = document.getElementById("searchInput");
const cartDrawer = document.getElementById("cartDrawer");
const backdrop = document.getElementById("backdrop");
const cartList = document.getElementById("cartList");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const productModal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");
const toast = document.getElementById("toast");

const formatIDR = (num) => "Rp " + num.toLocaleString("id-ID");

// Render Produk
function renderProducts() {
    const query = searchInput.value.toLowerCase();
    const filtered = products.filter(p => {
        const matchCat = activeCategory === "Semua" || p.category === activeCategory;
        const matchText = p.name.toLowerCase().includes(query) ||
                          p.shades.some(s => s.name.toLowerCase().includes(query));
        return matchCat && matchText;
    });

    if (filtered.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#756864;">Produk tidak ditemukan.</p>`;
        return;
    }

    productGrid.innerHTML = filtered.map(product => `
        <article class="card">
            <div class="card-img" onclick="openProductModal(${product.id})">
                <span class="pill-category">${product.category}</span>
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="card-body">
                <h3 class="card-title" onclick="openProductModal(${product.id})">${product.name}</h3>
                <div class="shade-dots">
                    ${product.shades.map(s => `<span class="dot" style="background:${s.hex}" title="${s.name}"></span>`).join("")}
                    <span class="shade-label">${product.shades.length} Shades</span>
                </div>
                <div class="card-price">${formatIDR(product.price)}</div>
                <div class="card-footer">
                    <button class="btn-detail" onclick="openProductModal(${product.id})">Detail</button>
                    <button class="btn-cart" onclick="addToCart(${product.id}, '${product.shades[0].name}')">+ Tambah</button>
                </div>
            </div>
        </article>
    `).join("");
}

// Filter Kategori
categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        categoryTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        activeCategory = tab.dataset.category;
        renderProducts();
    });
});

searchInput.addEventListener("input", renderProducts);

// Modal Detail Produk & Pemilihan Shade
function openProductModal(id) {
    const p = products.find(item => item.id === id);
    selectedModalShade = p.shades[0].name;

    modalContent.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div>
            <span class="tagline">${p.category.toUpperCase()}</span>
            <h2 style="font-size:2rem; margin-bottom:8px;">${p.name}</h2>
            <p style="color:#756864; font-size:0.92rem; margin-bottom:14px;">${p.description}</p>
            <div style="font-size:0.85rem; font-weight:600;">Pilih Shade: <span id="chosenShadeName" style="color:#96574B;">${selectedModalShade}</span></div>
            <div class="shade-selector">
                ${p.shades.map((s, idx) => `
                    <button class="shade-option ${idx === 0 ? 'selected' : ''}" 
                            style="background:${s.hex}" 
                            onclick="selectShade(this, '${s.name}')" 
                            title="${s.name}">
                    </button>
                `).join("")}
            </div>
            <h3 style="font-size:1.4rem; color:#96574B; margin-bottom:18px;">${formatIDR(p.price)}</h3>
            <button class="btn-primary w-100" onclick="addToCart(${p.id}, selectedModalShade); closeProductModal();">
                Masukkan ke Tas Belanja
            </button>
        </div>
    `;
    productModal.classList.add("open");
}

function selectShade(el, shadeName) {
    document.querySelectorAll(".shade-option").forEach(btn => btn.classList.remove("selected"));
    el.classList.add("selected");
    selectedModalShade = shadeName;
    document.getElementById("chosenShadeName").textContent = shadeName;
}

function closeProductModal() {
    productModal.classList.remove("open");
}

document.getElementById("closeModalBtn").addEventListener("click", closeProductModal);
productModal.addEventListener("click", (e) => {
    if (e.target === productModal) closeProductModal();
});

// Logika Keranjang Belanja
function addToCart(id, shade) {
    const product = products.find(p => p.id === id);
    const key = `${id}-${shade}`;
    const existing = cart.find(item => item.key === key);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            key,
            id: product.id,
            name: product.name,
            shade,
            price: product.price,
            image: product.image,
            qty: 1
        });
    }

    renderCart();
    showToast(`${product.name} (${shade}) ditambahkan!`);
}

function renderCart() {
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalCost = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    cartCount.textContent = totalItems;
    cartSubtotal.textContent = formatIDR(totalCost);

    if (cart.length === 0) {
        cartList.innerHTML = `<p class="empty-state">Tas belanja Anda masih kosong.</p>`;
        return;
    }

    cartList.innerHTML = cart.map(item => `
        <div class="cart-row">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-meta">
                <h4>${item.name}</h4>
                <small>Shade: ${item.shade}</small>
                <strong style="color:#96574B; font-size:0.9rem;">${formatIDR(item.price)}</strong>
                <div class="qty-box">
                    <button onclick="updateQty('${item.key}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="updateQty('${item.key}', 1)">+</button>
                    <button class="btn-remove" onclick="removeCartItem('${item.key}')">Hapus</button>
                </div>
            </div>
        </div>
    `).join("");
}

function updateQty(key, change) {
    const item = cart.find(i => i.key === key);
    if (!item) return;
    item.qty += change;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.key !== key);
    }
    renderCart();
}

function removeCartItem(key) {
    cart = cart.filter(i => i.key !== key);
    renderCart();
}

// Buka & Tutup Drawer
document.getElementById("openCartBtn").addEventListener("click", () => {
    cartDrawer.classList.add("open");
    backdrop.classList.add("show");
});

function closeCart() {
    cartDrawer.classList.remove("open");
    backdrop.classList.remove("show");
}

document.getElementById("closeCartBtn").addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);

document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Tas belanja masih kosong!");
        return;
    }
    alert(`Pesanan Anda berhasil dibuat!\nTotal Pembayaran: ${cartSubtotal.textContent}`);
    cart = [];
    renderCart();
    closeCart();
});

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

// Jalankan pertama kali
renderProducts();
