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
