# -*- coding: utf-8 -*-
{
    'name': "Estilos de Reportes",

    'summary': """
        Estilo de los reporte financieros de acuerdo a las espefcifiaciones del cliente""",

    'description': """
        Hola
    """,

    'author': "Mussol",
    'website': "http://www.mussolam.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/11.0/odoo/addons/base/module/module_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base', 'account'],

    'css': ['static/src/css/report_mussol.css',],

    'less': ['static/src/less/report_mussol.less',],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'data/report_data.xml',
        'views/views.xml',
        'views/templates.xml',
        'views/inherited_report_financial.xml',
        'views/report_assets_common_fonts.xml',
        
    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
}