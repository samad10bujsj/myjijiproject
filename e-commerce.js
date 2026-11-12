document.addEventListener("DOMContentLoaded", function() {

    const API = "https://dummyjson.com/products";

    
    const NAIRA_RATE = 1500;

    let allProducts = [];

    const productsContainer = document.getElementById("products");
    const categoryList = document.getElementById("categoryList");
    const categoryToggle = document.getElementById("categoryToggle");
    const mainArrow = document.getElementById("mainArrow");

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    const modal = document.getElementById("productModal");
    const productDetails = document.getElementById("productDetails");

    const sectionTitle = document.getElementById("sectionTitle");
    const resultMessage = document.getElementById("resultMessage");

    let currentProducts = [];



    const categories = {

       

        "Electronics & Accessories": [
            "mobile-accessories"
        ],

        "Fashion": [
            "tops",
            "mens-shirts",
            "womens-dresses"
        ],

        "Shoes": [
            "mens-shoes",
            "womens-shoes"
        ],

        "Beauty & Personal Care": [
            "beauty",
            "skin-care"
        ],

        "Fragrances": [
            "fragrances"
        ],

        "Home & Furniture": [
            "furniture",
            "home-decoration"
        ],

        "Watches & Jewellery": [
            "mens-watches",
            "womens-watches",
            "womens-jewellery"
        ],

        "Bags & Accessories": [
            "womens-bags",
            "sunglasses"
        ],

        "Computers": [
            "laptops"
        ],

        "Kitchen & Groceries": [
            "kitchen-accessories",
            "groceries"
        ],

        // "Sports & Outdoors": [
        //     "sports-accessories"
        // ]

    };

    function money(price) {

        return "₦" + Math.round(
            price * NAIRA_RATE
        ).toLocaleString("en-NG");

    }



    function escapeHTML(value) {

        return String(value ?? "").replace(
            /[&<>"']/g,
            function(char) {

                return {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                }[char];

            }
        );

    }



    function showProducts(items) {

        currentProducts = items;

        productsContainer.innerHTML = "";

        resultMessage.textContent =
            items.length + " products found";

        if (items.length === 0) {

            productsContainer.innerHTML = `
                <div class="no-products">
                    <h3>No products found</h3>
                    <p>Try another search or category.</p>
                </div>
            `;

            return;
        }


        items.forEach(function(product) {

            let availability =
                product.stock > 0 ? "In Stock" : "Out of Stock";

            productsContainer.innerHTML += `

                <div class="product-card"
                     data-id="${product.id}">

                    <img
                        src="${escapeHTML(product.thumbnail)}"
                        alt="${escapeHTML(product.title)}"
                        loading="lazy"
                    >

                    <h3>
                        ${escapeHTML(product.title)}
                    </h3>

                    <p class="product-price">
                        ${money(product.price)}
                    </p>

                    <p class="product-rating">
                        ⭐ ${product.rating} / 3
                    </p>

                    <span class="stock">
                        ${availability}
                    </span>

                </div>

            `;

        });

    }



    function createCategories() {

        categoryList.innerHTML = `

            <p class="all-products" onclick="showAll()">
                All Products (${allProducts.length})
            </p>

        `;


        for (let category in categories) {

            let subcategories = categories[category];


            let count = allProducts.filter(function(product) {

                return subcategories.includes(product.category);

            }).length;

            if (count === 0) {
                continue;
            }

            categoryList.innerHTML += `

                <div class="category-item">

                    <div class="category-heading"
                         onclick="toggleCategory(this)">

                        <span>
                            ${category}
                        </span>

                        <span class="category-right">

                            <span class="category-count">
                                ${count}
                            </span>

                            <b class="arrow">›</b>

                        </span>

                    </div>


                    <div class="subcategories">

                        ${subcategories.map(function(subcategory) {

                            let subCount = allProducts.filter(
                                function(product) {

                                    return product.category === subcategory;

                                }
                            ).length;


                            if (subCount === 0) {
                                return "";
                            }


                            return `

                                <p onclick="filterCategory('${subcategory}')">

                                    ${subcategory.replaceAll("-", " ")}

                                    (${subCount})

                                </p>

                            `;

                        }).join("")}

                    </div>

                </div>

            `;

        }

    }


    categoryToggle.addEventListener("click", function() {

        categoryList.classList.toggle("hidden");

        let isHidden = categoryList.classList.contains("hidden");

        categoryToggle.setAttribute(
            "aria-expanded",
            String(!isHidden)
        );

        mainArrow.textContent = isHidden ? "›" : "⌄";

    });



    window.toggleCategory = function(element) {

        let submenu = element.nextElementSibling;

        let arrow = element.querySelector(".arrow");

        submenu.classList.toggle("show");

        arrow.classList.toggle("rotate");

    };



    window.filterCategory = function(category) {

        let filtered = allProducts.filter(function(product) {

            return product.category === category;

        });

        searchInput.value = "";

        sectionTitle.textContent =
            category.replaceAll("-", " ");

        showProducts(filtered);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };



    window.showAll = function() {

        searchInput.value = "";

        sectionTitle.textContent = "Trending Ads";

        showProducts(allProducts);

    };


    function searchProducts() {

        let search = searchInput.value.toLowerCase().trim();


        if (search === "") {

            showAll();

            return;
        }


        let filtered = allProducts.filter(function(product) {

            return (

                product.title.toLowerCase().includes(search) ||

                product.description.toLowerCase().includes(search) ||

                (product.brand || "").toLowerCase().includes(search) ||

                product.category.toLowerCase().includes(search)

            );

        });


        sectionTitle.textContent = "Search Results";

        showProducts(filtered);

    }



    searchBtn.addEventListener("click", searchProducts);



    searchInput.addEventListener("keydown", function(event) {

        if (event.key === "Enter") {

            searchProducts();

        }

    });

    document.getElementById("showAllBtn").addEventListener(
        "click",
        showAll
    );


    function openProduct(id) {

        let product = allProducts.find(function(item) {

            return item.id === Number(id);

        });


        if (!product) {
            return;
        }


        let availability =
            product.stock > 0 ? "In Stock" : "Out of Stock";


        productDetails.innerHTML = `

            <div class="detail-layout">


                <!-- PRODUCT IMAGES -->

                <div>

                    <img
                        src="${escapeHTML(product.thumbnail)}"
                        class="detail-image"
                        id="mainProductImage"
                        alt="${escapeHTML(product.title)}"
                    >


                    <div class="detail-thumbnails">

                        ${product.images.map(function(image) {

                            return `

                                <img
                                    src="${escapeHTML(image)}"
                                    class="thumbnail-image"
                                    alt="Product image"
                                >

                            `;

                        }).join("")}

                    </div>

                </div>


                <!-- PRODUCT INFORMATION -->

                <div class="detail-info">

                    <h2>
                        ${escapeHTML(product.title)}
                    </h2>


                    <p class="product-price">
                        ${money(product.price)}
                    </p>


                    <p>
                        ⭐ ${product.rating} / 5
                    </p>


                    <p>
                        ${escapeHTML(product.description)}
                    </p>


                    <p>
                        <b>Brand:</b>
                        ${escapeHTML(product.brand || "Not specified")}
                    </p>


                    <p>
                        <b>Category:</b>
                        ${escapeHTML(product.category)}
                    </p>


                    <p>
                        <b>Stock:</b>
                        ${product.stock}
                    </p>


                    <p>
                        <b>Availability:</b>
                        ${availability}
                    </p>


                    <p>
                        <b>Discount:</b>
                        ${product.discountPercentage}%
                    </p>


                    <p>
                        <b>Warranty:</b>
                        ${escapeHTML(product.warrantyInformation)}
                    </p>


                    <p>
                        <b>Shipping:</b>
                        ${escapeHTML(product.shippingInformation)}
                    </p>


                    <p>
                        <b>Return Policy:</b>
                        ${escapeHTML(product.returnPolicy)}
                    </p>


                    <button class="buy-btn" onclick="showDemoMessage()">

                        Buy Now

                    </button>

                </div>

            </div>


            <!-- RELATED PRODUCTS -->

            <div class="related-products">

                <h3>Related Products</h3>

                <div class="products" id="relatedProducts">

                </div>

            </div>

        `;



        let thumbnails = document.querySelectorAll(
            ".thumbnail-image"
        );


        thumbnails.forEach(function(image) {

            image.addEventListener("click", function() {

                document.getElementById(
                    "mainProductImage"
                ).src = image.src;

            });

        });


        let related = allProducts.filter(function(item) {

            return (

                item.category === product.category &&

                item.id !== product.id

            );

        }).slice(0, 5);


        let relatedContainer = document.getElementById(
            "relatedProducts"
        );


        if (related.length === 0) {

            relatedContainer.innerHTML =
                "<p>No related products available.</p>";

        }


        related.forEach(function(item) {

            relatedContainer.innerHTML += `

                <div class="product-card"
                     data-id="${item.id}">

                    <img
                        src="${escapeHTML(item.thumbnail)}"
                        alt="${escapeHTML(item.title)}"
                    >

                    <h3>
                        ${escapeHTML(item.title)}
                    </h3>

                    <p class="product-price">
                        ${money(item.price)}
                    </p>

                </div>

            `;

        });



        modal.classList.add("show");

        document.body.style.overflow = "hidden";

    }



    productsContainer.addEventListener("click", function(event) {

        let card = event.target.closest(".product-card");

        if (card) {

            openProduct(card.dataset.id);

        }

    });



    productDetails.addEventListener("click", function(event) {

        let card = event.target.closest(".product-card");

        if (card) {

            openProduct(card.dataset.id);

        }

    });



    window.showDemoMessage = function() {

        alert(
            "THIS ACTION IS UNAVAILABLE."
        );

    };



    function closeProduct() {

        modal.classList.remove("show");

        document.body.style.overflow = "";

    }


    document.getElementById("closeModal").addEventListener(
        "click",
        closeProduct
    );


    modal.addEventListener("click", function(event) {

        if (event.target === modal) {

            closeProduct();

        }

    });


    document.addEventListener("keydown", function(event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("show")
        ) {

            closeProduct();

        }

    });

    fetch(API)

    .then(function(response) {

        if (!response.ok) {

            throw new Error("Could not connect to DummyJSON.");

        }

        return response.json();

    })


    .then(function(data) {

        allProducts = data.products;

        createCategories();

        showProducts(allProducts);

        console.log(
            "Products successfully loaded:",
            allProducts.length
        );

    })


    .catch(function(error) {

        console.log("API Error:", error);

        productsContainer.innerHTML = `

            <div class="no-products">

                <h3>Unable to load products</h3>

                <p>
                    Please check your internet connection
                    and refresh the page.
                </p>

            </div>

        `;

        resultMessage.textContent = "API connection failed.";

    });


});

