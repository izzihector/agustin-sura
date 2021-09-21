# -*- coding: utf-8 -*-
from odoo import fields, models, api, _
class Journal(models.Model):
    _inherit = 'account.journal'
    
    type_report = fields.Selection([
        ('fcf', _('Factura Consumidor Final')),
        ('ccf', _('Comprobante Credito Fiscal')),
        ('odp', _('Orden de Pedido')),
        ('ndc', _('Nota de Credito')),
        ('anu', _('Anulacion')),
        ('aod', _('Anulacion de Orden de Pedido')),
        ('tck', _('Ticket')),
        ('exp', _('Factura de Exportacion')),
        ('axp', _('Anulacion de Factura de Exportacion')),
        ('compras', _('CCF Compras')),
        ('anu_compras', _('Reintegro de CCF Compras')),
    ], default=False,string=_('Tipo de Documento Fiscal'),copy=False,
        help=_("El 'Tipo de Documento Fiscal' es usado en "\
        "las impresiones de los diferentes documentos"\
        ", solo selecionar si la numeracion corresponde a algunos de los documentos fiscales de venta"))
