import rpm from 'request-promise'

export async function sendUrlJson(
  method: 'GET' | 'POST' | 'PUT',
  url: string,
  vdata: any,
  headers: any,
  bodyType: 'body' | 'form',
) {
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

  return rpm(options).catch((e) => e)
}

export async function sendUrl(method: 'GET' | 'POST' | 'PUT', url: string, vdata: any, headers: any) {
  const options: any = {
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

  return rpm(options).catch((e) => e)
}
