

// Load and display all categories from the server
async function showAllCategories() {
  try {
    console.log("categories result");
    // Fetch categories from server
    const response = await fetch('http://localhost:8000/api/category/getAll');
    if (!response.ok) throw new Error('Failed to load categories');
    
    const { data: categories } = await response.json();
    const tableBody = document.getElementById('category-table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    // Add each category to the table
    categories.forEach((category, index) => {
      tableBody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${category.name}</td>
          <td>${category.offer || '-'}</td>
          <td>
            <div class="form-check form-switch">
              <input class="form-check-input toggle-switch" type="checkbox" 
                id="toggle-${category._id}" 
                ${category.listed ? 'checked' : ''}>
              <label class="form-check-label" for="toggle-${category._id}">
                ${category.listed ? 'Listed' : 'Unlisted'}
              </label>
            </div>
          </td>
          <td>
            <button class="btn btn-sm btn-primary edit-btn" data-id="${category._id}">
              Edit
            </button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${category._id}">
              Delete
            </button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error('Error:', error);
    alert('Could not load categories');
  }
}

// Handle form submission to add a new category
async function handleAddCategory(e) {
  
  e.preventDefault();
  const form = e.target;
  console.log(form);
  const formData = new FormData(form);

  try {
    const response = await fetch('http://localhost:8000/api/category/create', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    if (result.success) {
      alert('Category added!');
      form.reset();
      showAllCategories(); // Refresh the list
    } else {
      alert('Error: ' + (result.error || 'Failed to add'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong');
  }
}

// Handle category deletion
async function handleDelete(categoryId) {
  if (!confirm('Are you sure you want to delete this category?')) return;
  
  try {
    const response = await fetch(`/api/category/delete/${categoryId}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    if (result.success) {
      alert('Deleted successfully');
      showAllCategories(); // Refresh 
    } else {
      alert('Error: ' + (result.error || 'Delete failed'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong');
  }
}

// Handle category editing
async function handleEdit(categoryId) {
  try {
    // Get category details
    const response = await fetch(`/api/category/get/${categoryId}`);
    const { data: category } = await response.json();
    
    // Fill the edit form
    document.getElementById('edit-category-id').value = category._id;
    document.getElementById('edit-name').value = category.name || '';
    
    // Show current image if exists
    const imageContainer = document.getElementById('current-image');
    imageContainer.innerHTML = category.image 
      ? `<img src="/uploads/categories/${category.image}" width="100">`
      : 'No image';

    // Show the edit modal
    const modal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
    modal.show();
  } catch (error) {
    console.error('Error:', error);
    alert('Could not load category');
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
      alert('Updated successfully');
      bootstrap.Modal.getInstance(document.getElementById('editCategoryModal')).hide();
      showAllCategories(); // Refresh the list
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
    reader.onload = function(e) {
      document.getElementById('current-image').innerHTML = 
        `<img src="${e.target.result}" width="100">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Set up all event listeners when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Load categories when page opens
  showAllCategories();

  // Add category form
  document.getElementById('add-category-form')?.addEventListener('submit', handleAddCategory);

  // Edit/Delete buttons (using event delegation)
  document.getElementById('category-table-body').addEventListener('click', (e) => {
    if (e.target.closest('.edit-btn')) {
      handleEdit(e.target.closest('.edit-btn').dataset.id);
    }
    if (e.target.closest('.delete-btn')) {
      handleDelete(e.target.closest('.delete-btn').dataset.id);
    }
  });

  // Image preview for edit form
  document.getElementById('edit-image')?.addEventListener('change', function() {
    showImagePreview(this);
  });

  // Update category button
  document.getElementById('updateCategoryBtn')?.addEventListener('click', handleAddCategory);
});