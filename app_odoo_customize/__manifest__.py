# -*- coding: utf-8 -*-

# Created on 2019-11-12
# author: Carlos Moran，https://mussolam.com
# email: carlos.moran@mussolam.com
# resource of Sunpop
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

{
    'name': 'App Odoo Customize',
    'version': '11.19.1.20',
    'author': 'Carlos Morán (Mussol, S.A. de C.V.)',
    'category': 'Productivity',
    'website': 'https://mussolam.com',
    'license': 'AGPL-3',
    'sequence': 2,
    'summary': """    
Personalización del sistema
    """,
    'description': """
Personalización del sistema
    """,
    'images': ['static/description/banner.gif'],
    'depends': ['base', 'web', 'mail'],
    'data': [
        'views/app_odoo_customize_view.xml',
        'views/app_theme_config_settings_view.xml',
        'views/ir_model_view.xml',
        # data
        'data/ir_config_parameter.xml',
        #'data/res_company_data.xml',
        'data/res_groups.xml',
        'security/ir.model.access.csv',
    ],
    'demo': [],
    'test': [
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'qweb': [
        'static/src/xml/customize_user_menu.xml',
    ],
}
