sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",

], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("project.controller.Orders", {
      onInit: function () {
        
        var oUserModel = this.getOwnerComponent().getModel("userModel");
 
        var userId = oUserModel.getProperty("/userId");
 
    
        if (!oUserModel || !oUserModel.getProperty("/userId")) {
            sap.m.MessageBox.warning("Please log in to view your orders.");
            return;
        }
    
        var ordersModel = this.getOwnerComponent().getModel("ordersModel");
        console.log(ordersModel.getData());
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
  onMenuPress: function (oEvent) {
    if (!this._oMenuSheet) {
      this._oMenuSheet = new sap.m.ActionSheet({
        buttons: [
          new sap.m.Button({
            text: "My Orders",
            icon: "sap-icon://order-status",
            press: () => {
              const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
              oRouter.navTo("Orders"); // Ensure route name matches manifest.json
            }
          }),
          new sap.m.Button({
            text: "Account",
            icon: "sap-icon://account",
            press: () => {               
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("account");
            }
          })
        ],
        placement: sap.m.PlacementType.Bottom,
        class: "customActionSheet"
      });
      this.getView().addDependent(this._oMenuSheet);
    }
    this._oMenuSheet.openBy(oEvent.getSource());
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
      
       
          onCloseLoginDialog: function () {
            this.getOwnerComponent().onCloseLoginDialog(this.getView());
          },
         
        
        
    });
});
