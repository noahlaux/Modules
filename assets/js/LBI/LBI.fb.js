/**
 * Bridge to the new Facebook SDK with oauth 2, that loads the SDK asyncronously,
 * creates the FaceBook DOM root element and defaults to auto grow the application iframe
 *
 * @class LBI.fb
 *
 * @example
 * // Initiate with apikey (mandatory)
 * LBI.fb.init({ apiKey: '281411815254963' })
 *
 * @example
 * // Initiate and check if user likes a page
 * LBI.fb.init({apiKey: '281411815254963'}, function(fb) {
 *       if ( fb.hasLiked('125289967525962') ) {
 *           // User likes the page
 *       } else {
 *           // User do not like the page
 *       }
 * });
 *
 * // API docs & reference
 * http://developers.facebook.com/docs/reference/javascript/
 *
 * @author Noah Laux (noah.laux@lbi.com)
 */

// Create Namespace
var LBI = window.LBI || {};

LBI.fb = {
    /**
     * Setup up Facebook and loads the FB namespace
     *
     * @example LBI.fb.init({ apiKey: '281411815254963' })
     *
     * @constructor
     *
     * @param {Object} options
     * @param {Object} callback
     *
     * @return {Object} this
     */
    init: function( options, callback ) {

        // Create FaceBook DOM root element
        this.createRootElement();

        // Load the FaceBook SDK Asynchronously
        var js,
            id = 'facebook-jssdk';

        if ( !document.getElementById( id ) ) {
            js = document.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            document.getElementsByTagName('head')[0].appendChild(js);
        }
        
        // Initiated when the FaceBook SDK har loaded
        window.fbAsyncInit = this._fbInit( options, callback );
    },
    /**
     * Called when the FaceBook SDK has loaded
     *
     * @private
     * 
     * @param {Object} options
     * @param {Function} callback
     * @return N/A
     */
    _fbInit: function( options, callback ) {

        // Initialize FaceBook
        FB.init({
            appId      : options.apiKey, // App ID
            channelUrl : options.channelUrl, // Channel File
            status     : options.status || true, // check login status
            cookie     : options.cookie || true, // enable cookies to allow the server to access the session
            xfbml      : options.xfbml || true  // parse XFBML
        });

        // Autogrow FaceBook iframe
        if( !options.autoGrow ) {
            FB.Canvas.setAutoGrow();
        }

        // Callback
        if (callback) {
            callback( this );
        }
    },
    /**
     * Check is user has liked the page
     *
     * @example LBI.fb.hasLiked('125289967525962')
     *
     * @param {String} page_id From Facebook
     * @return {Boolean} true/false whether user liked the provided page
     */
    hasLiked: function( page_id ) {
        if ( this.apiCheck ) {
            // Check if user like the page
            FB.api({ method: 'fql.query', query: 'SELECT uid FROM page_fan WHERE uid= ' + FB.getUserID() + ' AND page_id=' + page_id }, function( result ) {
                if ( result.length ) {
                    // User liked the application
                    return true;
                } else {
                    // User didn't like the application
                    return false;
                }
            });
        }
    },
    /**
     * Set size of application iframe
     *
     * @example LBI.fb.setSize(600, 800) | LBI.fb.setSize()
     *
     * @function
     *
     * @param {Integer} width
     * @param {Integer} height
     * @return N/A
     */
    setSize: function( width, height ) {
        if (this.apiCheck) {
            // Set size
            if ( width && height ) {
                FB.Canvas.setSize({ width: width, height: height });
            } else {
                FB.Canvas.setSize(); // Facebook tries to auto assume new size
            }
        }
    },
    /**
     * Create Facebook Root element if it doesn't exist
     *
     * @function
     *
     * @return N/A
     */
    createRootElement: function() {
        if ( document.getElementById('fb-root') ) {
            var element = document.createElement('div');
            element.id = 'fb-root';
            document.getElementsByTagName('body')[0].appendChild( element );
        }
    },
    /**
     * Check if FaceBook API has been loaded
     *
     * @function
     *
     * @return {Boolean} true/false whether FaceBook API has been loaded
     */
    apiCheck: function() {
        if ( FB ) {
            return true;
        } else {
            alert('You need to Initialize with an apikey first');
            return false;
        }
    }
};