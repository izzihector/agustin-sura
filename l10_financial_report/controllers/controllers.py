# -*- coding: utf-8 -*-
from odoo import http

# class L10FinancialReport(http.Controller):
#     @http.route('/l10_financial_report/l10_financial_report/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/l10_financial_report/l10_financial_report/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('l10_financial_report.listing', {
#             'root': '/l10_financial_report/l10_financial_report',
#             'objects': http.request.env['l10_financial_report.l10_financial_report'].search([]),
#         })

#     @http.route('/l10_financial_report/l10_financial_report/objects/<model("l10_financial_report.l10_financial_report"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('l10_financial_report.object', {
#             'object': obj
#         })