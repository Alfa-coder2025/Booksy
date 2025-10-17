document.addEventListener("DOMContentLoaded",async()=>{
try{
 const res=await fetch("/api/user/useraccount/mydetails",{method:"GET",headers:{"Content-type":"application/json"},credentials: "include"});
 
 const result=await res.json();
 if(result.success){
  const user=result.data;
   document.querySelector("#sidebarProfileImage").src=user.profilePic||"";
 document.querySelector("#sidebarUserName").textContent=user.username||"User";
 document.querySelector("#welcomeUserName").textContent=user.username||"User";
 document.querySelector("#ordersCount").textContent=user.orderCount||0;
 document.querySelector("#wishlistCount").textContent=user.wishListCount||0;
 document.querySelector("#profileImage").src=user.profilePic||"";
 document.querySelector("#editUserName").value=user.username||"User";
 document.querySelector("#editUserPhone").value=user.phone||"";
 document.querySelector("#editUserAltPhone").value=user.altPhone||"";
 document.querySelector("#editUserEmail").value=user.email||"";
 
 if(user.address&&user.address.length>0){
  const address=user.address[0];
  document.querySelector("#editUserAddress").value=address.address || "Address not provided";

 }

 else{
  document.querySelector("#editUserAddress").value="Address not provided";
 }
 }
 
}
catch(error){
  console.error("Something went wrong",error.message);
}


const editBtn=document.getElementById("editBtn");
const saveBtn=document.getElementById("saveBtn");
const cancelBtn=document.getElementById("cancelBtn");
const form=document.getElementById("profileForm");
const inputs = form.querySelectorAll("input, textarea");

editBtn.addEventListener("click",()=>{
  inputs.forEach(input=>input.disabled=false);
   editBtn.classList.add("d-none");
    saveBtn.classList.remove("d-none");
    cancelBtn.classList.remove("d-none");
})

 cancelBtn.addEventListener("click", () => {
    inputs.forEach(input => input.disabled = true);
    editBtn.classList.remove("d-none");
    saveBtn.classList.add("d-none");
    cancelBtn.classList.add("d-none");
  });

  form.addEventListener("submit",async(e)=>{
    e.preventDefault();

    const updatedData={
  username:document.getElementById("editUserName").value.trim(),
  phone:document.getElementById("editUserPhone").value.trim(),
  altPhone: document.getElementById("editUserAltPhone").value,
  email: document.getElementById("editUserEmail").value,
  address: document.getElementById("editUserAddress").value,

}

try {
  const response=await fetch("/api/user/useraccount/update-profile",{method:"POST",headers:{"Content-type":"application/json"},credentials: "include",body:JSON.stringify(updatedData)});
  const result=await response.json();
  if (result.success) {
      alert("Profile updated successfully!");
      const user = result.data;

      // Update modal inputs
      document.getElementById("editUserName").value = user.username;
      document.getElementById("editUserPhone").value = user.phone || "";
      document.getElementById("editUserAltPhone").value = user.altPhone || "";
      document.getElementById("editUserEmail").value = user.email;
      document.getElementById("editUserAddress").value = user.address[0]?.address || "";

      // Update sidebar / welcome names
      document.getElementById("sidebarUserName").textContent = user.username;
      document.getElementById("welcomeUserName").textContent = user.username;
      document.getElementById("sidebarProfileImage").src = user.profilePic || "";

      // Hide Save/Cancel, show Edit
      inputs.forEach(input => input.disabled = true);
      editBtn.classList.remove("d-none");
      saveBtn.classList.add("d-none");
      cancelBtn.classList.add("d-none");
     
    } 
} catch (error) {
  console.error("Something went wrong",error.message);
}

  })


const profilePicForm = document.getElementById("profilePicForm");
const profilePicInput = document.getElementById("profilePicUpload");
const profileImage = document.getElementById("profileImage");
const sidebarProfileImage = document.getElementById("sidebarProfileImage");

profilePicForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!profilePicInput.files[0]) return alert("Please select a file");

  const formData = new FormData();
  formData.append("profilePic", profilePicInput.files[0]);

  try {
    const res = await fetch("/api/user/useraccount/upload-profile-pic", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const result = await res.json();

    if (result.success&& result.profilePic) {
      console.log("Uploaded Image URL:", result.profilePic);
      alert("Profile picture updated!");
      // Update modal and sidebar images
      profileImage.src = result.profilePic;
      if (sidebarProfileImage) sidebarProfileImage.src = result.profilePic;
    } else {
      alert("Error: " + result.message);
    }
  } catch (err) {
    console.error("Upload error:", err);
  }
});


})
