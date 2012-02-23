/**
 * Cross browser Cookie handling
 *
 * @class LBI.cookie
 *
 * @example
 * // Set a cookie
 * LBI.cookie.set('test', 'test value', 1);
 *
 * // Check if user liked a page
 * LBI.cookie.get('test')
 * 
 * @author Noah Laux (noah.laux@lbi.com)
 */

// Create Namespace
var LBI = window.LBI || {};

LBI.cookie = {
    /**
     * Sets a cookie with value in browser
     *
     * @param {String} name Name of cookie
     * @param {String} value Value of cookie
     * @param {Integer} exdays Days before expire
     * @return N/A
     */
    set: function( name, value, exdays ) {
        var exdate = new Date();
        exdate.setDate( exdate.getDate() + exdays );
        
        var c_value = escape(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = name + "=" + c_value;
    },
    /**
     * Get cookie from browser
     *
     * @param {String} name Name of cookie
     * @return {String} unescaped cookie value
     */
    get: function ( name ) {
            var x, 
                y, 
                ARRcookies = document.cookie.split(";"),
                cookiesLength = ARRcookies.length;

        for (var i = 0; i < cookiesLength; i++) {
            x = ARRcookies[i].substr( 0, ARRcookies[i].indexOf("=") );
            y = ARRcookies[i].substr( ARRcookies[i].indexOf("=") + 1 );
            x = x.replace(/^\s+|\s+$/g,"");
            
            if ( x === name ) {
                return unescape(y);
            } else {
                return false;
            }
        }
    }
};