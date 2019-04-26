'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT:'"http://172.168.3.17:7088/"',
  fileUrl:'"http://172.168.3.17/#/static/ontsourcing%E7%82%B9%E6%99%B4%E6%A8%A1%E6%9D%BF0426.xlsx"'
})

// process.env.API_ROOT