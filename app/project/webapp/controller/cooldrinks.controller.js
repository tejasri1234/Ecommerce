sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project.controller.cooldrinks", {
        onAfterRendering: function() {
            var view = this.getView(); 
            
            var softDrinksList = view.byId("softDrinksList");
            var fruitJuicesList = view.byId("fruitJuicesList");
        
            var softDrinksFilter = new sap.ui.model.Filter("category/name", "EQ", "Soft Drinks");
            var fruitJuicesFilter = new sap.ui.model.Filter("category/name", "EQ", "Fruit Juices");
        
            if (softDrinksList?.getBinding("items")) {
                softDrinksList.getBinding("items").filter([softDrinksFilter]);
            }
        
            if (fruitJuicesList?.getBinding("items")) {
                fruitJuicesList.getBinding("items").filter([fruitJuicesFilter]);
            }
        }
        
               

    });
})