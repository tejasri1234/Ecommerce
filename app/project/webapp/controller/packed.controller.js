sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/MessageToast",
    "sap/m/Text",
    "sap/m/VBox"
], function (Controller, JSONModel, Filter, MessageToast, Text, VBox) {
    "use strict";

    return Controller.extend("project.controller.packed", {
        onInit: function () {

            jQuery.sap.includeStyleSheet("project/css/style.css");

            var oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel);
            this.getView().setModel(new sap.ui.model.json.JSONModel({ results: [] }), "searchModel");

            var breakfastFilter = new Filter("category/name", "EQ", "Breakfast Instant");
            var noodlesFilter = new Filter("category/name", "EQ", "Instant Noodles");

            var breakfastList = this.getView().byId("breakfastList");
            var noodlesList = this.getView().byId("noodlesList");

            if (breakfastList?.getBinding("items")) {
                breakfastList.getBinding("items").filter([breakfastFilter]);
            }

            if (noodlesList?.getBinding("items")) {
                noodlesList.getBinding("items").filter([noodlesFilter]);
            }
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
                    sap.m.MessageToast.show("Account pressed");
                  }
                })
              ],
              placement: sap.m.PlacementType.Bottom
            });
            this.getView().addDependent(this._oMenuSheet);
          }
          this._oMenuSheet.openBy(oEvent.getSource());
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
      
          onCloseLoginDialog: function () {
            this.getOwnerComponent().onCloseLoginDialog(this.getView());
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
                      
                        console.log("Search results:", oData);
      
                        that.getView().getModel("searchModel").setProperty("/results", oData.results);
                    }
                });
            } else {
                that.getView().getModel("searchModel").setProperty("/results", []);
            }
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
