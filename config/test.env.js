'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"test"',
  API_ROOT:'"http://172.168.3.68:7088/"',
  fileUrl:'"/static/ontsourcing%E7%82%B9%E6%99%B4%E6%A8%A1%E6%9D%BF0426.xlsx"',
  ONTID_SIGININ: '"http://139.219.136.188:10390?params="',
  TOC_API_ROOT: '"http://172.168.3.68:9088/"'
})
