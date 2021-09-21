# -*- coding: utf-8 -*-
{
    'name': "Facturacion de El Salvador",
    'summary': """Facturacion de El Salvador""",
    'description': """
       Facturacion de El Salvador.
       Permite Imprimir los tres tipos de facturas utilizados en El Salvador
        - Consumidor Final
        - Credito Fiscal
        - Exportaciones
      Tambien permite imprimir los documentos que retifican:
        - Anulaciones.
        - Nota de Credito
        - Anulaciones de Exportacion
      Valida que todos los documentos lleven los registros requeridos por ley
        """,
    'author': "Intelitecsa(Francisco Trejo)",
    'website': "http://www.intelitecsa.com",
    'price': 100.00,
    'currency': 'USD',
    'license': 'GPL-3',
    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/master/odoo/addons/base/module/module_data.xml
    # for the full list
    'category': 'Contabilidad',
    'version': '1.1',
    # any module necessary for this one to work correctly
    'depends': ['base', 'l10n_sv' , 'account', 'jasper_reports'],
    # always loaded
    'data': [
        'report/internal_layout.xml',
        'views/account_invoice_wizard_view.xml',
        'views/account_journal.xml',
        'views/posicion_arancel_view.xml', # quitando los aranceles
        'views/product_template_view.xml', # solo para aranceles
        'views/account_invoice_view.xml',
        'views/account_tax.xml',        
        'data/journal_data.xml',
        'report/report_invoice_anu.xml',
        'report/report_invoice_ccf.xml',
        'report/report_invoice_fcf.xml',
        'report/report_invoice_odp.xml',
        'report/report_invoice_ndc.xml',
        'report/report_invoice_tck.xml',
        'report/invoice_report.xml',
        'report/report_invoice_main.xml',
        'security/ir.model.access.csv', # solo se ocupaba para los aranceles
        'wizard/account_invoice_refund.xml',
        'jasper_reports/report_menu.xml'
    ],
    # only loaded in demonstration mode
    'demo': [],
    #'demo.xml',
    'installable': True,
    'application': False,
    'auto_install': False,
    'post_init_hook': 'invoices_refunds',
}
