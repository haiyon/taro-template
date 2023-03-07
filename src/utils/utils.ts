/* eslint-disable no-undef */
// noinspection JSUnusedGlobalSymbols

const _rawType = (o: unknown): string => Object.prototype.toString.call(o).slice(8, -1);

/**
 * 验证一个值是否为 undefined。
 * @param un 要验证的值。
 * @returns 如果值为 undefined，则返回 true，否则返回 false。
 */
export const isUndefined = (un: unknown): boolean => _rawType(un) === 'Undefined';

/**
 * 验证一个值是否为数字。
 * @param num 要验证的值。
 * @returns 如果值为数字，则返回 true，否则返回 false。
 */
export const isNumber = (num: unknown): boolean => _rawType(num) === 'Number';

/**
 * 验证一个值是否为字符串。
 * @param str 要验证的值。
 * @returns 如果值为字符串，则返回 true，否则返回 false。
 */
export const isString = (str: unknown): boolean => _rawType(str) === 'String';

/**
 * 验证一个值是否为对象。
 * @param obj 要验证的值。
 * @returns 如果值为对象，则返回 true，否则返回 false。
 */
export const isObject = (obj: unknown): boolean => _rawType(obj) === 'Object';

/**
 * 验证一个值是否为数组。
 * @param arr 要验证的值。
 * @returns 如果值为数组，则返回 true，否则返回 false。
 */
export const isArray = <T>(arr: unknown): arr is T[] => Array.isArray(arr);

/**
 * 验证一个值是否为函数。
 * @param fn 要验证的值。
 * @returns 如果值为函数，则返回 true，否则返回 false。
 */
export const isFunction = (fn: unknown): boolean => _rawType(fn) === 'Function';

/**
 * 验证一个值是否为布尔值。
 * @param bool 要验证的值。
 * @returns 如果值为布尔值，则返回 true，否则返回 false。
 */
export const isBoolean = (bool: unknown): boolean => _rawType(bool) === 'Boolean';

/**
 * 生成一个随机数数组。
 * @param length 数组的长度。
 * @param maxNumber 随机数的最大值。如果未指定或无效，则默认为 2000。
 * @returns 随机数数组
 */
export const mathArr = (length: number, maxNumber?: number | string): number[] => {
  const arr: number[] = [];
  const max: number =
    maxNumber && !Number.isNaN(parseFloat(maxNumber as string))
      ? parseFloat(maxNumber as string)
      : 2000;

  for (let i = 0; i < length; i++) {
    const r: number = Math.random() * (max - 1) + 1;
    arr.push(parseFloat(r.toFixed(2)));
  }

  return arr;
};

/**
 * 验证数字类型或初始化为0
 * @param val 要验证或初始化的值。
 * @returns 如果值为数字，则返回该数字；否则返回0。
 */
export const verifyNumber = (val: unknown): number => {
  val = !isNumber(val) ? Number(val) : val || 0;
  if (Number.isNaN(val)) val = 0;
  return Number(val);
};

/**
 * 验证数组类型或初始化为空数组
 * @param arr 要验证或初始化的数组。
 * @returns 如果值为数组，则返回该数组；否则返回空数组 []。
 */
export const verifyArray = <T>(arr: unknown): T[] => (isArray<T>(arr) ? arr : []);

/**
 * 保留小数位
 * @param value 原始值
 * @param length 保留长度，默认 2 位
 * @returns 返回处理结果
 */
export const decimals = (value: number | string = 0, length = 2): number => {
  if (value === 0 || value === '0.00' || Number.isNaN(value)) return 0.0;
  value = typeof value === 'string' ? parseFloat(value) : value;
  return Math.round(parseFloat(value.toFixed(length)) * 100) / 100;
};

/**
 * 验证对象类型或初始化为空对象
 * @param obj 要验证或初始化的对象。
 * @returns 如果值为对象，则返回该对象；否则返回空对象{}。
 */
export const verifyObject = <T extends object>(obj: unknown): T =>
  isObject(obj) ? (obj as T) : ({} as T);

/**
 * 把小数转换为百分数
 * @param val 字段值
 * @param pre 百分数保留的小数位，默认为 2
 * @returns 带百分号后缀
 */
export function decimalToPercent(val: number | string, pre = 2): string | null {
  if (typeof val === 'string' && val) {
    val = Number(val);
  }
  if (!(typeof val === 'number' && !Number.isNaN(val))) {
    return null;
  }
  val = val * 100;
  const p = Math.pow(10, pre);
  val = Math.round(val * p) / p;
  return val.toFixed(pre) + '%';
}

/**
 * 将数值四舍五入 (保留 2 位小数) 后格式化成金额形式
 * @param num 数值
 * @return 金额格式的字符串，如'1,234,567.45'
 */
