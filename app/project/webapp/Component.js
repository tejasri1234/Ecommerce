sap.ui.define([
    "sap/ui/core/UIComponent",
    "project/model/models",
    "sap/ui/model/odata/v2/ODataModel"
], (UIComponent, models,ODataModel) => {
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
            
            var url = "/odata/v2/catalog/"; // Your OData service root
            var oModel = new ODataModel(url, { json: true });
            this.setModel(oModel);
        
            // Enable routing
            this.getRouter().initialize();
        }
        
    });
});