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
      var url = "/odata/v2/catalog/"; // Change this to your actual OData service root
      this.oModel = new sap.ui.model.odata.v2.ODataModel(url, { json: true });
      this.getView().setModel(this.oModel);

    },
    onProfilePress: function () {
      var oDialog = this.byId("loginRegisterDialog");
      if (oDialog) {
          oDialog.open();
      } else {
          sap.m.MessageBox.error("Login/Register dialog not found in the view.");
      }
  },

  onToggleForm: function () {
    // Access the login and register forms by their IDs in the view
    var oLoginForm = this.byId("loginForm");
    var oRegisterForm = this.byId("registerForm");

    if (!oLoginForm || !oRegisterForm) {
        sap.m.MessageBox.error("Form controls not found.");
        return;
    }

    var bLoginVisible = oLoginForm.getVisible();
    oLoginForm.setVisible(!bLoginVisible);
    oRegisterForm.setVisible(bLoginVisible);
},

onLoginPress: function () {
  var oView = this.getView();
  var oDialog = oView.byId("loginRegisterDialog");
  if (!oDialog) {
      sap.m.MessageBox.error("Dialog not open.");
      return;
  }

  var oEmailInput = oView.byId("emailInput");
  var oPasswordInput = oView.byId("passwordInput");
  console.log("loginEmail:", oEmailInput, "passwordInput:", oPasswordInput);

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

  this.oModel.read("/Customer", {
      filters: [
          new sap.ui.model.Filter("email", sap.ui.model.FilterOperator.EQ, email),
          new sap.ui.model.Filter("password", sap.ui.model.FilterOperator.EQ, password)
      ],
      success: function (oData) {
          if (oData.results && oData.results.length > 0) {
              sap.m.MessageToast.show("Login successful!");
              oDialog.close();
          } else {
              sap.m.MessageBox.error("Invalid email or password.");
          }
      },
      error: function () {
          sap.m.MessageBox.error("Login failed. Please try again.");
      }
  });
},
    onRegister: function () {
      var oView = this.getView();
  
      var fullName = oView.byId("fullName").getValue();
      var email = oView.byId("registerEmail").getValue();
      var mobile = oView.byId("mobileNumber").getValue();
      var password = oView.byId("registerPassword").getValue();
      var confirmPassword = oView.byId("confirmPassword").getValue();
      var termsAccepted = oView.byId("terms").getSelected();
      var address = oView.byId("address") ? oView.byId("address").getValue() : "";
  
      if (!fullName || !email || !mobile || !password || !confirmPassword) {
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
  
      var oData = {
          name: fullName,
          email: email,
          phone: mobile,
          password: password,
          address: address,
          createdAt: new Date().toISOString()
      };
  
      this.oModel.create("/Customer", oData, {
          success: function () {
              sap.m.MessageBox.success("Registration successful!");
              this.onToggleForm();
              var oDialog = this.byId("loginRegisterDialog");
              if (oDialog) {
                oDialog.close();
            }
  
              // Clear all input fields
              oView.byId("fullName").setValue("");
              oView.byId("registerEmail").setValue("");
              oView.byId("mobileNumber").setValue("");
              oView.byId("registerPassword").setValue("");
              oView.byId("confirmPassword").setValue("");
              oView.byId("terms").setSelected(false);
              if (oView.byId("address")) oView.byId("address").setValue("");
  
              var oUserModel = new sap.ui.model.json.JSONModel({ userId: email });
              oView.getController().getOwnerComponent().setModel(oUserModel, "userModel");
          }.bind(this),
          error: function () {
              sap.m.MessageBox.error("Registration failed. Please try again.");
          }
      });
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
      var oDialog = this.byId("loginRegisterDialog");
      if (oDialog) {
          oDialog.close();
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
      var placeOrderButton = view.byId("placeOrderButton"); // Make sure your Place Order button has this ID

      cartItemsContainer.removeAllItems();

      var cartModel = this.getOwnerComponent().getModel("cartModel");
      var cartData = cartModel.getData();

      let total = 0;

      if (!cartData.items || cartData.items.length === 0) {
        // Cart is empty
        cartItemsContainer.addItem(
          new sap.m.Text({
            text: "Your cart is empty. Browse products to add items!",
            textAlign: "Center"
          }).addStyleClass("cartEmptyText")
        );
        totalPriceText.setText("");
        if (placeOrderButton) {
          placeOrderButton.setVisible(false);
        }
        return;
      }

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
                  if (item.quantity < item.stock) {
                      item.quantity += 1;
                      cartModel.setProperty("/items", cartData.items);
                      this.updateCartDisplay();
                  } else {
                      sap.m.MessageToast.show("Maximum stock reached for " + item.name + "!");
                  }
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
      if (placeOrderButton) {
        placeOrderButton.setVisible(true);
      }
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
    },
    onPlaceOrder: function () {
      sap.m.MessageBox.success(
          "Order placed successfully! Your order will be delivered in 10 minutes.",
          {
              title: "Order Successful"
          }
      );
      var cartModel = this.getOwnerComponent().getModel("cartModel");
      cartModel.setProperty("/items", []); 
      this.onCloseCart();
      this.updateCartDisplay();
  }

  });
});