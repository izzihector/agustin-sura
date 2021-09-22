odoo.define('qztray_printing.print', function (require) {
  'use strict';

  var ActionManager = require('web.ActionManager');
  var core = require('web.core');
  var framework = require('web.framework');
  var rpc = require('web.rpc');

  ActionManager.include({
      ir_actions_report: function (action, options) {
          var action_val = _.clone(action);
          var _t = core._t;
          var self = this;
          var _super = this._super;

          if (action_val.report_type === 'qweb-pdf') {
              framework.blockUI();
              rpc.query({
                  model: 'ir.actions.report',
                  method: 'print_action_for_report_name',
                  args: [action_val.report_name]
              }).then(function (print_action) {
                  if (print_action && print_action.action === 'qztray') {
                    console.log(print_action);
                      framework.unblockUI();
                      rpc.query({
                          model: 'ir.actions.report',
                          method: 'print_document',
                          args: [action_val.id, action_val.context.active_ids],
                          kwargs: {data: action_val.data || {}},
                          context: action_val.context || {}
                      }).then(function (result) {
                          var config = qz.configs.create(print_action.printer_name, {
                              size: {
                                  width: print_action?.options?.size?.width,
                                  height: print_action?.options?.size?.height
                              },
                              units: 'mm',
                              margins: {
                                  ...print_action?.options?.margins
                              }
                          });
                          var data = [{
                            type: 'pdf',
                            format: 'base64',
                            data: result.document
                          }];
                          qz.print(config, data).catch(function(e){ 
                            self.do_notify(_t('Report'),
                              _.str.sprintf(_t('Error when sending the document to the printer '), print_action.printer_name));
                            console.log(e);
                           });
                          self.do_notify(_t('Report'),
                              _.str.sprintf(_t('Document sent to the printer %s'), print_action.printer_name));
                      }).fail(function () {
                          self.do_notify(_t('Report'),
                              _.str.sprintf(_t('Error when sending the document to the printer '), print_action.printer_name));

                      });
                  } else {
                      return _super.apply(self, [action_val, options]);
                  }
              });
          } else {
              return _super.apply(self, [action_val, options]);
          }
      }
  });
});