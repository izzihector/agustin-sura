# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.exceptions import UserError

class l10_financial_report(models.Model):
    _inherit = 'account.financial.report'

    type = fields.Selection(selection_add=[
        ('text', 'Texto'),
        ('initial_balance', 'Balance inicial'),
        ('final_balance', 'Balance final'),
        ('debit', 'Debito'),
        ('credit', 'Credito'),
    ])
#     value2 = fields.Float(compute="_value_pc", store=True)
#     description = fields.Text()
#
#     @api.depends('value')
#     def _value_pc(self):
#         self.value2 = float(self.value) / 100