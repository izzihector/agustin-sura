odoo.define("report_xml.report.qztray", function (require) {
  "use strict";

  var ActionManager = require("web.ActionManager");
  var framework = require("web.framework");
  var rpc = require('web.rpc');

  ActionManager.include({
    ir_actions_report: function (action, options) {
      var self = this;
      var cloned_action = _.clone(action);
      rpc.query({
        model: 'ir.actions.report',
        method: 'print_action_for_report_name',
        args: [cloned_action.report_name]
      }).then(result => {
        if (cloned_action.report_type === "jasper") {
          if (result?.action === 'qztray') {
            framework.blockUI();
          var report_jasper_url = "report/jasper/" + cloned_action.report_name;
          if (cloned_action.context.active_ids) {
            report_jasper_url += "/" + cloned_action.context.active_ids.join(",");
          } else {
            report_jasper_url +=
              "?options=" +
              encodeURIComponent(JSON.stringify(cloned_action.data));
            report_jasper_url +=
              "&context=" +
              encodeURIComponent(JSON.stringify(cloned_action.context));
          }
          fetch(report_jasper_url)
            .then((response) => response.body)
            .then((body) => {
              const reader = body.getReader();
              return new ReadableStream({
                start(controller) {
                  return pump();
                  function pump() {
                    return reader.read().then(({ done, value }) => {
                      // When no more data needs to be consumed, close the stream
                      if (done) {
                        controller.close();
                        return;
                      }
                      // Enqueue the next data chunk into our target stream
                      controller.enqueue(value);
                      return pump();
                    });
                  }
                },
              });
            })
            .then((stream) => new Response(stream))
            .then((response) => response.blob())
            .then((blob) => {
              var reader = new window.FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = function () {
                   const base64data = reader.result.split(',')[1];
                   var config = qz.configs.create(result?.printer_name, {
                      ...result?.options,
                      units: 'mm',
                  });
                  var data = [{
                    type: 'pdf',
                    format: 'base64',
                    data: base64data
                  }];
                  qz.print(config, data).catch(function(e){ 
                    self.do_notify(_t('Report'),
                      _.str.sprintf(_t('Error when sending the document to the printer '), "POS-80"));
                    console.log(e);
                   });
              }
              console.log(result);
            })
            .catch((err) => console.error(err));
  
            framework.unblockUI();
          }
        }
      });
      return self._super(action, options);
    },
  });
});
