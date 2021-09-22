# -*- coding: utf-8 -*-
from odoo import http

# class QztrayPrinting(http.Controller):
#     @http.route('/qztray_printing/qztray_printing/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/qztray_printing/qztray_printing/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('qztray_printing.listing', {
#             'root': '/qztray_printing/qztray_printing',
#             'objects': http.request.env['qztray_printing.qztray_printing'].search([]),
#         })

#     @http.route('/qztray_printing/qztray_printing/objects/<model("qztray_printing.qztray_printing"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('qztray_printing.object', {
#             'object': obj
#         })