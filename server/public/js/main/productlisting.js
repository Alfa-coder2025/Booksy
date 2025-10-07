
document.addEventListener("DOMContentLoaded",()=> {
  let currentPage = 1;     
  let pageSize = 6;
  
  showAllProductListingContents(currentPage,pageSize);

  const searchButton = document.getElementById("searchBtn");

if (searchButton) {
  searchButton.addEventListener("click",function () {
      getFilteredProducts(); // call only on click
    });

}


document.querySelectorAll("#priceFilters .price-filter").forEach(cb => {
  cb.addEventListener("change", function () {
      getFilteredProducts(); // call only on click
    });
});

const sortSelect = document.getElementById("sortSelect");

if (sortSelect) {
  sortSelect.addEventListener("change", function () {
    getFilteredProducts();
  });
}


})




async function showAllProductListingContents(page,limit){
   
  try{
    const response=await fetch(`/api/user/productslisting/getAllProductListingContents?page=${page}&limit=${limit}&sortBy=name&order=desc`);
    const result=await response.json();
    console.log(result);
    showProducts(result,page,limit);
   
    

  }catch(error){
    console.error("Error loading content",error);
  }

}

function showProducts(result,page,limit){

  const productList=document.getElementById("productContainer");
  const pagination = document.getElementById("pagination");

    const categoryFilters=document.getElementById("categoryFilters");


    const categories=result.data.categories||[];
    
    const products=result.data.products||[];
    const totalProducts = result.data.totalProducts || 0;
    const totalPages = Math.ceil(totalProducts / limit);

    categoryFilters.innerHTML = "";
    productList.innerHTML="";

    categories.forEach(cat=>{
      const column=document.createElement("div");
      column.classList.add("form-check");
      column.innerHTML = `
        <input class="form-check-input category-checkbox"  type="checkbox" id="cat-${cat._id}" value="${cat._id}">
        <label class="form-check-label" for="cat-${cat._id}">${cat.name}</label>
      `;

      categoryFilters.appendChild(column);

     
    })

     
document.querySelectorAll("#categoryFilters .category-checkbox").forEach(cb => {
  cb.addEventListener("change", function () {
      getFilteredProducts(); // call only on click
    });
});
   

    products.forEach(book=>{
      const column=document.createElement("div");
  column.classList.add("col-6", "col-md-4", "col-lg-3", "mb-4");
column.innerHTML = `
    <div class="card h-100 shadow-sm">
    <a href="/user-productsview?id=${book._id}">
      <img src="${book.images[0]}" class="card-img-top" alt="${book.bookName}">
      </a>
      <div class="card-body">
        <h6 class="card-title">
        <a href="/user-productsview?id=${book._id}" class="text-decoration-none text-dark">${book.bookName}</a></h6>
        <p class="card-text mb-1"><strong>₹${book.salePrice}</strong> <del>₹${book.regularPrice}</del></p>
        <p class="text-warning mb-0">★★★☆☆</p>
      </div>
    </div>
  `;
productList.appendChild(column);
      })

      pagination.innerHTML = "";
      // Previous button
  if (page > 1) {
    //const prev = `<li class="page-item"><a class="page-link" href="#" onclick="loadProducts(${page - 1}, ${limit})">«</a></li>`;
    const prev = `
  <li class="page-item">
    <a class="page-link" href="#" onclick="showAllProductListingContents(${page - 1}, ${limit})">«</a>
  </li>`;

    pagination.innerHTML += prev;
  }
  for (let i = 1; i <= totalPages; i++) {
    const active = i === page ? "active" : "";
    const pageBtn = `<li class="page-item ${active}"><a class="page-link" href="#" onclick="showAllProductListingContents(${i}, ${limit})">${i}</a></li>`;
    pagination.innerHTML += pageBtn;
  }
   if (page < totalPages) {
    const next = `<li class="page-item"><a class="page-link" href="#" onclick="showAllProductListingContents(${page + 1}, ${limit})">»</a></li>`;
    pagination.innerHTML += next;
  }


    
}

