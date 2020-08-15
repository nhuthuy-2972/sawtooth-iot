// const { Pool } = require('pg')
// const pool = new Pool({
//   user: 'postgres',
//   host: 'tsdb-7f22a0f-nhuthuy2972-0765.a.timescaledb.io',
//   database: 'defaultdb',
//   password: 'shrtowxdvp3jgoyd',
//   port: 5432
// })

// const createTableMetrics = `
// CREATE TABLE metrics(
//     time TIMESTAMPTZ,
//     device_id TEXT NOT NULL,
//     data JSONB,
//     PRIMARY KEY(time, device_id)
// );
// SELECT create_hypertable('metrics', 'time');
// CREATE INDEX idxgin ON metrics USING GIN(data);
// `

// pool.query(createTableMetrics, (err, res) => {
//   console.log(err, res)
//   pool.end()
// })
