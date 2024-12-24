async function showProductGrid(){
    const section = document.getElementById('product-details');
    section.style.display = 'none';
    const selectedSection = document.getElementById('product-grid-lists');
    selectedSection.style.display = 'block';
}
async function showdetailsSection(sectionId, productId, productPrice, productName, productFilter, productStatus) {
    console.log(sectionId);
    console.log(productId);

    document.querySelectorAll('.side-section').forEach(section => {
        section.style.display = 'none';
    });

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    const productDetailsSection = document.getElementById('product-details');
    const carouselInner = document.getElementById('carousel-inner');
    const carouselIndicators = document.getElementById('carousel-indicators');
    const productDetailsText = document.querySelector('.product-details-text');

    let productFolder = 'images/productImg/' + productId;

    carouselInner.innerHTML = '';
    carouselIndicators.innerHTML = '';

    const imageUrls = await Promise.all(
        Array.from({ length: 10 }, (_, i) => `${productFolder}/${i + 1}.jpg`).map(async url => {
            try {
                const response = await fetch(url);
                return response.ok ? url : null;
            } catch (error) {
                console.error(`Error fetching image ${url}:`, error);
                return null;
            }
        })
    ).then(urls => urls.filter(url => url !== null));

    const fragment = document.createDocumentFragment();
    imageUrls.forEach((imgSrc, index) => {
        let isActive = (index === 0) ? 'active' : '';

        let carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${isActive}`;

        let img = document.createElement('img');
        img.src = imgSrc;
        img.className = 'd-block w-100 carousel-img';
        img.alt = `${productId} image ${index + 1}`;

        carouselItem.appendChild(img);
        fragment.appendChild(carouselItem);

        let indicator = document.createElement('li');
        indicator.setAttribute('data-bs-target', '#product-details-carousel');
        indicator.setAttribute('data-bs-slide-to', index);
        indicator.className = (index === 0) ? 'active' : '';
        carouselIndicators.appendChild(indicator);
    });
    carouselInner.appendChild(fragment);

    try {
        const response = await fetch(`${productFolder}/details.txt`);
        const description = await response.text();
        productDetailsText.innerHTML = `
            <h5 id="product-name">${productName}</h5>
            <p id="product-description">${description || "Mô tả sản phẩm sẽ được cập nhật."}</p>
            <p id="product-price">Price: ${productPrice} VND</p>
        `;
    } catch (error) {
        console.error('Error fetching product details:', error);
        productDetailsText.innerHTML = `
            <h5 id="product-name">${productName}</h5>
            <p id="product-description" class = "description">Mô tả sản phẩm sẽ được cập nhật.</p>
            <p id="product-price">Price: ${productPrice} VND</p>
        `;
    }

    try {
        const response = await fetch(`${productFolder}/color.txt`);
        const text = await response.text();
        const colors = text.split("\n").map(line => line.trim()).filter(color => color);

        const productColorSelect = document.createElement('select');
        productColorSelect.classList.add("form-select", "mb-3");
        productColorSelect.id = "product-color";
        productColorSelect.setAttribute("aria-label", "Select color");
        productColorSelect.innerHTML = colors.map(color => `<option value="${color}">${color}</option>`).join("");
        productDetailsText.appendChild(productColorSelect);
    } catch (error) {
        console.error('Error fetching product colors:', error);
    }

    const soldOutButton = document.createElement('a');
    soldOutButton.href = "#";
    soldOutButton.classList.add("btn", "btn-primary", productStatus === "on" ? "addToCartBtn" : "soldOut");
    soldOutButton.textContent = productStatus === "on" ? `Liệng vô dỏ hàngggggg 🛒` : "SOLD OUT!";
    productDetailsText.appendChild(soldOutButton);
}
