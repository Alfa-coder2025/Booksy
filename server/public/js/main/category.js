


let categories = [];
let currentPage = 1;
let rowsPerPage = parseInt(localStorage.getItem("rowsPerPage")) || 3;
let sortBy = "name";
let sortOrder = "desc";
let categorySearchTerm = "";
let currentCategoryPage = 1;



async function showAllCategories() {
  try {
    const response = await fetch(`/api/category/getAll?sortBy=${sortBy}&order=${sortOrder}`);
    if (!response.ok) throw new Error("Failed to load categories");

    const result = await response.json();
    categories = result.data || [];

    renderPage(currentPage);
  } catch (error) {
    console.error("Error loading categories:", error);
    alert("Could not load categories");
  }
}
function getFilteredCategories() {
  const searchTerm = categorySearchTerm.trim().toLowerCase();
  if (!searchTerm) return categories;

  return categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm)
  );
}


// function renderPage(page) {
//   currentPage = page;
//   displayTable(categories, document.getElementById("category-table-body"), rowsPerPage, currentPage);
//   setupPagination(categories, document.getElementById("pagination"), rowsPerPage, currentPage, renderPage);
// }

function renderPage(page) {
  currentPage = page;
  const filteredCategories = getFilteredCategories();
  displayTable(
    filteredCategories,
    document.getElementById("category-table-body"),
    rowsPerPage,
    currentPage
  );
  setupPagination(
    filteredCategories,
    document.getElementById("pagination"),
    rowsPerPage,
    currentPage,
    renderPage
  );
}




// Handle form submission to add a new category
async function handleAddCategory(e) {
  e.preventDefault();
  const form = e.target;
  console.log(form);
  const formData = new FormData(form);

  try {
    const response = await fetch("http://localhost:8000/api/category/create", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      alert("Category added!");
      form.reset();
      showAllCategories(); // Refresh the list
    } else {
      alert("Error: " + (result.error || "Failed to add"));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  }
}

// Handle category deletion
async function handleDelete(categoryId) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this category?"
  );
  if (!confirmDelete) return;

  try {
    const response = await fetch(`/api/category/delete/${categoryId}`, {
      method: "DELETE",  
    });

    const result = await response.json();
    if (result.success) {
      alert("Deleted successfully");
      showAllCategories(); // Refresh
      //rowElement.remove();
    } else {
      alert("Error: " + (result.error || "Delete failed"));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  }
}

// Handle category editing
async function handleEdit(categoryId) {
  try {
    // Get category details
    console.log("Editing category with ID:", categoryId);

    const response = await fetch(`/api/category/get/${categoryId}`);
    const { data: category } = await response.json();

    console.log("Fetched category:", category);

    document.getElementById("edit-category-id").value = category._id;
    document.getElementById("edit-name").value = category.name || "";
    document.getElementById("edit-showOnHomepage").checked = !!category.showOnHomepage;


    // Show current image if exists
    const imageContainer = document.getElementById("current-image");
    imageContainer.innerHTML = category.image
      ? `<img src="${category.image}" width="100">`
      : "No image";

    document.getElementById("edit-showOnHomepage").checked =
      category.showOnHomepage || false;
    // Show the edit modal
    const modal = new bootstrap.Modal(
      document.getElementById("editCategoryModal")
    );
    modal.show();
  } catch (error) {
    console.error("Error:", error);
    alert("Could not load category");
  }
}

