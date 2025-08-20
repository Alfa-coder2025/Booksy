

let products = [];
let searchTerm = "";
let currentPage = 1;
let rowsPerPage = parseInt(localStorage.getItem("rowsPerPageProducts")) || 5;
let sortBy = "name"; 
let sortOrder = "desc"; 
let filterBy = "all"; 
async function showAllProducts() {
  try {
    const res = await fetch(`/api/admin/products/getAll?sortBy=${sortBy}&order=${sortOrder}`);
    if (!res.ok) throw new Error("Failed to fetch products");

    const result = await res.json();
    console.log(result);
    products = result || [];

    renderProductPage(1); 
  } catch (err) {
    console.error(err);
    alert("Could not load products");
  }
}


function getFilteredProducts() {
  console.log(products);
  return products.filter(product => {
    const matchesStatus =
      filterBy === "all" ||
      (filterBy === "in-stock" && product.stock > 0) ||
      (filterBy === "out-of-stock" && product.stock === 0);
    const matchesSearch =
      product.bookName.toLowerCase().includes(searchTerm) ||
      (product.category && product.category.toLowerCase().includes(searchTerm));

    return matchesStatus && matchesSearch;
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
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No products available.</td></tr>`;
    return;
  }

  paginatedItems.forEach((p, index) => {
    const row = `
    <tr>
              <td>
  <img src="${p.imageUrl || (p.image ? '/uploads/products/' + p.image : '/images/no-image.png')}" 
  alt="Book" width="50">
</td>
              <td>${p.bookName || ''}</td>
              <td>${p.categoryId?.name || ''}</td>
              <td><strong>${p.author || ''}</strong></td>
              <td>₹${p.salePrice ? p.salePrice.toFixed(2) : '0.00'}</td>
              <td>${p.stockQuantity || 0}</td>
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

  addDeleteProductListeners();
}

function addDeleteProductListeners() {
  document.querySelectorAll(".delete-product").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("data-id");
      if (!confirm("Are you sure you want to delete this product?")) return;

      try {
        const res = await fetch(`/api/admin/products/delete/${id}`, { method: "DELETE" });
        const result = await res.json();
        if (result.success) {
          alert("Product deleted");
          showAllProducts();
        } else {
          alert(result.message || "Failed to delete product");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting product");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
    showAllProducts();
    
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
  document.querySelectorAll(".sortable-product").forEach(header => {
    header.addEventListener("click", () => {
      const field = header.getAttribute("data-sort");
      if (sortBy === field) {
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
      } else {
        sortBy = field;
        sortOrder = "asc";
      }
      showAllProducts();
    });
  });

  // Filter dropdown
  document.getElementById("filter-products").addEventListener("change", (e) => {
    filterBy = e.target.value;
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
