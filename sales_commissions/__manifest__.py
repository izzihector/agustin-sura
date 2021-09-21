{
    'name': 'Sales commissions',
    'version': '11.0.1.0.0',
    'author': 'Carlos Moran',
    'depends': [
        'product',
        'sale_management'
    ],
    'data': [
        'data/sale_commission_data.xml',
        'security/ir.model.access.csv',
        'views/sales_commissions_view.xml',
        'views/sale_order_view.xml',
        'wizard/wizard_commissions.xml',
        'report/sale_commission_report.xml'
    ],
    'installable': True
}