async function getFilteredProducts(page=1,limit=6){
try{
  console.log("test");
const searchValue=document.getElementById("searchInput").value.trim();

const categoryValue = document.querySelectorAll("#categoryFilters input[type=checkbox]:checked");
    let selectedCategories = Array.from(categoryValue).map(cb => cb.value);
    console.log(selectedCategories);

//store seleted categories to selectedCategories array

    const priceupto499 = document.getElementById("priceupto499").checked;
    const price500to1000 = document.getElementById("price500to1000").checked;
    const price1001to2000 = document.getElementById("price1000to2000").checked;
    const priceabove2000 = document.getElementById("priceabove2000").checked;


    const sortValue=document.getElementById("sortSelect").value;


    //query

    //let query="?page="+(page||1)+"&limit="+10;

      let query = `?page=${page}&limit=${limit}`;


    //all ifs

    if(searchValue){
      query=query+`&search=${searchValue}`;
    }
    if(selectedCategories.length>0){
      query=query+`&category=${selectedCategories.join(",")}`;
    }
    
    if(priceupto499){
      query=query+"&priceupto499=true";

    }
    if(price500to1000){
      query=query+"&price500to1000=true";
    }
    if(price1001to2000){
      query=query+"&price1001to2000=true";

    }
    if(priceabove2000){
      query=query+"&priceabove2000=true";
    }
    if(sortValue){
      query=query+`&sortBy=${sortValue}`;
    }

    //api
    console.log("Query :"+query);
    const response=await fetch("/api/user/productslisting/getAllFilteredProducts"+query);
    const result=await response.json();
    showUpdatedProducts(result,page,limit);
}
catch(error){
  console.error("Error loading filtered products",error);
}


}


async function showUpdatedProducts(result,page,limit){
try{
  console.log("TRY TEST");
    const productList=document.getElementById("productContainer");
    const pagination = document.getElementById("pagination");

      productList.innerHTML = ""; //clearing first old values

    const products=result.data.products||[];
    console.log(products);
    const totalProducts = result.data.totalProducts || 0;
    const totalPages = Math.ceil(totalProducts / limit);

    if(products.length===0){
      productList.innerHTML = `<p class="text-muted">No products found.</p>`;
    }
    else{
    products.forEach(book=>{
    const column=document.createElement("div");
    column.classList.add("col-6", "col-md-4", "col-lg-3", "mb-4");
    column.innerHTML = `
    <div class="card h-100 shadow-sm">
    <a href="/user-productsview?id=${book._id}">
      <img src="${book.images?.[0] || '/assets/images/placeholder-book.jpg'}" class="card-img-top" alt="${book.bookName}">
      </a>
      <div class="card-body">
        <h6 class="card-title">
        <a href="/user-productsview?id=${book._id}" class="text-decoration-none text-dark">${book.bookName}</a></h6>
        <p class="card-text mb-1"><strong>₹${book.salePrice}</strong> <del>₹${book.regularPrice}</del></p>
        <p class="text-warning mb-0">★★★☆☆</p>
      </div>
    </div>
  `;
   productList.appendChild(column);
      })

    }

      pagination.innerHTML = "";
      // Previous button
  if (page > 1) {
    
    const prev = `
  <li class="page-item">
    <a class="page-link" href="#" onclick="showAllProductListingContents(${page - 1}, ${limit})">«</a>
  </li>`;

    pagination.innerHTML += prev;
  }
  for (let i = 1; i <= totalPages; i++) {
    const active = i === page ? "active" : "";
    const pageBtn = `<li class="page-item ${active}"><a class="page-link" href="#" onclick="getFilteredProducts(${i}, ${limit})">${i}</a></li>`;
    pagination.innerHTML += pageBtn;
  }
   if (page < totalPages) {
    const next = `<li class="page-item"><a class="page-link" href="#" onclick="getFilteredProducts(${page + 1}, ${limit})">»</a></li>`;
    pagination.innerHTML += next;
  }
    

}
catch(error){
  console.error("Error loading updated products",error);
}
}