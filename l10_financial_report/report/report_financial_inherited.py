from odoo import api, fields, models

class ReportFinancial(models.Model):
	_inherit = "account.financial.report"

	header_type = fields.Selection(selection=[('a', 'A'), ('b', 'B')], string= "Tipo de Header de Reporte")
