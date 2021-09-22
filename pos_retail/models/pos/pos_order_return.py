from odoo import api, fields, models

class pos_order_return(models.Model):
    _name = "pos.order.return"
    _description = "Pos Order Return"
    amount_paid = fields.Float()
    amount_return = fields.Float()
    amount_total = fields.Float()
    invoice_id = fields.Many2one('account.invoice', 'Account Invoice')
