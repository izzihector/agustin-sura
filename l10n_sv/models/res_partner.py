from odoo import api, models, fields


class ResPartner(models.Model):

    _inherit = "res.partner"
    dui = fields.Char(string="DUI", help="Documento unico de identidad")
    nit = fields.Char(string="NIT", help="Número de identificación tributario")
    nrc = fields.Char(string="NRC", help="Número de registro comercial")
    giro = fields.Char(string="Giro", help="Giro")
    color = fields.Integer(string="Color Index")

    residual = fields.Float(string="Saldo", compute='compute_residual')

    credit_limit = fields.Float(string="Límite de crédito")

    @api.model
    def compute_residual(self):
        for partner in self:
            partner.residual = 0
            for invoice in partner.invoice_ids:
                partner.residual += invoice.residual_signed
