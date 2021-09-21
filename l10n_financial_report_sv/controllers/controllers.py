# -*- coding: utf-8 -*-
from odoo import http

# class L10nFinancialReportSv(http.Controller):
#     @http.route('/l10n_financial_report_sv/l10n_financial_report_sv/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/l10n_financial_report_sv/l10n_financial_report_sv/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('l10n_financial_report_sv.listing', {
#             'root': '/l10n_financial_report_sv/l10n_financial_report_sv',
#             'objects': http.request.env['l10n_financial_report_sv.l10n_financial_report_sv'].search([]),
#         })

#     @http.route('/l10n_financial_report_sv/l10n_financial_report_sv/objects/<model("l10n_financial_report_sv.l10n_financial_report_sv"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('l10n_financial_report_sv.object', {
#             'object': obj
#         })