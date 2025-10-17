

let products = [];
let searchTerm = "";
let currentPage = 1;
let rowsPerPage = parseInt(localStorage.getItem("rowsPerPageProducts")) || 5;
let sortBy = "bookName"; 
let sortOrder = "desc"; 
let filterBy = "all"; 
let filterAuthor = "all";
async function showAllProducts() {
  try {
    console.log("test");
    const res = await fetch(`/api/admin/products/getAll?sortBy=${sortBy}&order=${sortOrder}`,{ headers: { "Cache-Control": "no-cache" } } );
    console.log(res);
    if (!res.ok) throw new Error("Failed to fetch products");

    const result = await res.json();
    console.log("Products API result:", result);
    products = result.data || [];

    renderProductPage(1); 
  } catch (err) {
    console.error(err);
    alert("Could not load products");
  }
}


function getFilteredProducts() {
  console.log(products);
  return products.filter(product => {
    const matchesCategory =
      filterBy === "all" || product.categoryId?._id === filterBy;

      const matchesAuthor = filterAuthor === "all" || product.authorId?._id === filterAuthor;
    const matchesSearch =
      product.bookName?.toLowerCase().includes(searchTerm) ||
      product.categoryId?.name?.toLowerCase().includes(searchTerm)||
      product.authorId?.name?.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch && matchesAuthor;
  });
}

function renderProductPage(page) {
  currentPage = page;
  const filteredProducts = getFilteredProducts();
  console.log(filteredProducts);

  displayProductTable(
    filteredProducts,
    document.getElementById("productTableBody"),
    rowsPerPage,
    currentPage
  );

  const paginationWrapper = document.getElementById("pagination");
  if (paginationWrapper) {
    paginationWrapper.innerHTML = "";
    setupPagination(filteredProducts, paginationWrapper, rowsPerPage, currentPage, renderProductPage);
  }
}