// document.addEventListener("DOMContentLoaded", function() {


//     const API = "https://dummyjson.com/products";

//     const NAIRA_RATE = 1500;

//     let allProducts = [];

//     const productsContainer = document.getElementById("products");
//     const categoryList = document.getElementById("categoryList");
//     const categoryToggle = document.getElementById("categoryToggle");
//     const mainArrow = document.getElementById("mainArrow");

//     const searchInput = document.getElementById("searchInput");
//     const searchBtn = document.getElementById("searchBtn");

//     const modal = document.getElementById("productModal");
//     const productDetails = document.getElementById("productDetails");

//     const sectionTitle = document.getElementById("sectionTitle");
//     const resultMessage = document.getElementById("resultMessage");

//     let currentProducts = [];



//     const categories = {

//         "Vehicles": [
//             "vehicle",
//             "motorcycle"
//         ],

//         "Phones & Tablets": [
//             "smartphones",
//             "tablets"
//         ],

//         "Electronics & Accessories": [
//             "mobile-accessories"
//         ],

//         "Fashion": [
//             "tops",
//             "mens-shirts",
//             "womens-dresses"
//         ],

//         "Shoes": [
//             "mens-shoes",
//             "womens-shoes"
//         ],

//         "Beauty & Personal Care": [
//             "beauty",
//             "skin-care"
//         ],

