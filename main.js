//---------------------------------------------------------------
/*Declaring constant variables*/
const shopping_list = document.querySelector("#shopping-list")//Unordered list for shopping items
const prices = document.querySelector("#prices")//Unorder list for item prices
const zip_code_input = document.querySelector("#zip-code")//Input box for the zipcode
const tax_input = document.querySelector("#tax-input")//Inputbox for the taxrate
const tax_input_popup = document.querySelector(".tax-ex")//Div that acts as a popup for TaxRate
const tax_rate = document.querySelector("#TaxRate")//Parent div of the TaxRate
const tax_section = document.querySelector("#tax-rate-section")//Article containing all the elemtent for pricing essentials
const tax_popup = document.querySelector("#taxfind-popup")
const total = document.querySelector("#Total")//Div to display the total
const save_key = document.querySelector("#save-key")//Input box for the key used to save
const save_button = document.querySelector("#Save-Button")//Button that is used to save
const load_button = document.querySelector("#Load-Button")//Button that is used to load
const essentials_button = document.querySelector("#essentials-button")//Button that is used to price the essentials
const essential_city = document.querySelector("#price-area")//Select element holding cities used by GroceryBear API
const essential_section = document.querySelector("#essentials-section")//Article containing all the elemtent for pricing essentials
const essentials_popup = document.querySelector("#essentials-popup")
const tax_rate_button = document.querySelector("#zip-go-button")//Button to find the TaxRate using Zipcode
const essentials_products = ['eggs', 'milk', 'bread', 'rice', 'steak','butter']//List of items the GroceryBear API accepts
const starting_items = 10//The number of items to start the list with
//---------------------------------------------------------------
/*Adding event listners for calculating total,saving and loading,finding prices, and finding the taxrate. */
tax_rate.addEventListener("input",calculate_total)
save_button.addEventListener("click",save)
load_button.addEventListener("click",load)
essentials_button.addEventListener("click",findEssientialPrices)
tax_rate_button.addEventListener("click", importTaxRate)
//---------------------------------------------------------------
/*Adding eventlistners to make desctiptive popups functional*/
tax_input.addEventListener("mouseover",function(){tax_input_popup.classList.toggle("show")})
tax_input.addEventListener("mouseout",function(){tax_input_popup.classList.toggle("show")})
essential_section.addEventListener("mouseover",function(){essentials_popup.classList.toggle("show")})
essential_section.addEventListener("mouseout",function(){essentials_popup.classList.toggle("show")})
tax_section.addEventListener("mouseover",function(){tax_popup.classList.toggle("show")})
tax_section.addEventListener("mouseout",function(){tax_popup.classList.toggle("show")})

//---------------------------------------------------------------
/*Creates the inital list of items in the shopping list*/
for(let i = 0; i<starting_items;i++){
    addItem()
}
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
    new_price.addEventListener("input",extendList)
    new_item.addEventListener("input",calculate_total)
    new_item.addEventListener("input",extendList)
}
//---------------------------------------------------------------
/*Calculates the total by adding all values from the price list and 
multiplying by the percentage provided in the tax-rate input. Sets the text of the 
Total section to the Total: + calculated total */
function calculate_total(){
    const input_prices = document.querySelectorAll(".price_item")
    let gross_price = 0
    
    let net_price = 0
    let tax_multiplier = (format_value('remove',tax_input,'')/100)+1
    for(let i = 0;i < input_prices.length; i++){
        if(input_prices[i].value != 0){
            gross_price += parseFloat(input_prices[i].value)
        }
    }
    net_price = parseFloat(gross_price*tax_multiplier).toFixed(2)
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
//----------------------------------------------------------------
/*Saves the contents of all the input boxes to local storage using the keyword provided in the 
key textbox as the save key. */
function save(){
    let items = document.querySelectorAll(".list_item")
    let costs = document.querySelectorAll(".price_item")
    let save_data = []
    for(let i = 0; i < items.length; i++){
        let object = {}
        object["itemName"] = items[i].value
        object["itemPrice"] = costs[i].value
        save_data.push(object)
    }
    localStorage.setItem(save_key.value,JSON.stringify(save_data))
}
//----------------------------------------------------------------
/*Loads data from local storage placing each item in the position it was in before being saved.
Gathers this data using the keyword provided in the "Key" input box. */
function load(){
    let items = document.querySelectorAll(".list_item")
    let costs = document.querySelectorAll(".price_item")
    let save_data = JSON.parse(localStorage.getItem(save_key.value))
    if(items.length < save_data.length){
        for(let i = 0; i < (save_data.length-items.length); i++){
            addItem()
        }
    }
    items = document.querySelectorAll(".list_item")
    costs = document.querySelectorAll(".price_item")

    for(let i = 0; i < save_data.length; i++){
        
        items[i].value = save_data[i].itemName
        costs[i].value = save_data[i].itemPrice
        
    }
    calculate_total()
}
//-----------------------------------------------------------------
/*Extends the list of textboxes for by one if the last box has had somehthing entered into it.
This makes the list infinate as long as you keep adding items. */
function extendList(){
    let items = document.querySelectorAll(".list_item")
    let costs = document.querySelectorAll(".price_item")
    let last_item = items.length - 1

    if(items[last_item].value != "" ||  costs[last_item].value != 0){
        addItem()
    }
}
//------------------------------------------------------------------
/*Takes a product and city and makes a call to the grocerybear api and returns the most recent price of the product in the city provided.
The api only accepts ['eggs', 'milk', 'bread', 'rice', 'steak','butter'] as products.*/
function checkPrices(product,city){
    var xhr = new XMLHttpRequest();
    xhr.open("POST","https://grocerybear.com/getitems", false)
    xhr.setRequestHeader("api-key","B46011AC9EFA593D73ED9298361574814BD718EFD037CA167CF7BDBFA1224A0E")
    xhr.setRequestHeader("Content-Type","application/json")
    let toReturn = null
    xhr.onreadystatechange = function(){
        let response = JSON.parse(this.responseText)
        //console.log(this.responseText)
        toReturn = JSON.stringify(response[response.length-1]['price'])

    }
    xhr.send(`{"city":"${city}", "product":"${product}", "num_days": 0}`)
    return toReturn
}
//-------------------------------------------------------------------
/*Finds the price of 'eggs', 'milk', 'bread', 'rice', 'steak','butter' by passing them to checkPrices with 
the city that is selected in city select box. Sets the price box of the item to the price that it finds.*/
function findEssientialPrices(){
    let items = document.querySelectorAll(".list_item")
    let costs = document.querySelectorAll(".price_item")
    for(let i=0; i<items.length;i++){
        if(essentials_products.includes(items[i].value.toLowerCase())){
            costs[i].value = checkPrices(items[i].value,essential_city.value)
        }
    }
}
//----------------------------------------------------------------------
/*Makes a call to the zip-tax api with the provided zipcode in the input box. Then
sets the Taxrate value from the api's response. */
function importTaxRate(){
    var xhr = new XMLHttpRequest();
    xhr.open("get",`https://api.zip-tax.com/request/v40?key=3EuSmNeUasn8QbLY&postalcode=${zip_code_input.value}`, false)
    xhr.onreadystatechange = function(){
        let response = JSON.parse(this.responseText)
        tax_input.value = response['results'][0]['taxSales']*100+'%'

    }

    xhr.send()

}
//---------------------------------------------------------------

