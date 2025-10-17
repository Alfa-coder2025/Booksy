
document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  console.log("Fetching product ID:", productId);

  if (productId) {
    productsView(productId);
   
  } else {
    console.error("No productId found in URL");
  }
});




async function productsView(id){
try{
const response=await fetch(`/api/user/productsview/${id}?_=${Date.now()}`);
const data=await response.json();

if(!data.success){
 console.error("Couldnt load the book",data.error);
}
const book=data.data;

    document.getElementById("bookMainImage").src = book.images?.[0] || "/assets/images/placeholder-book.jpg";
      // document.getElementById("bookImage").src = book.images?.[1] || "/assets/images/placeholder-book.jpg";
    document.getElementById("authorImage").src = book.images?.[1] || "/assets/images/placeholder-author.jpg";
    document.getElementById("bookTitle").textContent = book.bookName || "Untitled Book";
    document.getElementById("bookAuthor").textContent = book.author?.name|| "Unknown Author";
    document.getElementById("bookPrice").textContent = book.salePrice ? `INR ${book.salePrice}` : "";
    document.getElementById("bookOldPrice").textContent = book.regularPrice ? `INR ${book.regularPrice}` : "";
   const stockAvailable=document.getElementById("stockQuantity");
   if(book.stockQuantity&&book.stockQuantity>0){
    stockAvailable.textContent=`In Stock :${book.stockQuantity}`;
    stockAvailable.classList.remove("text-danger");
    stockAvailable.classList.add("text-success");
   }
   else{
    stockAvailable.textContent=`Out of Stock`;
    stockAvailable.classList.remove("text-success");
    stockAvailable.classList.add("text-danger");
   }
    document.getElementById("bookSummary").textContent = book.cardDescription ||  book.description || "No summary available.";
    document.getElementById("bookNameBreadcrumb").textContent = book.bookName;

      const homeBreadcrumb = document.getElementById("homeBreadcrumb");
    const productsBreadcrumb = document.getElementById("productsBreadcrumb");

    if (homeBreadcrumb) {
      homeBreadcrumb.href = "/landingpage"; // landing page
    }

    if (productsBreadcrumb) {
      const categoryId = book.category?._id || ""; 
      productsBreadcrumb.href = `/user-productslisting?category=${categoryId}`;
    }

    // SCategory Name
const bookCategory = document.getElementById("bookCategory");
if (bookCategory) {
  bookCategory.textContent = book.category?.name || "Uncategorized";
}

  // Book Meta Info
    const bookMeta = [];
    if (book.totalPage) bookMeta.push(`${book.totalPage} pages`);
    if (book.language) bookMeta.push(`Language: ${book.language}`);
    if (book.publishedDate) bookMeta.push(`Published: ${new Date(book.publishedDate).toLocaleDateString()}`);
    if (book.coverType) bookMeta.push(`Cover: ${book.coverType}`);
    document.getElementById("bookMeta").textContent = bookMeta.join(" | ");

    // ISBN
    document.getElementById("bookISBN").textContent = book.ISBN ? `${book.ISBN}` : "";

    // Offer, Top Selling, Latest
    const offerText = book.offer ? `Offer: ${book.offer}` : "";
    const topSelling = book.showAsTopSelling ? "Top Selling ✅" : "";
    const latest = book.showAsLatest ? "Latest ✅" : "";
    document.getElementById("deliveryInfo").textContent = [offerText, topSelling, latest].filter(Boolean).join(" | ");

console.log("Book data:", book);
console.log("Category ID:", book.category?._id);
console.log("Book ID:", book._id);

if (book.category && book._id) {
  
  loadRelatedProducts(book.category._id, book._id);
}


}
catch(error){
console.error("Error loading product",error);

}


}

async function loadRelatedProducts(categoryId,excludedId){
  try{
    const response=await fetch(`/api/user/productsview/related?categoryId=${categoryId}&excludedId=${excludedId}`);
    const data=await response.json();
    const relatedProductContainer=document.getElementById("relatedItems");
    relatedProductContainer.innerHTML="";

    if(data.success&&data.data.length>0){
      data.data.forEach(book=>{
      const column=document.createElement("div");
      column.className="col";
      column.innerHTML=`
      <div class="card h-100">
        <a href="/user-productsview?id=${book._id}">
          <img src="${book.images?.[0] || '/assets/images/placeholder-book.jpg'}" class="card-img-top" alt="${book.bookName}">
        </a>
        <div class="card-body text-center">
          <p class="mb-1 fw-bold">
            <a href="/user-productsview?id=${book._id}" class="text-decoration-none text-dark">${book.bookName}</a>
          </p>
          <p class="text-muted">${book.authorId?.name || "Unknown Author"}</p>
              <p class="text-secondary">${book.categoryId?.name || "Uncategorized"}</p>
          <p class="text-primary">₹${book.salePrice || book.regularPrice || "N/A"}</p>
        </div>
      </div>
    `;
    relatedProductContainer.appendChild(column);
      })
    }
    else{
      relatedProductContainer.innerHTML="<p>No related products found.</p>"
    }

  }
  catch(error){
    console.error("Couldnt load related products",error);
  }
}