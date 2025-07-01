sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast",
  "sap/m/Text",
  "sap/m/VBox",
  "sap/m/MessageBox"

], (Controller, Fragment) => {
  "use strict";

  return Controller.extend("project.controller.View1", {
    onInit() {

      this.oModel = this.getOwnerComponent().getModel();
      this.getView().setModel(new sap.ui.model.json.JSONModel({ results: [] }), "searchModel");

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
          placement: sap.m.PlacementType.Bottom,
          class: "customActionSheet"
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

    onToggleConfirmPasswordVisibility: function () {
      this.getOwnerComponent().onToggleConfirmPasswordVisibility(this.getView());
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
    },


    onImagePress1: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("fruitVegetable"); // 'fruitVegetable' is the route name
    },
    onImagePress2: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("attarice"); // 'fruitVegetable' is the route name
    },
    onImagePress3: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("sweet"); // 'fruitVegetable' is the route name
    },
    onImagePress4: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("dairy"); // 'fruitVegetable' is the route name
    },
    onImagePress5: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("packed"); // 'fruitVegetable' is the route name
    },
    onImagePress6: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("cooldrinks"); // 'fruitVegetable' is the route name
    },
    onImagePress7: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("teacoffe"); // 'fruitVegetable' is the route name
    }

  });
});