//         "Fragrances": [
//             "fragrances"
//         ],

//         "Home & Furniture": [
//             "furniture",
//             "home-decoration"
//         ],

//         "Watches & Jewellery": [
//             "mens-watches",
//             "womens-watches",
//             "womens-jewellery"
//         ],

//         "Bags & Accessories": [
//             "womens-bags",
//             "sunglasses"
//         ],

//         "Computers": [
//             "laptops"
//         ],

//         "Kitchen & Groceries": [
//             "kitchen-accessories",
//             "groceries"
//         ],

//         "Sports & Outdoors": [
//             "sports-accessories"
//         ]

//     };



//     function money(price) {

//         return "₦" + Math.round(
//             price * NAIRA_RATE
//         ).toLocaleString("en-NG");

//     }


//     function escapeHTML(value) {

//         return String(value ?? "").replace(
//             /[&<>"']/g,
//             function(char) {

//                 return {
//                     "&": "&amp;",
//                     "<": "&lt;",
//                     ">": "&gt;",
//                     '"': "&quot;",
//                     "'": "&#39;"
//                 }[char];

//             }
//         );

//     }


//     function showProducts(items) {

//         currentProducts = items;

//         productsContainer.innerHTML = "";

//         resultMessage.textContent =
//             items.length + " products found";