// Handle form submission to update a category
async function handleUpdate() {
  const categoryId = document.getElementById('edit-category-id').value;
  const formData = new FormData();

  formData.append('name', document.getElementById('edit-name').value);
  const imageFile = document.getElementById('edit-image').files[0];
  if (imageFile) formData.append('image', imageFile);

  try {
    const response = await fetch(`/api/category/update/${categoryId}`, {
      method: 'PUT',
      body: formData
    });

    const result = await response.json();
    if (result.success) {
      // alert('Updated successfully');
      // bootstrap.Modal.getInstance(document.getElementById('editCategoryModal')).hide();
      // showAllCategories(); // Refresh the list

      const modalElement = document.getElementById("editCategoryModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);

      if (modalInstance) {
        // modalElement.addEventListener("hidden.bs.modal", () => {
        //   e.target.reset();
        //   document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
        //   document.body.classList.remove("modal-open");
        // }, { once: true });

        modalInstance.hide();
      }

      modalElement.addEventListener("hidden.bs.modal", () => {
        e.target.reset();
      }, { once: true });

      showAllCategories();
      alert("Category updated successfully");
    } else {
      alert('Error: ' + (result.error || 'Update failed'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong');
  }
}

// Show image preview when selecting a new image
function showImagePreview(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById(
        "current-image"
      ).innerHTML = `<img src="${e.target.result}" width="100">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Set up all event listeners when page loads
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("categorySearch");
if (searchInput) {
  searchInput.addEventListener("input", function () {
    categorySearchTerm = this.value;
    renderPage(1); // Reset to first page on new search
  });
}

const clearButton = document.getElementById("clearCategorySearch");
if (clearButton) {
  clearButton.addEventListener("click", function () {
    document.getElementById("categorySearch").value = "";
    categorySearchTerm = "";
    renderPage(1);
  });
}

  // Load categories when page opens
  showAllCategories();

  // Add category form
  document
    .getElementById("add-category-form")
    ?.addEventListener("submit", handleAddCategory);

    // Page size dropdown
  const pageSizeDropdown = document.getElementById("pageSize");
  if (pageSizeDropdown) {
    pageSizeDropdown.value = rowsPerPage;
    pageSizeDropdown.addEventListener("change", function () {
      rowsPerPage = parseInt(this.value);
      localStorage.setItem("rowsPerPage", rowsPerPage);
      currentPage = 1;
      renderPage(currentPage);
    });
  }


  // Edit/Delete buttons (using event delegation)
  document
    .getElementById("category-table-body")
    .addEventListener("click", (e) => {
      if (e.target.closest(".edit-btn")) {
        handleEdit(e.target.closest(".edit-btn").dataset.id);
      }
      if (e.target.closest(".delete-btn")) {
        handleDelete(e.target.closest(".delete-btn").dataset.id);
      }
    });

  // Image preview for edit form
  document
    .getElementById("edit-image")
    ?.addEventListener("change", function () {
      showImagePreview(this);
    });



const modalElement = document.getElementById("editCategoryModal");
  if (modalElement) {
    modalElement.addEventListener("hidden.bs.modal", () => {
      document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty('padding-right');
    });
  }


  //edit category event listener

  document
    .getElementById("edit-category-form")
    .addEventListener("submit", async function (e) {
      // Stop the form from refreshing the page
      e.preventDefault();

      // Get the form and its data
      const form = e.target;
      const formData = new FormData(form);
      const id = document.getElementById("edit-category-id").value;

      try {
        // Send the data to the server
        const response = await fetch(`/api/category/update/${id}`, {
          method: "POST",
          body: formData,
        });

        // Get the server's response
        const result = await response.json();
        console.log(result);

        // If everything went well
        if (result.success) {
          // Close the edit popup
           const modalElement = document.getElementById('editCategoryModal');
const modalInstance = bootstrap.Modal.getInstance(modalElement);

if (modalInstance) {
  modalElement.addEventListener('hidden.bs.modal', () => {
    // Reset the form for next time
    const form = modalElement.querySelector('form');
    if (form) form.reset();

    // Safety net: remove any stuck backdrops
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
    document.body.classList.remove('modal-open');
  }, { once: true });

  modalInstance.hide(); // <- THIS is the key
}



          //  form.reset();
          // document.getElementById('current-image').innerHTML = '';

          // Refresh the categories table
          await showAllCategories();

          alert("Category updated successfully");
        } else {
          // Show error message if something went wrong
          const { message } = await result.json();
          alert(result.message || "Failed to update category");
        }
      } catch (error) {
        // Show error if there was a problem sending the request
        console.error("Error:", error);
        alert("Something went wrong while updating");
      }
    });
});

