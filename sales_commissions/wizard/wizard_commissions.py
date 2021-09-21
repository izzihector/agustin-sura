# -*- coding: utf-8 -*-
# Autor: Carlos Morán
# Fecha: 30/oct./2019
from odoo import models, fields, api, exceptions
from datetime import datetime
import calendar

class SaleCommissionReportWizard(models.TransientModel):
    _name = 'sale.commission.report.wizard'
    _description = 'Formulario de generación de reporte de comisiones'

    date_from = fields.Date(
        string='Fecha de inicio',
        default=lambda self: datetime.today().replace(day=1).__str__()[0:10] # first day of month
    )
    date_to = fields.Date(
        string='Fecha final',
        default=lambda self: datetime.today().replace(day=calendar.monthrange(datetime.today().year, datetime.today().month)[1]).__str__()[0:10], # last day of month
    )
    user_ids = fields.Many2many('res.users', string='Vendedores')
    @api.multi
    def generate_commission_report(self):
        for wizard in self:
            date_from = self.odoo_date_to_datetime(self.date_from)
            date_to = self.odoo_date_to_datetime(self.date_to)
            data = {
                    'ids': self.ids,
                    'model': self._name,
                    'form': {
                        'date_from': self.date_from,
                        'date_to': self.date_to,
                        'user_ids': self.user_ids.ids
                    },
                }
            return self.env.ref('sales_commissions.sale_commision_report').report_action(self, data=data)
        # end for
    # end funct

    def odoo_date_to_datetime(self, date=None):
        if date != None:
            return datetime.strptime(date,'%Y-%m-%d')