//         if (items.length === 0) {

//             productsContainer.innerHTML = `
//                 <div class="no-products">
//                     <h3>No products found</h3>
//                     <p>Try another search or category.</p>
//                 </div>
//             `;

//             return;
//         }


//         items.forEach(function(product) {

//             let availability =
//                 product.stock > 0 ? "In Stock" : "Out of Stock";

//             productsContainer.innerHTML += `

//                 <div class="product-card"
//                      data-id="${product.id}">

//                     <img
//                         src="${escapeHTML(product.thumbnail)}"
//                         alt="${escapeHTML(product.title)}"
//                         loading="lazy"
//                     >

//                     <h3>
//                         ${escapeHTML(product.title)}
//                     </h3>

//                     <p class="product-price">
//                         ${money(product.price)}
//                     </p>

//                     <p class="product-rating">
//                         ⭐ ${product.rating} / 5
//                     </p>

//                     <span class="stock">
//                         ${availability}
//                     </span>

//                 </div>

//             `;

//         });

//     }



//     function createCategories() {

//         categoryList.innerHTML = `

//             <p class="all-products" onclick="showAll()">
//                 All Products (${allProducts.length})
//             </p>

//         `;


//         for (let category in categories) {

//             let subcategories = categories[category];


//             let count = allProducts.filter(function(product) {

//                 return subcategories.includes(product.category);

//             }).length;



//             if (count === 0) {
//                 continue;
//             }


//             categoryList.innerHTML += `

//                 <div class="category-item">

//                     <div class="category-heading"
//                          onclick="toggleCategory(this)">

//                         <span>
//                             ${category}
//                         </span>

//                         <span class="category-right">

//                             <span class="category-count">
//                                 ${count}
//                             </span>

//                             <b class="arrow">›</b>

//                         </span>

//                     </div>


//                     <div class="subcategories">

//                         ${subcategories.map(function(subcategory) {

//                             let subCount = allProducts.filter(
//                                 function(product) {

//                                     return product.category === subcategory;

//                                 }
//                             ).length;


//                             if (subCount === 0) {
//                                 return "";
//                             }


//                             return `

