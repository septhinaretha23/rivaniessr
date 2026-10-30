const products = [
    {
        id: 1,
        name: "Pink Ribbon Blouse",
        category: "Tops",
        price: 89000,
        image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=700",
        description: "A sweet and elegant blouse for your everyday outfit. Perfect for a cute feminine look.",
        sizes: ["S", "M", "L"]
    },
    {
        id: 2,
        name: "Cream Knit Top",
        category: "Tops",
        price: 95000,
        image: "https://images.unsplash.com/photo-1564257577-7a3c7e1c2c4f?w=700",
        description: "A soft and lovely knit top, easy to mix and match.",
        sizes: ["S", "M", "L"]
    },
    {
        id: 3,
        name: "Soft Wide Pants",
        category: "Pants",
        price: 119000,
        image: "https://images.unsplash.com/photo-1506629905607-d9c297d8f3e8?w=700",
        description: "Comfortable wide-leg pants for a relaxed and stylish outfit.",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 4,
        name: "Classic Beige Trousers",
        category: "Pants",
        price: 125000,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=700",
        description: "Classic trousers with a lovely minimalist style.",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 5,
        name: "Pink Pleated Skirt",
        category: "Skirts",
        price: 109000,
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=700",
        description: "A cute pleated skirt for a dreamy coquette-inspired outfit.",
        sizes: ["S", "M", "L"]
    },
    {
        id: 6,
        name: "Floral Mini Skirt",
        category: "Skirts",
        price: 119000,
        image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=700",
        description: "A lovely floral skirt that adds a sweet touch to your look.",
        sizes: ["S", "M", "L"]
    },
    {
        id: 7,
        name: "Dreamy Pink Dress",
        category: "Dresses",
        price: 159000,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700",
        description: "A feminine dress for special days and lovely moments.",
        sizes: ["S", "M", "L"]
    },
    {
        id: 8,
        name: "Elegant Cream Dress",
        category: "Dresses",
        price: 169000,
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=700",
        description: "An elegant cream dress with a timeless style.",
        sizes: ["S", "M", "L"]
    }
];

function rupiah(number) {
    return "Rp" + number.toLocaleString("id-ID");
}

function getCart() {
    return JSON.parse(localStorage.getItem("roseCart") || "[]");
}

function saveCart(cart) {
    localStorage.setItem("roseCart", JSON.stringify(cart));
}

function addToCart(id, size, quantity = 1) {
    const cart = getCart();
    const existing = cart.find(item =>
        item.id === id && item.size === size
    );

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: id,
            size: size,
            quantity: quantity
        });
    }

    saveCart(cart);
    alert("Product added to your cart! ♡");
}

function renderProducts(list, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    target.innerHTML = list.map(product => `
        <div class="product-card">
            <a href="detail.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}"
                     onerror="this.src='https://placehold.co/500x600/ffe5ef/aa6685?text=Rose+Belle'">
                <h3>${product.name}</h3>
            </a>
            <div class="price">${rupiah(product.price)}</div>
            <a class="btn" href="detail.html?id=${product.id}">
                View Product
            </a>
        </div>
    `).join("");
}

function renderCategory(category) {
    const list = products.filter(p => p.category === category);
    renderProducts(list, "product-list");
}

function renderDetail() {
    const id = Number(new URLSearchParams(location.search).get("id"));
    const product = products.find(p => p.id === id);
    const target = document.getElementById("detail-content");

    if (!target) return;

    if (!product) {
        target.innerHTML = "<p>Product not found ♡</p>";
        return;
    }

    target.innerHTML = `
        <div class="detail-layout">
            <img src="${product.image}" alt="${product.name}"
                 onerror="this.src='https://placehold.co/500x600/ffe5ef/aa6685?text=Rose+Belle'">

            <div class="detail-info">
                <div class="eyebrow">${product.category} COLLECTION</div>
                <h1>${product.name}</h1>
                <div class="price">${rupiah(product.price)}</div>
                <p>${product.description}</p>

                <div class="field">
                    <label>Choose Size</label>
                    <select id="product-size">
                        ${product.sizes.map(size =>
                            `<option value="${size}">${size}</option>`
                        ).join("")}
                    </select>
                </div>

                <div class="field">
                    <label>Quantity</label>
                    <input class="quantity" type="number"
                           id="product-quantity" value="1" min="1" max="20">
                </div>

                <button class="btn" onclick="buyProduct(${product.id})">
                    ♡ Add to Cart
                </button>
                <br><br>
                <a href="shop.html">← Continue Shopping</a>
            </div>
        </div>
    `;
}

function buyProduct(id) {
    const size = document.getElementById("product-size").value;
    const quantity = Math.max(1, Math.min(20,
        Number(document.getElementById("product-quantity").value) || 1
    ));

    addToCart(id, size, quantity);
}

function renderCart() {
    const target = document.getElementById("cart-content");
    if (!target) return;

    const cart = getCart();

    if (cart.length === 0) {
        target.innerHTML = `
            <div class="empty">
                <h2>Your cart is empty ♡</h2>
                <p>Let's find something pretty for you!</p><br>
                <a href="shop.html" class="btn">Shop Now</a>
            </div>
        `;
        return;
    }

    let total = 0;

    const itemsHTML = cart.map((item, index) => {
        const product = products.find(p => p.id === item.id);
        if (!product) return "";

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}">
                <div style="flex:1">
                    <h3>${product.name}</h3>
                    <p>Size: ${item.size}</p>
                    <p class="price">${rupiah(product.price)}</p>
                    <label>Qty:
                        <input type="number" min="1" max="20"
                            value="${item.quantity}"
                            onchange="changeQuantity(${index}, this.value)">
                    </label>
                    <br><br>
                    <button class="remove-btn"
                        onclick="removeItem(${index})">Remove</button>
                </div>
                <strong>${rupiah(subtotal)}</strong>
            </div>
        `;
    }).join("");

    target.innerHTML = `
        ${itemsHTML}
        <div class="cart-total">
            <h2>Total: ${rupiah(total)}</h2>
            <button class="btn" onclick="checkout()">
                Checkout via WhatsApp ♡
            </button>
        </div>
    `;
}

function changeQuantity(index, value) {
    const cart = getCart();
    cart[index].quantity = Math.max(1, Math.min(20,
        Number(value) || 1
    ));
    saveCart(cart);
    renderCart();
}

function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

function checkout() {
    const cart = getCart();
    if (!cart.length) return;

    let message = "Hello Rosé Belle Boutique! ♡%0A";
    message += "I would like to order:%0A%0A";
    let total = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        total += product.price * item.quantity;
        message += `- ${product.name}%0A`;
        message += `  Size: ${item.size}%0A`;
        message += `  Qty: ${item.quantity}%0A`;
        message += `  Price: ${rupiah(product.price * item.quantity)}%0A%0A`;
    });

    message += `Total: ${rupiah(total)}`;

    // GANTI NOMOR INI DENGAN NOMOR WHATSAPP TOKO
    const phone = "6281234567890";

    window.open(
        "https://wa.me/" + phone + "?text=" + message,
        "_blank"
    );
}

function sendContact(event) {
    event.preventDefault();

    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const message = document.getElementById("contact-message").value;

    const subject = encodeURIComponent("Message from " + name);
    const body = encodeURIComponent(
        "Name: " + name +
        "\nEmail: " + email +
        "\nMessage: " + message
    );

    // GANTI EMAIL INI DENGAN EMAIL TOKO
    window.location.href =
        "mailto:rosebelle@example.com?subject=" +
        subject + "&body=" + body;
}