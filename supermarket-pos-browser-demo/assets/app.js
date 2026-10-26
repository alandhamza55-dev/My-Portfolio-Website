const productsElement = document.getElementById('products');
const cartBody = document.getElementById('cartBody');
const searchInput = document.getElementById('productSearch');
const barcodeInput = document.getElementById('barcodeInput');
const toast = document.getElementById('toast');
const csrfMeta = document.querySelector('meta[name="csrf-token"]');
const csrfToken = csrfMeta ? csrfMeta.content : '';
let products = [];
let cart = [];
let toastTimer;

const money = (value) => Number(value).toFixed(2);

async function loadProducts() {
    const message = document.getElementById('catalogMessage');
    if (!message) return;
    message.textContent = 'کاڵاکان بار دەکرێن...';
    try {
        const response = await fetch('../api/get_products.php', { headers: { Accept: 'application/json' } });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'بارکردنی کاڵاکان سەرکەوتوو نەبوو.');
        }
        products = Array.isArray(data) ? data : [];
        message.textContent = products.length ? '' : 'هیچ کاڵایەکی بەردەست نییە.';
        renderProducts();
        const productCount = document.getElementById('productCount');
        if (productCount) {
            productCount.textContent = `${products.length.toLocaleString('ckb-IQ')} کاڵا`;
        }
    } catch (error) {
        message.textContent = error.message || 'پەیوەندی بە سێرڤەرەوە سەرکەوتوو نەبوو.';
    }
}

function renderProducts() {
    if (!productsElement || !searchInput) return;
    const query = searchInput.value.trim().toLocaleLowerCase();
    const filtered = products.filter((product) =>
        String(product.name).toLocaleLowerCase().includes(query)
        || String(product.barcode).toLocaleLowerCase().includes(query)
    );
    productsElement.replaceChildren();
    filtered.forEach((product) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        const barcode = document.createElement('span');
        barcode.className = 'product-barcode';
        barcode.textContent = product.barcode;
        const name = document.createElement('h3');
        name.textContent = product.name;
        const footer = document.createElement('div');
        footer.className = 'product-footer';
        const price = document.createElement('strong');
        price.textContent = `${money(product.price)} $`;
        const stock = document.createElement('span');
        stock.className = Number(product.stock) <= 5 ? 'stock-label stock-low' : 'stock-label';
        stock.textContent = `ماوە: ${Number(product.stock).toLocaleString('ckb-IQ')}`;
        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.className = 'button button-add';
        addButton.textContent = 'زیادکردن +';
        addButton.disabled = Number(product.stock) < 1;
        addButton.addEventListener('click', () => addToCart(product));
        footer.append(price, stock);
        card.append(barcode, name, footer, addButton);
        productsElement.append(card);
    });
    if (filtered.length === 0 && products.length > 0) {
        const noResults = document.createElement('p');
        noResults.className = 'no-results';
        noResults.textContent = 'هیچ کاڵایەک نەدۆزرایەوە.';
        productsElement.append(noResults);
    }
}

function showToast(message, isError = false) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle('toast-error', isError);
    toast.classList.add('toast-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('toast-visible'), 3200);
}

function addToCart(product) {
    const id = Number(product.id);
    const existingItem = cart.find((item) => item.id === id);
    if (existingItem && existingItem.qty >= Number(product.stock)) {
        showToast('بڕی کاڵای ماوە بەس نییە.', true);
        return;
    }
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            id,
            name: product.name,
            barcode: product.barcode,
            price: Number(product.price),
            vat: Number(product.vat_rate),
            stock: Number(product.stock),
            qty: 1,
        });
    }
    renderCart();
}

function renderCart() {
    if (!cartBody) return;
    let subtotal = 0;
    let vatTotal = 0;
    cartBody.replaceChildren();
    cart.forEach((item) => {
        const lineTotal = Math.round((item.price * item.qty + Number.EPSILON) * 100) / 100;
        const lineVat = Math.round((lineTotal * item.vat / 100 + Number.EPSILON) * 100) / 100;
        subtotal += lineTotal;
        vatTotal += lineVat;

        const row = document.createElement('tr');
        const name = document.createElement('td');
        name.className = 'cart-item-name';
        name.textContent = item.name;
        const quantity = document.createElement('td');
        const controls = document.createElement('div');
        controls.className = 'quantity-controls';
        const decrease = document.createElement('button');
        decrease.type = 'button';
        decrease.className = 'quantity-button';
        decrease.textContent = '−';
        decrease.setAttribute('aria-label', `کەمکردنەوەی بڕی ${item.name}`);
        decrease.addEventListener('click', () => changeQuantity(item.id, -1));
        const amount = document.createElement('span');
        amount.textContent = item.qty.toLocaleString('ckb-IQ');
        const increase = document.createElement('button');
        increase.type = 'button';
        increase.className = 'quantity-button';
        increase.textContent = '+';
        increase.setAttribute('aria-label', `زیادکردنی بڕی ${item.name}`);
        increase.disabled = item.qty >= item.stock;
        increase.addEventListener('click', () => changeQuantity(item.id, 1));
        controls.append(decrease, amount, increase);
        quantity.append(controls);
        const total = document.createElement('td');
        total.className = 'cart-line-total';
        total.textContent = money(lineTotal);
        const action = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'remove-button';
        removeButton.textContent = '×';
        removeButton.setAttribute('aria-label', `سڕینەوەی ${item.name}`);
        removeButton.addEventListener('click', () => removeItem(item.id));
        action.append(removeButton);
        row.append(name, quantity, total, action);
        cartBody.append(row);
    });

    const roundedSubtotal = Math.round((subtotal + Number.EPSILON) * 100) / 100;
    const roundedVat = Math.round((vatTotal + Number.EPSILON) * 100) / 100;
    const grandTotal = roundedSubtotal + roundedVat;
    const subtotalElement = document.getElementById('subtotal');
    const vatElement = document.getElementById('vat');
    const grandElement = document.getElementById('grand');
    const emptyCartElement = document.getElementById('emptyCart');
    const checkoutButtonElement = document.getElementById('checkoutButton');
    if (subtotalElement) subtotalElement.textContent = money(roundedSubtotal);
    if (vatElement) vatElement.textContent = money(roundedVat);
    if (grandElement) grandElement.textContent = money(grandTotal);
    if (emptyCartElement) emptyCartElement.hidden = cart.length > 0;
    if (checkoutButtonElement) checkoutButtonElement.disabled = cart.length === 0;
    updateChange();
}

