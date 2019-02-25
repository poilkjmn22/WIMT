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

    connection.query('SELECT * from activityclass ac left join activityclassinfo aci on ac.id = aci.activityclassid', function(error, results, fields) {
        if (error) throw error;
        if (_isFunction(cb)) {
            cb.call(this, results)
        }
    });

    connection.end();
}

exports.addActivityRound = function(data, cb){
  var connection = mysql.createConnection({
      host: 'localhost',
      user: 'fangqi',
      password: '123456',
      database: 'wimt'
  });

  connection.connect();

  if (_isFunction(cb)) {
      cb.call(this, {
        code: 0,
        message: '添加成功！'
      })
  }

  connection.end();
}
