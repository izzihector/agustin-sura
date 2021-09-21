from odoo import api, models, fields, exceptions
from decimal import Decimal
class VendorVatBook(models.AbstractModel):

    """
    Modelo abstracto para la plantilla de reporte l10n_vat_books_sv.vendor_vat_book_report_main
    """

    _name = 'report.l10n_vat_books_sv.vendor_vat_book_report_main'

    @api.model
    def get_report_values(self, docids, data=None):
        # para representar los totales al final del reporte
        gravadas = Decimal('0.0')
        iva_ret = Decimal('0.0')
        iva = Decimal('0.0')
        total = Decimal('0.0')
        #raise exceptions.ValidationError(data['form']['journal_ids'])
        # facturas del mes
        journal_ids = self.env['account.journal'].search([
            ('id', 'in', data['form']['journal_ids'])
        ])

        invoice_ids = self.env['account.invoice'].search([
            ('date_invoice', '>=', data['form']['date_from']),
            ('date_invoice', '<=', data['form']['date_to']),
            ('journal_id', 'in', journal_ids.ids),
            ('state', 'in', ('open', 'paid')),
            #('refund_invoice_id', '=', False),
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
                'partner_name': invoice['partner_id'][1], # if not invoice['inv_refund_id'] else 'DOCUMENTO ANULADO',
                'partner_nrc': self.env['res.partner'].search_read([
                    ('id', '=', invoice['partner_id'][0])
                ])[0]['nrc'],# if not invoice['inv_refund_id'] else '',
                'exentas': 0.00,
                'gravadas': invoice['amount_untaxed_signed'], # if not invoice['inv_refund_id'] else 0.00,
                'iva': 0.00,
                'iva_ret': 0.00,
                'total': invoice['amount_total_signed'], # if not invoice['inv_refund_id'] else 0.00,
            }
            # agregar el iva y la retencion (si hay)
            tax_ids = invoice['tax_line_ids']
            tax_line_ids = self.env['account.invoice.tax'].search_read([
                ('id', 'in', tax_ids),
            ])
            # aplicar el iva (si se aplico en la factura)
            tax_iva = self.env.ref('l10n_sv.tax5')
            tax_iva_1 = self.env.ref('l10n_sv.1_tax5')
            tax_ret = self.env.ref('l10n_sv.tax4')
            tax_ret_1 = self.env.ref('l10n_sv.1_tax4')
            for tax_line in tax_line_ids:
                if tax_line['tax_id'][0] == tax_iva.id or tax_line['tax_id'][0] == tax_iva_1.id:
                    vat_book_lines[invoice['id']]['iva'] = tax_line['amount'] * (1 if not invoice['refund_invoice_id'] else -1)
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
            tax_iva = self.env.ref('l10n_sv.tax5')
            tax_ret = self.env.ref('l10n_sv.tax4')
            for tax_line in tax_line_ids:
                if tax_line['tax_id'][0] == tax_iva.id:
                    vat_book_lines_anulation[invoice['id']]['iva'] = -tax_line['amount']
                elif tax_line['tax_id'][0] == tax_ret.id:
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
        ids = []
        vat_book_lines = {k: v for k, v in sorted(vat_book_lines.items(), key=lambda item: item[1]['day'])}
        
        for k in vat_book_lines:
            ids.append(k)
        
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
            'ids': ids,
            'vat_book_lines': {k: v for k, v in sorted(vat_book_lines.items(), key=lambda item: item[1]['day'])},
            'gravadas': gravadas,
            'iva': iva,
            'iva_ret': iva_ret,
            'total': total,
            'accountant': accountant['name']
        }