function displayProductTable(data, tableBody, rowsPerPage, page) {
  tableBody.innerHTML = "";
  let start = (page - 1) * rowsPerPage;
  let end = start + rowsPerPage;
  let paginatedItems = data.slice(start, end);

  if (paginatedItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="15" class="text-center">No products available.</td></tr>`;
    return;
  }

  paginatedItems.forEach((p, index) => {
    const imageSrc = p.images && p.images.length > 0 
      ? p.images[0] 
      : "/images/no-image.png";

    const row = `
    <tr>
              <td class="text-center">
  <button class="btn btn-sm btn-outline-info view-image-btn" 
                  data-bs-toggle="modal" 
                  data-bs-target="#imageModal"
                  data-image="${imageSrc}">
            <i class="fas fa-info-circle"></i>
          </button>
        </td>

              <td>${p.bookName || ''}</td>
              <td>${p.categoryId?.name || ''}</td>
             <td>${p.authorId?.name || ''}</td>
              <td>${p.ISBN || "—"}</td>
              <td>${p.publisher || "—"}</td>
              <td>${p.publishedDate ? new Date(p.publishedDate).toLocaleDateString() : "—"}</td>
              <td>${p.totalPage || "—"}</td>
              <td>${p.coverType || "—"}</td>
              <td>${p.language || "—"}</td>
              <td>₹${p.salePrice ? p.salePrice.toFixed(2) : '0.00'}</td>
              <td>${p.stockQuantity || 0}</td>
               <td>${p.showAsTopSelling ? "✅" : "❌"}</td>
        <td>${p.showAsLatest ? "✅" : "❌"}</td>
              <td class="text-center">
             <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${p._id}">
           <i class="fas fa-pen"></i>
         </button>
            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${p._id}">
             <i class="fas fa-trash"></i>
            </button>
         
            </tr>
    `;
    tableBody.innerHTML += row;
  });

}


async function openEditModal(product) {
  await loadCategories();
  await loadAuthors(); 
  document.getElementById("editProductId").value = product._id;

  document.getElementById("editBookName").value = product.bookName || "";
  document.getElementById("editDescription").value = product.description;
  document.getElementById("editOffer").value = product.offer;
  document.getElementById("editAuthorDropdown").value = product.authorId?._id || "";
  document.getElementById("editSalePrice").value = product.salePrice || "";
  document.getElementById("editStockQuantity").value = product.stockQuantity || "";
  document.getElementById("editRegularPrice").value = product.regularPrice;
  document.getElementById("showAsTopSelling").checked = !!product.showAsTopSelling;
  document.getElementById("showAsLatest").checked = !!product.showAsLatest;
  document.getElementById("editPublisher").value = product.publisher || "";
  document.getElementById("editLanguage").value = product.language || "";
  document.getElementById("editCoverType").value = product.coverType || "";
  document.getElementById("editPublishedDate").value = product.publishedDate
    ? new Date(product.publishedDate).toISOString().split("T")[0]
    : "";
  document.getElementById("editISBN").value = product.ISBN || "";
  document.getElementById("editTotalPage").value = product.totalPage || "";

  console.log(product);

  //document.getElementById("editCategoryDropdown").value = product.categoryId;

   document.getElementById("editAuthorDropdown").value = product.authorId?._id || "";
  // If you have category dropdown
  if (document.getElementById("editCategoryDropdown")) {
    document.getElementById("editCategoryDropdown").value = product.categoryId?._id || "";
  }

  const preview = document.getElementById("editBookCoverPreview");
  if (preview) {
    preview.src = product.images && product.images.length > 0? `${product.images[0]}` : "/images/no-image.png";
  }

  // Show modal
  const editModal = new bootstrap.Modal(document.getElementById("editProductModal"));
  editModal.show();
}

async function loadCategories() {
  try {
    const res = await fetch("/api/category/getAll"); 
    const data = await res.json();
    console.log("Categories API response:", data);

    const dropdown = document.getElementById("editCategoryDropdown");
    dropdown.innerHTML = ""; // to clear old options
    const categories = data.categories || data.data || []; 


    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat._id;
      option.textContent = cat.name;
      dropdown.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading categories:", err);
  }
}

async function loadAuthors() {
  try {
    const res = await fetch("/api/admin/author/getAll");
    const data = await res.json();

    const dropdown = document.getElementById("editAuthorDropdown");
    dropdown.innerHTML = '<option value="">Select an Author</option>';

    const authors = data.data || [];
    authors.forEach(author => {
      const option = document.createElement("option");
      option.value = author._id;
      option.textContent = author.name;
      dropdown.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading authors:", err);
  }
}


async function loadCategoryFilterDropdown() {
  try {
    const res = await fetch("/api/category/getAll");
    const data = await res.json();
    const dropdown = document.getElementById("categoryDropdown");
    dropdown.innerHTML = '<option value="all" selected>Category</option>';

    const categories = data.categories || data.data || [];
    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat._id;
      opt.textContent = cat.name;
      dropdown.appendChild(opt);
    });
  } catch (err) {
    console.error("Error loading categories:", err);
  }
}
async function loadAuthorFilterDropdown() {
  try {
    const res = await fetch("/api/admin/author/getAll");
    const data = await res.json();
    const dropdown = document.getElementById("authorDropdown");
    dropdown.innerHTML = '<option value="all" selected>Author</option>';

    const authors = data.author || data.data || [];
     authors.sort((a, b) => a.name.localeCompare(b.name));
    authors.forEach(auth => {
      const opt = document.createElement("option");
      opt.value = auth._id;
      opt.textContent = auth.name;
      dropdown.appendChild(opt);
    });
  } catch (err) {
    console.error("Error loading categories:", err);
  }
}

async function updateProduct(productId) {
  const form = document.getElementById("edit-product-form");
  const formData = new FormData(form);
  formData.set("showAsTopSelling", document.getElementById("showAsTopSelling").checked ? "true" : "false");
formData.set("showAsLatest", document.getElementById("showAsLatest").checked ? "true" : "false");
 formData.set("totalPage", document.getElementById("editTotalPage").value);

  try {
    const res = await fetch(`/api/admin/products/update/${productId}`, {
  method: "PUT",
  body: formData
});

    const result = await res.json();
    console.log("Update response:", result);

    if (result.success) {
      alert("Product updated successfully");
        bootstrap.Modal.getInstance(document.getElementById("editProductModal")).hide();
      showAllProducts();
      document.getElementById("editProductModal").style.display = "none";
    } else {
      alert(result.message || "Could not update product");
    }
  } catch (err) {
    console.error(err);
    alert("Error updating product");
  }
}




// Handle edit + delete buttons in product table
document.getElementById("productTableBody").addEventListener("click", async function (e) {
  // Edit button clicked
  if (e.target.closest(".edit-btn")) {
    const productId = e.target.closest(".edit-btn").dataset.id;
    const product = products.find(p => p._id === productId);
    if (product) {
      openEditModal(product);
    }
  }

  // Delete button clicked
  if (e.target.closest(".delete-btn")) {
    const productId = e.target.closest(".delete-btn").dataset.id;
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/products/delete/${productId}`, {
        method: "DELETE"
      });
      const result = await res.json();

      if (result.success) {
        
        showAllProducts(); // reload the table
        alert("Product deleted successfully");
      } else {
        alert(result.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Something went wrong while deleting");
    }
  
  }
});



