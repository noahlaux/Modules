/**
 * Returns items array {id, title, imageURL, link
 * @dependency jQuery => 1.4
 */

// Create Namespace
var LBI = window.LBI || {};

LBI.imageTools = {
    /**
     * Initialize
     *
     * @param {Object} options Options for the class
     * @return N/A
     */
     init: function( options ) {
         this.type          = options.type || 'flickr';
         this.flickrAPIKey  = options.flickrAPIKey;
     },
    /**
     * Search for photos by text
     *
     * @param {String} key
     * @param {Integer} pr_page
     * @param {Integer} pagenum
     * @param {Function} callback
     */
    getPhotosSearchByText: function ( key, pr_page, pagenum, callback ) {

        var search_options  = images.search.text[this.type](key),
            paging          = images.paging[this.type](pr_page, pagenum),
            // Insert defaults
            options         = $.extend(paging, search_options);

        return this._getPhotos(options, callback);
    },
     /**
      * Search for photos by tags
      *
      * @param {String} tags Commaseperated string of tags to search for
      * @param {Integer} pr_page Number of images pr page
      * @param {Integer} pagenum Current page
      * @param {Function} eventHandler Callback when done
      * @return N/A
      */
    getPhotosSearchByTags: function (tags, pr_page, pagenum, callback) {

        var search_options  = images.search.tags[this.type](tags),
            paging          = images.paging[this.type](pr_page, pagenum),
            // Insert defaults
            options         = $.extend(paging, search_options);

        return this._getPhotos(options, callback);
    },
    /**
     * Fetch photos from service
     *
     * @param {} options
     * @param {Function} eventHandler
     *
     * @return N/A
     */
    _getPhotos: function (options, callback) {
        
        var optionsURL='';

        // serialize options into URL parameters
        for ( var key in options ) {
            optionsURL += "&" + key + "=" + options[key];
        }

        // Get feed
        $.ajax({
            url: images.baseURL[type]() + optionsURL,
            async: false,
            dataType: 'json',
            success: function (data) {
                callback( images.parse[type](data) );
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log( errorThrown );
            }
        });
    }
};


    var images = {
        /* BASE URLS FOR SERVICES
         * ------------------------*/
        'baseURL' :  {
            'flickr' : function () {
                var apikey = 'da430e07b1a66e95b9fede7896098d99';
                URL = 'http://api.flickr.com/services/rest/';
                return URL + '?format=json&jsoncallback=?&api_key=' + apikey;
            },
            'picasa' : function () {
                // http://code.google.com/intl/da-DK/apis/picasaweb/docs/2.0/reference.html#Parameters
                var URL = 'http://picasaweb.google.com/data/feed/api/all';
                return URL + '?alt=json';
            }
        },
        /* ## SEARCH
         * ----------------------- */
        'search' : {
            // TEXT
            'text' : {
                'flickr' : function ( key ) {
                    // Make flickr search string

                    key = '(' + key.join(" OR ")  + ') AND (Maersk OR Mærsk)';
                    //key = '(' + key.join(" OR ")  + ') AND (Maersk OR Mærsk)';
                    return {
                        'method' : 'flickr.photos.search',
                        'text' : key
                    };
                },
                'picasa' : function ( key ) {
                    var q = '';
                    // Make picasa search string
                    for ( var ship in key ) {
                        q += '"' + key[ship] + ' Maersk" ';
                    }
                    key = q;
                    return {
                        'q' : q
                    };
                }
            },
            // TAGS
            'tags' : {
                'flickr' : function ( tags ) {

//                    var searchtags;
//                    $.each(tags,function(){
//                        searchtags += tags + "+maersk,";
//                    })
                    tags = tags.join(",");
                    return {
                        'method' : 'flickr.photos.search',
                        'tags': tags
                    };
                },
                'picasa' : function (tags) {
                    // Search for picassa tags
                    return {
                        'tags' : tags
                    };
                }
            }
        },
        /* ## PAGING
         * ----------------------------- */
        'paging' : {
            'flickr' : function ( pr_page, pagenum ) {
                return {
                    'per_page' : pr_page,
                    'page' : pagenum
                };
            },
            'picasa' : function ( pr_page, pagenum ) {
                return {
                    'max-results' : pr_page,
                    'start-index' : pagenum
                };
            }
        },
        /* ## Parse and transform request to custom unified format
         * ---------------------------------------------------*/
        'parse' : {
            'flickr' : function (data) {

                var items = [];
                
                $(data.photos.photo).each( function() {
                    // Insert returned photos into array
                    var item = {
                        'id': this.id,
                        'title' : this.title,
                        'imageURL' : 'http://farm{0}.static.flickr.com/{1}/{2}_{3}_{4}.jpg'
                            .replace('{0}', this.farm)
                            .replace('{1}', this.server)
                            .replace('{2}', this.id)
                            .replace('{3}', this.secret)
                            .replace('{4}', 'm'),
                        'link' : 'http://www.flickr.com/photos/{0}/{1}/'
                            .replace('{0}', this.owner)
                            .replace('{1}',this.id)
                    };
                    items.push(item);
                });

                var photos = $.extend( {'items': items }, { 'total': data.photos.total } );
                return photos;
            },
            'picasa' : function (data) {

                var items = [];

                $( data.feed.entry ).each( function( i, entry ) {
                    // Insert returned photos into array
                    var item = {
                        'id': entry.gphoto$id.$t,
                        'title' : entry.title.$t,
                        'imageURL' : entry.media$group.media$thumbnail[2].url,
                        'link' : entry.link[1].href
                    };
                    items.push( item );
                });
                var photos = $.extend( { 'items': items }, { 'total': data.feed.openSearch$totalResults.$t } );

                return photos;
            }
        }
    };
