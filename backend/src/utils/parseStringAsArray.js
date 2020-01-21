module.exports = function parseStringAsArray(arrayAsString) {
    return arrayAsString.split(',').map(p => p.trim());
}