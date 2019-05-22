'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT:'"http://172.168.3.68:7088/"',
  fileUrl:'"/static/ontsourcing%E7%82%B9%E6%99%B4%E6%A8%A1%E6%9D%BF0426.xlsx"',
  ONTID_SIGININ: '"http://139.219.136.188:10390?params="',
  APP_ONTID: '"did:ont:ANqiHycikgyzkfz36faP5ymXLVg1uovhXh"',
  TOC_API_ROOT: '"http://172.168.3.68:9088/"'
})

// process.env.API_ROOT