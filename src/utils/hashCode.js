function hashCode(str) {
    let h = 0;
    const len = str.length;
    const t = 2147483648;
    for (let i = 0; i < len; i++) {
        h = 31 * h + str.charCodeAt(i);
        if (h > 2147483647) h %= t; // int溢出则取模
    }
    /*var t = -2147483648 * 2;
     while (h > 2147483647) {
     h += t
     }*/
    const hashCode= h.toString();
    if (hashCode.length <= 8) return hashCode;
    return hashCode.substr(hashCode.length - 8, 8);
}

/*
 * randomWord 产生任意长度随机字母数字组合
 * randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
 * 用法  randomWord(false,6);规定位数 false
 * randomWord(true,3，6);长度不定，true
 * arr变量可以把其他字符加入，如以后需要小写字母，直接加入即可
 */
function randomWord(randomFlag, min, max) {
    let str = "";
    let range = min;
    let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

export function getHashCode() {
    const timestamp = (new Date()).valueOf();
    const myRandom = randomWord(false, 4, 6);
    return hashCode(myRandom + timestamp.toString());
}

export default {
    getHashCode
}