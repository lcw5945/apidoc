/**
 * Created by lichunwei on 2016/8/16.
 */

const StringUtils = {
    replaceAll (string, find, replace) {
        return string.replace(new RegExp(find.replace(/([.*+?\^=!:flex{}()|\[\]\/\\])/g, '\\$1'), 'g'), replace);
    },
    trim (text) {
        let rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        return text == null ? "" : (text + "").replace(rtrim, "");
    },
    trimFirstAndLastChar(source, target) {
        let beginIndex = source.indexOf(target);
        let endIndex = source.lastIndexOf(target);
        return source.substring(beginIndex+1, endIndex);
    }
};

export default StringUtils;