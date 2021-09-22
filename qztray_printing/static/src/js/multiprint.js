odoo.define("qztray_printing.multiprint", function (require) {
  "use strict";
  var models = require("point_of_sale.models");
  var core = require("web.core");

  var QWeb = core.qweb;

  models.Order = models.Order.extend({
    printChanges: function () {
      var printers = this.pos.printers;
      var cashier = this.pos.get_cashier();
      for (var i = 0; i < printers.length; i++) {
        var changes = this.computeChanges(
          printers[i].config.product_categories_ids
        );
        changes.cashier_name = cashier?.name;
        if (changes["new"].length > 0 || changes["cancelled"].length > 0) {
          (function (_changes, _i) {
            var receipt = QWeb.render("Comandas", {
              changes: _changes,
              widget: this,
            });
            const name = printers[_i].config.name;
            qz.printers
              .find(name)
              .then(function (printer) {
                var config = qz.configs.create(printer); // Create a default config for the found printer
                var data = [
                  {
                    type: "html",
                    format: "plain", // or 'plain' if the data is raw HTML
                    data: receipt,
                    options: { pageWidth: 3 },
                  },
                ];
                return qz.print(config, data);
              })
              .catch(function (e) {
                console.error(e);
              });
          })(changes, i);
        }
      }
    },
  });
});
