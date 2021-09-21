from odoo import api, models, fields, exceptions

class Resolution(models.Model):
    _name = "l10n_vat_books_sv.resolution"
    journal = fields.Many2one('account.journal', string="Diario de facturación")
    res_from = fields.Char(string="Resolución desde")
    res_to = fields.Char(string="Resolución hasta")

