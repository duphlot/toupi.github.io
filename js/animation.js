document.getElementById('product-list').addEventListener('click', function(event) {
    if (event.target.classList.contains('addToCartBtn')) {
        const cart = document.querySelector('#cartBtn');
        const productCard = event.target.closest('.card');
        const productImage = productCard.querySelector('.carousel-item.active img');
        const productImageClone = productImage.cloneNode(true);
        const rect = productImage.getBoundingClientRect();
        productImageClone.style.position = 'fixed';
        productImageClone.style.top = `${rect.top}px`;
        productImageClone.style.left = `${rect.left}px`;
        productImageClone.style.width = `${rect.width}px`;
        productImageClone.style.height = `${rect.height}px`;
        productImageClone.style.transition = 'all 1s ease-in-out';
        productImageClone.style.zIndex = '1000';
        document.body.appendChild(productImageClone);
        const cartRect = cart.getBoundingClientRect();
        setTimeout(() => {
            productImageClone.style.top = `${cartRect.top}px`;
            productImageClone.style.left = `${cartRect.left}px`;
            productImageClone.style.width = '0px';
            productImageClone.style.height = '0px';
            productImageClone.style.opacity = '0';
        }, 100);
        productImageClone.addEventListener('transitionend', () => {
            productImageClone.remove();
        });
    }
});


document.querySelectorAll('.carousel').forEach(function(carousel) {
    let touchstartX = 0;
    let touchendX = 0;
    carousel.addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
    });
    carousel.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchendX < touchstartX) {
            carousel.querySelector('.carousel-control-next').click();
        }
        if (touchendX > touchstartX) {
            carousel.querySelector('.carousel-control-prev').click();
        }
    }
});


document.getElementById('product-details').addEventListener('click', function(event) {
    if (event.target.classList.contains('addToCartBtn')) {
        const cart = document.querySelector('#cartBtn');

        cart.classList.add('cart-highlight');
        setTimeout(() => {
            cart.classList.remove('cart-highlight');
        }, 1000);

        const toast = document.createElement('div');
        toast.textContent = "Đã thêm sản phẩm vào giỏ hàng!";
        toast.className = 'custom-toast';
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hide');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 1000);
    }
});
