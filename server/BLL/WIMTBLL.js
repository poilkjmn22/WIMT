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
                    var sqlActivity = _.map(results, ac => `insert into activity values (null, ${ac.ID}, '${data.ActivityRoundDate}', '${data[ac.Name]}')`).join(';')
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
