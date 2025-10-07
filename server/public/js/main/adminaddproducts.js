let sortBy = "name";
let sortOrder = "desc";
async function showAllCategories() {
  try {
    const response = await fetch(`/api/category/getAll?sortBy=${sortBy}&order=${sortOrder}`);
    if (!response.ok) throw new Error("Failed to load categories");

    const result = await response.json();
    const categories = result.data || [];

    const dropdown = document.getElementById("categoryDropdown");
    dropdown.innerHTML = '<option value="">Select a Category</option>'; // reset options

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat._id;          // categoryId
      option.textContent = cat.name;  // categoryName
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
    alert("Could not load categories");
  }
}




document.addEventListener("DOMContentLoaded", () => {
  showAllCategories();
  const form = document.getElementById("add-product-form");

  form.addEventListener("submit", async (e) => {
    console.log("test");
    e.preventDefault();
   // const form=e.target;

    const formData = new FormData();
    console.log(formData);

    // //Append all form fields
    console.log(document.getElementById("categoryDropdown").value.trim())
    formData.append("bookName", document.getElementById("bookName").value.trim());
    formData.append("author",document.getElementById("author").value.trim());
    formData.append("description", document.getElementById("description").value.trim());
    formData.append("offer", document.getElementById("offer").value.trim());
    formData.append("stockQuantity", document.getElementById("stockQuantity").value.trim());
    formData.append("regularPrice", document.getElementById("regularPrice").value.trim());
    formData.append("salePrice", document.getElementById("salePrice").value.trim());
    formData.append("categoryId", document.getElementById("categoryDropdown").value);
    formData.append("showAsTopSelling", document.querySelector("input[name='showAsTopSelling']").checked ? "true" : "false");
    console.log(document.querySelector("input[name='showAsTopSelling']").checked);
  formData.append("showAsLatest", document.querySelector("input[name='showAsLatest']").checked ? "true" : "false");
  console.log(document.querySelector("input[name='showAsLatest']").checked);




    const file = document.getElementById("bookCover").files[0];
    if (file) {
      formData.append("image", file);

    }

     try {
      console.log("result");
      console.log(formData,e.target);
     const res = await fetch("/api/admin/products/add", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log(data);
  

      if (data.success) {
        console.log("success");
        alert("Product added successfully!");
        form.reset();
      } else {
        alert(`Error: ${data.message || "Failed to add product"}`);
      }
    } catch (err) {
      console.error(err);
      alert(" Something went wrong!");
    }
  });
});
document.getElementById("close-btn").addEventListener("click",()=>{
  window.location.href="/admin-products";
})