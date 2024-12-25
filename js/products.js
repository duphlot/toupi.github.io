function showfilter(category) {
    document.querySelectorAll('.product-category').forEach(product => {
        if (product.classList.contains(category)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
    document.querySelectorAll('#product-filters button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`#product-filters button[onclick="showProductGrid(); showfilter('${category}')"]`).classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
    updatetoupiCount();
    displaytoupiProducts();
});

document.getElementById('product-list').addEventListener('click', function (event) {
    if (event.target.classList.contains('addToCartBtn')) {
        const button = event.target;
        const productStyle = button.closest('.product-category').classList.contains('cookies');
        const productCard = button.closest('.card');
        let productName = productCard.querySelector('.card-title').textContent.trim();
        const productPrice = productCard.querySelector('.btn-primary').textContent;
        const productImage = productCard.querySelector('img').getAttribute('src');
        const productColor =  productCard.querySelector('#product-color').value;
        productName = `${productName} - ${productColor}`;
        console.log(`Adding to cart: ${productName}, Price: ${productPrice}, Style: ${productStyle}, Image: ${productImage}`);

        let toupi = JSON.parse(localStorage.getItem('toupi')) || [];
        const existingProduct = toupi.find(product => product.name === productName);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            const product = { name: productName, price: productPrice, style: productStyle, image: productImage, quantity: 1 };
            toupi.push(product);
        }

        localStorage.setItem('toupi', JSON.stringify(toupi));
        updatetoupiUI();
    }
});

document.getElementById('product-details').addEventListener('click', function (event) {
    if (event.target.classList.contains('addToCartBtn')) {
        const button = event.target;

        const productContainer = button.closest('#product-details');
        const productName = productContainer.querySelector('#product-name').textContent.trim();
        const productDescription = productContainer.querySelector('#product-description').textContent.trim();
        const productPrice = productContainer.querySelector('#product-price').textContent.split(':')[1].trim();
        const productImage = productContainer.querySelector('.carousel-inner .active img').getAttribute('src'); // Lấy hình ảnh hiện tại trong carousel
        const productColorSelect = productContainer.querySelector('select'); 
        const productColor = productColorSelect ? productColorSelect.value : 'Default Color';

        const finalProductName = `${productName} - ${productColor}`;

        console.log(`Adding to cart: ${finalProductName}, Description: ${productDescription}, Price: ${productPrice}, Image: ${productImage}`);

        let toupi = JSON.parse(localStorage.getItem('toupi')) || [];
        const existingProduct = toupi.find(product => product.name === finalProductName);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            const product = {
                name: finalProductName,
                description: productDescription,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            toupi.push(product);
        }

        localStorage.setItem('toupi', JSON.stringify(toupi));

        if (typeof updatetoupiUI === 'function') {
            updatetoupiUI();
        }
    }
});



function removeFromtoupi(productName) {
    let toupi = JSON.parse(localStorage.getItem('toupi')) || [];
    const productIndex = toupi.findIndex(product => product.name === productName);
    toupi.splice(productIndex, 1); 
    localStorage.setItem('toupi', JSON.stringify(toupi));
    updatetoupiUI();
}

function updatetoupiCount() {
    const toupi = JSON.parse(localStorage.getItem('toupi')) || [];
    const totalQuantity = toupi.reduce((total, product) => total + product.quantity, 0);
    document.getElementById('cartCount').textContent = totalQuantity;
}

function updatetoupiUI() {
    updatetoupiCount();
    displaytoupiProducts();
}

function displaytoupiProducts() {
    const toupi = JSON.parse(localStorage.getItem('toupi')) || [];
    const toupiContainer = document.getElementById('cartContainer');
    toupiContainer.innerHTML = '';

    if (toupi.length === 0) {
        toupiContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        toupi.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-product', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-3');
            itemDiv.innerHTML = `
                <div class="flex-grow-1">
                    <h4 class="cart-product-title mb-1">${item.name}</h4>
                </div>
                <div class="d-flex align-items-center justify-content-center flex-grow-1">
                    <div class="item-price-quantity d-flex flex-column align-items-center">
                        <p class="cart-product-price mb-1" style="font-size: 1rem;">${item.price}</p>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-secondary btn-sm adjust-quantity decreaseQuantityBtn me-2 d-flex align-items-center justify-content-center" style="font-size:1.2rem; width: 30px; height: 30px;">-</button>
                            <span class="quantity me-2" style="font-size: 1.2rem;">${item.quantity}</span>
                            <button class="btn btn-secondary btn-sm adjust-quantity increaseQuantityBtn d-flex align-items-center justify-content-center" style="font-size:1.2rem; width: 30px; height: 30px;">+</button>
                        </div>
                    </div>
                </div>
                <span class="trash-icon ms-3" onclick="removeFromtoupi('${item.name}')">&#128465;</span>
            `;
            toupiContainer.appendChild(itemDiv);
        });
        addtoupiButtonsEvents();
    }
}

function addtoupiButtonsEvents() {
    document.querySelectorAll('.removeFromCartBtn').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.cart-product');
            const productName = productCard.querySelector('.cart-product-title').textContent;
            removeFromCart(productName);
        });
    });

    document.querySelectorAll('.increaseQuantityBtn').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.cart-product');
            const productName = productCard.querySelector('.cart-product-title').textContent;
            let toupi = JSON.parse(localStorage.getItem('toupi')) || [];
            const product = toupi.find(product => product.name === productName);
            if (product) product.quantity += 1;
            localStorage.setItem('toupi', JSON.stringify(toupi));
            updatetoupiUI();
        });
    });

    document.querySelectorAll('.decreaseQuantityBtn').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.cart-product');
            const productName = productCard.querySelector('.cart-product-title').textContent;
            let toupi = JSON.parse(localStorage.getItem('toupi')) || [];
            const productIndex = toupi.findIndex(product => product.name === productName);
            if (productIndex !== -1) {
                if (toupi[productIndex].quantity > 1) {
                    toupi[productIndex].quantity -= 1; 
                } else {
                    toupi.splice(productIndex, 1); 
                }
            }
            localStorage.setItem('toupi', JSON.stringify(toupi));
            updatetoupiUI();
        });
    });
}
