sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project.controller.dairy", {
        onAfterRendering: function () {
            var view = this.getView(); 

            var dairyEggsList = view.byId("dairyEggsList");
            var breadsList = view.byId("breadsList");



            var dairyEggsFilter = new sap.ui.model.Filter("category/name", "EQ", "Dairy & Eggs");                
            var breadsFilter = new sap.ui.model.Filter("category/name", "EQ", "Breads");

            if (dairyEggsList?.getBinding("items")) {
                dairyEggsList.getBinding("items").filter([dairyEggsFilter]);
            }

            if (breadsList?.getBinding("items")) {
                breadsList.getBinding("items").filter([breadsFilter]);
            }

        }


    });
})