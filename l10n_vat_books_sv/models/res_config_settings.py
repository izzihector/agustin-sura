# -*- coding: utf-8 -*-

from odoo import api, fields, models, exceptions, _

class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    accountant_id = fields.Many2one('hr.employee',
                            string="Contador general",
                            help="Contador encargado de legalizar los libros de IVA",
                            required = True,
                        )

    resolution_ids = fields.Many2many('l10n_vat_books_sv.resolution', string="Números de resolución")
    
    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        ir_config = self.env['ir.config_parameter'].sudo()

        accountant_id = ir_config.get_param('accountant_id')
        # raise exceptions.ValidationError(_(accountant_id))
        result = self.env['hr.employee'].search_read([
            ('id', '=', accountant_id)
        ], limit=1)
        id = result[0]['id'] if len(result) > 0 else False
        res.update(accountant_id = id)
        ids = ir_config.get_param('resolution_ids')
        resolution_ids = list(map(int, ids.replace("[", "").replace("]", "").split(", "))) if ids != False and ids != "[]" else []
        res.update(resolution_ids=resolution_ids)
        return res

    @api.multi
    def set_values(self):
        super(ResConfigSettings, self).set_values()
        ir_config = self.env['ir.config_parameter']
        ids = repr(self.resolution_ids.ids if self.resolution_ids != None else [])

        if self.accountant_id:
            ir_config.set_param('accountant_id', self.accountant_id.id)
            ir_config.set_param('resolution_ids', ids)
    

