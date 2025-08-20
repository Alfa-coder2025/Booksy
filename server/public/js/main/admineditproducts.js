


document.addEventListener("DOMContentLoaded", async () => {
  const productId = window.productId;

  try {
    // Fetch existing product data
    const res = await fetch(`/admin/products/get/${productId}`);
    const product = await res.json();

    // Populate form fields
    document.getElementById("bookName").value = product.bookName || "";
    document.getElementById("description").value = product.description || "";
    document.getElementById("offer").value = product.offer || "";
    document.getElementById("stockQuantity").value = product.stockQuantity || "";
    document.getElementById("regularPrice").value = product.regularPrice || "";
    document.getElementById("salePrice").value = product.salePrice || "";
    document.getElementById("category").value = product.categoryId?.name || "";

  } catch (err) {
    console.error("Error loading product:", err);
  }

  // Handle form submission
  document.getElementById("edit-product-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const res = await fetch(`/admin/products/update/${productId}`, {
        method: "PUT",
        body: formData
      });

      if (res.ok) {
        alert("Product updated successfully!");
        window.location.href = "/admin-products";
      } else {
        alert("Failed to update product.");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  });
});
