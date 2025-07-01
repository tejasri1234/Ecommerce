sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",

], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("project.controller.Orders", {
      onInit: function () {
        this.getView().setModel(new sap.ui.model.json.JSONModel({ results: [] }), "searchModel");
        var oUserModel = this.getOwnerComponent().getModel("userModel");
 
        var userId = oUserModel.getProperty("/userId");
 
    
        if (!oUserModel || !oUserModel.getProperty("/userId")) {
            sap.m.MessageBox.warning("Please log in to view your orders.");
            return;
        }
    
        var ordersModel = this.getOwnerComponent().getModel("ordersModel");
        if (ordersModel) {
            this.getView().setModel(ordersModel, "ordersModel");
        } else {
            sap.m.MessageToast.show("No orders found.");
        }
    }
    
    ,
    onRefreshOrders: function () {
      this.getOwnerComponent().loadOrdersForUser();
      var ordersModel = this.getOwnerComponent().getModel("ordersModel");
      this.getView().setModel(ordersModel, "ordersModel");
  },
  
    
    

        onLoginPress: function () {
          this.getOwnerComponent().onLoginPress(this.getView());
        },
        onProfilePress: function () {
            this.getOwnerComponent().onProfilePress(this.getView());
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
        
        
    });
});
