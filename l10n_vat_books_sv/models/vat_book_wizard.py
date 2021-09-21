# -*- coding: utf-8 -*-
# Autor: Carlos Morán
# Fecha: 30/oct./2019
from odoo import models, fields, api, exceptions
from datetime import datetime
import calendar

class VatBookWizard(models.TransientModel):
    _name = 'l10n_vat_books_sv.wizard'
    _description = 'Formulario de generación de libros de IVA'

    report_type = fields.Selection(
        selection=[
            ('customer', 'Libro de ventas a consumidores finales'),
            ('taxpayer', 'Libro de ventas a contribuyentes'),
            ('vendor', 'Libro de compras')
        ],
        string = 'Tipo de reporte',
        default='customer'
    )
    date_from = fields.Date(
        string='Fecha de inicio',
        default=lambda self: datetime.today().replace(day=1).__str__()[0:10] # first day of month
    )
    date_to = fields.Date(
        string='Fecha final',
        default=lambda self: datetime.today().replace(day=calendar.monthrange(datetime.today().year, datetime.today().month)[1]).__str__()[0:10], # last day of month
        compute='_on_date_from_change'
    )
    journal_ids = fields.Many2many('account.journal', String='Diarios')

    @api.multi
    def generate_vat_book(self):
        for wizard in self:
            date_from = self.odoo_date_to_datetime(self.date_from)
            date_to = self.odoo_date_to_datetime(self.date_to)
            if(date_from.month != date_to.month or date_from.year != date_to.year):
                raise exceptions.ValidationError("Ambas fechas deben pertenecer al mismo periodo contable")
            else:
                data = {
                    'ids': self.ids,
                    'model': self._name,
                    'form': {
                        'date_from': self.date_from,
                        'date_to': self.date_to,
                        'journal_ids': self.journal_ids.ids
                    },
                }
                if self.report_type == 'customer':
                    return self.env.ref('l10n_vat_books_sv.customer_vat_book_report').report_action(self, data=data)
                elif self.report_type == 'taxpayer':
                    return self.env.ref('l10n_vat_books_sv.taxpayer_vat_book_report').report_action(self, data=data)
                elif self.report_type == 'vendor':
                    return self.env.ref('l10n_vat_books_sv.vendor_vat_book_report').report_action(self, data=data)


    @api.depends('date_from')
    def _on_date_from_change(self):
        for wizard in self:
            date_from = self.odoo_date_to_datetime(self.date_from)
            self.date_to = date_from.replace(day=calendar.monthrange(date_from.year, date_from.month)[1]).__str__()[0:10] # last day of month



    def odoo_date_to_datetime(self, date=None):
        if date != None:
            return datetime.strptime(date,'%Y-%m-%d')
