// JavaScript 正则表达式完全指南

// 一、正则表达式基本语法

// 1. 字符匹配

// 普通字符
// 匹配单个字符
const regex1 = /a/; // 匹配字母 a

// 转义字符
const regex2 = /\./; // 匹配点号 "."
const regex3 = /\\/; // 匹配反斜杠 "\\"
const regex4 = /\(/; // 匹配左括号 "("

// 字符类
const regex5 = /[abc]/; // 匹配 a、b 或 c 中的任意一个字符
const regex6 = /[^abc]/; // 匹配除了 a、b、c 之外的任意字符
const regex7 = /[0-9]/; // 匹配任意数字
const regex8 = /[a-z]/; // 匹配任意小写字母
const regex9 = /[A-Z]/; // 匹配任意大写字母
const regex10 = /[a-zA-Z]/; // 匹配任意字母
const regex11 = /[a-zA-Z0-9]/; // 匹配任意字母或数字

// 预定义字符类
const regex12 = /./; // 匹配除换行符外的任意字符
const regex13 = /\d/; // 等价于 [0-9]，匹配任意数字
const regex14 = /\D/; // 等价于 [^0-9]，匹配任意非数字
const regex15 = /\w/; // 等价于 [a-zA-Z0-9_]，匹配任意字母、数字或下划线
const regex16 = /\W/; // 等价于 [^a-zA-Z0-9_]，匹配任意非字母、数字或下划线
const regex17 = /\s/; // 匹配任意空白字符（空格、制表符、换行符等）
const regex18 = /\S/; // 匹配任意非空白字符
const regex19 = /\b/; // 匹配单词边界
const regex20 = /\B/; // 匹配非单词边界
const regex21 = /\n/; // 匹配换行符
const regex22 = /\t/; // 匹配制表符

// 2. 量词
const regex23 = /a*/; // 匹配 0 个或多个 a
const regex24 = /a+/; // 匹配 1 个或多个 a
const regex25 = /a?/; // 匹配 0 个或 1 个 a
const regex26 = /a{3}/; // 匹配恰好 3 个 a
const regex27 = /a{2,5}/; // 匹配 2 到 5 个 a
const regex28 = /a{2,}/; // 匹配至少 2 个 a
const regex29 = /a{0,5}/; // 匹配最多 5 个 a

// 3. 边界匹配
const regex30 = /^a/; // 匹配字符串开头的 a
const regex31 = /a$/; // 匹配字符串结尾的 a
const regex32 = /^abc$/; // 匹配整个字符串为 abc

// 4. 分组和捕获
const regex33 = /(abc)/; // 捕获组，匹配 abc 并捕获
const regex34 = /(?:abc)/; // 非捕获组，匹配 abc 但不捕获
const regex35 = /(a|b)c/; // 或运算，匹配 ac 或 bc
const regex36 = /(a(bc))/; // 嵌套分组，捕获 ab 和 bc
const regex37 = /\1/; // 反向引用，匹配第一个捕获组匹配的内容
const regex38 = /(?<name>abc)/; // 命名捕获组

// 5. 贪婪和非贪婪
const regex39 = /a+/; // 贪婪匹配，尽可能多地匹配 a
const regex40 = /a+?/; // 非贪婪匹配，尽可能少地匹配 a

// 二、常用正则表达式模式

// 1. 验证类正则表达式

// 手机号码（中国大陆）
const regexPhone = /^1[3-9]\d{9}$/;

// 邮箱地址
const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// 身份证号（18位）
const regexIdCard = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

// 邮政编码（中国大陆）
const regexPostalCode = /^[1-9]\d{5}$/;

// URL地址
const regexUrl = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// IP地址（IPv4）
const regexIpv4 = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

// 日期格式（YYYY-MM-DD）
const regexDate = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// 时间格式（HH:MM:SS）
const regexTime = /^([01]?\d|2[0-3]):[0-5]\d:[0-5]\d$/;

// 整数
const regexInteger = /^-?\d+$/;

// 小数
const regexDecimal = /^-?\d+\.\d+$/;

// 正整数
const regexPositiveInteger = /^[1-9]\d*$/;

// 负整数
const regexNegativeInteger = /^-[1-9]\d*$/;

// 中文字符
const regexChinese = /^[\u4e00-\u9fa5]+$/;

// 用户名（字母开头，允许字母、数字、下划线，长度6-20位）
const regexUsername = /^[a-zA-Z][a-zA-Z0-9_]{5,19}$/;

// 密码强度（至少包含大小写字母、数字和特殊字符，长度8-20位）
const regexStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

// 2. 提取和替换类正则表达式

// HTML标签
const regexHtmlTag = /<[^>]+>/g;

// 去除首尾空格
const regexTrim = /^\s+|\s+$/g;

// 数字提取
const regexExtractNumbers = /\d+/g;

// 中文字符提取
const regexExtractChinese = /[\u4e00-\u9fa5]+/g;

// 驼峰命名转下划线命名
const regexCamelToSnake = /([a-z])([A-Z])/g;

// 下划线命名转驼峰命名
const regexSnakeToCamel = /_([a-z])/g;

// 三、JavaScript 中正则表达式的使用

// 1. 创建正则表达式

// 字面量形式
const regexLiteral = /hello/;

// 构造函数形式
const regexConstructor = new RegExp('hello');
const regexConstructorWithFlags = new RegExp('hello', 'gi');

// 2. 正则表达式方法

// test() 方法 - 测试字符串是否匹配正则表达式，返回布尔值
const testResult = /hello/.test('hello world'); // true

// exec() 方法 - 执行匹配，返回匹配结果数组或 null
const execResult = /hello/.exec('hello world'); // ["hello", index: 0, input: "hello world", groups: undefined]

// 3. 字符串方法中的正则表达式

// match() 方法 - 查找匹配项，返回匹配结果数组或 null
const matchResult = 'hello world'.match(/hello/); // ["hello", index: 0, input: "hello world", groups: undefined]
const matchAllResult = 'hello world hello'.match(/hello/g); // ["hello", "hello"]

// search() 方法 - 查找匹配位置，返回索引或 -1
const searchResult = 'hello world'.search(/world/); // 6

// replace() 方法 - 替换匹配项，返回替换后的字符串
const replaceResult = 'hello world'.replace(/world/, 'javascript'); // "hello javascript"
const replaceAllResult = 'hello world hello'.replace(/hello/g, 'hi'); // "hi world hi"

// split() 方法 - 根据匹配项分割字符串，返回数组
const splitResult = 'hello,world,javascript'.split(/,/); // ["hello", "world", "javascript"]

// 4. 正则表达式标志

// g - 全局匹配
const globalRegex = /hello/g;

// i - 忽略大小写
const caseInsensitiveRegex = /hello/i;

// m - 多行匹配
const multilineRegex = /^hello/m;

// s - 单行模式，使 . 匹配换行符
const dotAllRegex = /hello.world/s;

// u - Unicode 模式
const unicodeRegex = /\u{1F600}/u;

// y - 粘性匹配，从上次匹配结束位置开始
const stickyRegex = /hello/y;

// 四、实际应用示例

// 1. 表单验证示例
function validateForm(input) {
    return {
        isPhone: regexPhone.test(input),
        isEmail: regexEmail.test(input),
        isIdCard: regexIdCard.test(input),
        isUrl: regexUrl.test(input),
        isDate: regexDate.test(input),
        isStrongPassword: regexStrongPassword.test(input)
    };
}

// 2. 文本处理示例
function processText(text) {
    return {
        // 提取所有数字
        extractNumbers: text.match(regexExtractNumbers) || [],
        // 提取所有中文
        extractChinese: text.match(regexExtractChinese) || [],
        // 移除HTML标签
        removeHtmlTags: text.replace(regexHtmlTag, ''),
        // 驼峰转下划线
        camelToSnake: text.replace(regexCamelToSnake, '$1_$2').toLowerCase(),
        // 下划线转驼峰
        snakeToCamel: text.replace(regexSnakeToCamel, (match, p1) => p1.toUpperCase()),
        // 去除首尾空格
        trim: text.replace(regexTrim, '')
    };
}

// 3. 高级应用：解析URL参数
function parseUrlParams(url) {
    const params = {};
    const regex = /[?&]([^=&#]+)=([^&#]*)/g;
    let match;
    
    while ((match = regex.exec(url)) !== null) {
        params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
    }
    
    return params;
}

// 4. 高级应用：千位分隔符
function formatNumberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 五、正则表达式性能优化

// 1. 避免回溯陷阱
// 不好的写法：可能导致大量回溯
const badRegex = /^(a+)+$/;

// 好的写法：避免不必要的嵌套重复
const goodRegex = /^a+$/;

// 2. 使用具体的字符类代替通配符
// 不好的写法：使用过多的通配符
const badRegex2 = /.*/;

// 好的写法：使用具体的字符类
const goodRegex2 = /[\w\s]*/;

// 3. 尽量使用非捕获组
// 不需要捕获时使用非捕获组 (?:...)
const nonCapturingRegex = /(?:abc)+/;

// 4. 使用正确的量词
// 根据实际需求选择合适的量词
const exactRegex = /a{3}/; // 匹配恰好3个a
const rangeRegex = /a{2,5}/; // 匹配2-5个a

// 5. 编译正则表达式（对于频繁使用的正则）
// 使用RegExp对象并保存引用
const compiledRegex = new RegExp('pattern', 'flags');