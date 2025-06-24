sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/MessageToast",
    "sap/m/Text",
    "sap/m/VBox"
], function (Controller, JSONModel, Filter, MessageToast, Text, VBox) {
    "use strict";

    return Controller.extend("project.controller.teacoffe", {
        onInit: function () {
            var oView = this.getView();
            sap.ui.core.Fragment.load({
                name: "project.view.NavBar",
                type: "XML",
                controller: this
            }).then(function(oFragment){
                oView.byId("page").addContent(oFragment);
            });
            jQuery.sap.includeStyleSheet("project/css/style.css");

            var oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel);

            var teaFilter = new Filter("category/name", "EQ", "Tea");
            var coffeeFilter = new Filter("category/name", "EQ", "Coffee");

            var teaList = this.getView().byId("teaList");
            var coffeeList = this.getView().byId("coffeeList");

            if (teaList?.getBinding("items")) {
                teaList.getBinding("items").filter([teaFilter]);
            }

            if (coffeeList?.getBinding("items")) {
                coffeeList.getBinding("items").filter([coffeeFilter]);
            }
        },

        updateCartDisplay: function () {
            var view = this.getView();
            var cartItemsContainer = view.byId("cartItemsContainer");
            var totalPriceText = view.byId("totalPriceText");

            cartItemsContainer.removeAllItems();

            var cartModel = this.getOwnerComponent().getModel("cartModel");
            var cartData = cartModel.getData();

            let total = 0;

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
                                item.quantity += 1;
                                cartModel.setProperty("/items", cartData.items);
                                this.updateCartDisplay();
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

            var cartModel = this.getOwnerComponent().getModel("cartModel");
            var cartItems = cartModel.getProperty("/items") || [];

            var existingItem = cartItems.find(item => item.id === itemData.id);
            if (existingItem) {
                existingItem.quantity = (parseInt(existingItem.quantity) || 1) + 1;
            } else {
                cartItems.push({ ...itemData, quantity: 1 });
            }

            cartModel.setProperty("/items", cartItems);
            console.log("Cart Items:", cartItems);
            MessageToast.show(itemData.name + " added to cart");
        }
    });
});
