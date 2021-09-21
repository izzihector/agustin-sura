from odoo import models, fields, api, _
from odoo.exceptions import UserError

class SaleOrderLine(models.Model):
    _inherit = "sale.order.line"

    commission_id = fields.Many2one('sale.commission', 'Comision del vendedor', required=False)

    amount_commission = fields.Float(
        string='Monto de la comision',
        compute="_compute_commission_total",
        store=True,
    )

    @api.depends('commission_id')
    def _compute_commission_total(self):
        for record in self:
            price_unit = record.product_id.lst_price / (1 - record.commission_id.amount)
            record.amount_commission = round((record.product_uom_qty * price_unit) - (record.product_uom_qty * record.product_id.lst_price), 2)
    
    @api.multi
    @api.onchange('commission_id')
    def _compute_price_unit_with_commission(self):
        if self.commission_id:
            self.price_unit = self.product_id.lst_price / (1 - self.commission_id.amount)
        else:
            self.price_unit = self.product_id.lst_price
            self.amount_commission = 0
