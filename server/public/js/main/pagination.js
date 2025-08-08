window.displayTable = function (items, wrapper, rowsPerPage, page) {
  wrapper.innerHTML = "";
  page--;

  let start = rowsPerPage * page;
  let end = start + rowsPerPage;
  let paginatedItems = items.slice(start, end);
  if (paginatedItems.length === 0) {
    wrapper.innerHTML = `<tr><td colspan="100%" class="text-center">No data available.</td></tr>`;
    return;
  }

 

  paginatedItems.forEach((cat, index) => {
    wrapper.innerHTML += `
      <tr>
        <td>${start + index + 1}</td>
        <td>${cat.name}</td>
        <td>
          <div class="form-check form-switch">
            <input class="form-check-input toggle-switch" type="checkbox" 
              id="toggle-${cat._id}" 
              ${cat.showOnHomepage ? "checked" : ""} disabled>
            <label class="form-check-label" for="toggle-${cat._id}">
              ${cat.showOnHomepage ? "Shown" : "Hidden"}
            </label>
          </div>
        </td>
        <td>
          <button 
            class="btn btn-sm btn-primary edit-btn" 
            data-bs-toggle="modal"
            data-bs-target="#editCategoryModal"
            data-id="${cat._id}"
            data-name="${cat.name}"
            data-image="/uploads/categories/${cat.image || ""}"
            data-show="${cat.showOnHomepage}">
            <i class="fa fa-pen"></i>
          </button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${cat._id}">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
};

window.setupPagination = function (items, wrapper, rowsPerPage, currentPage, onPageChange) {
  wrapper.innerHTML = "";
  let pageCount = Math.ceil(items.length / rowsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    let li = document.createElement("li");
    li.classList.add("page-item");
    if (i === currentPage) li.classList.add("active");

    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener("click", function (e) {
      e.preventDefault();
      onPageChange(i);
    });

    wrapper.appendChild(li);
  }
};

// Export for Node (optional for bundlers)
if (typeof module !== "undefined") {
  module.exports = { displayTable, setupPagination };
}
