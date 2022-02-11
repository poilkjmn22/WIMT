/*
 * @Author: zhangchuanzhong
 * @Date: 2021-04-15 15:09:07
 * @LastEditors: xiaoxing.zhou
 * @LastEditTime: 2022-02-10 10:56:20
 * @Description: 正则表达式
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */

// 通用正则
export const NORMAL_NAME = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/ // 汉字、数字、字母
export const NORMAL_NAME_U = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/ // 汉字、数字、字母、下划线
export const CHINESE_NAME = /^[\u4e00-\u9fa5]+$/ // 汉字
export const CHINESE_NAME_LETTER = /^[\u4e00-\u9fa5a-zA-Z]+$/ // 汉字、字母
export const NORMAL_CODE = /^[a-zA-Z0-9_]+$/ // 字母、数字、下划线
export const LETTER_NUMBER = /^[a-zA-Z0-9]+$/ // 字母+数字
export const POSITIVE = /^\d+(\.\d*)?$/ // 正有理数
export const POSITIVE_INT = /^[1-9]\d*$/ // 正整数
export const NORMAL_NAME_BOTH = /^[\u4e00-\u9fa5a-zA-Z0-9()（）·.\-_—@#$&^<>]+$/ //  汉字、数字、字母、特殊字符, 中英文()\·.-——@#$&^<>
export const NORMAL_CODE_POINT = /^[a-zA-Z0-9_-]+$/ // 字母、数字、_或-
export const NON_SPACE = /^[^\s]+$/ // 空格除外的组合
export const LON_LAT = /^[0-9.]+$/ // 数字,.
export const PLANE_CODE = /^[0-9A-Z-]+$/ // 大写字母、数字、中划线
export const PLANE_MODEL = /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/ // 汉字、数字、字母、下划线、中划线
export const MODEL_ID = /^[0-9A-Z]+$/ // 大写字母、数字

// 其他
export const PASSWORD = /^(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-z0-9\W_]{8,}$/i
export const PASSWORD_REG = /^(?=.*[!@#$%^&*\-+=])[\dA-Za-z!@#$%^&*\-+=]{8,}$/ // 只允许这些字符!@#$%^&*-+=
export const MSG_CODE = /^\d{6,6}$/ // 6位数字 短信验证码

export const EMAIL = /^.*[^\s]+[@][^\s]+.*$/ // 含@前后不为空-邮箱
export const MOBILE = /^1[0-9]\d{9}$/ // 11位移动手机号
export const CUSTOMER_USER_NAME = /^[a-zA-Z][\da-zA-Z_]*$/ // 字母开头，为字母、数字、‘_’的任意组合

export const ENTERPRISE_NAME = /^[\u4e00-\u9fa5()（）·.\-_—@#$&^<>]+$/ // 企业名称 汉字、特殊字符, 中英文()\·.-——@#$&^<>
export const CREDIT_CODE = /^[0-9A-Z]{18}$/ // 统一信用代码 只能由十八位的数字或大写字母
export const CONTACT = /^[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z\s.·]*$/ // 联系人/客户名称 汉字或字母开头，可输入汉字、字母、空格、'.'、'·'
export const TELEPHONE = /^(([02-9][\d-]{4,})|(1\d{10}))$/ // 固话/手机号
export const ID_CARD = /^\d{17}[0-9X]$/i // 身份证号

export const SUPPLY_NAME = /^[^0-9a-zA-Z%*]+$/ // 供应商名称 不能包含数字、字母、%和*
export const TEMPLATE_NAME = /^[\u4e00-\u9fa5()（）\-_—/,<>]+$/ // 消息模板名称 汉字、字符（包括中英文（）、-、_、——、/、，、<、>）
export const MAS_ID = /^[a-z0-9]{32}$/ // 32位数字+小写字母组成

export const HTTP_URL = /^http(s?):\/\/([^\u4e00-\u9fa5\s]+)$/ // http://或https:// 开头字母、数字及特殊符号（空格除外）的组合
export const URL = /^[^\u4e00-\u9fa5\s]+$/ // url 字母、数字及特殊符号（空格除外）的组合
export const PRODUCT_NAME = /^[^%*]+$/ // 不能包含%和*
export const SHELVES_NAME = /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/ // 货架名称只能由字母、数字、汉字、下划线和横杠组成

export const ARTICLE_TITLE = /^[\u4e00-\u9fa5a-zA-Z0-9()（）\-_]+$/ // 文章标题：汉字、英文、数字、特殊字符（包括中英文（）、-、_）

export const DOMAIN = /^((?=[a-z0-9-]{1,63}\.)[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}$/
export const IP = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/
// 特殊范围数字
export const NUM_1_999 = /^[1-9][0-9]{0,2}$/ //1-9,10-99,100-999,1000-9999,10000-99999
export const NUM_1_99999 = /^[1-9][0-9]{0,4}$/ //1-9,10-99,100-999,1000-9999,10000-99999
export const NUM_1_99999999 = /^[1-9][0-9]{0,7}$/ //1-99999999
export const NUM_1_4094 = /^(([1-9][0-9]{0,2})|([1-3][0-9]{3})|(40[0-9][0-4]))$/ //1-999,1000-3999,4000-4094

export const COLOR_HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/ //十六进制颜色
