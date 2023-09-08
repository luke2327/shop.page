'use strict'

import rpm from 'request-promise'

export default class Request {
  sendUrlJson(method: 'GET' | 'POST', url: string, vdata: any, headers: any, bodyType: 'body' | 'form') {
    const options: any = {
      method: method,
      uri: url,
      headers: headers,
      json: true, // Automatically stringifies the body to JSON
    }

    // 값이 있는경우에만 body 세팅
    if (vdata) {
      if (method.toLowerCase() === 'get') {
        options.qs = vdata
      } else {
        options[bodyType ? bodyType : 'body'] = vdata
      }
    }

    return rpm(options)
  }

  sendUrl(method, url, vdata, headers) {
    const options = {
      method: method,
      uri: url,
      headers: headers,
    }

    // 값이 있는경우에만 body 세팅
    if (vdata) {
      if (method.toLowerCase() === 'get') {
        options.qs = vdata
        options.json = false
      } else {
        options.body = vdata
      }
    }

    return rpm(options)
  }

  sendUrlFiles(url, vdata, headers) {
    const options = {
      method: 'POST',
      uri: url,
      headers: headers,
      formData: vdata,
    }

    return rpm(options)
  }
}
