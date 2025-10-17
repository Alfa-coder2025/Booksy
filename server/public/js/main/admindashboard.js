window.addEventListener("DOMContentLoaded",async()=>{
  try {
    const response=await fetch("/api/admin/dashboard/getAdminDashboard-details",{credentials:"include"});
    const data=await response.json();
     if (!data.success) return alert("Failed to load dashboard data");
         document.getElementById("totalUsers").innerText = data.totalUsers;
    document.getElementById("totalOrders").innerText = data.totalOrders;
    document.getElementById("totalSales").innerText = "INR" + data.totalSales;

    const tbody = document.querySelector("#ordersTableBody tbody");
    tbody.innerHTML="";

     data.tableData.forEach(order => {
      tr.innerHTML="";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customerName}</td>
        <td>${order.address}</td>
        <td>${new Date(order.date).toLocaleDateString()}</td>
        <td>${order.type}</td>
        <td>
          <span class="badge ${order.status === "delivered" ? "bg-success" : order.status === "processing" ? "bg-warning text-dark" : "bg-danger"}">
            ${order.status}
          </span>
        </td>
      `;
      tbody.appendChild(tr);

    });

  } catch (error) {
    console.error(error);
    alert("Error loading dashboard data");
  }
})