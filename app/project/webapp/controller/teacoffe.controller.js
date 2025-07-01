sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/MessageToast",
    "sap/m/Text",
    "sap/m/VBox",
    "sap/m/MessageBox"
], function (Controller, JSONModel, Filter, MessageToast, Text, VBox) {
    "use strict";

    return Controller.extend("project.controller.teacoffe", {
        onInit: function () {

            jQuery.sap.includeStyleSheet("project/css/style.css");

            var oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel);
            this.getView().setModel(new sap.ui.model.json.JSONModel({ results: [] }), "searchModel");

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
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
            this.getOwnerComponent().onSearch(sQuery, this.getView());
        },
        
        onAddToCart: function (oEvent) {
            var itemContext = oEvent.getSource().getBindingContext();
            var itemData = itemContext.getObject();
            this.getOwnerComponent().onAddToCart(itemData);
        },
        
        onPlaceOrder: function () {
            this.getOwnerComponent().onPlaceOrder(this.getView());
        },        
      onProfilePress: function () {
            this.getOwnerComponent().onProfilePress(this.getView());
        },
        onLoginPress: function () {
            this.getOwnerComponent().onLoginPress(this.getView());
        },
        
        onRegister: function () {
            this.getOwnerComponent().onRegister(this.getView());
        },
        
        onToggleForm: function () {
            this.getOwnerComponent().onToggleForm(this.getView());
        },
        
        onForgotPasswordPress: function () {
            this.getOwnerComponent().onForgotPasswordPress();
        },
        
        onToggleLoginPasswordVisibility: function () {
            this.getOwnerComponent().onToggleLoginPasswordVisibility(this.getView());
        },
        
        onToggleRegisterPasswordVisibility: function () {
            this.getOwnerComponent().onToggleRegisterPasswordVisibility(this.getView());
        },
        
        onToggleConfirmPasswordVisibility: function () {
            this.getOwnerComponent().onToggleConfirmPasswordVisibility(this.getView());
        },
        
        onCloseLoginDialog: function () {
            this.getOwnerComponent().onCloseLoginDialog(this.getView());
        },
        onCartPress: function () {
            this.getOwnerComponent().onCartPress(this.getView());
        },
        
        onCloseCart: function () {
            this.getOwnerComponent().onCloseCart(this.getView());
        },
        
        updateCartDisplay: function () {
            this.getOwnerComponent().updateCartDisplay(this.getView());
        }
        
    });
});
