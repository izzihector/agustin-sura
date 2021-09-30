from odoo import models, fields, _

class SaleOrder(models.Model):
    _inherit = 'sale.order'

    def action_confirm(self):
        
        for sale in self:
            for line in sale.order_line:
                if line.price_unit < line.product_id.minimum_list_price:
                    line.price_unit = line.product_id.minimum_list_price          
        
        res = super(SaleOrder, self).action_confirm()
        return res