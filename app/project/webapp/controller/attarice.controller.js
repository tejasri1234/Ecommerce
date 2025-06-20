sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project.controller.attarice", {
        onAfterRendering: function () {
            var grainsList = this.getView().byId("grainsList");
            var essentialsList = this.getView().byId("essentialsList");
        
            var grainsFilter = new sap.ui.model.Filter("category/name", "EQ", "Grains");
            var essentialsFilter = new sap.ui.model.Filter("category/name", "EQ", "Essentials");
        
            if (grainsList && grainsList.getBinding("items")) {
                grainsList.getBinding("items").filter([grainsFilter]);
            }
        
            if (essentialsList && essentialsList.getBinding("items")) {
                essentialsList.getBinding("items").filter([essentialsFilter]);
            }
        }
        



    });
})