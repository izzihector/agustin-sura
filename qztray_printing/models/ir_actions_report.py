import base64
from odoo import api, models, fields, exceptions

class IrActionsReport(models.Model):
  _inherit = 'ir.actions.report'

  jasper_report_action = fields.Selection([
    ('default', 'Por defecto'),
    ('qztray', 'QZ Tray')
  ], default='default', required=False)

  jasper_report_printer_name = fields.Char(string='Impresora')

  jasper_report_height = fields.Float(string="Alto de página (mm)")
  jasper_report_width = fields.Float(string="Ancho de página (mm)")
  jasper_report_margin_top = fields.Float(string="Margen superior (mm)")
  jasper_report_margin_bottom = fields.Float(string="Margen inferior (mm)")
  jasper_report_margin_left = fields.Float(string="Margen izquierdo (mm)")
  jasper_report_margin_right = fields.Float(string="Margen derecho (mm)")

  @api.multi
  def behaviour(self):
    self.ensure_one()
    result = {
      'action': self.jasper_report_action,
      'printer': {
        'name': self.jasper_report_printer_name
      },
      'options': {
        'size': {
          'height': self.jasper_report_height,
          'width': self.jasper_report_width
        },
        'margins': {
          'top': self.jasper_report_margin_top,
          'bottom': self.jasper_report_margin_bottom,
          'right': self.jasper_report_margin_right,
          'left': self.jasper_report_margin_left
        }
      }
    }

    return result

  @api.model
  def print_action_for_report_name(self, report_name):
    """ Returns if the action is a direct print or pdf

    Called from js
    """
    report = self._get_report_from_name(report_name)
    if not report:
      return {}
    result = report.behaviour()
    serializable_result = {
      'action': result['action'],
      'printer_name': result['printer']['name'],
      'options': result['options']
    }
    return serializable_result

  @api.multi
  def print_document(self, record_ids, data=None):
    document, doc_format = self.with_context(
            must_skip_send_to_printer=True).render_qweb_pdf(
                record_ids, data=data)
    return {
      'document': base64.b64encode(document).decode('ascii')
    }

  @api.noguess
  def report_action(self, docids, data=None, config=True):
    res = super().report_action(docids, data=data, config=config)
    if not res.get('id'):
      res['id'] = self.id
    return res
