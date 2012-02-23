// Create Namespace
var LBI = window.LBI || {};

/**
 * Utils
 *
 * @class LBI.utils
 * 
 * @author Noah Laux (noah.laux@lbi.com)
 */

LBI.utils = {
    /**
     * GUID generator
     *
     * @return (String} GUID
     */
    getGuid: function() {
        function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },
    /**
     * Replaces all occurences of string
     *
     * @param {string} str String to be searched
     * @param {string} from String to search for
     * @param {string} to Replace string
     * @return {string}
     */
    replaceAll: function (haystack, needle, replace) {
        if (haystack !== undefined) {
            var idx = haystack.indexOf(needle);

            while (idx > -1) {
                haystack = haystack.replace(needle, replace);
                idx = haystack.indexOf(needle);
            }
        }
        return haystack;
    },
     /**
      * Return single url parameter
      *
      * @param {String} parameter:
      * @return {String} Value of Url parameter
      */
    query: function (parameter) {
        var hu = window.location.search.substring(1),
            gy = hu.split("&");
        
        for (var i=0; i < gy.length; i++) {
            var ft = gy[i].split("=");
            if (ft[0] == parameter) {
                return ft[1];
            } else {
                return '';
            }
        }
    },
    /**
     * Returns a formatted string where $1 to $9 are replaced by the second to the
     * tenth argument.
     *
     * @param {string} s The format string.
     * @param {...string} The extra values to include in the formatted output.
     * @return {string} The string after format substitution.
     */
    replaceArgs: function (s, args) {
      return s.replace(/\$[$1-9]/g, function(m) {
        return (m == '$$') ? '$' : args[m[1]];
      });
    }
};