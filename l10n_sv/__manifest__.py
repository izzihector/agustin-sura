# -*- coding: utf-8 -*-
{
    'name': 'Localización de El Salvador',
    'summary': 'Localización de El Salvador',
    'description': """Agrega los campos de NRC, DUI y NIT.
                   Crea los tipos de factura usados en El Salvador:
                   -Factura de consumidor final
                   -Crédito fiscal
                   -Factura comercial (nota de envío)
                   """,
    'author': 'Mussol S.A. de C.V. (Carlos Rolando Morán Campos)',
    'version': '11.0.1',
    'depends': [
        'base',
        'account',
    ],
    'data': [
        #'data/l10n_sv_coa_chart_data.xml',
        'data/account_group_data.xml',
        'data/l10n_sv_coa_data.xml',
        'data/account_tax_data.xml',
        'data/sequence_data.xml',
        'data/journal_data.xml',
        'data/account_fiscal_position.xml',
        'data/account_fiscal_position_tax.xml',
        'views/res_partner_view.xml',
    ],
    'application': False
}
