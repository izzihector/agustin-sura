from odoo import fields, models


class Invoice(models.Model):
    _inherit = "res.partner"

    saldo=fields.Float(string="Saldo",compute="summary")
    
    def summary(self):
        for record in self:
            record.invoices = self.env["account.invoice"].search(
                [
                    ("type", "=", "out_invoice"),
                    ("state", "in", ("paid","open")),
                    ("partner_id.name", "=", record.name),
                    
                ]
            )
     
            record.saldo= sum(lines.residual for lines in record.invoices)

        
