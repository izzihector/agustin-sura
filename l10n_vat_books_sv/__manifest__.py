{
        'name':'Libros de IVA - El Salvador',
        'description':'Cliente para generar los libros de IVA de El Salvador',
        'author':'Mussol, S.A. de C.V.',
        'data':[
                'views/vat_books_assets.xml',
                'views/account_tax_menu_view.xml',
                'views/website_template.xml',
                'views/vat_book_wizard_view.xml',
                'report/grid_system.xml',
                'report/accountant_sign.xml',
                'report/customer_vat_book_report.xml',
                'report/taxpayer_vat_book_report.xml',
                'report/vendor_vat_book_report.xml',
                'views/res_config_settings_view.xml',
        ],
        'depends':[
                'base',
                'account',
                'account_invoicing',
                'l10n_sv',
                'hr', # para configurar el contador
        ],
        'application': True,
}
