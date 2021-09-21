# -*- coding: utf-8 -*-

# Created on 2020-02-12
# author: Carlos Moran，https://mussolam.com
# email: carlos.moran@mussolam.com
# resource of Mussol
# License Contrato de licencia de software de Mussol 1.0 (https://mussolam.com/license)

{
    'name': 'Exportación de plan de cuentas a XML',
    'version': '11.1.0.0',
    'author': 'Carlos Morán (Mussol, S.A. de C.V.)',
    'category': 'Productivity',
    'website': 'https://mussolam.com',
    'sequence': 2,
    'summary': """
Este módulo permite exportar un plan de cuentas digitado en el sistema a formato XML para incluirlo en los datos de un módulo
    """,
    'description': """
Este módulo permite exportar un plan de cuentas digitado en el sistema a formato XML para incluirlo en los datos de un módulo
    """,
    'depends': ['base', 'account_invoicing'],
    'data': [
        "wizard/account_chart_wizard_view.xml",
        "view/download_files_view.xml"
    ],
    'demo': [],
    'test': [
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
    'qweb': [
        
    ],
    'external_dependencies': {
        'python' : ["lxml"]
    },
}
