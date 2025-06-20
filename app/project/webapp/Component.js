sap.ui.define([
    "sap/ui/core/UIComponent",
    "project/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("project.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init: function () {
            // Call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
        
            // Set the device model
            this.setModel(models.createDeviceModel(), "device");
        
            // Create and set global cart model
            var cartModel = new sap.ui.model.json.JSONModel({ items: [] });
            this.setModel(cartModel, "cartModel");
        
            // Enable routing
            this.getRouter().initialize();
        }
        
    });
});