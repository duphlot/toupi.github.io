const productListContainer = document.getElementById("product-list");
const productPath = "images/productImg/";

async function fetchProductData() {
    try {
        console.log("Fetching product data...");
        const response = await fetch(`${productPath}/text.txt`);
        const text = await response.text();
        console.log("Product data fetched:", text);
        return text.split("\n").map(line => {
            const [folder, name, filter,status ,price] = line.split("-").map(item => item.trim());
            return { folder, name, filter,status ,price };
        }).filter(product => product.folder && product.name && product.filter && product.status && product.price);
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
}

async function createProductCard(product, index) {
    try {
        console.log("Creating product card for:", product);
        const imageFolder = `${productPath}${product.folder}`;
        const imageUrls = [`${imageFolder}/1.jpg`, `${imageFolder}/2.jpg`, `${imageFolder}/3.jpg`];

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

        const soldOutButton = document.createElement("a");
        soldOutButton.href = "#";
        soldOutButton.classList.add("btn", "btn-primary", product.status=="on"?"addToCartBtn":"soldOut");
        soldOutButton.textContent = product.status=="on"?"Add to Cart":"SOLD OUT!";

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(soldOutButton);

        carouselDiv.appendChild(carouselInner);
        carouselDiv.appendChild(prevButton);
        carouselDiv.appendChild(nextButton);

        cardDiv.appendChild(carouselDiv);
        cardDiv.appendChild(cardBody);
        colDiv.appendChild(cardDiv);

        console.log("Product card created:", colDiv);
        return colDiv;
    } catch (error) {
        console.error("Error creating product card:", error);
    }
}

async function initProductList() {
    try {
        console.log("Initializing product list...");
        const products = await fetchProductData();
        console.log("Products fetched:", products);

        products.forEach(async (product, index) => {
            const productCard = await createProductCard(product, index);
            productListContainer.appendChild(productCard);
            console.log("Product card appended:", productCard);
        });
    } catch (error) {
        console.error("Error initializing product list:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM content loaded");
    initProductList();
});
