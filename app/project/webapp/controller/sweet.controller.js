sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project.controller.sweet", {
        onAfterRendering: function() {
            var view = this.getView(); 

            var chocolatesList = view.byId("chocolatesList");
            var iceCreamList = view.byId("iceCreamList");

            var chocolatesFilter = new sap.ui.model.Filter("category/name", "EQ", "Chocolates & Sweets");
            var iceCreamFilter = new sap.ui.model.Filter("category/name", "EQ", "Ice Creams");
            // Check if bindings exist before filtering

            if (chocolatesList && chocolatesList.getBinding("items")) {
                chocolatesList.getBinding("items").filter([chocolatesFilter]);
            }

            if (iceCreamList && iceCreamList.getBinding("items")) {
                iceCreamList.getBinding("items").filter([iceCreamFilter]);
            }

        }


    });
})