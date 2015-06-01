// XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js
Utils = {
  capitalize: function(str){
    str = str == null ? '' : String(str);
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};
