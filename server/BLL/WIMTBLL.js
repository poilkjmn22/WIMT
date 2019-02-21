var mysql = require('mysql');
const _isFunction = require('lodash/isFunction')
exports.getList = function(cb) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'fangqi',
        password: '123456',
        database: 'wimt'
    });

    connection.connect();

    connection.query('SELECT * from activity', function(error, results, fields) {
        if (error) throw error;
        if (_isFunction(cb)) {
            cb.call(this, results)
        }
    });

    connection.end();
}
