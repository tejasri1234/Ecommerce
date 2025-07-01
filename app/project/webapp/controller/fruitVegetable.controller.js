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
            this.getView().setModel(new sap.ui.model.json.JSONModel({ results: [] }), "searchModel");
            
      

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
          onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
            this.getOwnerComponent().onSearch(sQuery, this.getView());
          },
          onCartPress: function () {
            this.getOwnerComponent().onCartPress(this.getView());
          },
      
          onCloseCart: function () {
            this.getOwnerComponent().onCloseCart(this.getView());
          },
      
          updateCartDisplay: function () {
            this.getOwnerComponent().updateCartDisplay(this.getView());
          },
      
          onAddToCart: function (oEvent) {
            var itemContext = oEvent.getSource().getBindingContext();
            var itemData = itemContext.getObject();
            this.getOwnerComponent().onAddToCart(itemData);
          },
      
          onPlaceOrder: function () {
            this.getOwnerComponent().onPlaceOrder(this.getView());
          }
    });
});
