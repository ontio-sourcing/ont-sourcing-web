/**
 * Created by tanyuan on 4/5/2017.
 */

export const API_ROOT = (process.env.NODE_ENV === 'production')
  ? 'http://42.159.196.7/fl/'
  // ? 'http://42.159.233.39/fl/'
:'http://172.168.3.17:7088/'
// :'http://42.159.233.39/fl/'

export const CookieDomain = (process.env.NODE_ENV === 'production')
  ? ''
  :''
