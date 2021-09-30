from odoo import fields, models


class AccountInvoiceSummary(models.TransientModel):
    _name = "account.invoice.summary"
    _description = "Account Invoice Summary"

    start = fields.Date(
        required=True,
    )
    
    end = fields.Date(
        required=True,
    )
   
    

    def generate(self):
        report = self.env.ref("payment_method.invoice_summary_report")
        return report.report_action(self)

    def get_invoices(self):
        invoices = self.env["account.payment"].search(
            [
                ("payment_type", "=", "inbound"),
                ("state", "=", "posted"),
                ("payment_date", ">=", self.start),
                ("payment_date", "<=", self.end),
                ("communication", "not ilike","Main"),
                
            ]
        )

        return invoices

    def get_payments(self):
        invoices = self.env["account.invoice"].search(
            [
                ("type", "=", "out_invoice"),
                ("state", "in", ("open", "paid")),
                ("date_invoice", ">=", self.start),
                ("date_invoice", "<=", self.end),
                ("pos_order_id", "=", False),
            ]
        )


        return invoices

    def get_summary(self):
        invoices = self.get_payments()
        payments = invoices.mapped("payment_ids")
        payment_methods = payments.mapped("journal_id")
        summary = [
            (
                method,
                sum(
                    payment.amount
                    for payment in payments.filtered(lambda p: p.journal_id == method)
                ),
            )
            for method in payment_methods
        ]
        return summary