export function formatCurrency(num: any): string {
  num = num.toString().replace(/[$,]/g, '');
  if (Number.isNaN(Number(num))) {
    num = '0';
  }
  const sign = num == (num = Math.abs(Number(num)));
  num = Math.floor(Number(num) * 100 + 0.50000000001);
  let cents: any = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10) {
    cents = '0' + cents;
  }
  for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num =
      num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
  }
  return (sign ? '' : '-') + num + '.' + cents;
}

/**
 * 计算一个字符串的字节长度
 * @param val 输入的字符串
 * @returns 字节长度
 */
export function getByteLen(val: string): number {
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) !== null) {
      len += 1;
    } else {
      len += 0.5;
    }
  }
  return Math.floor(len);
}

/**
 * 从数组中删除 null 或 undefined 元素
 * @param actual 数组
 * @returns 删除了 null 或 undefined 元素的新数组
 */
export function cleanArray<T>(actual: Array<T | null | undefined>): T[] {
  const newArray: T[] = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i] !== null && actual[i] !== undefined) {
      newArray.push(actual[i] as T);
    }
  }
  return newArray;
}

/**
 * 将 JSON 对象转换为 URL 查询参数字符串
 * @param json JSON 对象
 * @returns URL 查询参数字符串
 */
export function param(json: Record<string, any> | null | undefined): string {
  if (!json) {
    return '';
  }
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) {
        return '';
      }
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    })
  ).join('&');
}

/**
 * 将 URL 查询参数字符串转换为 JSON 对象
 * @param url URL 查询参数字符串
 * @returns JSON 对象
 */
export function param2Obj(url: string): Record<string, any> {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
      '"}'
  );
}

/**
 * 从原始数据中获取指定路径的字段值
 * @param obj 原始数据
 * @param path 字符串路径由点号分隔嵌套路径或者字符串数组
 * @param defaultValue 当字段值是 null 或 undefined 时，返回默认值。否则返回 null
 * @returns 指定路径的字段值
 */
export function getValueByPath(obj: any, path: string | string[], defaultValue?: any): any {
  const paths = Array.isArray(path) ? path : path.split('.');
  const _isNull = (v: any) => v === null || v === undefined;
  let value = obj;

  for (let i = 0; i < paths.length; i++) {
    if (_isNull(value)) {
      break;
    }
    value = value[paths[i]];
  }

  return _isNull(value) ? (_isNull(defaultValue) ? null : defaultValue) : value;
}

/**
 * 计算返点使用金额
 * @param tm 金额
 * @param om 原金额
 * @param um 返点使用总金额
 * @returns {number}
 */
export function calRebateMoney(tm: number, om: number, um: number): number {
  tm = verifyNumber(tm);
  om = verifyNumber(om);
  um = verifyNumber(um);
  return (tm / om) * um || 0;
}

/**
 * 根据比例计算金额
 * @param tm 类型金额
 * @param p 比例
 * @returns {number}
 */
export function calRebateRRMoney(tm: number, p: number): number {
  tm = verifyNumber(tm);
  p = verifyNumber(p);
  return tm * (p / 100) || 0;
}

/**
 * 根据使用金额计算比例
 * @param um 使用金额
 * @param om 原金额
 * @returns {number}
 */
export function calPercent(um: number, om: number): number {
  um = verifyNumber(um);
  om = verifyNumber(om);
  return 100 * (um / om) || 0;
}

/**
 * 比较两个值是否相等
 * @param a
 * @param b
 * @returns {boolean}
 */
export function isSameValue<T>(a: T, b: T): boolean {
  return a === b;
}

/**
 * 比较两个数组对象，是否只存在于左边数组
 * @param left 左边数组
 * @param right 右边数组
 * @param opts 扩展参数
 * @param opts.lk 左边数组取值 key
 * @param opts.rk 右边数组取值 key
 * @returns {*[]}
 */
export function onlyInLeft<T, U>(left: T[], right: U[], opts: { lk?: keyof T; rk?: keyof U }): T[] {
  left = verifyArray(left);
  right = verifyArray(right);
  opts = verifyObject(opts);

  return left.filter(o => {
    return !right.some(t => {
      const lv = opts.lk ? o[opts.lk] : (o as unknown as { id: any }).id;
      const rv = opts.rk ? t[opts.rk] : (t as unknown as { id: any }).id;
      return isSameValue(lv, rv);
    });
  });
}

/**
 * 从对象或对象数组中过滤出验证值
 * @param data 操作对象，如果 key 为字符串则 obj 要求为数组对象
 * @param key 是否取值 key, boolean 类型且为 true 时取值 key 键，string 类型则原数据应为数组对象并取值 value
 */
export function filterVerifyValue<T extends object>(data: T | T[], key?: string | boolean): any[] {
  const tmpArr: any = [];

  if (Array.isArray(data) && typeof key === 'string') {
    data.forEach(o => {
      tmpArr.push(o[key]);
    });
  } else {
    Object.keys(verifyObject(data)).forEach(ok => {
      if (typeof key === 'boolean' && key) {
        tmpArr.push(ok);
      } else {
        tmpArr.push(data[ok]);
      }
    });
  }

  return tmpArr;
}
