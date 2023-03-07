import Taro from '@tarojs/taro';
import { downloadFile } from '@/utils/request';
import api from '@/utils/api';

/**
 * 文件预览通用方法
 * @param url 文件资源地址
 */
export async function openDocument(url: string) {
  if (!url) {
    throw new Error('fail parameter error: parameter.url should be String');
  }

  const validFiletype = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];
  const pathArray = url.split('.');
  const fileType: any = pathArray[pathArray.length - 1];
  const toastMsg = `仅支持预览 ${validFiletype.join(' | ')} 类型的文件`;

  if (!validFiletype.includes(fileType)) {
    return Taro.showToast({ title: toastMsg, icon: 'none' });
  }

  try {
    const { statusCode, errMsg, tempFilePath } = await downloadFile(url);
    if (statusCode !== 200) {
      new Error(errMsg);
    }
    Taro.openDocument({ filePath: tempFilePath, fileType });
  } catch (error) {
    console.error(error);
  }
}

/**
 * 处理文件预览
 * @param filePath 文件路径
 */
export function handleFilePreview(filePath: string) {
  const tmpArray = filePath.split('.');
  const fileType = tmpArray[tmpArray.length - 1];
  const _url = api.base_url + 'shell' + filePath;

  if (!['png', 'jpg', 'jpeg', 'gif'].includes(fileType)) {
    return openDocument(_url);
  }
  Taro.previewImage({ urls: [_url] });
}
