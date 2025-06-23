sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/MessageToast",
    "sap/m/Text",
    "sap/m/VBox"
], function (Controller, JSONModel, Filter, MessageToast, Text, VBox) {
    "use strict";

    return Controller.extend("project.controller.sweet", {
        onInit: function () {
            jQuery.sap.includeStyleSheet("project/css/style.css");

            var oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel);

            var chocolatesFilter = new Filter("category/name", "EQ", "Chocolates & Sweets");
            var iceCreamFilter = new Filter("category/name", "EQ", "Ice Creams");

            var chocolatesList = this.getView().byId("chocolatesList");
            var iceCreamList = this.getView().byId("iceCreamList");

            if (chocolatesList?.getBinding("items")) {
                chocolatesList.getBinding("items").filter([chocolatesFilter]);
            }

            if (iceCreamList?.getBinding("items")) {
                iceCreamList.getBinding("items").filter([iceCreamFilter]);
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
