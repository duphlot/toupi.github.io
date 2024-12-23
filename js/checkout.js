function adjustQuantity(action, index) {
    const toupi = JSON.parse(localStorage.getItem('toupi')) || [];
    let quantity = toupi[index].quantity || 1;
    if (action === 'increase') {
        quantity++;
    } else if (action === 'decrease' && quantity > 1) {
        quantity--;
    }
    toupi[index].quantity = quantity; 
    localStorage.setItem('toupi', JSON.stringify(toupi)); 
    rendertoupi(); 
}

function updateSubtotal() {
    let subtotal = 0;
    const toupiItems = document.querySelectorAll('.cart-item');
    
    toupiItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        const price = parseFloat(item.querySelector('.item-total-price').textContent.replace(' VND', '').replace(',', ''));
        subtotal += quantity * price;
    });
    
    document.getElementById('subtotal').textContent = subtotal.toLocaleString();
}

function toggleOtherAddress(select) {
    var otherAddressInput = document.getElementById('other-address');
    if (select.value === 'other') {
        otherAddressInput.style.display = 'block';
        otherAddressInput.required = true;
    } else {
        otherAddressInput.style.display = 'none';
        otherAddressInput.required = false;
    }
}

function rendertoupi() {
    const toupi = JSON.parse(localStorage.getItem('toupi')) || [];
    const toupiItemsContainer = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const discountCombosContainer = document.getElementById('discountCombos');

    let subtotal = 0;
    let cookiesCount = 0;
    let braceletsCount = 0;

    // Tính toán lại tổng tiền và số lượng của từng loại
    toupi.forEach(item => {
        const quantity = item.quantity || 1;
        const itemPrice = parseInt(item.price.replace(/\D/g, ''));
        subtotal += itemPrice * quantity;

        if (item.style) {
            cookiesCount += quantity;
        } else {
            braceletsCount += quantity;
        }
    });

    let discount = 0;
    const discountCombos = [];
    let count = 0;
    
    while (braceletsCount >= 2) {
        discount += 5000;
        braceletsCount -= 2;
        count++;
    }
    while (cookiesCount >= 3) {
        discount += 5000;
        cookiesCount -= 3;
        count++;
    }
    discountCombos.push(`Special Discount: -${discount} VND`);
    const total = subtotal - discount;

    // Cập nhật lại HTML giỏ hàng
    toupiItemsContainer.innerHTML = '';
    toupi.forEach((item, index) => {
        const quantity = item.quantity || 1;
        const itemPrice = parseInt(item.price.replace(/\D/g, ''));
        const totalItemPrice = itemPrice * quantity;
        
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
        <div class="item-details">
            <span class="trash-icon" onclick="removeItem(${index})">&#128465;</span>
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div>
                <p class="item-name">${item.name}</p>
                <p class="item-price-quantity">
                    <button class="btn btn-secondary btn-sm adjust-quantity" onclick="adjustQuantity('decrease', ${index})">-</button>
                    <span class="quantity">${quantity}</span>
                    <button class="btn btn-secondary btn-sm adjust-quantity" onclick="adjustQuantity('increase', ${index})">+</button>
                </p>
            </div>
        </div>
        <p class="item-total-price">${totalItemPrice} VND</p>
        `;
        toupiItemsContainer.appendChild(itemDiv);
    });
    discountCombosContainer.innerHTML = '';
    discountCombos.forEach(combo => {
        const comboDiv = document.createElement('div');
        comboDiv.classList.add('discount-combo');
        comboDiv.textContent = combo;
        discountCombosContainer.appendChild(comboDiv);
    });
    subtotalElement.textContent = `${total} VND`;
}

// Thêm sự kiện submit khi trang được tải lần đầu
window.addEventListener('DOMContentLoaded', () => {
    rendertoupi();

    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const fullName = document.getElementById('billing-name').value;
        const email = document.getElementById('billing-email').value;
        const address = document.getElementById('billing-address').value;
        const zip = document.getElementById('billing-number').value;
        const day = document.getElementById('delivery-day').value;
        const time = document.getElementById('delivery-time').value;
        const otheraddress = document.getElementById('other-address').value;

        // Lấy lại giỏ hàng và tính toán subtotal
        const toupi = JSON.parse(localStorage.getItem('toupi')) || [];
        let subtotal = 0;
        let cookiesCount = 0;
        let braceletsCount = 0;
        toupi.forEach(item => {
            const quantity = item.quantity || 1;
            const itemPrice = parseInt(item.price.replace(/\D/g, ''));
            subtotal += itemPrice * quantity;
            if (item.style) {
                cookiesCount += quantity;
            } else {
                braceletsCount += quantity;
            }
        });
        let discount = 0;
        while (braceletsCount >= 2) {
            discount += 5000;
            braceletsCount -= 2;
        }
        while (cookiesCount >= 3) {
            discount += 5000;
            cookiesCount -= 3;
        }
        subtotal -= discount;
        const orderData = {
            fullName: fullName,
            email: email,
            address: address + ' - ' + otheraddress,
            city: day + ' - ' + time,
            zip: zip,
            toupiItems: toupi.map((item, index) => `${item.name} - ${item.quantity}`).join(', '),
            subtotal: subtotal
        };

        const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbxOxB3-Zdt8GKdcjMBs1A2IoPEClKI4vuCgJol8P6c8pKt9kfo7FYVCKiNk92RjhI4x0Q/exec';
        fetch(googleAppsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
            mode: 'no-cors'
        })
        .then(() => {
            console.log('Order submitted successfully');

            localStorage.removeItem('toupi');

            document.getElementById('cartItems').innerHTML = '';
            document.getElementById('subtotal').textContent = '0 VND';

            checkoutForm.reset();
        })
        .catch(error => {
            console.error('Error submitting order:', error);
            alert('There was an error processing your order. Please try again.');
        });        
    });
});

// Hàm removeItem dùng để xóa mục khỏi giỏ hàng
function removeItem(index) {
    const toupi = JSON.parse(localStorage.getItem('toupi')) || [];
    toupi.splice(index, 1); // Xóa mục khỏi giỏ hàng
    localStorage.setItem('toupi', JSON.stringify(toupi)); // Cập nhật lại localStorage
    rendertoupi(); // Gọi lại rendertoupi để cập nhật giao diện
}