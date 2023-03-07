import dayjs from 'dayjs';

/**
 * 格式化时间字符串
 * @param time 时间
 * @param format 格式化字符串
 * @returns 格式化后的时间字符串
 */
export const parseTime = (time: string | number | Date, format = 'YYYY-MM-DD'): string => {
  if (!time) return '';
  if (typeof time === 'string' && time.includes('/')) {
    time = time.replace(/\//g, '-');
  }
  const md = dayjs(time);
  return md.isValid() ? md.format(format) : '';
};

/**
 * 格式化时间对象
 * @param time 时间
 * @param cFormat 格式化字符串
 * @returns 格式化后的时间字符串
 */
export const formatDate = (time: string | number | Date, cFormat?: string): string => {
  if (!time) return '';
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  const date = typeof time === 'object' ? time : new Date(time);
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value: any = formatObj[key];
    if (key === 'a') {
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value.toString();
  });
  return time_str;
};

/**
 * 格式化时间距离现在的差
 * @param time 时间
 * @param option 配置参数
 * @returns 格式化后的时间字符串
 */
export const formatTimeDistance = (time: string | number | Date, option?: any): string => {
  if (!time) return '';
  if (typeof time === 'string' && time.includes('-')) {
    time = time.replace(/-/g, '/');
  }
  const d = new Date(time);
  const now = Date.now();
  const diff = (now - d.getTime()) / 1000;
  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less than 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 16) {
    return `${Math.ceil(diff / 3600 / 24)} 天前`;
  }
  if (option) {
    return formatDate(time, option);
  }
  return `${d.getMonth() + 1}月${d.getDate()}日${d.getHours()}时${d.getMinutes()}分`;
};

/**
 * 获取 URL 中的查询参数
 * @param url URL
 * @returns 查询参数对象
 */
export const getQueryObject = (url?: string): { [key: string]: string } => {
  url = url || window.location.href;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj: { [key: string]: string } = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
};
