let users = [];
let searchTerm = "";
let currentPage = 1;
let rowsPerPage = parseInt(localStorage.getItem("rowsPerPage")) || 5;
let sortBy = "name"; 
let sortOrder = "desc"; 
let filterBy = "all"; 

async function showAllUsers() {
  try {
    const res = await fetch(`/api/users/getAll?sortBy=${sortBy}&order=${sortOrder}`);
    if (!res.ok) throw new Error("Failed to fetch users");

    const result = await res.json();
    users = result.data || [];

    renderPage(1); // always start from page 1 on reload
  } catch (err) {
    console.error(err);
    alert("Could not load users");
  }
}

function getFilteredUsers() {
  return users.filter(user => {
    const matchesStatus =
      filterBy === "all" ||
     (filterBy === "blocked" && user.status === "blocked") ||
      (filterBy === "unblocked" && user.status === "active");
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm);

    return matchesStatus && matchesSearch;
  });
}



// function getFilteredUsers() {
//   if (filterBy === "blocked") return users.filter(u => u.status === "blocked"); // 🛠 fixed from u.isBlocked
//   if (filterBy === "unblocked") return users.filter(u => u.status === "active"); // 🛠 fixed from !u.isBlocked
//   return users;
  
// }

function renderPage(page) {
  currentPage = page;
  const filteredUsers = getFilteredUsers();

  displayTable(
    filteredUsers,
    document.getElementById("users-table-body"),
    rowsPerPage,
    currentPage
  );

  const paginationWrapper = document.getElementById("pagination");
  if (paginationWrapper) {
    paginationWrapper.innerHTML = ""; // reset before drawing
    setupPagination(filteredUsers, paginationWrapper, rowsPerPage, currentPage, renderPage);
  }
}

function displayTable(data, tableBody, rowsPerPage, page) {
  tableBody.innerHTML = "";
  let start = (page - 1) * rowsPerPage;
  let end = start + rowsPerPage;
  let paginatedItems = data.slice(start, end);

  if (paginatedItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No users available.</td></tr>`;
    return;
  }

  paginatedItems.forEach((user, index) => {
    const isBlocked = user.status === "active";
    
    const row = `
      <tr>
        <td>${start + index + 1}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.phone || ""}</td>
        <td>${user.status}</td>
        <td>
          <div class="form-check form-switch">
            <input 
              class="form-check-input toggle-btn" 
              type="checkbox" 
              data-id="${user._id}" 
              ${!isBlocked ? "checked" : ""} 
            >
            <label class="form-check-label">
              ${isBlocked ? "Block" : "Unblock"}
            </label>
          </div>
        </td>
      </tr>
    `;
    
    tableBody.innerHTML += row;
  });

  addToggleListeners();
}

function addToggleListeners() {
  document.querySelectorAll(".toggle-btn").forEach(btn => {

    btn.addEventListener("click", async (e) => {

      e.preventDefault(); 
     const checkbox = e.target; //  define the checkbox element
      const userId = checkbox.getAttribute("data-id"); // get user ID
      const isChecked = checkbox.checked;
      const newStatus = isChecked ? "blocked" : "active";


      const confirmMsg = isChecked
        ? "Are you sure you want to BLOCK this user?"
        : "Are you sure you want to UNBLOCK this user?";

      const confirmed = confirm(confirmMsg);

      // const userId = e.target.getAttribute("data-id");
      // const newStatus = e.target.checked ? "blocked" : "active";
      // console.log(newStatus);
      // console.log(e.target.checked);

      

      if (!confirmed) {
        // Revert the toggle switch if user cancels
        checkbox.checked = !isChecked;
        return;
      }
    //pop up
      try {
        const res = await fetch(`/api/users/updateUsers/${userId}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ status: newStatus })
});

        const result = await res.json();
        if (result.success) {
          const label = e.target.closest(".form-check").querySelector("label");
          label.textContent = newStatus === "blocked" ? "Unblock" : "Block";
          showAllUsers(); 
        } else {
          alert(result.message);
          checkbox.checked = !isChecked;
          // e.target.checked = !e.target.checked;
        }
      } catch (err) {
        console.error(err);
        alert("Failed to update user");
        // e.target.checked = !e.target.checked; 
        checkbox.checked = !isChecked;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
    // Search functionality
  const userSearch = document.getElementById("userSearch");
  if (userSearch) {
    userSearch.addEventListener("input", function () {
      searchTerm = this.value.trim().toLowerCase();
       currentPage = 1;
    const filtered = getFilteredUsers();
    // displayTable(filtered, currentPage, rowsPerPage);
    displayTable(filtered, document.getElementById("users-table-body"), rowsPerPage, currentPage);

    updatePagination(filtered);
      // const filteredByStatus = getFilteredUsers();
      // const searched = filteredByStatus.filter(user =>
      //   user.username.toLowerCase().includes(searchTerm) ||
      //   user.email.toLowerCase().includes(searchTerm)
      // );
      renderPage(currentPage);
    });
  } else {
    console.warn("userSearch element not found");
  }

  // Clear functionality
//   const clearUserSearch = document.getElementById("clearUserSearch");
//   if (clearUserSearch) {
//     clearUserSearch.addEventListener("click", function () {
//       document.getElementById("userSearch").value = "";
//       filterBy = "all"; 
//       document.getElementById("filter-dropdown").value = "all";
//       renderPage(1);
//     });
//   } else {
//     console.warn("clearUserSearch element not found");
//   }
// });

const clearUserSearch = document.getElementById("clearUserSearch");
if (clearUserSearch) {
  clearUserSearch.addEventListener("click", function () {
    document.getElementById("userSearch").value = "";
    searchTerm = "";
    filterBy = "all";
    document.getElementById("filter-dropdown").value = "all";
    currentPage = 1;
    renderPage(currentPage);

    // const filtered = getFilteredUsers();
    // displayTable(filtered, currentPage, rowsPerPage);
    // updatePagination(filtered);
  });
}
})

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  showAllUsers();

  

  document.querySelectorAll(".sortable").forEach(header => {
    header.addEventListener("click", () => {
      const field = header.getAttribute("data-sort");
      if (sortBy === field) {
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
      } else {
        sortBy = field;
        sortOrder = "asc";
      }
      showAllUsers();
    });
  });

  document.getElementById("filter-dropdown").addEventListener("change", (e) => {
    filterBy = e.target.value;
    renderPage(1);
  });

  document.getElementById("pageSize").addEventListener("change", (e) => {
    rowsPerPage = parseInt(e.target.value);
    localStorage.setItem("rowsPerPage", rowsPerPage);
    renderPage(1);
  });
});