document.addEventListener("DOMContentLoaded", () => {
    showAllProducts();
     loadCategoryFilterDropdown(); 
        loadAuthorFilterDropdown(); 
    
  // Search
  const productSearch = document.getElementById("productSearch");
  if (productSearch) {
    productSearch.addEventListener("input", function () {
      searchTerm = this.value.trim().toLowerCase();
      currentPage = 1;
      renderProductPage(currentPage);
    });
  }

  // Clear search
  const clearProductSearch = document.getElementById("clearProductSearch");
  if (clearProductSearch) {
    clearProductSearch.addEventListener("click", function () {
      document.getElementById("productSearch").value = "";
      searchTerm = "";
      filterBy = "all";
      document.getElementById("filter-products").value = "all";
      currentPage = 1;
      renderProductPage(currentPage);
    });
  }

  // Sorting
  // document.querySelectorAll(".sortable-product").forEach(header => {
  //   header.addEventListener("click", () => {
  //     const field = header.getAttribute("data-sort");
  //     if (sortBy === field) {
  //       sortOrder = sortOrder === "asc" ? "desc" : "asc";
  //     } else {
  //       sortBy = field;
  //       sortOrder = "asc";
  //     }
  //     showAllProducts();
  //   });
  // });

  const sortDropdown = document.getElementById("sortDropdown");
  sortDropdown?.addEventListener("change", (e) => {
    const value = e.target.value;
    if (value === "latest") {
      sortBy = "createdAt";
      sortOrder = "desc";
    } else if (value === "oldest") {
      sortBy = "createdAt";
      sortOrder = "asc";
    } else {
      sortBy = "bookName";
      sortOrder = "asc";
    }
    showAllProducts();
  });

  // Filter dropdown
  // document.getElementById("filter-products").addEventListener("change", (e) => {
  //   filterBy = e.target.value;
  //   renderProductPage(1);
  // });

    const categoryDropdown = document.getElementById("categoryDropdown");
    categoryDropdown?.addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
     filterBy = selectedCategory; 
    
    renderProductPage(1);
  });

   // --- Author filter ---
  
    const authorDropdown = document.getElementById("authorDropdown");
    authorDropdown?.addEventListener("change", (e) => {
      filterAuthor = e.target.value;
      renderProductPage(1);
    });


  // Rows per page
  document.getElementById("pageSize").addEventListener("change", (e) => {
    rowsPerPage = parseInt(e.target.value);
    localStorage.setItem("rowsPerPageProducts", rowsPerPage);
    renderProductPage(1);
  })

  // Initial load

});

document.getElementById("edit-product-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const productId = document.getElementById("editProductId").value;
  formData.set("showAsTopSelling", document.getElementById("showAsTopSelling").checked);
  formData.set("showAsLatest", document.getElementById("showAsLatest").checked);

  try {
    const res = await fetch(`/api/admin/products/update/${productId}`, {
      method: "PUT",
      body: formData
    });

    if (!res.ok) throw new Error("Failed to update product");
    alert("Product updated successfully");

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById("editProductModal")).hide();

    // Reload product list
    showAllProducts();
  } catch (err) {
    console.error("Update error:", err);
    alert("Could not update product");
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const imageModal = document.getElementById("imageModal");
  const previewImage = document.getElementById("previewImage");

  imageModal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget; // Button that triggered modal
    const imageUrl = button.getAttribute("data-image");
    previewImage.src = imageUrl || "/images/no-image.png"; // fallback if missing
  });
});
