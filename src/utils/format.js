/* eslint-disable no-nested-ternary, no-mixed-operators, no-control-regex, no-useless-escape */
import moment from 'moment';

const stripTagsRE = /<\/?[^>]+>/gi;
const trimRe = /^\s+|\s+$/g;

export default {
  /**
   * 对大于指定长度部分的字符串，进行裁剪，增加省略号（“...”）的显示。
   * @param {String} value 要裁剪的字符串
   * @param {Number} len 允许的最大长度
   * @param {Boolean} word True表示尝试以一个单词来结束
   * @return {String} 转换后的文本
   */
  ellipsis(value = '', len, word = '...') {
    if (this.length(value) <= len) return value;
    let retVal = value;
    do {
      retVal = retVal.substr(0, retVal.length - 1);
    } while (this.length(retVal) > len - this.length(word));
    return retVal + word;
  },

  length(value) {
    return value.replace(/[^\x00-\xff]/g, 'rr').length;
  },

  /**
   * 检查一个引用值是否为 undefined，若是的话转换其为空值。
   * @param value 要检查的值
   * @returns {*} 转换成功为空白字符串，否则为原来的值
   */
  undef(value) {
    return value !== undefined ? value : '';
  },

  /**
   * 检查一个引用值是否为空，若是则转换到缺省值。
   * @param value 要检查的引用值
   * @param defaultValue 默认赋予的值（默认为""）
   * @return {*}
   */
  defaultValue(value, defaultValue = '') {
    if (Array.isArray(value) && value.length === 0) {
      return defaultValue || value;
    }
    return value !== null ? value : defaultValue;
  },

  /**
   * 为能在HTML显示的字符转义&、<、>以及'。
   * @param {String} value 要编码的字符串
   * @return {String} 编码后的文本
   */
  htmlEncode(value) {
    return !value
      ? value
      : String(value)
          .replace(/&/g, '&amp;')
          .replace(/>/g, '&gt;')
          .replace(/</g, '&lt;')
          .replace(/"/g, '&quot;');
  },

  /**
   * 将&, <, >, and '字符从HTML显示的格式还原。
   * @param {String} value 解码的字符串
   * @return {String} 编码后的文本
   */
  htmlDecode(value) {
    return !value
      ? value
      : String(value)
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&');
  },

  /**
   * 裁剪一段文本的前后多余的空格。
   * @param {String} value 要裁剪的文本
   * @return {String} 裁剪后的文本
   */
  trim(value) {
    return String(value).replace(trimRe, '');
  },

  /**
   * 返回一个从指定位置开始的指定长度的子字符串。
   * @param {String} value 原始文本
   * @param {Number} start 所需的子字符串的起始位置
   * @param {Number} length 在返回的子字符串中应包括的字符个数。
   * @return {String} 指定长度的子字符串
   */
  substr(value, start, length) {
    return String(value).substr(start, length);
  },

  /**
   * 返回一个字符串，该字符串中的字母被转换为小写字母。
   * @param {String} value 要转换的字符串
   * @return {String} 转换后的字符串
   */
  lowercase(value) {
    return String(value).toLowerCase();
  },

  /**
   * 返回一个字符串，该字符串中的字母被转换为大写字母。
   * @param {String} value 要转换的字符串
   * @return {String} 转换后的字符串
   */
  uppercase(value) {
    return String(value).toUpperCase();
  },

  /**
   * 返回一个字符串，该字符串中的第一个字母转化为大写字母，剩余的为小写。
   * @param {String} value 要转换的字符串
   * @return {String} 转换后的字符串
   */
  capitalize(value) {
    return !value ? value : value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
  },

  /**
   * 格式化数字到美元货币
   * @param v {Number/String} 要格式化的数字
   * @returns {string} 已格式化的货币
   */
  usMoney(v) {
    let reVal = v;
    reVal = Math.round((reVal - 0) * 100) / 100;
    reVal = reVal === Math.floor(reVal) ? `${reVal}.00` : reVal * 10 === Math.floor(reVal * 10) ? `${reVal}0` : reVal;
    reVal = String(reVal);
    const ps = reVal.split('.');
    let whole = ps[0];
    const sub = ps[1] ? `.${ps[1]}` : '.00';
    const r = /(\d+)(\d{3})/;
    while (r.test(whole)) {
      whole = whole.replace(r, '$1,$2');
    }
    reVal = whole + sub;
    if (reVal.charAt(0) === '-') {
      return `-$${reVal.substr(1)}`;
    }
    return `$${reVal}`;
  },

  /**
   * 将某个值解析成为一个特定格式的日期。
   * @param v 要格式化的值
   * @param {String} format （可选的）任何有效的日期字符串（默认为“月/日/年”）
   * @return {Function} 日期格式函数
   */
  date(v, format = 'YYY-MM-DD') {
    if (!v) {
      return '';
    }
    if (v.constructor === Date) {
      return this.date(v, format);
    }
    if (moment.isMoment(v)) {
      return v.format(format);
    }
    throw new Error('只支持 Date 与 Moment 对象的日期格式');
  },

  /**
   * 剥去所有HTML标签。
   * @param v 要剥去的文本
   * @return {String} 剥去后的HTML标签
   */
  stripTags(v) {
    return !v ? v : String(v).replace(stripTagsRE, '');
  },

  stripScriptsRe: /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/gi,

  /**
   * 剥去所有脚本（<script>...</script>）标签
   * @param v value 要剥去的文本
   * @returns {*} 剥去后的HTML标签
   */
  stripScripts(v) {
    return !v ? v : String(v).replace(this.stripScriptsRe, '');
  },

  /**
   * 对文件大小进行简单的格式化（xxx bytes、xxx KB、xxx MB）
   * @param {Number/String} size 要格式化的数值
   * @return {String} 已格式化的值
   */
  fileSize(size) {
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size < 1048576) {
      return `${Math.round(size * 10 / 1024) / 10} KB`;
    }
    return `${Math.round(size * 10 / 1048576) / 10} MB`;
  },

  /**
   * 依据某种（字符串）格式来转换数字。
   * <div style="margin-left:40px">例子 (123456.789):
   * <div style="margin-left:10px">
   * 0 - (123456) 只显示整数，没有小数位<br>
   * 0.00 - (123456.78) 显示整数，保留两位小数位<br>
   * 0.0000 - (123456.7890) 显示整数，保留四位小数位<br>
   * 0,000 - (123,456) 只显示整数，用逗号分开<br>
   * 0,000.00 - (123,456.78) 显示整数，用逗号分开，保留两位小数位<br>
   * 0,0.00 - (123,456.78) 快捷方法，显示整数，用逗号分开，保留两位小数位<br>
   * 在一些国际化的场合需要反转分组（,）和小数位（.），那么就在后面加上/i
   * 例如： 0.000,00/i
   * </div></div>
   *
   * @method format
   * @param {Number} v 要转换的数字。
   * @param {String} format 格式化数字的“模”。
   * @return {String} 已转换的数字。
   */
  number(v, format) {
    if (!format) {
      return v;
    }
    v *= 1;
    if (typeof v !== 'number' || Number.isNaN(v)) {
      return '';
    }
    let comma = ',';
    let dec = '.';
    let i18n = false;

    if (format.substr(format.length - 2) === '/i') {
      format = format.substr(0, format.length - 2);
      i18n = true;
      comma = '.';
      dec = ',';
    }

    const hasComma = format.indexOf(comma) !== -1;
    let psplit = (i18n ? format.replace(/[^\d\,]/g, '') : format.replace(/[^\d\.]/g, '')).split(dec);

    if (psplit.length > 1) {
      v = v.toFixed(psplit[1].length);
    } else if (psplit.length > 2) {
      throw new Error(`NumberFormatException: invalid format, formats should have no more than 1 period: ${format}`);
    } else {
      v = v.toFixed(0);
    }

    let fnum = v.toString();

    if (hasComma) {
      psplit = fnum.split('.');

      const cnum = psplit[0];
      const parr = [];
      const j = cnum.length;
      let n = cnum.length % 3 || 3;

      for (let i = 0; i < j; i += n) {
        if (i !== 0) {
          n = 3;
        }
        parr[parr.length] = cnum.substr(i, n);
      }
      fnum = parr.join(comma);
      if (psplit[1]) {
        fnum += dec + psplit[1];
      }
    }

    return format.replace(/[\d,?\.?]+/, fnum);
  },

  /**
   * 可选地为一个单词转为为复数形式。例如在模板中，{commentCount:plural("Comment")}这样的模板语言如果commentCount是1那就是 "1 Comment"；
   * 如果是0或者大于1就是"x Comments"。
   * @param v {Number} 参与比较的数
   * @param s {String} singular 单词的单数形式
   * @param  p {String} plural （可选的） 单词的复数部分（默认为加上's'）
   * @returns {string}
   */
  plural(v, s, p) {
    return `${v} ${v === 1 ? s : p || `${s}s`}`;
  },

  /**
   * 字符串模版
   * @param v {String} 模版
   * @param values {Object} 数据对象
   * @returns {string}
   */
  template(v, values) {
    return v.replace(/\{([^\\}]+)\}/, (substring, name) => values[name]);
  }
};
