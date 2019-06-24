
var encryptionKey  = "Abcdefghijklmnop";
var iterationCount = 1000;
var keySize = 128;
var iv = "dc0da04af8fee58593442bf834b30739";
var salt = "dc0da04af8fee58593442bf834b30739";
fillKey();

function fillKey() {
    jQuery.get('js/lib/key/file.txt', function(data) {
        encryptionKey = data;
    });
}
    function decrypt(str) {
        var aesUtil = new AesUtil(keySize, iterationCount);
        var plaintext =  aesUtil.decrypt(salt, iv, encryptionKey, str);
        return plaintext;

    }

    function encrypt(str) {
        var aesUtil = new AesUtil(keySize, iterationCount);
        var plaintext =  aesUtil.encrypt(salt, iv, encryptionKey, str);
        return plaintext;

    }

    var AesUtil = function(keySize, iterationCount) {
        this.keySize = keySize / 32;
        this.iterationCount = iterationCount;
    };

    AesUtil.prototype.generateKey = function(salt, passPhrase) {
        var key = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt),
            { keySize: this.keySize, iterations: this.iterationCount });
        return key;
    };

    AesUtil.prototype.decrypt = function(salt, iv, passPhrase, cipherText) {
        var key = this.generateKey(salt, passPhrase);
        var cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(cipherText)
        });
        var decrypted = CryptoJS.AES.decrypt(cipherParams,key,
            { iv: CryptoJS.enc.Hex.parse(iv) });
        return decrypted.toString(CryptoJS.enc.Utf8);
    };

    AesUtil.prototype.encrypt = function(salt, iv, passPhrase, plainText) {
        var key = this.generateKey(salt, passPhrase);
        var encrypted = CryptoJS.AES.encrypt(
            plainText,
            key,
            {iv: CryptoJS.enc.Hex.parse(iv)});
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64);

    };