//                                 <p onclick="filterCategory('${subcategory}')">

//                                     ${subcategory.replaceAll("-", " ")}

//                                     (${subCount})

//                                 </p>

//                             `;

//                         }).join("")}

//                     </div>

//                 </div>

//             `;

//         }

//     }



//     categoryToggle.addEventListener("click", function() {

//         categoryList.classList.toggle("hidden");

//         let isHidden = categoryList.classList.contains("hidden");

//         categoryToggle.setAttribute(
//             "aria-expanded",
//             String(!isHidden)
//         );

//         mainArrow.textContent = isHidden ? "›" : "⌄";

//     });



//     window.toggleCategory = function(element) {

//         let submenu = element.nextElementSibling;

//         let arrow = element.querySelector(".arrow");

//         submenu.classList.toggle("show");

//         arrow.classList.toggle("rotate");

//     };



//     window.filterCategory = function(category) {

//         let filtered = allProducts.filter(function(product) {

//             return product.category === category;

//         });

//         searchInput.value = "";

//         sectionTitle.textContent =
//             category.replaceAll("-", " ");

//         showProducts(filtered);

//         window.scrollTo({
//             top: 0,
//             behavior: "smooth"
//         });

//     };



//     window.showAll = function() {

//         searchInput.value = "";

//         sectionTitle.textContent = "Trending Ads";

//         showProducts(allProducts);

//     };


//     function searchProducts() {

//         let search = searchInput.value.toLowerCase().trim();


//         if (search === "") {

//             showAll();

//             return;
//         }


//         let filtered = allProducts.filter(function(product) {

//             return (

//                 product.title.toLowerCase().includes(search) ||

//                 product.description.toLowerCase().includes(search) ||

//                 (product.brand || "").toLowerCase().includes(search) ||

//                 product.category.toLowerCase().includes(search)

//             );

//         });


//         sectionTitle.textContent = "Search Results";

//         showProducts(filtered);

//     }


//     searchBtn.addEventListener("click", searchProducts);



//     searchInput.addEventListener("keydown", function(event) {

//         if (event.key === "Enter") {

//             searchProducts();

//         }

//     });


//     document.getElementById("showAllBtn").addEventListener(
//         "click",
//         showAll
//     );



//     function openProduct(id) {

//         let product = allProducts.find(function(item) {

//             return item.id === Number(id);

//         });


//         if (!product) {
//             return;
//         }


//         let availability =
//             product.stock > 0 ? "In Stock" : "Out of Stock";


//         productDetails.innerHTML = `

//             <div class="detail-layout">


//                 <!-- PRODUCT IMAGES -->

//                 <div>

//                     <img
//                         src="${escapeHTML(product.thumbnail)}"
//                         class="detail-image"
//                         id="mainProductImage"
//                         alt="${escapeHTML(product.title)}"
//                     >


//                     <div class="detail-thumbnails">

//                         ${product.images.map(function(image) {

//                             return `

//                                 <img
//                                     src="${escapeHTML(image)}"
//                                     class="thumbnail-image"
//                                     alt="Product image"
//                                 >

//                             `;

//                         }).join("")}

//                     </div>

//                 </div>


//                 <!-- PRODUCT INFORMATION -->

//                 <div class="detail-info">

//                     <h2>
//                         ${escapeHTML(product.title)}
//                     </h2>


//                     <p class="product-price">
//                         ${money(product.price)}
//                     </p>


//                     <p>
//                         ⭐ ${product.rating} / 5
//                     </p>


//                     <p>
//                         ${escapeHTML(product.description)}
//                     </p>


//                     <p>
//                         <b>Brand:</b>
//                         ${escapeHTML(product.brand || "Not specified")}
//                     </p>


//                     <p>
//                         <b>Category:</b>
//                         ${escapeHTML(product.category)}
//                     </p>


//                     <p>
//                         <b>Stock:</b>
//                         ${product.stock}
//                     </p>


