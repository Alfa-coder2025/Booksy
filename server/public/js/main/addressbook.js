document.addEventListener("DOMContentLoaded", () => {
  // Elements from the page
  const addressList = document.getElementById("addressList");
  const addressForm = document.getElementById("addressForm");
  const addressModal = new bootstrap.Modal(document.getElementById("addressModal"));
  const addressModalLabel = document.getElementById("addressModalLabel");

  // Inputs in the form
  const addressIdInput = document.getElementById("addressId");
  const nameInput = document.getElementById("name");
  const houseInput = document.getElementById("house");
  const placeInput = document.getElementById("place");
  const pincodeInput = document.getElementById("pincode");
  const contactInput = document.getElementById("contact");


  // 1. Load all addresses

  async function loadAddresses() {
    try {
      let response = await fetch("/api/user/addressBook/getAll"); // GET request
      let result = await response.json();

      if (result.success) {
        showAddresses(result.data); // show them on screen
      } else {
        addressList.innerHTML = `<p class="text-muted">No addresses found.</p>`;
      }
    } catch (error) {
      console.error("Problem loading addresses:", error);
    }
  }

 
  // 2. Show addresses as cards

  function showAddresses(addresses) {
    addressList.innerHTML = ""; // clear the list first

    if (addresses.length === 0) {
      addressList.innerHTML = `<p class="text-muted">No addresses added yet.</p>`;
      return;
    }

    addresses.forEach((addr) => {
      let card = document.createElement("div");
      card.className = "card mb-3 p-3 shadow-sm";

      card.innerHTML = `
        <h6>${addr.firstName || ""} ${addr.lastName || ""}</h6>
        <p class="mb-1">${addr.address || ""}, ${addr.district || ""}, ${addr.state || ""}</p>
        <p class="mb-1">Pincode: ${addr.pincode || ""}</p>
        <p class="mb-1">Phone: ${addr.phoneNumber || ""}</p>
        <div class="d-flex gap-2 mt-2">
          <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${addr._id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${addr._id}">Delete</button>
        </div>
      `;

      addressList.appendChild(card);
    });

    // Add click events for edit + delete buttons
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => openEditForm(btn.dataset.id, addresses));
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => removeAddress(btn.dataset.id));
    });
  }

  // 3. Add or Edit Address (form submit)

  addressForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop page refresh

    let id = addressIdInput.value; // empty if new, filled if editing

    // make an object from form values
    let data = {
      firstName: nameInput.value.split(" ")[0] || "",
      lastName: nameInput.value.split(" ")[1] || "",
      address: houseInput.value,
      district: placeInput.value,
      state: "", // can add more fields later
      pincode: pincodeInput.value,
      phoneNumber: contactInput.value,
    };

    try {
      // choose POST (add new) or PUT (edit)
      let response = await fetch(`/api/user/addressBook/${id ? "/" + id : ""}`, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let result = await response.json();

      if (result.success) {
        addressModal.hide(); // close modal
        loadAddresses(); // reload list
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Problem saving address:", error);
    }
  });


  // 4. Edit Address (open modal with values)

  function openEditForm(id, addresses) {
    let addr = addresses.find((a) => a._id === id);
    if (!addr) return;

    addressIdInput.value = addr._id;
    nameInput.value = `${addr.firstName || ""} ${addr.lastName || ""}`;
    houseInput.value = addr.address || "";
    placeInput.value = addr.district || "";
    pincodeInput.value = addr.pincode || "";
    contactInput.value = addr.phoneNumber || "";

    addressModalLabel.textContent = "Edit Address";
    addressModal.show();
  }


  // 5. Reset form for "Add New"

  document.getElementById("addAddressBtn").addEventListener("click", () => {
    addressIdInput.value = "";
    addressForm.reset();
    addressModalLabel.textContent = "Add New Address";
  });

  // 6. Delete Address

  async function removeAddress(id) {
    if (!confirm("Do you really want to delete this address?")) return;

    try {
      let response = await fetch(`/api/user/addressBook/${id}`, { method: "DELETE" });
      let result = await response.json();

      if (result.success) {
        loadAddresses();
      } else {
        alert(result.message || "Could not delete");
      }
    } catch (error) {
      console.error("Problem deleting address:", error);
    }
  }


  // load when page opens
  loadAddresses();
});
