from odoo import api, models, fields

class AccountInvoiceWizard(models.TransientModel):
    _name = 'account.invoice.wizard'
    _description = 'Agrupando las lineas de ventas'

    invoice_id = fields.Many2one('account.invoice', string="Factura")