


document.addEventListener("DOMContentLoaded", async () => {
  const productId = window.productId;

  try {
    // Fetch existing product data
    const res = await fetch(`/api/admin/products/get/${productId}`);
    const product = await res.json();

    // Populate form fields
    document.getElementById("bookName").value = product.bookName || "";
    document.getElementById("description").value = product.description || "";
    document.getElementById("offer").value = product.offer || "";
    document.getElementById("stockQuantity").value = product.stockQuantity || "";
    document.getElementById("regularPrice").value = product.regularPrice || "";
    document.getElementById("salePrice").value = product.salePrice || "";
    document.getElementById("category").value = product.categoryId?.name || "";
    document.getElementById("editAuthor").value=product.author||"";

    document.getElementById("showAsTopSelling").checked = !!product.showAsTopSelling;
    document.getElementById("showAsLatest").checked = !!product.showAsLatest;

    const preview = document.getElementById("bookCoverPreview");
    if (preview) {
      preview.src = product.image
        ? `/uploads/${product.image}`
        : "/images/no-image.png";
    }

  } catch (err) {
    console.error("Error loading product:", err);
  }

  // Handle form submission
  document.getElementById("edit-product-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const res = await fetch(`/api/admin/products/update/${productId}`, {
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
