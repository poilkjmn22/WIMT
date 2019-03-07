var mysql = require('mysql');
const _ = require('lodash')
exports.getActivityList = function(cb) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'fangqi',
        password: '123456',
        database: 'wimt'
    });

    connection.connect();

    connection.query('SELECT * from activity a left join activityclass ac on a.activityclassid = ac.id', function(error, results, fields) {
        if (error) {
            cb.call(this, {
                code: error.errno,
                message: error.sqlMessage
            })
            throw error
        };
        if (_.isFunction(cb)) {
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
        if (error) {
            cb.call(this, {
                code: error.errno,
                message: error.sqlMessage
            })
            throw error
        };
        if (_.isFunction(cb)) {
            cb.call(this, {
                results,
                code: 0
            })
        }
    });

    connection.end();
}

exports.addActivityRound = function(data, cb) {
    if (!_.isFunction(cb)) {
        return
    }
    var pool = mysql.createPool({
        host: 'localhost',
        user: 'fangqi',
        password: '123456',
        database: 'wimt',

        connectionLimit: 10,
        multipleStatements: true
    });

    pool.getConnection((error, connection) => {
        connection.query('insert into activityround values (?)', data.ActivityRoundDate, (err, results, fields) => {
            if (err) {
                cb.call(this, {
                    code: err.errno,
                    message: err.sqlMessage
                })
                throw err
            }
            connection.release()
            pool.getConnection((error, connection) => {
                connection.query('select * from activityclass', (err, results, fields) => {
                    if (err) {
                        cb.call(this, {
                            code: err.errno,
                            message: err.sqlMessage
                        })
                        throw err
                    }
                    var sqlActivity = _.map(results, ac => `insert into activity values (null, ${ac.ID}, '${data.ActivityRoundDate}', '${data[ac.Name]}', '0')`).join(';')
                    connection.release()
                    pool.getConnection((error, connection) => {
                        connection.query(sqlActivity, (err, results, fields) => {
                            pool.end((error) => {
                                if (error) {
                                    cb.call(this, {
                                        code: error.errno,
                                        message: error
                                    })
                                }
                            })
                            if (err) {
                                cb.call(this, {
                                    code: err.errno,
                                    message: err.sqlMessage
                                })
                                throw err
                            }
                            cb.call(this, {
                                code: 0,
                                message: '添加成功！'
                            })

                        })
                    })
                })
            })


        })
    })

}

exports.deleteActivity = function(data, cb) {
    if (!_.isFunction(cb)) {
        return
    }
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'fangqi',
        password: '123456',
        database: 'wimt'
    });

    connection.connect();

    connection.query(`update activity set disable = '1' where activityrounddate = '${data.ActivityRoundDate}'`, function(error, results, fields) {
        if (error) {
            cb.call(this, {
                code: error.errno,
                message: error.sqlMessage
            })
            throw error
        };
        cb.call(this, {
            results,
            code: 0
        })
    });

    connection.end();
}

exports.restoreActivity = function(data, cb) {
    if (!_.isFunction(cb)) {
        return
    }
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'fangqi',
        password: '123456',
        database: 'wimt'
    });

    connection.connect();

    connection.query(`update activity set disable = '0' where activityrounddate = '${data.ActivityRoundDate}'`, function(error, results, fields) {
        if (error) {
            cb.call(this, {
                code: error.errno,
                message: error.sqlMessage
            })
            throw error
        };
        cb.call(this, {
            results,
            code: 0
        })
    });

    connection.end();
}


exports.getActivityRound = function(data, cb) {
    if (!_.isFunction(cb)) {
        return
    }
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'fangqi',
        password: '123456',
        database: 'wimt'
    });

    connection.connect();
    connection.query(`SELECT * from activity a left join activityclass ac on a.activityclassid = ac.id where a.ActivityRoundDate = '${data.ActivityRoundDate}'`, function(error, results, fields) {
        if (error) {
            cb.call(this, {
                code: error.errno,
                message: error.sqlMessage
            })
            throw error
        };
        cb.call(this, {
            results,
            code: 0
        })
    });

    connection.end();
}

exports.updateActivityRound = function(data, cb) {
    if (!_.isFunction(cb)) {
        return
    }
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'fangqi',
        password: '123456',
        database: 'wimt',
        multipleStatements: true
    });

    connection.connect();
    let updateSql = _.reduce(data, (res, v, k, obj) => {
      if(k !== 'ActivityRoundDate'){
        res.push(`update activity a left join activityclass ac on a.activityclassid=ac.id set duration='${v}' where ac.name='${k}' and activityrounddate='${obj.ActivityRoundDate}'`)
      }
      return res
    }, []).join(';')+';'
    connection.query(updateSql, function(error, results, fields) {
        if (error) {
            cb.call(this, {
                code: error.errno,
                message: error.sqlMessage
            })
            throw error
        };
        cb.call(this, {
            message: '更新成功！',
            code: 0
        })
    });

    connection.end();
}
