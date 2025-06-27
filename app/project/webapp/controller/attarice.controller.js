sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/MessageToast",
    "sap/m/Text",
    "sap/m/VBox"
], function (Controller, JSONModel, Filter, MessageToast, Text, VBox) {
    "use strict";

    return Controller.extend("project.controller.attarice", {
        onInit: function () {
            
            jQuery.sap.includeStyleSheet("project/css/style.css");

            var oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel);
            this.getView().setModel(new sap.ui.model.json.JSONModel({ results: [] }), "searchModel");

            var grainsFilter = new Filter("category/name", "EQ", "Grains");
            var essentialsFilter = new Filter("category/name", "EQ", "Essentials");

            var grainsList = this.getView().byId("grainsList");
            var essentialsList = this.getView().byId("essentialsList");

            if (grainsList?.getBinding("items")) {
                grainsList.getBinding("items").filter([grainsFilter]);
            }

            if (essentialsList?.getBinding("items")) {
                essentialsList.getBinding("items").filter([essentialsFilter]);
            }
        },
        onSearch: function (oEvent) {
          var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
          var oModel = this.getView().getModel(); // ODataModel
          var that = this;
      
          if (sQuery && sQuery.length > 0) {
              oModel.read("/Product", {
                  filters: [
                      new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sQuery)
                  ],
                  success: function (oData) {
                      that.getView().getModel("searchModel").setProperty("/results", oData.results);
                  }
              });
          } else {
              that.getView().getModel("searchModel").setProperty("/results", []);
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
          var oView = this.getView();
          var cartModel = this.getOwnerComponent().getModel("cartModel");
          var cartData = cartModel.getData();
          var oUserModel = this.getOwnerComponent().getModel("userModel");
          var oModel = oView.getModel(); // ODataModel
      
          // Get customer ID from userModel
          var customerId = oUserModel && oUserModel.getProperty("/userId");
          if (!customerId) {
              sap.m.MessageBox.error("You must be logged in to place an order.");
              return;
          }
      
          if (!cartData.items || cartData.items.length === 0) {
              sap.m.MessageBox.warning("Your cart is empty.");
              return;
          }
      
          // Use totalAmount from cartModel if available, else calculate
          var totalAmount = cartData.totalAmount;
          if (typeof totalAmount !== "number") {
              totalAmount = cartData.items.reduce(function(sum, item) {
                  return sum + (item.price * item.quantity);
              }, 0);
          }
      
          // Build order items payload
          var orderItems = cartData.items.map(function(item) {
              return {
                  product_id: item.id, // Association to Product (check your OData $metadata for the correct property name)
                  unit: item.quantity,
                  price: item.price
              };
          });
      
          // Build order payload
          var oOrderData = {
            customer_id: customerId, // Association to Customer (check your OData $metadata for the correct property name)
              orderDate: new Date().toISOString(),
              status: "Placed",
              totalAmount: totalAmount,
              items: orderItems
          };
      
          oModel.create("/Order", oOrderData, {
              success: function () {
                cartData.items.forEach(function(item) {
                  var newStock = item.stock - item.quantity;
                  if (newStock < 0) newStock = 0;
                  oModel.update("/Product('" + item.id + "')", { stock: newStock }, {
                      success: function () {
                          // Optionally refresh product model or show a toast
                      },
                      error: function () {
                          sap.m.MessageToast.show("Failed to update stock for " + item.name);
                      }
                  });
              });
                  sap.m.MessageBox.success(
                      "Order placed successfully! Your order will be delivered in 10 minutes.",
                      { title: "Order Successful" }
                  );
                  cartModel.setProperty("/items", []);
                  cartModel.setProperty("/totalAmount", 0);
                  this.onCloseCart();
                  this.updateCartDisplay();
              }.bind(this),
              error: function () {
                  sap.m.MessageBox.error("Order placement failed. Please try again.");
              }
          });
      }
    });
});
