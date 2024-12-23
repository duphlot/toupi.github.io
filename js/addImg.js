// New Products
const productGrid = document.getElementById("product-grid");
const productImagePath = "images/newProducts/";
const productTextFile = "images/newProducts/text.txt";

async function fetchProductDataForGrid() {
    const response = await fetch(productTextFile);
    const text = await response.text();
    return text.split("\n").map(line => {
        const [imageName, label, position] = line.split('-').map(item => item.trim());
        return { imageName, label, position };
    }).filter(item => item.imageName && item.label && item.position);
}

async function initProductGrid() {
    const products = await fetchProductDataForGrid();

    products.forEach(product => {
        const columnDiv = document.createElement("div");
        columnDiv.classList.add("new-product");

        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card", product.position);

        const imgElement = document.createElement("img");
        imgElement.src = `${productImagePath}${product.imageName}`;
        imgElement.classList.add("card-img-top");

        const labelDiv = document.createElement("div");
        labelDiv.classList.add("corner-label", "bottom-right");
        labelDiv.textContent = product.label;

        cardDiv.appendChild(imgElement);
        //cardDiv.appendChild(labelDiv);
        columnDiv.appendChild(cardDiv);
        productGrid.appendChild(columnDiv);
    });
}

// Carousel
const carouselContainer = document.getElementById("carousel-container");
const carouselImagePath = "images/homeCarousel/";
const carouselTextFile = "images/homeCarousel/text.txt";

async function fetchLabels() {
    const response = await fetch(carouselTextFile);
    const text = await response.text();
    return text.split("\n").map(line => {
        const [imageName, label] = line.split('-').map(item => item.trim());
        return { imageName, label };
    }).filter(item => item.imageName && item.label);
}

async function initCarousel() {
    const labels = await fetchLabels();

    labels.forEach((item, index) => {
        const imageSrc = `${carouselImagePath}${item.imageName}`;
        
        const carouselItem = document.createElement("div");
        carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;

        const imgElement = document.createElement("img");
        imgElement.src = imageSrc;
        imgElement.classList.add("d-block", "w-100", "carousel-img");

        const labelDiv = document.createElement("div");
        labelDiv.classList.add("corner-label", "top-left");
        labelDiv.textContent = item.label;

        carouselItem.appendChild(imgElement);
        carouselItem.appendChild(labelDiv);
        carouselContainer.appendChild(carouselItem);
    });
}

// Product List
const productListContainer = document.getElementById("product-list");
const productPath = "images/productImg/";

async function fetchProductData() {
    const response = await fetch(`${productPath}/text.txt`);
    const text = await response.text();
    return text.split("\n").map(line => {
        const [folder, name, filter, status, price] = line.split('-').map(item => item.trim());
        return { folder, name, filter, status, price };
    }).filter(product => product.folder && product.name && product.filter && product.status && product.price);
}

async function createProductCard(product, index) {
    const imageFolder = `${productPath}${product.folder}`;
    const imageUrls = [];
    for (let i = 1; i <= 20; i++) {
        const imageUrl = `${imageFolder}/${i}.jpg`;
        try {
            const response = await fetch(imageUrl);
            if (response.ok) {
                imageUrls.push(imageUrl);
            }
        } catch (error) {
            console.error(`Error fetching image ${imageUrl}:`, error);
        }
    }

    const colDiv = document.createElement("div");
    colDiv.classList.add("col", "product-category", product.filter);

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "h-100");

    const carouselId = `carouselExampleControls${index}`;
    const carouselDiv = document.createElement("div");
    carouselDiv.id = carouselId;
    carouselDiv.classList.add("carousel", "slide");

    const carouselInner = document.createElement("div");
    carouselInner.classList.add("carousel-inner");

    imageUrls.forEach((imageUrl, idx) => {
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        if (idx === 0) carouselItem.classList.add("active");

        const imgElement = document.createElement("img");
        imgElement.src = imageUrl;
        imgElement.classList.add("card-img-top");
        imgElement.alt = product.name;

        carouselItem.appendChild(imgElement);
        carouselInner.appendChild(carouselItem);
    });

    const prevButton = document.createElement("button");
    prevButton.classList.add("carousel-control-prev");
    prevButton.type = "button";
    prevButton.setAttribute("data-bs-target", `#${carouselId}`);
    prevButton.setAttribute("data-bs-slide", "prev");
    prevButton.innerHTML = `
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    `;

    const nextButton = document.createElement("button");
    nextButton.classList.add("carousel-control-next");
    nextButton.type = "button";
    nextButton.setAttribute("data-bs-target", `#${carouselId}`);
    nextButton.setAttribute("data-bs-slide", "next");
    nextButton.innerHTML = `
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    `;

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "text-center");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = product.name;

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = `Price: ${product.price} VND`;

    const colorFile = `${imageFolder}/color.txt`;
    const response = await fetch(colorFile);
    const text = await response.text();
    const colors = text.split("\n").map(line => line.trim()).filter(color => color);
    const selectElement = document.createElement("select");
    selectElement.classList.add("form-select", "mb-3");
    selectElement.id = "product-color";
    selectElement.setAttribute("aria-label", "Select color");
    selectElement.innerHTML = colors.map(color => `<option value="${color}">${color}</option>`).join("");

    const soldOutButton = document.createElement("a");
    soldOutButton.href = "#";
    soldOutButton.classList.add("btn", "btn-primary", product.status === "on" ? "addToCartBtn" : "soldOut");
    soldOutButton.textContent = product.status === "on" ? `${product.price} VND` : "SOLD OUT!";

    cardBody.appendChild(cardTitle);
    //cardBody.appendChild(cardText);
    cardBody.appendChild(selectElement);
    cardBody.appendChild(soldOutButton);

    carouselDiv.appendChild(carouselInner);
    carouselDiv.appendChild(prevButton);
    carouselDiv.appendChild(nextButton);

    cardDiv.appendChild(carouselDiv);
    cardDiv.appendChild(cardBody);
    colDiv.appendChild(cardDiv);

    return colDiv;
}

async function initProductList() {
    const products = await fetchProductData();

    products.forEach(async (product, index) => {
        const productCard = await createProductCard(product, index);
        productListContainer.appendChild(productCard);
    });
}

// Custom Gallery
const customPath = "images/custom/";
const customContainer = document.getElementById("custom-gallery");

async function fetchCustomImages() {
    try {
        const response = await fetch(`${customPath}/text.txt`);
        const text = await response.text();
        return text.split("\n").map(line => {
            const [imageName, caption] = line.split("-").map(item => item.trim());
            return { imageName, caption };
        }).filter(item => item.imageName && item.caption);
    } catch (error) {
        console.error("Error fetching custom images:", error);
    }
}

async function initCustomGallery() {
    const customImages = await fetchCustomImages();
    customImages.forEach(item => {
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("custom-image-wrapper");

        const imgElement = document.createElement("img");
        imgElement.src = `${customPath}${item.imageName}`;
        imgElement.alt = item.caption;
        imgElement.classList.add("custom-image");

        const captionDiv = document.createElement("div");
        captionDiv.classList.add("custom-caption");
        captionDiv.textContent = item.caption;

        imageWrapper.appendChild(imgElement);
        imageWrapper.appendChild(captionDiv);
        customContainer.appendChild(imageWrapper);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initProductGrid();
    initCarousel();
    initProductList();
    initCustomGallery();
});