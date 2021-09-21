from odoo import models, fields, api, _

class SaveAccountChartXMLWizard(models.TransientModel):
    _name = "accounting_chart_to_xml.download_files"

    account_chart = fields.Binary("Plan de cuentas", readonly=True)
    account_group = fields.Binary("Grupo de cuentas", readonly=True)
