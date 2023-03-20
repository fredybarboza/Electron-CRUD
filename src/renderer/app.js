const productForm = document.getElementById('productForm')
const btnSubmit = document.getElementById('btnSubmit')
const productName = document.getElementById('name')
const productPrice = document.getElementById('price')
const productsList = document.getElementById('products')

let products = [];
let isEditing = false;
let editProductId;

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const product = {
        name: productName.value,
        price: productPrice.value
    }

    productForm.reset();
    productName.focus();

    if(isEditing){
        window.myApi.updateProduct(product, editProductId);
        isEditing = false;
        getProducts();
        return
    }

    window.myApi.newProduct(product)

    getProducts();

})

async function initData(){
    getProducts()
}

async function getProducts(){
    productsList.innerHTML = "";
    products = await window.myApi.getProducts()
    products.forEach((p) => {
       productsList.innerHTML += `
       <div class="card card-body my-2 animate__animated animate__backInLeft">
        <h5>Id ${p.id}</h5>
        <p>${p.name}</p>
        <h3>${p.price}$</h3>
        <p>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">
                DELETE
            </button>
            <button class="btn btn-info btn-sm" onclick="editProduct('${p.id}')">
                EDIT 
            </button>
        </p>
       </div>
       `;
    })  
}

async function editProduct(id){
    const product = await window.myApi.editProduct(id);
    
    productName.value = product.name;
    productPrice.value = product.price;
    isEditing = true;
    editProductId = id;
}

async function deleteProduct(id){

    await window.myApi.deleteProduct(id);
    getProducts();
    return
}

initData();