//                     <p>
//                         <b>Availability:</b>
//                         ${availability}
//                     </p>


//                     <p>
//                         <b>Discount:</b>
//                         ${product.discountPercentage}%
//                     </p>


//                     <p>
//                         <b>Warranty:</b>
//                         ${escapeHTML(product.warrantyInformation)}
//                     </p>


//                     <p>
//                         <b>Shipping:</b>
//                         ${escapeHTML(product.shippingInformation)}
//                     </p>


//                     <p>
//                         <b>Return Policy:</b>
//                         ${escapeHTML(product.returnPolicy)}
//                     </p>


//                     <button class="buy-btn" onclick="showDemoMessage()">

//                         Buy Now

//                     </button>

//                 </div>

//             </div>


//             <!-- RELATED PRODUCTS -->

//             <div class="related-products">

//                 <h3>Related Products</h3>

//                 <div class="products" id="relatedProducts">

//                 </div>

//             </div>

//         `;

//         let thumbnails = document.querySelectorAll(
//             ".thumbnail-image"
//         );


//         thumbnails.forEach(function(image) {

//             image.addEventListener("click", function() {

//                 document.getElementById(
//                     "mainProductImage"
//                 ).src = image.src;

//             });

//         });

//         let related = allProducts.filter(function(item) {

//             return (

//                 item.category === product.category &&

//                 item.id !== product.id

//             );

//         }).slice(0, 5);


//         let relatedContainer = document.getElementById(
//             "relatedProducts"
//         );


//         if (related.length === 0) {

//             relatedContainer.innerHTML =
//                 "<p>No related products available.</p>";

//         }


//         related.forEach(function(item) {

//             relatedContainer.innerHTML += `

//                 <div class="product-card"
//                      data-id="${item.id}">

//                     <img
//                         src="${escapeHTML(item.thumbnail)}"
//                         alt="${escapeHTML(item.title)}"
//                     >

//                     <h3>
//                         ${escapeHTML(item.title)}
//                     </h3>

//                     <p class="product-price">
//                         ${money(item.price)}
//                     </p>

//                 </div>

//             `;

//         });


//         // SHOW MODAL

//         modal.classList.add("show");

//         document.body.style.overflow = "hidden";

//     }



//     productsContainer.addEventListener("click", function(event) {

//         let card = event.target.closest(".product-card");

//         if (card) {

//             openProduct(card.dataset.id);

//         }

//     });



//     productDetails.addEventListener("click", function(event) {

//         let card = event.target.closest(".product-card");

//         if (card) {

//             openProduct(card.dataset.id);

//         }

//     });

//     window.showDemoMessage = function() {

//         alert(
//             "This is not a real e-commerce website"
//         );

//     };

//     function closeProduct() {

//         modal.classList.remove("show");

//         document.body.style.overflow = "";

//     }


//     document.getElementById("closeModal").addEventListener(
//         "click",
//         closeProduct
//     );


//     modal.addEventListener("click", function(event) {

//         if (event.target === modal) {

//             closeProduct();

//         }

//     });


//     document.addEventListener("keydown", function(event) {

//         if (
//             event.key === "Escape" &&
//             modal.classList.contains("show")
//         ) {

//             closeProduct();

//         }

//     });


//     fetch(API)

//     .then(function(response) {

//         if (!response.ok) {

//             throw new Error("Could not connect to DummyJSON.");

//         }

//         return response.json();

//     })


//     .then(function(data) {

//         allProducts = data.products;

//         createCategories();

//         showProducts(allProducts);

//         console.log(
//             "Products successfully loaded:",
//             allProducts.length
//         );

//     })


//     .catch(function(error) {

//         console.log("API Error:", error);

//         productsContainer.innerHTML = `

//             <div class="no-products">

//                 <h3>Unable to load products</h3>

//                 <p>
//                     Please check your internet connection
//                     and refresh the page.
//                 </p>

//             </div>

//         `;

//         resultMessage.textContent = "API connection failed.";

//     });


// });

