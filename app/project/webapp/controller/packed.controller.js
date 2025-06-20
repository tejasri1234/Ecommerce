sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project.controller.packed", {
        onAfterRendering: function() {
            var view = this.getView(); 
        
            var breakfastList = view.byId("breakfastList");
            var noodlesList = view.byId("noodlesList");
        
            var breakfastFilter = new sap.ui.model.Filter("category/name", "EQ", "Breakfast Instant");
            var noodlesFilter = new sap.ui.model.Filter("category/name", "EQ", "Instant Noodles");
        
            if (breakfastList?.getBinding("items")) {
                breakfastList.getBinding("items").filter([breakfastFilter]);
            }
        
            if (noodlesList?.getBinding("items")) {
                noodlesList.getBinding("items").filter([noodlesFilter]);
            }
        }
        
               

    });
})