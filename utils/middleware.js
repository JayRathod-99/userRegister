const responseMiddleWares = (msg, success, data, code) => {
  let obj = {};
  // obj['data'] = decrypt(data);
  obj["message"] = msg;
  obj["success"] = success;
  // obj["count"] = count;
  obj["success_code"] = code;
  obj["data"] = data;
  return obj;
};

module.exports = { responseMiddleWares };
