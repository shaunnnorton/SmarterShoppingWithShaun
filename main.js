const shopping_list = document.querySelector("#shopping-list")
const prices = document.querySelector("#prices")
let number_of_items = 10

function addItem() {
    let new_item = document.createElement("li")
    new_item.innerHTML= `<input type="text" class="list_item" value="" placeholder="Shopping List Item">`
    shopping_list.appendChild(new_item)
    let new_price = document.createElement("li")
    new_price.innerHTML = `<input type="number" class="price_item" value="" placeholder="Item Price">`
    prices.appendChild(new_price)
}

for(let i = 0; i<number_of_items;i++){
    addItem()
}