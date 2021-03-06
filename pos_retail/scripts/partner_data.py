import xmlrpclib
import time
import logging

__logger = logging.getLogger(__name__)

start_time = time.time()

database = '11_retail'
login = 'admin'
password = 'admin'
url = 'http://localhost:8888'

common = xmlrpclib.ServerProxy('{}/xmlrpc/2/common'.format(url))
uid = common.authenticate(database, login, password, {})

models = xmlrpclib.ServerProxy(url + '/xmlrpc/object')
with open("partner.jpg", "rb") as f:
    data = f.read()
    for i in range(0, 1000):
        vals = {
            'street': u'255 Bui Huu Nghia, Tan Van',
            'city': u'Bien Hoa',
            'name': 'RM3_%s' % str(i),
            'zip': u'False',
            'mobile': u'0909888888',
            'country_id': 233,
            'email': u'custoSwift_mer_big_data@gmail.com',
            'image': data.encode("base64")
        }
        partner_id = models.execute_kw(database, uid, password, 'res.partner', 'create', [vals])
        __logger.info('created: %s' % partner_id)


