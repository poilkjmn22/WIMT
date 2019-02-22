var mysql = require('mysql');
const _isFunction = require('lodash/isFunction')
exports.getActivityList = function(cb) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'fangqi',
        password: '123456',
        database: 'wimt'
    });

    connection.connect();

    connection.query('SELECT * from activity a left join activityclass ac on a.activityclassid = ac.id', function(error, results, fields) {
        if (error) throw error;
        if (_isFunction(cb)) {
            cb.call(this, results)
        }
    });

    connection.end();
}

exports.getActivityClassList = function(cb) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'fangqi',
        password: '123456',
        database: 'wimt'
    });

    connection.connect();

    connection.query('SELECT * from activityclass', function(error, results, fields) {
        if (error) throw error;
        if (_isFunction(cb)) {
            cb.call(this, results)
        }
    });

    connection.end();
}