function changeQuantity(id, change) {
    const item = cart.find((line) => line.id === id);
    if (!item) return;
    item.qty += change;
    if (item.qty < 1) {
        removeItem(id);
        return;
    }
    if (item.qty > item.stock) item.qty = item.stock;
    renderCart();
}

function removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    renderCart();
}

function updateChange() {
    const cashInput = document.getElementById('cashReceived');
    const changeDue = document.getElementById('changeDue');
    if (!cashInput || !changeDue) return;
    const cashReceived = Number(cashInput.value) || 0;
    const total = Number(document.getElementById('grand').textContent) || 0;
    changeDue.textContent = money(Math.max(0, cashReceived - total));
}

function addBarcode() {
    const barcode = barcodeInput.value.trim();
    if (!barcode) return;
    const product = products.find((item) => String(item.barcode) === barcode);
    if (!product) {
        showToast('کاڵایەک بەو بارکۆدە نەدۆزرایەوە.', true);
    } else {
        addToCart(product);
    }
    barcodeInput.value = '';
    barcodeInput.focus();
}

function prepareReceipt(sale, received) {
    document.getElementById('receiptSaleId').textContent = sale.sale_id;
    document.getElementById('receiptDate').textContent = new Date().toLocaleString('ckb-IQ');
    document.getElementById('receiptSubtotal').textContent = money(sale.total);
    document.getElementById('receiptVat').textContent = money(sale.vat);
    document.getElementById('receiptGrand').textContent = money(sale.grand);
    document.getElementById('receiptCash').textContent = money(received);
    document.getElementById('receiptChange').textContent = money(received - Number(sale.grand));
    const receiptItems = document.getElementById('receiptItems');
    receiptItems.replaceChildren();
    sale.items.forEach((item) => {
        const row = document.createElement('tr');
        [item.name, Number(item.quantity).toLocaleString('ckb-IQ'), money(item.price), money(item.price * item.quantity)].forEach((value) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.append(cell);
        });
        receiptItems.append(row);
    });
}

async function checkout() {
    if (cart.length === 0) return;
    const total = Number(document.getElementById('grand').textContent);
    const cashInput = document.getElementById('cashReceived');
    if (!cashInput) return;
    const received = cashInput.value.trim() === '' ? total : Number(cashInput.value);
    if (!Number.isFinite(received) || received < total) {
        showToast('پارەی وەرگیراو دەبێت یەکسان یان زیاتر بێت لە کۆی گشتی.', true);
        cashInput.focus();
        return;
    }

    const button = document.getElementById('checkoutButton');
    button.disabled = true;
    button.textContent = 'تکایە چاوەڕێ بکە...';
    let sale;
    try {
        const response = await fetch('../api/save_sale.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken, Accept: 'application/json' },
            body: JSON.stringify({ items: cart.map(({ id, qty }) => ({ id, qty })) }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'فرۆشتن تەواو نەبوو.');
        sale = data;
    } catch (error) {
        showToast(error.message || 'پەیوەندی بە سێرڤەرەوە سەرکەوتوو نەبوو.', true);
        return;
    } finally {
        button.textContent = 'تەواوکردنی فرۆشتن';
        button.disabled = cart.length === 0;
    }

    prepareReceipt(sale, received);
    cart = [];
    cashInput.value = '';
    renderCart();
    showToast(`فرۆشتن بە سەرکەوتوویی تەواو بوو · پسووڵەی ${sale.sale_id}`);
    await loadProducts();
    window.print();
}

if (searchInput) {
    searchInput.addEventListener('input', renderProducts);
}
if (barcodeInput) {
    barcodeInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addBarcode();
        }
    });
}
const cashReceivedInput = document.getElementById('cashReceived');
if (cashReceivedInput) {
    cashReceivedInput.addEventListener('input', updateChange);
}
const checkoutButton = document.getElementById('checkoutButton');
if (checkoutButton) {
    checkoutButton.addEventListener('click', checkout);
}
const clearCartButton = document.getElementById('clearCart');
if (clearCartButton) {
    clearCartButton.addEventListener('click', () => {
        cart = [];
        renderCart();
    });
}
document.addEventListener('keydown', (event) => {
    if (event.key === 'F2' && searchInput) {
        event.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
});

renderCart();
loadProducts();
