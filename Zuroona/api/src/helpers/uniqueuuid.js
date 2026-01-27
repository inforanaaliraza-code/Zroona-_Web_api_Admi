const generateUniqueId = (prefix,len) => {
    let result = prefix;
    const characters = '0123456789';
    for (let i = 0; i < len; i++){
        const randomChar = Math.floor(Math.random() * characters.length);
        result += characters[randomChar]
    }
    return result;
}

module.exports =  generateUniqueId;

