from odoo import api, models, fields, _
from odoo.exceptions import UserError

class SaleCommissionReport(models.AbstractModel):
    _name = 'report.sales_commissions.sale_commission_report_main'

    @api.model
    def get_report_values(self, docids, data=None):
        date_from = data['form']['date_from']
        date_to = data['form']['date_to']
        user_ids = data['form']['user_ids']
        sale_ids = None
        if len(user_ids) == 0:
            sale_ids = self.env['sale.order'].search([
                ('confirmation_date', '>=', date_from),
                ('confirmation_date', '<=', date_to)
            ])
        elif len(user_ids) > 0:
            sale_ids = self.env['sale.order'].search([
                ('confirmation_date', '>=', date_from),
                ('confirmation_date', '<=', date_to),
                ('user_id', 'in', tuple(user_ids))
            ])
        sales = self.env['sale.order'].browse(sale_ids.ids)
        sale_commissions_dict = {}
        for sale in sales:
            sale_commission = sale_commissions_dict.get(sale.user_id.id)
            if sale_commission == None:
                sale_commissions_dict[sale.user_id.id] = {
                    'amount_commission': 0
                }
            for line in sale.order_line:
                sale_commissions_dict[sale.user_id.id]['amount_commission'] = sale_commissions_dict[sale.user_id.id]['amount_commission'] + line.amount_commission
        sellers = self.env['res.users'].search([
            ('id','in',tuple(sale_commissions_dict.keys()))
        ], order='name ASC')
        sale_commissions = []
        commission_total = 0.00
        for seller in sellers:
            sale_commissions.append({
                'name': seller['name'],
                'amount': sale_commissions_dict[seller['id']].get('amount_commission', 0)
            })
            commission_total = commission_total + sale_commissions_dict[seller['id']].get('amount_commission', 0)
        
        return {
            'doc_ids': data['ids'],
            'doc_model': data['model'],
            'sale_commissions': sale_commissions,
            'date_from': date_from,
            'date_to': date_to,
            'commission_total': commission_total
        }
