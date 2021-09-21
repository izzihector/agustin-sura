from odoo import models, fields, _

class SaleCommision(models.Model):
    _name = "sale.commission"
    _description = "Comision por venta"

    name = fields.Char('Nombre', required = True)
    amount = fields.Float('Monto de la comision', digits=(3,4))
