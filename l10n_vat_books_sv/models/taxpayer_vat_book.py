from odoo import api, models, fields, exceptions
from .customer_vat_book import  CustomerVatBook
from decimal import Decimal

class TaxpayerVatBook(models.AbstractModel):

    """
    Modelo abstracto para la plantilla de reporte l10n_invoice_sv.report_invoice_main_cdp
    """

    _name = 'report.l10n_vat_books_sv.taxpayer_vat_book_report_main'

    @api.model
    def get_report_values(self, docids, data=None):
        # para representar los totales al final del reporte
        gravadas = Decimal('0.0')
        iva_ret = Decimal('0.0')
        iva = Decimal('0.0')
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

        ids = set() # ids de las facturas
        vat_book_lines = {} # diccionario que almacena las lineas a mostrar en el libro de iva

        for invoice in invoice_ids:
            ids.add(invoice['id'])
            vat_book_lines[invoice['id']] = {
                'day': invoice['date_invoice'][8:10],
                'number': invoice['number'],
                'ret_number': '',
                'partner_name': invoice['partner_id'][1] if not invoice['inv_refund_id'] else 'DOCUMENTO ANULADO',
                'partner_nrc': self.env['res.partner'].search_read([
                    ('id', '=', invoice['partner_id'][0])
                ])[0]['nrc'] if not invoice['inv_refund_id'] else '',
                'exentas': 0.00,
                'gravadas': invoice['amount_untaxed'] if not invoice['inv_refund_id'] else 0.00,
                'iva': 0.00,
                'iva_ret': 0.00,
                'total': invoice['amount_total'] if not invoice['inv_refund_id'] else 0.00,
            }
            if not invoice['inv_refund_id']:
                # agregar el iva y la retencion (si hay)
                tax_ids = invoice['tax_line_ids']
                tax_line_ids = self.env['account.invoice.tax'].search_read([
                    ('id', 'in', tax_ids),
                ])
                # aplicar el iva (si se aplico en la factura)
                tax_iva = self.env.ref('l10n_sv.tax1')
                tax_iva_1 = self.env.ref('l10n_sv.1_tax1')
                tax_ret = self.env.ref('l10n_sv.tax4')
                tax_ret_1 = self.env.ref('l10n_sv.1_tax4')
                for tax_line in tax_line_ids:
                    if tax_line['tax_id'][0] == tax_iva.id or tax_line['tax_id'][0] == tax_iva_1.id:
                        vat_book_lines[invoice['id']]['iva'] = tax_line['amount']
                    elif tax_line['tax_id'][0] == tax_ret.id or tax_line['tax_id'][0] == tax_ret_1.id:
                        vat_book_lines[invoice['id']]['iva_ret'] = abs(tax_line['amount'])
                    # end if
                # end for
            # end if
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
                'number': invoice['refund_invoice_id'][1].strip(),
                'ret_number': '',
                'partner_name': 'DOCUMENTO ANULADO',
                'partner_nrc':  '',
                'exentas': 0.00,
                'gravadas': -invoice['amount_untaxed'],
                'iva': 0.00,
                'iva_ret': 0.00,
                'total': -invoice['amount_total'],
            }
            # agregar el iva y la retencion (si hay)
            tax_ids = invoice['tax_line_ids']
            tax_line_ids = self.env['account.invoice.tax'].search_read([
                ('id', 'in', tax_ids),
            ])
            # aplicar el iva (si se aplico en la factura)
            tax_iva = self.env.ref('l10n_sv.tax1')
            tax_iva_1 = self.env.ref('l10n_sv.1_tax1')
            tax_ret = self.env.ref('l10n_sv.tax4')
            tax_ret_1 = self.env.ref('l10n_sv.1_tax4')
            for tax_line in tax_line_ids:
                if tax_line['tax_id'][0] == tax_iva.id or tax_line['tax_id'][0] == tax_iva_1.d:
                    vat_book_lines_anulation[invoice['id']]['iva'] = -tax_line['amount']
                elif tax_line['tax_id'][0] == tax_ret.id or tax_line['tax_id'][0] == tax_ret_1.id:
                    vat_book_lines_anulation[invoice['id']]['iva_ret'] = -abs(tax_line['amount'])
                # end if
            # end for
        # end for

        # calculando totales
        for invoice in invoice_ids:
            id = invoice['id']
            gravadas = gravadas + Decimal(str(vat_book_lines[id]['gravadas']))
            iva = iva + Decimal(str(vat_book_lines[id]['iva']))
            iva_ret = iva_ret + Decimal(str(vat_book_lines[id]['iva_ret']))
            total = total + Decimal(str(vat_book_lines[id]['total']))
        
        for id in refund_ids:
            gravadas = gravadas + Decimal(str(vat_book_lines_anulation[id]['gravadas']))
            iva = iva + Decimal(str(vat_book_lines_anulation[id]['iva']))
            iva_ret = iva_ret + Decimal(str(vat_book_lines_anulation[id]['iva_ret']))
            total = total + Decimal(str(vat_book_lines_anulation[id]['total']))

        ir_config = self.env['ir.config_parameter'].sudo()
        accountant_id = ir_config.get_param('accountant_id')
        accountant = self.env['hr.employee'].search_read([
            ('id', '=', accountant_id)
        ])[0]

        # obteniendo totales de las FCF
        fcf_data = dict(data)
        fcf_data['type_report'] = 'fcf'
        customers_data = CustomerVatBook.get_report_values(self, data['ids'], fcf_data)

        return {
            'doc_ids': data['ids'],
            'doc_model': data['model'],
            'company': customers_data['company'],
            'date_from': data['form']['date_from'],
            'date_to': data['form']['date_to'],
            'month': customers_data['month'],
            'ids': ids,
            'vat_book_lines': vat_book_lines,
            'customers_data': customers_data,
            'gravadas': '{:.2f}'.format(gravadas),
            'iva_ret': '{:.2f}'.format(float(iva_ret)),
            'totales': '{:.2f}'.format(float(total)),
            'iva': '{:.2f}'.format(float(iva)),
            'accountant': customers_data['accountant'],
            'calculo_gravadas': gravadas + Decimal(customers_data['locales']),
            'calculo_iva': iva + Decimal(customers_data['iva']),
            'calculo_iva_ret': iva_ret + Decimal(customers_data['iva_ret']),
            'calculo_totales': total + Decimal(customers_data['total'])
        }
