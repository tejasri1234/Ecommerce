sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project.controller.teacoffe", {
        onAfterRendering: function() {
            var view = this.getView(); 
        
            var teaList = view.byId("teaList");
            var coffeeList = view.byId("coffeeList");
        
            var teaFilter = new sap.ui.model.Filter("category/name", "EQ", "Tea");
            var coffeeFilter = new sap.ui.model.Filter("category/name", "EQ", "Coffee");
        
            if (teaList?.getBinding("items")) {
                teaList.getBinding("items").filter([teaFilter]);
            }
        
            if (coffeeList?.getBinding("items")) {
                coffeeList.getBinding("items").filter([coffeeFilter]);
            }
        }
          

    });
})