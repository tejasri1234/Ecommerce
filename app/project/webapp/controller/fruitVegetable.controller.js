sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project.controller.fruitVegetable", {
        onInit() {
            var oModel = this.getOwnerComponent().getModel(); // OData V4 model
            this.getView().setModel(oModel);
        
            // Apply filters directly
            var fruitFilter = new sap.ui.model.Filter("category/name", "EQ", "Fruit");
            var vegetableFilter = new sap.ui.model.Filter("category/name", "EQ", "Vegetable");
        
            var fruitList = this.getView().byId("fruitList");
            var vegetableList = this.getView().byId("vegetableList");
        
            // Check if bindings exist before filtering
            if (fruitList.getBinding("items")) {
                fruitList.getBinding("items").filter([fruitFilter]);
            }
        
            if (vegetableList.getBinding("items")) {
                vegetableList.getBinding("items").filter([vegetableFilter]);
            }
        }
               

    });
})