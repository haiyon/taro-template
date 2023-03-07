/* eslint-disable no-unused-vars */
// noinspection JSUnusedGlobalSymbols

import request from '@/utils/request';
import api from '@/utils/api';
import { verifyArray } from '@/utils/utils';

/**
 * 通用解析常用枚举
 * @param value 值
 * @param enums 枚举对象
 * @returns 解析后的值
 */
export const parseEnums = (value: string, enums?: { [key: string]: any }): any => {
  value = value || '';
  if (enums) {
    return enums[value];
  }
  return value;
};

/**
 * 处理行业选项
 */
export const handleIndustry = {
  options: [] as any[],

  /**
   * 获取行业数据
   */
  query: async (): Promise<any> => {
    return await request({ url: api.dictionary.industry, data: {} });
  },

  /**
   * 解析行业数据
   * @param industries 行业数据
   * @param selected 已选中的行业
   * @param get 获取行业数据的函数
   * @returns 解析结果字符串
   */
  parse: (
    industries: any[],
    selected?: any[],
    get?: (industries: any[], key: string, get: any) => any
  ): string => {
    selected = verifyArray(selected);
    const arr: string[] = [];

    selected.forEach(key => {
      let item = get ? get(industries, key, get) : undefined;
      arr.push(item?.label || '');
    });

    return arr.filter(val => val !== '').join(' / ');
  },

  /**
   * 根据 key 获取一个行业
   * @param industries 行业数据
   * @param key 行业 key
   * @param get 获取行业数据的函数
   * @returns 行业数据对象
   */
  get: (
    industries: any[],
    key: string,
    get?: (industries: any[], key: string, get: any) => any
  ): any | undefined => {
    let target = 'value';
    industries = verifyArray(industries);

    for (let i = 0; i < industries.length; i++) {
      if (industries[i][target] === key) {
        return industries[i];
      } else if (industries[i].children && get) {
        let rst = get(industries[i].children, key, get);
        if (rst) return rst;
      }
    }
  }
};
