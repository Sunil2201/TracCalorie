// Storage Controller 
const StorageCtrl = (function(){

    return{
        storeItem : function(item){
            let items;
            // Check if any items in local storage 
            if(localStorage.getItem('items') === null){
                items = [];
                // Push the new item 
                items.push(item);
                // Set ls
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                // Get what is already in ls 
                items = JSON.parse(localStorage.getItem('items'));

                // Push the new item 
                items.push(item);

                // Reset ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(item){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
             let items = JSON.parse(localStorage.getItem('items'));

             items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
             })
             localStorage.setItem('items', JSON.stringify(items))
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

             items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
             })
             localStorage.setItem('items', JSON.stringify(items))
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const ItemCtrl = (function(){
    // Item constructor 
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure/ State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0,
    }

    // Public Methods
    return{
        getItems : function(){
            return data.items;
        },
        addItem : function(name, calories){
            let ID;
            // Create id
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }

            // Calories to number 
            calories = parseInt(calories); 

            // Create new Item 
            newItem = new Item(ID, name, calories);

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getTotalCalories: function(){
            let total = 0;

            // loop through items and add cals 
            data.items.forEach(function(item){
              total += item.calories;  
            })
            // Set total calories in dS
            data.totalCalories = total; 

            // return total
            return data.totalCalories;

        },
        logData: function(){
            return data;
        },
        getItemById: function(id){
            let found = null
            // loop through items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            })
            return found;
        },
        updateItem: function(name, calories){
            // Calories to number 
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(item){
            return data.currentItem;
        },
        deleteItem: function(id){
            const ids = data.items.map(function (item){
                return item.id;
            });

            // Get index
            const index  = ids.indexOf(id);
            // Remove Item 
            data.items.splice(index,1);
        },
        clearAllItems: function(){
            data.items = [];
        }
    }
})();

// UI Controller
const UICtrl = (function(){

    // const UISelectors = {
    //     itemList : '#item-list',
    //     addBtn: '.add-btn'
    // }

    return{
        populateItemList: function(items){
            let html = '';
            
            items.forEach(function(item){
                html +=  `<li id="item-${item.id}" class="collection-item"> 
                <strong> ${item.name} </strong> <em> ${item.calories} Calories </em>
                <a href = "#" class = "secondary-content">
                    <i class = "edit-item fa fa-solid fa-pencil"> </i>
                </a>
                </li>`
            });

            // Insert list items
            document.querySelector('#item-list').innerHTML = html;
        },

        getItemInput: function(){
            return{
                name: document.querySelector('#item-name').value,
                calories: document.querySelector('#item-calories').value
            }
        },
        addListItem: function(item){
            // show the list 
            document.querySelector('#item-list').style.display = 'block'
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item'
            // Add Id
            li.id = `item-${item.id}`
            // Add html 
            li.innerHTML = `<strong> ${item.name} </strong> <em> ${item.calories} Calories </em>
            <a href = "#" class = "secondary-content">
                <i class = "edit-item fa fa-solid fa-pencil"> </i>
            </a>`;
            // Insert item 
            document.querySelector('#item-list').insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll('#item-list li')

            // Convert node list to array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong> ${item.name} </strong> <em> ${item.calories} Calories </em>
                    <a href = "#" class = "secondary-content">
                        <i class = "edit-item fa fa-solid fa-pencil"> </i>
                    </a>`;
                }
            })

            console.log(listItems);
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`
            const item = document.querySelector(itemID);
            item.remove();
        },
        removeItems : function(){
            let listItems = document.querySelectorAll('#item-list li');

            // Turn node list into an array
            listItems =  Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            })

        },
        clearInput: function(){
            document.querySelector('#item-name').value = '';
            document.querySelector('#item-calories').value = '';
        },
        addItemToForm: function(){
            document.querySelector('#item-name').value = ItemCtrl.getCurrentItem().name;
            document.querySelector('#item-calories').value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        showTotalCalories: function(totalCalories){
            document.querySelector('.total-calories').textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector('.update-btn').style.display = 'none';
            document.querySelector('.delete-btn').style.display = 'none';
            document.querySelector('.back-btn').style.display = 'none';
            document.querySelector('.add-btn').style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector('.update-btn').style.display = 'inline';
            document.querySelector('.delete-btn').style.display = 'inline';
            document.querySelector('.back-btn').style.display = 'inline';
            document.querySelector('.add-btn').style.display = 'none';
        },
        hideList: function(){
            document.querySelector('#item-list').style.display = 'none';
        }

        // ,
        // getSelectors: function(){
        //     return UISelectors;
        // }
    }
})();

// App Controller
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl){
    // Load event Listeners
    const loadEventListeners = function(){

        // Add Item Event
        document.querySelector('.add-btn').addEventListener('click', itemAddSubmit);

        // Disable submit on enter 
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false; 
            }
        })

        // Edit item Event
        document.querySelector('#item-list').addEventListener('click', itemEditClick);

        // Update item Event 
        document.querySelector('.update-btn').addEventListener('click', itemUpdateSubmit);

        // Delete item Event 
        document.querySelector('.delete-btn').addEventListener('click', itemDeleteSubmit);
        
        // Back item Event 
        document.querySelector('.back-btn').addEventListener('click', UICtrl.clearEditState);

        // Clear item Event 
        document.querySelector('.clear-btn').addEventListener('click', clearAllItemsClick);
    }

    //  Add item submit 
    const itemAddSubmit = function(e){
        const input = UICtrl.getItemInput();
      
        // check for name and calorie input 
        if(input.name !== '' && input.calories !== ''){
            // Add item 
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add item to ui list
            UICtrl.addListItem(newItem);

            // Get total calories 
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to ui 
            UICtrl.showTotalCalories(totalCalories);

            // Store to local storage 
            StorageCtrl.storeItem(newItem);

            // Clear fields
            UICtrl.clearInput();
        }
        e.preventDefault()
    }

    // Click edit item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            // Get list item id 
            const listId = e.target.parentNode.parentNode.id;

            // Break into an array
            const listIdArr = listId.split('-');

            // Get the actual id 
            const id = parseInt(listIdArr[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set current item 
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    // Update Item Submit 
    const itemUpdateSubmit = function(e){
        // Get Item input 
        const input = UICtrl.getItemInput();

        //Updated item 
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories); 

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories 
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to ui 
        UICtrl.showTotalCalories(totalCalories);

        // Update the local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();


        e.preventDefault();
    }

    // Delete Button
    const itemDeleteSubmit = function(e){
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories 
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to ui 
        UICtrl.showTotalCalories(totalCalories);

        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear all Button 
    const clearAllItemsClick = function(e){
        // Delete all items from data structure
        ItemCtrl.clearAllItems();
        // Remove from UI
        UICtrl.removeItems();
        
        // Get total calories 
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to ui 
        UICtrl.showTotalCalories(totalCalories);

        // Remove from local storage
        StorageCtrl.clearItemsFromStorage();

        UICtrl.hideList();


        e.preventDefault();
    }

    // Public Methds
    return{
        init: function(){
            
             // Clear Edit State
             UICtrl.clearEditState();

            // Fetch Items from data structure
            const items = ItemCtrl.getItems();

            // Check if any items
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                // Populate list with items 
                UICtrl.populateItemList(items);
            }
            
                // Get total calories 
                const totalCalories = ItemCtrl.getTotalCalories();

                // Add total calories to ui 
                UICtrl.showTotalCalories(totalCalories);

                // Load event listeners
                loadEventListeners();

               
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

AppCtrl.init();