sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project.controller.View1", {
        onInit() {
        },

        onProfilePress: function () {
            var oView = this.getView();
          
            // Create label
            var oLabel = new sap.m.Label({
              text: "Enter Mobile Number",
              labelFor: "mobileInput"
            });
            oLabel.addStyleClass("customLabel");
          
            // Create input field
            var oInput = new sap.m.Input({
              id: "mobileInput",
              liveChange: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var isValid = /^\d{10}$/.test(sValue);
                oContinueBtn.setEnabled(isValid);
              }
            });
          
            // Create Continue button
            var oContinueBtn = new sap.m.Button({
              text: "Continue",
              enabled: false,
              type: "Emphasized",
              press: function () {
                var sNumber = oInput.getValue();
                sap.m.MessageToast.show("Number entered: " + sNumber);
                oDialog.close();
              }
            });
          
            // Create Close button
            var oCloseBtn = new sap.m.Button({
              text: "Close",
              press: function () {
                oDialog.close();
              }
            });
          
            // VBox to center label and input
            var oVBox = new sap.m.VBox({
              alignItems: "Center",
              justifyContent: "Center",
              items: [oLabel, oInput],
              width: "100%",
              height: "100%"
            });
          
            // Create dialog
            var oDialog = new sap.m.Dialog({
              title: "Login",
              content: [oVBox],
              contentHeight: "100px",
              contentWidth: "300px",
              beginButton: oContinueBtn,
              endButton: oCloseBtn,
              afterClose: function () {
                oDialog.destroy();
              }
            });
          
            oDialog.open();
          }
          



    });
});