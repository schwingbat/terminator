module.exports = function(node) {
    if (typeof node === 'string') {
        return document.querySelector(node);
    }
    return node;
}