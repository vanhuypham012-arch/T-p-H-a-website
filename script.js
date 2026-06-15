// Bọc mọi thứ trong DOMContentLoaded để an toàn khi deploy lên GitHub Pages
document.addEventListener('DOMContentLoaded', () => {
    // Diagnostic: log when script runs
    console.log('script.js: DOMContentLoaded fired');

    // Global error handler: show a visible banner and log to console
    function showErrorBanner(message) {
        console.error('script.js error:', message);
        try {
            let banner = document.getElementById('__error_banner');
            if (!banner) {
                banner = document.createElement('div');
                banner.id = '__error_banner';
                banner.style.position = 'fixed';
                banner.style.left = '0';
                banner.style.right = '0';
                banner.style.top = '0';
                banner.style.background = 'rgba(200,50,50,0.95)';
                banner.style.color = 'white';
                banner.style.padding = '10px';
                banner.style.zIndex = '99999';
                banner.style.fontFamily = 'sans-serif';
                banner.style.fontSize = '14px';
                banner.style.textAlign = 'center';
                document.body.appendChild(banner);
            }
            banner.textContent = 'Lỗi JS: ' + message + ' (xem Console để biết chi tiết)';
        } catch (e) {
            console.error('Không thể hiển thị banner lỗi:', e);
        }
    }

    window.addEventListener('error', function(ev) {
        showErrorBanner(ev.message || String(ev));
    });
    window.addEventListener('unhandledrejection', function(ev) {
        showErrorBanner(ev.reason ? String(ev.reason) : 'Unhandled rejection');
    });

    // Danh sách sản phẩm mẫu
    const products = [
        { id: 1, name: "Táo đỏ Mỹ", price: 50000, img: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400" },
        { id: 2, name: "Sữa tươi sạch", price: 35000, img: "https://tse3.mm.bing.net/th/id/OIP.NqQUztHuTZnqwOlgT1LuVgHaF2?pid=Api&h=220&P=0?w=400" },
        { id: 3, name: "Bánh mì bơ", price: 15000, img: "https://tse3.mm.bing.net/th/id/OIP.aHpvD8-9M4ho8n8BzwcRVgHaEL?pid=Api&h=220&P=0?w=400" },
        { id: 4, name: "Trứng gà ta", price: 45000, img: "https://tse1.mm.bing.net/th/id/OIP.A2tQFg4tFBPQw-V5hhDZdQHaHa?pid=Api&h=220&P=0?w=400" },
        { id: 5, name: "Chuối chín", price: 25000, img: "https://tse3.mm.bing.net/th/id/OIP.NnV3ukPKT5oSus-ped0iGAHaE8?pid=Api&h=220&P=0?w=400" },
        { id: 6, name: "Cà phê nguyên chất", price: 120000, img: "https://tse2.mm.bing.net/th/id/OIP.LbzBlHXHAquz7Cuc-2vV8gHaH3?pid=Api&h=220&P=0?w=400" },
        { id: 7, name: "Mì tôm hảo hảo", price: 5000, img: "https://tse2.mm.bing.net/th/id/OIP.Uovd6Q1Bq-zdFsgANPFGugHaFj?pid=Api&h=220&P=0?w=400" },
        { id: 8, name: "Gạo ST25 (5kg)", price: 185000, img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" },
        { id: 9, name: "Nước ngọt lon", price: 10000, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400" },
        { id: 10, name: "Dầu ăn 1L", price: 45000, img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400" },
    ];

    let cart = []; // Mảng chứa các sản phẩm trong giỏ hàng

    // Lưu giỏ hàng vào LocalStorage
    function saveCart() {
        localStorage.setItem('taphoa_cart', JSON.stringify(cart));
    }

    // Tải giỏ hàng từ LocalStorage
    function loadCart() {
        const savedCart = localStorage.getItem('taphoa_cart');
        if (savedCart) cart = JSON.parse(savedCart);
    }

    const productList = document.getElementById('product-list');
    const cartCountEl = document.getElementById('cart-count');

    // Hiển thị sản phẩm ra màn hình (dùng data-id thay vì onclick inline)
    function displayProducts(items = products) {
        if (!productList) {
            console.warn('product-list element not found');
            return;
        }
        try {
            if (items.length === 0) {
                productList.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Không tìm thấy sản phẩm nào.</p>';
                return;
            }
            productList.innerHTML = items.map(product => `
			<div class="product-card">
				<img src="${product.img}" alt="${product.name}">
				<h3>${product.name}</h3>
				<p class="price">${product.price.toLocaleString('vi-VN')} đ</p>
				<button class="btn-buy" data-id="${product.id}">Chọn mua</button>
			</div>
            `).join('');

            // Gắn sự kiện cho các nút mua
            productList.querySelectorAll('.btn-buy').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.dataset.id, 10);
                    addToCart(id);
                });
            });
        } catch (err) {
            showErrorBanner(err.message || String(err));
            throw err; // rethrow so console shows full stack
        }
    }

    // Cập nhật hiển thị số lượng giỏ hàng
    function updateCartCount() {
        if (cartCountEl) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountEl.innerText = totalItems;
        }
    }

    // Hiển thị chi tiết giỏ hàng trong Modal
    function displayCart() {
        const container = document.getElementById('cart-items-container');
        const totalPriceEl = document.getElementById('cart-total-price');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '<div style="padding: 40px 0; text-align: center; color: #888;"><i class="fas fa-shopping-basket" style="font-size: 3rem; margin-bottom: 10px; display: block;"></i> Giỏ hàng của bạn đang trống.</div>';
            if (totalPriceEl) totalPriceEl.innerText = '0';
            return;
        }

        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <div style="font-weight: 600; color: #333;">${item.name}</div>
                    <div style="color: #e74c3c; font-size: 0.9rem;">${item.price.toLocaleString('vi-VN')} đ</div>
                    <div class="quantity-controls">
                        <button class="btn-qty decrease" data-id="${item.id}">-</button>
                        <span style="font-size: 0.9rem;">${item.quantity}</span>
                        <button class="btn-qty increase" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="btn-remove" data-id="${item.id}">&times;</button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (totalPriceEl) totalPriceEl.innerText = total.toLocaleString('vi-VN');

        // Gắn sự kiện xóa sản phẩm
        container.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id, 10);
                removeFromCart(id);
            });
        });

        // Gắn sự kiện tăng số lượng
        container.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id, 10);
                changeQuantity(id, 1);
            });
        });

        // Gắn sự kiện giảm số lượng
        container.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id, 10);
                changeQuantity(id, -1);
            });
        });
    }

    // Chức năng mua hàng (tăng số lượng giỏ hàng) với kiểm tra an toàn
    function addToCart(id) {
        const item = products.find(p => p.id === id);
        if (!item) {
            console.warn('Sản phẩm không tìm thấy:', id);
            return;
        }

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({...item, quantity: 1 });
        }

        // Thêm hiệu ứng rung cho biểu tượng giỏ hàng
        const cartIconBtn = document.querySelector('.cart-icon');
        if (cartIconBtn) {
            cartIconBtn.classList.add('shake-anim');
            // Xóa class sau khi animation kết thúc (0.5s) để có thể chạy lại lần sau
            setTimeout(() => {
                cartIconBtn.classList.remove('shake-anim');
            }, 500);
        }

        updateCartCount();
        saveCart();
        alert(`Đã thêm "${item.name}" vào giỏ hàng!`);
    }

    // Hàm thay đổi số lượng
    function changeQuantity(id, delta) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeFromCart(id);
            } else {
                updateCartCount();
                displayCart();
            }
            saveCart();
        }
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartCount();
        displayCart();
        saveCart();
    }

    // Xử lý Modal Đăng nhập
    const modal = document.getElementById("login-modal");
    const loginBtnLi = document.getElementById("login-btn");
    const loginAnchor = loginBtnLi ? loginBtnLi.querySelector('a') : null;
    const closeBtn = document.querySelector(".close");
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');

    if (loginAnchor && modal && closeBtn) {
        loginAnchor.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn chặn load lại trang khi bấm link
            modal.style.display = "block";
            if (loginSection) loginSection.style.display = 'block';
            if (registerSection) registerSection.style.display = 'none';
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = "none";
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) modal.style.display = "none";
        });
    }

    // Xử lý Modal Giỏ hàng
    const cartModal = document.getElementById("cart-modal");
    const cartIcon = document.querySelector(".cart-icon");
    const closeCartBtn = document.querySelector(".close-cart");

    if (cartIcon && cartModal && closeCartBtn) {
        cartIcon.addEventListener('click', () => {
            cartModal.style.display = "block";
            displayCart();
        });

        closeCartBtn.addEventListener('click', () => {
            cartModal.style.display = "none";
        });

        window.addEventListener('click', (event) => {
            if (event.target === cartModal) cartModal.style.display = "none";
        });
    }

    // Xử lý nút Thanh toán
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return alert('Giỏ hàng trống!');
            alert('Cảm ơn bạn đã mua hàng! Đơn hàng đang được xử lý.');
            cart = [];
            saveCart();
            updateCartCount();
            displayCart(); // Cập nhật lại giao diện giỏ hàng trống
            if (cartModal) cartModal.style.display = 'none';
        });
    }

    // Chuyển đổi giữa Đăng nhập và Đăng ký
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');

    if (showRegister && showLogin && loginSection && registerSection) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
        });

        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const errorDiv = document.getElementById('register-error');
            if (errorDiv) errorDiv.style.display = 'none'; // Reset lỗi cũ

            // Lấy tất cả các ô nhập liệu kiểu password trong form đăng ký
            const passwordInputs = registerForm.querySelectorAll('input[type="password"]');
            const password = passwordInputs[0].value;
            const confirmPassword = passwordInputs[1].value;

            // Kiểm tra xem hai mật khẩu có khớp nhau không
            if (password !== confirmPassword) {
                if (errorDiv) {
                    errorDiv.textContent = "Mật khẩu xác nhận không khớp!";
                    errorDiv.style.display = 'block';
                }
                return; // Dừng hàm tại đây, không thực hiện các lệnh bên dưới
            }

            alert("Đăng ký thành công! Bây giờ bạn có thể đăng nhập.");
            if (registerSection) registerSection.style.display = 'none';
            if (loginSection) loginSection.style.display = 'block';
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Đăng nhập thành công!");
            if (modal) modal.style.display = "none";
            if (loginAnchor) {
                loginAnchor.textContent = 'Chào, Admin';
                loginAnchor.setAttribute('href', '#');
                loginAnchor.style.pointerEvents = 'none';
            }
        });
    }

    // Xử lý tìm kiếm
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const filteredItems = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm)
            );
            displayProducts(filteredItems);
        });
    }

    // Khởi chạy hiển thị ban đầu
    loadCart();
    displayProducts();
    updateCartCount();
});