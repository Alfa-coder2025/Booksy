document.addEventListener("DOMContentLoaded",()=> {
  showAllContents();

})

async function showAllContents() {
   const categoryLandingPage=document.getElementById("categoriesLandingPage"); 
   const topsellingBooksLandingPage=document.getElementById("topSellingBooksLandingPage");
   const latestBooksLandingPage=document.getElementById("latestBooksLandingPage");

 try{
    console.log("test1");
    const response=await fetch("/api/user/landingPage/getLandingPageContents?sortBy=name&order=desc");
    const result=await response.json();
    const categories=result.data.categories||[];
    const topsellingBooks=result.data.topselling||[];
    const latestBooks=result.data.latestBooks||[];
    //categoryLandingPage.innerHTML="";
    categories.forEach(cat=>{
      const column=document.createElement("div");
      column.className = "col-6 col-md-3 mb-4";
      column.innerHTML = `
    <img src="${cat.image}" 
         class="img-fluid rounded popular-category-img" 
         alt="${cat.name}">
    <p class="mt-2 fw-semibold">${cat.name.toUpperCase()}</p>
  `;
      categoryLandingPage.appendChild(column);
    })

    //top selling
console.log(topsellingBooks);
topsellingBooks.forEach(book => {
  const column = document.createElement("div");
  column.className = "col-6 col-md-3 mb-4";

  // Card structure
  column.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img src="${book.images[0]}" class="card-img-top" alt="${book.bookName}">
      <div class="card-body">
        <h6 class="card-title">${book.bookName}</h6>
        <p class="text-muted mb-1">Bram Stoker</p>
        <p><del>₹${book.regularPrice}</del> ₹${book.salePrice}</p>
         <span class="text-warning">★★★★☆</span>
      </div>
    </div>
  `;

  // Append to parent container
  topsellingBooksLandingPage.appendChild(column);
});

    //latest books

    latestBooks.forEach(book=>{
      const column=document.createElement("div");
      column.className = "col-6 col-md-3 mb-4";


      column.innerHTML = `
<div class="card h-100">
          <img src="${book.images[0]}" class="card-img-top" alt="Latest Book">
          <div class="card-body">
            <h6 class="card-title">${book.bookName}</h6>
            <p><del>₹${book.regularPrice}</del> ₹${book.salePrice}</p>
            <span class="text-warning">★★★★★</span>
          </div>
        </div>

  `;
      latestBooksLandingPage.appendChild(column);
    })


  }
  catch(error){
    console.error("Error loading categories:",error);
  }

}