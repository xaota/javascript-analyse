/** @section @imports */
  import Num from '/javascript-std-lib/library/number.js';

/** @section @exports */
/** {Analyse} анализ данных @class @static
  * @author xaota
  * @required javascript-std-lib {Num}
  */
  export default class Analyse {
  /** Гистограмма
    * @param {array} values данные
    * @return {object} {min, P05, Q1, median, Q3, P95, max, IQR, mean, extreme = {less, more}}
    */
    static histogram(values) {
      const data = {
        length: values.length,
        max   : Math.max(...values),
        min   : Math.min(...values),
        values
      };
      return data;
    }

  /** Ящик с усами (рассеивание)
    * @param {array} values данные
    * @param {number} lambda параметр влияния на длину усов (0 -> auto)
    * @return {object} {min, P05, Q1, median, Q3, P95, max, IQR, mean, extreme = {less, more}}
    */
    static box(values, lambda = 1.5) {
      const data = {
        length: values.length,
        mean  : Num.mean(values),
        median: Num.median(values),
        min   : Math.min(...values),
        max   : Math.max(...values),
        Q1    : Num.quartile(values, 1),
        Q3    : Num.quartile(values, 3),
        P05   : Num.percentile(values, 0.05),
        P95   : Num.percentile(values, 0.95)
      };
      data.IQR     = data.Q3 - data.Q1;
      const length = lambda * data.IQR;
      data.whisker = length === 0
        ? {min: data.Q1 - (data.Q1 - data.P05), max: data.Q3 + (data.P95 - data.Q3)}
        : {min: data.Q1 - length,               max: data.Q3 + length};
      data.extreme = {
        less: values.filter(e => e < data.whisker.min),
        more: values.filter(e => e > data.whisker.max)
      };
      data.domain = Math.max(data.max, data.whisker.max) - Math.min(data.min, data.whisker.min);
      return data;
    }
  }
