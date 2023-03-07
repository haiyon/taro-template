interface GlobalData {
  [key: string]: any;
}

const globalData: GlobalData = {};

/**
 * 设置全局数据
 * @param key 键名
 * @param val 键值
 */
export function setGlobalData(key: string, val: any): void {
  globalData[key] = val;
}

/**
 * 获取全局数据
 * @param key 键名
 * @returns 对应的键值
 */
export function getGlobalData(key: string): any {
  return globalData[key];
}
