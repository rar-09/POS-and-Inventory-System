function showContent(contentId) {
    // Clear existing content
    document.getElementById("main-content").innerHTML = "";

    // Create content div
    var contentDiv = document.createElement("div");
    contentDiv.className = "content";
    contentDiv.id = contentId;

    // Check contentId
    if (contentId === "orders") {
        // Display orders content
        displayOrdersContent(contentDiv);
    } else if (contentId === "inventory") {
        // Display inventory form
        displayInventoryContent(contentDiv)
         
    } else {
        // Handle other content
        handleOtherContent(contentDiv, contentId);
    }

    // Append content div to main content
    document.getElementById("main-content").appendChild(contentDiv);
}

// Function to display orders content
function displayOrdersContent(contentDiv) {
    var posContainerDiv = document.createElement("div");
    posContainerDiv.className = "pos-container";

    var availableProductsDiv = document.createElement("div");
    availableProductsDiv.className = "available-products";
    
    var productsDiv = document.createElement("div");
    productsDiv.id = "productsDiv"; // This div will contain product elements

    var shoppingCartDiv = document.createElement("div");
    shoppingCartDiv.className = "shopping-cart";

    var processSaleButton = document.createElement("button");
    processSaleButton.textContent = "Process Sale";
    processSaleButton.id = "processSaleButton"; 

    
    // Make AJAX request to fetch products
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var products = JSON.parse(xhr.responseText);
                displayProducts(products, productsDiv);
            } else {
                console.error("Error fetching products");
            }
        }
    };
    xhr.open("GET", "fetch_data.php", true);
    xhr.send();

    function displayProducts(products, productsDiv) {
        // Clear existing content in productsDiv
        productsDiv.innerHTML = "";
    
        // Iterate through products and create HTML elements
        products.forEach(function(product) {
            var productElement = document.createElement("div");
            productElement.className = "product";
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <p>${product.productName}</p>
                <p>Price: ${product.price}</p>
                <p>Quantity: ${product.quantity}</p>
                <button class="add-to-cart">Add to Cart</button>
            `;
            productsDiv.appendChild(productElement);

            // Add event listener to "Add to Cart" button
            productElement.querySelector(".add-to-cart").addEventListener("click", function() {
                addToCart(product);
            });
        });
    }

    
    function addToCart(product) {

        // Call the function to calculate total price initially
        calculateTotalPrice();

        // Function to update total price whenever quantity changes
        function updateTotalPrice() {
        calculateTotalPrice();
        }

        // Check if the product already exists in the cart
        var existingCartItem = shoppingCartDiv.querySelector(`.cart-item[data-product-id="${product.id}"]`);
        if (existingCartItem) {
            // If it exists, update the quantity
            var quantityElement = existingCartItem.querySelector(".quantity");
            var currentQuantity = parseInt(quantityElement.textContent);
            quantityElement.textContent = currentQuantity + 1;

            
    
            // Update event listeners on buttons
            updateButtonListeners(existingCartItem);
        } else {

            // If it doesn't exist, create a new entry
            var cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.setAttribute("data-product-id", product.id); // Add product id for identification
            cartItem.innerHTML = `
                <p>${product.productName}</p>
                <p>Price: ${product.price}</p>
                <button class="btn-add">+</button>
                <p class="quantity">1</p>
                <button class="btn-minus">-</button>
            `;
            shoppingCartDiv.appendChild(cartItem);

            
    
            // Add event listeners to buttons
            updateButtonListeners(cartItem);
        }
    
        // Call the function to calculate total price initially
        calculateTotalPrice();
    

    // Update total price when quantity of items in the cart changes
    shoppingCartDiv.addEventListener("click", updateTotalPrice);
    }


    function calculateTotalPrice() {
        var totalPrice = 0;

        // Iterate through each product in the shopping cart
        shoppingCartDiv.querySelectorAll(".cart-item").forEach(function(cartItem) {
            var price = parseFloat(cartItem.querySelector("p:nth-of-type(2)").textContent.split(": ")[1]);
            var quantity = parseInt(cartItem.querySelector(".quantity").textContent);
            totalPrice += price * quantity;
        });

        // Display total price in a div inside the shopping cart
        var totalDiv = document.createElement("div");
        totalDiv.textContent = "Total Price: " + totalPrice.toFixed(2);
        totalDiv.className = "total-price";
        
        // Check if total price div already exists, if so, replace it
        var existingTotalDiv = shoppingCartDiv.querySelector(".total-price");
        if (existingTotalDiv) {
            existingTotalDiv.replaceWith(totalDiv);
        } else {
            shoppingCartDiv.appendChild(totalDiv);
        }
        return totalPrice;
    }

    
    function updateButtonListeners(cartItem) {
        var addButton = cartItem.querySelector(".btn-add");
        var minusButton = cartItem.querySelector(".btn-minus");
        var quantityElement = cartItem.querySelector(".quantity");
    
        addButton.addEventListener("click", function() {
            var currentQuantity = parseInt(quantityElement.textContent);
            quantityElement.textContent = currentQuantity + 1;
        });
    
        minusButton.addEventListener("click", function() {
            var currentQuantity = parseInt(quantityElement.textContent);
            if (currentQuantity > 1) {
                quantityElement.textContent = currentQuantity - 1;
            } else {
                // If quantity is 1, remove the item from the cart
                cartItem.remove();
            }
        });
    }

    function processSale() {
        var totalPrice = calculateTotalPrice();
        var productsInCart = getProductsInCart();
    
        // Display total price and products
        var saleDetails = document.createElement("div");
        saleDetails.classList.add("sale-details");
        saleDetails.innerHTML = `<h3>Sale Details:</h3>
                                 <p>Total Price: $${totalPrice.toFixed(2)}</p>
                                 <p>Products:</p>
                                 <ul>${productsInCart}</ul>`;
        var mainContent = document.getElementById("main-content");
        mainContent.appendChild(saleDetails);
    }
    // Set up event listener for "Process Sale" button
    processSaleButton.addEventListener("click", function () {
        processSale();
        clearShoppingCart(); // Clear the shopping cart after processing the sale
    });
    
    function clearShoppingCart() {
        // Clear only the items in the shopping cart, excluding the button
    var shoppingCartDiv = document.querySelector(".shopping-cart");
    var cartItems = shoppingCartDiv.querySelectorAll(".cart-item");
    cartItems.forEach(function(item) {
        item.remove();
    });

    // Remove total price display
    var totalDiv = document.querySelector(".total-price");
    if (totalDiv) {
        totalDiv.remove();
    }
    }

    
    calculateTotalPrice();
    
    function getProductsInCart() {
        var productsInCart = "";
        // Iterate through each product in the shopping cart
        document.querySelectorAll(".cart-item").forEach(function (cartItem) {
            var productName = cartItem.querySelector("p:first-of-type").textContent;
            var quantity = cartItem.querySelector(".quantity").textContent;
            productsInCart += `<li>${productName} - Quantity: ${quantity}</li>`;
        });
    
        return productsInCart;
    }
    

    var shoppingCartDiv = document.createElement("div");
    shoppingCartDiv.className = "shopping-cart";

    availableProductsDiv.appendChild(productsDiv);
    posContainerDiv.appendChild(availableProductsDiv);
    posContainerDiv.appendChild(shoppingCartDiv);
    shoppingCartDiv.appendChild(processSaleButton);

    contentDiv.appendChild(posContainerDiv);
}

// Function to display inventory
function displayInventoryContent(contentDiv) {
    var inventoryContainerDiv = document.createElement("div");
    inventoryContainerDiv.className = "inventory-container";
    inventoryContainerDiv.id = "inventoryContainer";

    var form = createInventoryForm();
    var formContainerDiv = document.createElement("div");
    formContainerDiv.className = "form-container";

    var productsDiv = document.createElement("div");
    productsDiv.id = "productsDiv"; // This div will contain product elements

    

    // Make AJAX request to fetch products
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var products = JSON.parse(xhr.responseText);
                displayProducts(products, productsDiv);
            } else {
                console.error("Error fetching products");
            }
        }
    };
    xhr.open("GET", "fetch_data.php", true);
    xhr.send();

    function displayProducts(products, productsDiv) {
        // Clear existing content in productsDiv
        productsDiv.innerHTML = "";
    
        // Iterate through products and create HTML elements
        products.forEach(function(product) {
            var productElement = document.createElement("div");
            productElement.className = "product";
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <p>${product.productName}</p>
                <p>Price: ${product.price}</p>
                <p>Quantity: ${product.quantity}</p>
                <button>Delete</button>
            `;
            productsDiv.appendChild(productElement);
        });
    }

    formContainerDiv.appendChild(form);
    inventoryContainerDiv.appendChild(formContainerDiv);

    inventoryContainerDiv.appendChild(productsDiv);
    contentDiv.appendChild(inventoryContainerDiv);

}

