import request from 'superagent';


 
export const SERVISE_PATH = config.servicePath;

export function RequestAPI(path, mode = 'GET') {
  switch (mode.toUpperCase()) {
    case 'POST':
      return request.post(SERVISE_PATH + path).withCredentials()
        .set('Content-Type', 'application/x-www-form-urlencoded');
    default:
      return request.get(SERVISE_PATH + path).withCredentials()
        .set('Accept', 'application/json');
  }
}
