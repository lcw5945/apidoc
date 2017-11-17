/**
 * Created by lichunwei on 2016/8/30.
 */

class ArrayUtils {
    static  max(array) {
        return Math.max.apply(null, array);
    }

    static each(obj, callback) {
        let value,
            i = 0,
            length = obj.length,
            isArray = Object.prototype.toString.apply(obj) === '[object Array]';
        if (isArray) {
            for (; i < length; i++) {
                value = callback.call(obj[i], i, obj[i]);
                if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = callback.call(obj[i], i, obj[i]);
                if (value === false) {
                    break;
                }
            }
        }
        return obj;
    }

    /**
     * 数组中是否存在
     * @param haystack
     * @param needle
     * @returns {*|boolean}
     */
    static inArray(haystack, needle) {
        return Array.prototype.indexOf && (haystack.indexOf(needle) != -1);
    }

    /**
     * 是否是数组
     * @param value
     * @returns {boolean}
     */
    static isArray(value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    }
}

export default ArrayUtils;