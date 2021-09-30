from odoo import fields, models, api


class ResPartner(models.Model):
    _inherit ="res.partner"

    journal_id=fields.Many2one("account.journal",string="Diario")

class AccountInvoice(models.Model):
    _inherit="account.invoice"

 

    journal_id=fields.Many2one("account.journal", related="partner_id.journal_id")

    
    


    
