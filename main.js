const shopping_list = document.querySelector("#shopping-list")
const prices = document.querySelector("#prices")
let number_of_items = 10
const tax_rate = document.querySelector("#TaxRate")
const total = document.querySelector("#Total")
for(let i = 0; i<number_of_items;i++){
    addItem()
}
tax_rate.addEventListener("input",calculate_total)

//---------------------------------------------------------------
/*Function that adds list items containing an input to both the shoping list and the price list 
adds an event listener to the price list item to calculate total. */
function addItem() {
    let new_item = document.createElement("li")
    new_item.innerHTML= `<input type="text" class="list_item" value="" placeholder="Shopping List Item">`
    shopping_list.appendChild(new_item)
    let new_price = document.createElement("li")
    new_price.innerHTML = `<input type="number" class="price_item" value=0 placeholder="Item Price">`
    prices.appendChild(new_price)
    new_price.addEventListener("input",calculate_total)
}
//---------------------------------------------------------------
/*Calculates the total by adding all values from the price list and 
multiplying by the percentage provided in the tax-rate input. Sets the text of the 
Total section to the Total: + calculated total */
function calculate_total(){
    const input_prices = document.querySelectorAll(".price_item")
    let gross_price = 0
    const tax_input = document.querySelector("#tax-input")
    let net_price = 0
    let tax_multiplier = (format_value('remove',tax_input,'')/100)+1
    for(let i = 0;i < input_prices.length; i++){
        if(input_prices[i].value != 0){
            gross_price += parseFloat(input_prices[i].value)
        }
    }
    net_price = parseFloat(gross_price*tax_multiplier,2)
    total.textContent = `Total: $${net_price}`
    format_value('add',tax_input,"%")
}
//----------------------------------------------------------------
/*Formats the provided inputs value to remove all characters not numbers
or to add a percentage or dollar sign */
function format_value(perform,item,symbol){
    let newvalue =  ''
    if(perform === 'remove'){
        for(let i = 0;i<item.value.length;i++){
            if('1234567890.'.includes(item.value[i])){
                newvalue+=item.value[i]
            }
        }
        return newvalue
    }
    else if(perform === 'add') { 
        for(let i = 0;i<item.value.length;i++){
            if(symbol.includes(item.value[i])){
                item.value = item.value.replace(symbol,'') 
            }
        }
        if(symbol == '%'){item.value = `${item.value}${symbol}`}
        if(symbol == '$'){item.value = `${symbol}${parseFloat(item.value).toFixed(2)}`}
    }
}