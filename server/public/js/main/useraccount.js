document.addEventListener("DOMContentLoaded",async()=>{
try{
 const res=await fetch("/api/user/useraccount/mydetails",{method:"GET",headers:{"Content-type":"application/json"}});
 const result=await res.json();
 if(result.success){
  const user=result.data;
 }
 document.querySelectorAll("#sidebarProfileImage").src=user.profilePic||"https://via.placeholder.com/100";
 document.querySelectorAll("#sidebarUserName").textContent=user.username||"User";
 document.querySelectorAll("#welcomeUserName").textContent=user.username||"User";
 document.querySelectorAll("#ordersCount").textContent=user.orderCount;
 document.querySelectorAll("#wishlistCount").textContent=user.wishListCount;
 document.querySelectorAll("#profileImage").src=user.profilePic||"https://via.placeholder.com/100";
 document.querySelectorAll("#userName").textContent=user.username||"User";
 document.querySelectorAll("#userPhone").textContent=user.phone||"";
 document.querySelectorAll("#userAltPhone").textContent=user.altPhone||"";
 document.querySelectorAll("#userEmail").textContent=user.email||"";
 
 if(user.address&&user.address.length>0){
  const address=user.address[0];
  document.querySelectorAll("#userAddress").textContent=`${address.firstName}||"",${address.lastName}||"",${address.district || ""}, ${address.state || ""} - ${address.pincode || ""}`;

 }
 else{
  document.querySelectorAll("#userAddress").textContent="Address not provided";
 }





}
catch(error){
  console.error("Something went wrong");
}
})