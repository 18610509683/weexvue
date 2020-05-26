const CryptoJS = require("crypto-js")
const key = CryptoJS.enc.Utf8.parse("20160613646aBcDW");
const md5 = require('md5-node');

/**
 * 获取时间戳
 */
export function getTimeStamp() {
  return new Date().getTime();
};

/**
 * 获取6位随机数
 */
export function getNmberSixRandom() {
  return Math.floor(Math.random() * 1000000);
};

/**
 * 获取tocken值
 */
export function getToken(params) {
  let result = [];
  params = params || {};
  Object.keys(params).forEach(v => {
    result.push(v + params[v]);
  });

  return getSign(result.sort().join(''));
};

/**
 * token加密
 *  */
export function getSign(value) {
  var encryptedData = CryptoJS.AES.encrypt(md5(value), key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  encryptedData = encryptedData.ciphertext.toString();
  return encryptedData;
};
