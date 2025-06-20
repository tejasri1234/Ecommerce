sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project.controller.teacoffe", {
        onInit: function(){            
            var cartModel = new sap.ui.model.json.JSONModel({ items: [] });
            this.getView().setModel(cartModel, "cartModel");

        },
        onAfterRendering: function() {
            var view = this.getView(); 
        
            var teaList = view.byId("teaList");
            var coffeeList = view.byId("coffeeList");
        
            var teaFilter = new sap.ui.model.Filter("category/name", "EQ", "Tea");
            var coffeeFilter = new sap.ui.model.Filter("category/name", "EQ", "Coffee");
        
            if (teaList?.getBinding("items")) {
                teaList.getBinding("items").filter([teaFilter]);
            }
        
            if (coffeeList?.getBinding("items")) {
                coffeeList.getBinding("items").filter([coffeeFilter]);
            }
        },
        onAddToCart: function (oEvent) {
            var itemContext = oEvent.getSource().getBindingContext();
            var itemData = itemContext.getObject();
        
            var cartModel = this.getView().getModel("cartModel");
            var cartItems = cartModel.getProperty("/items") || [];
        
            // Check if item already exists in cart
            var existingItem = cartItems.find(item => item.id === itemData.id);
            if (existingItem) {
                existingItem.quantity = (parseInt(existingItem.quantity) || 1) + 1;
            } else {
                cartItems.push({ ...itemData, quantity: 1 });
            }
        
            cartModel.setProperty("/items", cartItems);
            sap.m.MessageToast.show(itemData.name + " added to cart");
        }
        
        

          

    });
})