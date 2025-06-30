sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",

], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("project.controller.Orders", {
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(this.oModel)
            var oModel = this.getView().getModel();
            oModel.read("/OrderItem", {
                success: function (oData) {
                    const jsonModel = new sap.ui.model.json.JSONModel({ orders: oData.results });
                    console.log(jsonModel)
                    this.getView().setModel(jsonModel, "ordersModel");
                }.bind(this),
                error: function () {
                    sap.m.MessageToast.show("Failed to load orders.");
                }
            });
        }
        
        
    });
});
