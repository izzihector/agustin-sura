from odoo import api, models, fields, exceptions
from decimal import Decimal

class CustomerVatBook(models.AbstractModel):

    """
    Modelo abstracto para la plantilla de reporte l10n_invoice_sv.report_invoice_main_cdp
    """

    _name = 'report.l10n_vat_books_sv.customer_vat_book_report_main'

    @api.model
    def get_report_values(self, docids, data=None):
        # para representar los totales al final del reporte
        locales = Decimal('0.0')
        iva_ret = Decimal('0.0')
        total = Decimal('0.0')

        # facturas del mes
        journal_ids = self.env['account.journal'].search([
            ('id', 'in', data['form']['journal_ids'])
        ])

        invoice_ids = self.env['account.invoice'].search([
            ('date_invoice', '>=', data['form']['date_from']),
            ('date_invoice', '<=', data['form']['date_to']),
            ('journal_id', 'in', journal_ids.ids),
            ('state', 'in', ('open', 'paid')),
            ('refund_invoice_id', '=', False),
        ])

        # anulaciones de facturas del mes, hechas durante el mes
        refund_invoice_ids = self.env['account.invoice'].search_read([
            ('refund_invoice_id', 'in', invoice_ids.ids),
            ('date_invoice', '>=', data['form']['date_from']),
            ('date_invoice', '<=', data['form']['date_to']),
            ('state', 'in', ('open', 'paid')),
        ], order="id asc")
        # anulaciones de facturas de meses anteriores, hechas durante el meses
        old_invoice_ids = self.env['account.invoice'].search([
            ('date_invoice', '<', data['form']['date_from']),
            ('journal_id', 'in', journal_ids.ids),
            ('state', 'in', ('open', 'paid')),
            ('refund_invoice_id', '=', False),
        ])

        refund_old_invoice_ids = self.env['account.invoice'].search_read([
            ('refund_invoice_id', 'in', old_invoice_ids.ids),
            ('journal_id', 'in', journal_ids.ids),
            ('date_invoice', '>=', data['form']['date_from']),
            ('date_invoice', '<=', data['form']['date_to']),
            ('state', 'in', ('open', 'paid')),
        ], order="id asc")

        # facturas de consumidor final

        invoice_ids = self.env['account.invoice'].search_read([
            ('id', 'in', invoice_ids.ids),
        ], order="id asc")

        days = set() # dias en los que hubo movimientos
        vat_book_lines = {} # diccionario que almacena las lineas a mostrar en el libro de iva

        for invoice in invoice_ids:
            days.add(invoice['date_invoice'])
        # end for


        for day in days:

            counter = 0

            vat_book_lines[day] = {
                'from': '',
                'to': '',
                'locales': 0.00,
                'iva_ret': 0.00,
                'total': 0.00,
            }

            for invoice in invoice_ids:
                if invoice['date_invoice'] == day:
                    # facturas al No.
                    if counter == 0:
                        vat_book_lines[day]['from'] = invoice['number']
                        counter = counter + 1
                    # factura del No.
                    vat_book_lines[day]['to'] = invoice['number']
                    if invoice['inv_refund_id'] == False:
                        # agregar el total de la factura al día
                        vat_book_lines[day]['locales'] = vat_book_lines[day]['locales'] + invoice['amount_untaxed']
                        vat_book_lines[day]['total'] = vat_book_lines[day]['total'] + invoice['amount_untaxed']
                        # agregar el iva y la retencion (si hay)
                        ids = invoice['tax_line_ids']
                        tax_line_ids = self.env['account.invoice.tax'].search_read([
                            ('id', 'in', ids),
                        ])
                        # aplicar el iva (si se aplico en la factura)
                        tax_iva = self.env.ref('l10n_sv.tax1')
                        tax_iva_1 = self.env.ref('l10n_sv.1_tax1')
                        tax_ret = self.env.ref('l10n_sv.tax4')
                        tax_ret_1 = self.env.ref('l10n_sv.1_tax4')
                        for tax_line in tax_line_ids:
                            if tax_line['tax_id'][0] == tax_iva.id or tax_line['tax_id'][0] == tax_iva_1.id:
                                vat_book_lines[day]['locales'] = vat_book_lines[day]['locales'] + tax_line['amount']
                                vat_book_lines[day]['total'] = vat_book_lines[day]['total'] + tax_line['amount']
                            elif tax_line['tax_id'][0] == tax_ret.id or tax_line['tax_id'][0] == tax_ret_1.id:
                                vat_book_lines[day]['iva_ret'] = vat_book_lines[day]['iva_ret'] + abs(tax_line['amount'])
                                vat_book_lines[day]['total'] = vat_book_lines[day]['total'] + tax_line['amount']
                            # end if
                        # end for
                    # end if (si las facturas no fueron anuladas)
                # end if
            # end for
        # end for

        # lineas de libro de iva

        vat_book_lines_anulation = {}
        refund_ids = set()
        for invoice in refund_old_invoice_ids:
            refund_ids.add(invoice['id'])
            vat_book_lines_anulation[invoice['id']] = {
                'day': self.env['account.invoice'].search_read([
                    ('id', '=', invoice['refund_invoice_id'][0])
                ])[0]['date_invoice'],
                'from': '',
                'to': '',
                'locales': 0.00,
                'iva_ret': 0.00,
                'total': 0.00,
            }
            vat_book_lines_anulation[invoice['id']]['from'] = invoice['refund_invoice_id'][1]
            # factura del No.
            vat_book_lines_anulation[invoice['id']]['to'] = invoice['refund_invoice_id'][1]
            # agregar el total de la factura al día
            vat_book_lines_anulation[invoice['id']]['locales'] = vat_book_lines_anulation[invoice['id']]['locales'] - invoice['amount_untaxed']
            vat_book_lines_anulation[invoice['id']]['total'] = vat_book_lines_anulation[invoice['id']]['total'] - invoice['amount_untaxed']
            # agregar el iva y la retencion (si hay)
            ids = invoice['tax_line_ids']
            tax_line_ids = self.env['account.invoice.tax'].search_read([
                ('id', 'in', ids),
            ])
            # aplicar el iva (si se aplico en la factura)
            tax_iva = self.env.ref('l10n_sv.tax1')
            tax_iva_1 = self.env.ref('l10n_sv.1_tax1')
            tax_ret = self.env.ref('l10n_sv.tax4')
            tax_ret_1 = self.env.ref('l10n_sv.1_tax4')
            for tax_line in tax_line_ids:
                if tax_line['tax_id'][0] == tax_iva.id or tax_line['tax_id'][0] == tax_iva_1.id:
                    vat_book_lines_anulation[invoice['id']]['locales'] = vat_book_lines_anulation[invoice['id']]['locales'] - tax_line['amount']
                    vat_book_lines_anulation[invoice['id']]['total'] = vat_book_lines_anulation[invoice['id']]['total'] - tax_line['amount']
                elif tax_line['tax_id'][0] == tax_ret.id or tax_line['tax_id'][0] == tax_ret_1.id:
                    vat_book_lines_anulation[invoice['id']]['iva_ret'] = vat_book_lines_anulation[invoice['id']]['iva_ret'] - abs(tax_line['amount'])
                    vat_book_lines_anulation[invoice['id']]['total'] = vat_book_lines_anulation[invoice['id']]['total'] - tax_line['amount']
                # end if
            # end for
        # end for

        # calculando el total de ventas locales
        for day in days:
            locales = locales + Decimal(str(vat_book_lines[day]['locales']))
            iva_ret = iva_ret + Decimal(str(vat_book_lines[day]['iva_ret']))
            total = total + Decimal(str(vat_book_lines[day]['total']))
        for id in refund_ids:
            locales = locales + Decimal(str(vat_book_lines_anulation[id]['locales']))
            iva_ret = iva_ret + Decimal(str(vat_book_lines_anulation[id]['iva_ret']))
            total = total + Decimal(str(vat_book_lines_anulation[id]['total']))
        gravadas = locales / ((Decimal('100.0') + Decimal(str(self.env.ref('l10n_sv.tax1').amount)))/Decimal('100.0'))
        iva = gravadas * (Decimal(str(self.env.ref('l10n_sv.tax1').amount)) / Decimal('100.0'))

        ir_config = self.env['ir.config_parameter'].sudo()
        accountant_id = ir_config.get_param('accountant_id')
        accountant = self.env['hr.employee'].search_read([
            ('id', '=', accountant_id)
        ])[0]
        return {
            'doc_ids': data['ids'],
            'doc_model': data['model'],
            'company': self.env.user.company_id,
            'date_from': data['form']['date_from'],
            'date_to': data['form']['date_to'],
            'month': {
                0:"ENERO",
                1:"FEBRERO",
                2:"MARZO",
                3:"ABRIL",
                4:"MAYO",
                5:"JUNIO",
                6:"JULIO",
                7:"AGOSTO",
                8:"SEPTIEMBRE",
                9:"OCTUBRE",
                10:"NOVIEMBRE",
                11:"DICIEMBRE"
            },
            'vat_book_lines': vat_book_lines,
            'refund_invoice_ids': refund_invoice_ids,
            'refund_ids': refund_ids,
            'vat_book_lines_anulation': vat_book_lines_anulation,
            'locales': '{:.2f}'.format(float(locales)),
            'iva': '{:.2f}'.format(float(iva)),
            'iva_ret': '{:.2f}'.format(iva_ret),
            'total': '{:.2f}'.format(total),
            'gravadas': '{:.2f}'.format(float(gravadas)),
            'days': days,
            'exportaciones': '0.00',
            'accountant': accountant['name']
        }
