sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/MessageToast",
    "sap/m/Text",
    "sap/m/VBox",
    "sap/m/MessageBox"
], function (Controller, JSONModel, Filter, MessageToast, Text, VBox,MessageBox) {
    "use strict";

    return Controller.extend("project.controller.fruitVegetable", {
        onInit: function () {
            // Load custom CSS
            jQuery.sap.includeStyleSheet("css/style.css");

            // Set OData model
            var oModel = this.getOwnerComponent().getModel(); // OData V4 model
            this.getView().setModel(oModel);

        },
        onAfterRendering: function () {
            // Apply filters after rendering
            var fruitFilter = new Filter("category/name", "EQ", "Fruit");
            var vegetableFilter = new Filter("category/name", "EQ", "Vegetable");
    
            var fruitList = this.getView().byId("fruitList");
            var vegetableList = this.getView().byId("vegetableList");
    
            if (fruitList && fruitList.getBinding("items")) {
                fruitList.getBinding("items").filter([fruitFilter]);
            }
            if (vegetableList && vegetableList.getBinding("items")) {
                vegetableList.getBinding("items").filter([vegetableFilter]);
            }
        },

        updateCartDisplay: function () {
            var view = this.getView();
            var cartItemsContainer = view.byId("cartItemsContainer");
            var totalPriceText = view.byId("totalPriceText");
            var placeOrderButton = view.byId("placeOrderButton"); // Make sure your Place Order button has this ID
      
            cartItemsContainer.removeAllItems();
      
            var cartModel = this.getOwnerComponent().getModel("cartModel");
            var cartData = cartModel.getData();
      
            let total = 0;
      
            if (!cartData.items || cartData.items.length === 0) {
              // Cart is empty
              cartItemsContainer.addItem(
                new sap.m.Text({
                  text: "Your cart is empty. Browse products to add items!",
                  textAlign: "Center"
                }).addStyleClass("cartEmptyText")
              );
              totalPriceText.setText("");
              if (placeOrderButton) {
                placeOrderButton.setVisible(false);
              }
              return;
            }
      
            cartData.items.forEach((item, index) => {
              total += item.price * item.quantity;
      
              var quantityBox = new sap.m.HBox({
                items: [
                  new sap.m.Button({
                    icon: "sap-icon://less",
                    type: "Transparent",
                    press: () => {
                      if (item.quantity > 1) {
                        item.quantity -= 1;
                      } else {
                        cartData.items.splice(index, 1);
                      }
                      cartModel.setProperty("/items", cartData.items);
                      this.updateCartDisplay();
                    }
                  }),
                  new sap.m.Text({ text: item.quantity.toString() }).addStyleClass("cartItemQuantity"),
                  new sap.m.Button({
                    icon: "sap-icon://add",
                    type: "Transparent",
                    press: () => {
                        if (item.quantity < item.stock) {
                            item.quantity += 1;
                            cartModel.setProperty("/items", cartData.items);
                            this.updateCartDisplay();
                        } else {
                            sap.m.MessageToast.show("Maximum stock reached for " + item.name + "!");
                        }
                    }
                })
                ],
                alignItems: "Center",
                justifyContent: "Center"
              }).addStyleClass("quantityControlBox");
      
              var itemBox = new sap.m.VBox({
                items: [
                  new sap.m.Text({ text: item.name }).addStyleClass("cartItemName"),
                  quantityBox,
                  new sap.m.Text({ text: "Price: ₹" + item.price }).addStyleClass("cartItemPrice")
                ]
              }).addStyleClass("cartItemBox");
      
              cartItemsContainer.addItem(itemBox);
            });
      
            totalPriceText.setText("Total: ₹" + total.toFixed(2));
            if (placeOrderButton) {
              placeOrderButton.setVisible(true);
            }
          },

        onCartPress: function () {
            var view = this.getView();
            var cartPanel = view.byId("cartPanel");

            cartPanel.setVisible(!cartPanel.getVisible());
            this.updateCartDisplay();
        },

        onCloseCart: function () {
            var cartPanel = this.getView().byId("cartPanel");
            if (cartPanel) {
                cartPanel.setVisible(false);
            }
        },

        onAddToCart: function (oEvent) {
            var itemContext = oEvent.getSource().getBindingContext();
            var itemData = itemContext.getObject();
            console.log(itemData);
        
            var cartModel = this.getOwnerComponent().getModel("cartModel");
            var cartItems = cartModel.getProperty("/items") || [];
        
            // Ensure stock is present
            if (typeof itemData.stock !== "number") {
                sap.m.MessageToast.show("Stock information not available for " + itemData.name + "!");
                return;
            }
        
            var existingItem = cartItems.find(item => item.id === itemData.id);
            if (existingItem) {
                if (existingItem.quantity >= itemData.stock) {
                    sap.m.MessageToast.show("Maximum stock reached for " + itemData.name + "!");
                    return;
                }
                existingItem.quantity = (parseInt(existingItem.quantity) || 1) + 1;
            } else {
                if (itemData.stock < 1) {
                    sap.m.MessageToast.show("Out of stock for " + itemData.name + "!");
                    return;
                }
                cartItems.push({ ...itemData, quantity: 1 });
            }
        
            cartModel.setProperty("/items", cartItems);
            MessageToast.show(itemData.name + " added to cart");
        },
        onPlaceOrder: function () {
          sap.m.MessageBox.success(
              "Order placed successfully! Your order will be delivered in 10 minutes.",
              {
                  title: "Order Successful"
              }
          );
          var cartModel = this.getOwnerComponent().getModel("cartModel");
          cartModel.setProperty("/items", []); 
          this.onCloseCart();
          this.updateCartDisplay();
      }
    });
});