// Function to create inventory form
function createInventoryForm() {
    var form = document.createElement("form");
    form.id = "productForm";
    form.action = "save_product.php"; // Set action attribute to PHP script
    form.method = "post"; // Set method to post
    form.enctype = "multipart/form-data"; // Set enctype for file uploads
    form.innerHTML = `
        <h2>Add Product to Inventory</h2>
        <label for="productName">Product Name:</label>
        <input type="text" id="productName" name="productName" required><br><br>
        <label for="price">Price:</label>
        <input type="number" id="price" name="price" min="0" step="0.01" required><br><br>
        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" name="quantity" min="0" required><br><br>
        <label for="image">Image:</label>
        <input type="file" id="image" name="image" accept="image/*" required><br><br>
        <button type="submit" id="submitButton">Add Product</button>
    `;
    return form;
}

// Function to handle form submission
function handleFormSubmit(form) {
    if (form.checkValidity()) {
        var formData = new FormData(form);
        saveProductToDatabase(formData);
        form.reset();
    } else {
        alert("Please fill out all required fields.");
    }
}

// Function to handle other content
function handleOtherContent(contentDiv, contentId) {
    switch (contentId) {
        case "transactions":
            // Code for displaying transactions
            break;
        default:
            contentDiv.innerHTML = "<h2>Page Not Found</h2><p>The requested page could not be found.</p>";
            break;
    }
}

