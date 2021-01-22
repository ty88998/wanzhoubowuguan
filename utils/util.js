/**
 * 格式化日期
 * @param {*} date 
 */
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 数字补0
 * @param {*} n 
 */
export const formatNumber = n => {
  return n > 10 ? `${n}` : `0${n}`
}

/**
 * 传入数组，转换为瀑布流数据
 * @param {*} arr 已转换的瀑布流
 * @param {*} data 未转换的瀑布流
 */
export const dataToColumn = (arr, data) => {
  const len = arr.length
  const middle = Math.ceil(len / 2)
  const tmpA = arr.slice(0, middle)
  const tmpB = arr.slice(middle, len)
  for (let i = 0; i < data.length; i++) {
    if (i % 2 == 0) tmpA.push(data[i])
    else tmpB.push(data[i])
  }
  return [...tmpA, ...tmpB]
}

/**
 * 2020.12.14新增方法
 * @param {*} str 接收一段字符串(富文本,只适用于带p标签的多段文本)
 */
export const get_HTML_str = (str) => {
  //分割出每一段文本
  let strArr = str.split('p>');
  //对生成的数组筛选出有意义的元素
  let everyStrArr = strArr.filter(value => value && value != '<');
  //对新生成数组中每个元素进行分割，生成二维数组(将span标签去掉，这里我们用函数配合循环)。
  let allEveryArr = everyStrArr.map(value => value.split(/[<]/));
  //调用写好的筛选方法。
  let arr = [];
  for (let j = 0; j < allEveryArr.length; j++) {
    let newStr = getStr(allEveryArr[j]);
    arr.push(newStr)
  }
  function getStr(arr) {
    let newStr = '';
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i] || arr[i] == "/") continue;
      newStr += arr[i].split(/[>]/)[1];//对分割后的有用数据进行字符串拼接
    }
    return newStr;
  }
  return arr;
}
