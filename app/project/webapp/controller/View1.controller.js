sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast",
  "sap/m/Text",
  "sap/m/VBox",
  "sap/m/MessageBox"

], (Controller, Fragment) => {
  "use strict";

  return Controller.extend("project.controller.View1", {
    onInit() {
      var cartModel = new sap.ui.model.json.JSONModel({ items: [] });
      this.getView().setModel(cartModel, "cartModel");

    },
    onProfilePress: function () {
      var oView = this.getView();
      if (!this._oLoginDialog) {
        sap.ui.core.Fragment.load({
          name: "project.view.LoginRegisterDialog",
          controller: this
        }).then(function (oDialog) {
          oView.addDependent(oDialog);
          this._oLoginDialog = oDialog;
          oDialog.open();
        }.bind(this));
      } else {
        this._oLoginDialog.open();
      }
    },

    onToggleForm: function () {
      var oDialog = this._oLoginDialog;
      if (!oDialog) {
        sap.m.MessageBox.error("Dialog not open.");
        return;
      }
      // The first content is the VBox (loginBox), its items are [loginForm, registerForm]
      var aForms = oDialog.getContent()[0].getItems();
      var oLoginForm = aForms[0];
      var oRegisterForm = aForms[1];
      if (!oLoginForm || !oRegisterForm) {
        sap.m.MessageBox.error("Form controls not found.");
        return;
      }
      var bLoginVisible = oLoginForm.getVisible();
      oLoginForm.setVisible(!bLoginVisible);
      oRegisterForm.setVisible(bLoginVisible);
    },

    onLoginPress: function () {
      var oDialog = this._oLoginDialog;
      if (!oDialog) {
        sap.m.MessageBox.error("Dialog not open.");
        return;
      }
      // Get the login form VBox (first item in dialog content)
      var oLoginBox = oDialog.getContent()[0].getItems()[0];
      // Find the email and password Input controls by their order in the VBox
      var aLoginItems = oLoginBox.getItems();
      var oEmailInput = aLoginItems.find(function (oControl) {
        return oControl.getMetadata().getName() === "sap.m.Input" && oControl.getType() === "Email";
      });
      var oPasswordInput = aLoginItems.find(function (oControl) {
        return oControl.getMetadata().getName() === "sap.m.Input" && oControl.getType() === "Password";
      });

      if (!oEmailInput || !oPasswordInput) {
        sap.m.MessageBox.error("Login controls not found. Please try again.");
        return;
      }

      var email = oEmailInput.getValue();
      var password = oPasswordInput.getValue();

      if (!email || !password) {
        sap.m.MessageBox.warning("Please enter both email and password.");
        return;
      }

      // Dummy authentication logic
      if (email === "user@example.com" && password === "password") {
        sap.m.MessageToast.show("Login successful!");
        oDialog.close();
      } else {
        sap.m.MessageBox.error("Invalid email or password.");
      }
    },

    onRegister: function () {
      var fullName = this.byId("fullName").getValue();
      var email = this.byId("registerEmail").getValue();
      var mobile = this.byId("mobileNumber").getValue();
      var username = this.byId("username").getValue();
      var password = this.byId("registerPassword").getValue();
      var confirmPassword = this.byId("confirmPassword").getValue();
      var termsAccepted = this.byId("terms").getSelected();

      if (!fullName || !email || !mobile || !username || !password || !confirmPassword) {
        sap.m.MessageBox.warning("Please fill in all required fields.");
        return;
      }
      if (password !== confirmPassword) {
        sap.m.MessageBox.error("Passwords do not match.");
        return;
      }
      if (!termsAccepted) {
        sap.m.MessageBox.warning("You must agree to the Terms & Conditions.");
        return;
      }

      sap.m.MessageToast.show("Registration successful! You can now log in.");
      this.onToggleForm();
    },

    onForgotPasswordPress: function () {
      sap.m.MessageBox.information("Password reset functionality is not implemented in this demo.");
    },

    onToggleLoginPasswordVisibility: function () {
      var oInput = this.byId("passwordInput");
      if (oInput) {
        oInput.setType(oInput.getType() === "Password" ? "Text" : "Password");
      }
    },

    onToggleRegisterPasswordVisibility: function () {
      var oInput = this.byId("registerPassword");
      if (oInput) {
        oInput.setType(oInput.getType() === "Password" ? "Text" : "Password");
      }
    },

    onToggleConfirmPasswordVisibility: function () {
      var oInput = this.byId("confirmPassword");
      if (oInput) {
        oInput.setType(oInput.getType() === "Password" ? "Text" : "Password");
      }
    },
    onCloseLoginDialog: function () {
      if (this._oLoginDialog) {
        this._oLoginDialog.close();
      }
    },


    onImagePress1: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("fruitVegetable"); // 'fruitVegetable' is the route name
    },
    onImagePress2: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("attarice"); // 'fruitVegetable' is the route name
    },
    onImagePress3: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("sweet"); // 'fruitVegetable' is the route name
    },
    onImagePress4: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("dairy"); // 'fruitVegetable' is the route name
    },
    onImagePress5: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("packed"); // 'fruitVegetable' is the route name
    },
    onImagePress6: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("cooldrinks"); // 'fruitVegetable' is the route name
    },
    onImagePress7: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("teacoffe"); // 'fruitVegetable' is the route name
    },
    updateCartDisplay: function () {
      var view = this.getView();
      var cartItemsContainer = view.byId("cartItemsContainer");
      var totalPriceText = view.byId("totalPriceText");

      cartItemsContainer.removeAllItems();

      var cartModel = this.getOwnerComponent().getModel("cartModel");
      var cartData = cartModel.getData();

      let total = 0;

      cartData.items.forEach((item, index) => {
        total += item.price * item.quantity;

        var quantityBox = new sap.m.HBox({
          items: [
            new sap.m.Button({
              icon: "sap-icon://less",
              type: "Transparent",
              press: () => {
                if (item.quantity > 1) {
                  item.quantity -= 1;
                } else {
                  cartData.items.splice(index, 1);
                }
                cartModel.setProperty("/items", cartData.items);
                this.updateCartDisplay();
              }
            }),
            new sap.m.Text({ text: item.quantity.toString() }).addStyleClass("cartItemQuantity"),
            new sap.m.Button({
              icon: "sap-icon://add",
              type: "Transparent",
              press: () => {
                item.quantity += 1;
                cartModel.setProperty("/items", cartData.items);
                this.updateCartDisplay();
              }
            })
          ],
          alignItems: "Center",
          justifyContent: "Center"
        }).addStyleClass("quantityControlBox");

        var itemBox = new sap.m.VBox({
          items: [
            new sap.m.Text({ text: item.name }).addStyleClass("cartItemName"),
            quantityBox,
            new sap.m.Text({ text: "Price: ₹" + item.price }).addStyleClass("cartItemPrice")
          ]
        }).addStyleClass("cartItemBox");

        cartItemsContainer.addItem(itemBox);
      });

      totalPriceText.setText("Total: ₹" + total.toFixed(2));
    },

    onCartPress: function () {
      var view = this.getView();
      var cartPanel = view.byId("cartPanel");

      cartPanel.setVisible(!cartPanel.getVisible());
      this.updateCartDisplay();
    },

    onCloseCart: function () {
      var cartPanel = this.getView().byId("cartPanel");
      if (cartPanel) {
        cartPanel.setVisible(false);
      }
    }






  });
});