/*
 * jquery.csCrop.js
 * jQuery plugin for client side image croping v0.9.0 beta, based on http://github.com/tapmodo/Jcrop
 *
 *
 * last update: 11.2013
 * author: michael verhov
 * http://michael.verhov.com/project/client_side_cropping
 *
 * released under MIT License 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 */

(function ($) {

    $.csCrop = function (obj, sett) {
        var settings = sett,
            fileInput = obj,
            jCropApis = [];
        var api = {
            CropImageToUrl: function (img, area1, area2) {
                var canvas = document.createElement("canvas");
                canvas.width = area2.w;
                canvas.height = area2.h;

                canvas.getContext("2d").drawImage(img, area1.x, area1.y, area1.w, area1.h, area2.x, area2.y, area2.w, area2.h);
                return canvas.toDataURL();
            },
            destroy: function () {
                for (var i = 0; i < jCropApis.length; i++) {
                    jCropApis[i].destroy();
                }
                $(obj).removeData('csCrop');
            }
        };

        function createObjectURL(i) {
            var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
            return URL.createObjectURL(i);
        }
        function ScalePicture(picture, p_width, p_height, scale_size) {
            var canvas = document.createElement("canvas");
            canvas.width = p_width;
            canvas.height = p_height;
            canvas.getContext("2d").scale(scale_size, scale_size);
            canvas.getContext("2d").drawImage(picture, 0, 0);
            return canvas;
        }

        function imageLoaded(e) {
            var imgCroped = document.createElement('img');
            imgCroped.src = e.target.src;

            // if max sizes exceeds and opt is set -> resezing
            if (settings.maxSize && settings.maxSize.width && settings.maxSize.height)
                if (e.target.width > settings.maxSize.width || e.target.height > settings.maxSize.height) {
                    scale_val = Math.min(settings.maxSize.width / e.target.width, settings.maxSize.height / e.target.height);
                img_width = Math.round(e.target.width * scale_val);
                img_height = Math.round(e.target.height * scale_val);

                imgCroped.src = ScalePicture(e.target, img_width, img_height, scale_val).toDataURL();
                }

            if ($.isFunction(settings.onImgLoading))
                settings.onImgLoading(imgCroped);

            var jApi;
            $(imgCroped).Jcrop(settings.jCropOptions, function () {
                jApi = this;
                jCropApis.push(this);
                if ($.isFunction(settings.onJcropLoading))
                    settings.onJcropLoading.call(this);
            });

            if ($.isFunction(settings.onLoadingComplate))
                settings.onLoadingComplate(imgCroped, jApi);
        }
        function imageChanged(e) {
            e.preventDefault && e.preventDefault();

            var images = 'files' in e.target ? e.target.files : 'dataTransfer' in e ? e.dataTransfer.files : [];
            if (images && images.length)
            for (var im = 0; im < images.length; im++) {
                if (typeof images[im] == 'object') {
                    var image = new Image();
                    image.src = createObjectURL(images[im]);
                    image.onload = imageLoaded;
                }
            }
            if ($.isFunction(settings.onFileChanged))
                settings.onFileChanged(this);
        }


        // initialize
        // $this.change(imageChanged); $this = $(obj);
        $(obj).bind('change.csCrop', imageChanged);
        $(obj).data('csCrop', api);

        return api;
    }



    $.fn.csCrop = function (customSettings, callback) {
        // img onload - calback with image: left, top, width, height
        var sett = $.extend({}, $.fn.csCrop.defaults, customSettings),
            api;

        return this.each(function () {
            // if csCrop allready attached
            if ($(this).data('csCrop')) {
                sett.errorMessage('csCrop allready initialize for "' + this.tagName + '#' + this.id + '"');
            }
                // if csCrop dont attached
            else {
                if (this.tagName != 'INPUT')
                    sett.errorMessage('csCrop mast be initialized on <input />');
                else {
                    api = $.csCrop(this, sett);
                    if ($.isFunction(callback)) callback.call(api);
                }
            }
        });
    };



    $.fn.csCrop.defaults = {
        //onFileChanged: function () { },
        //onImgLoading: function () { },
        //onJcropLoading: function () { },
        jCropOptions: {},

        maxSize: null,

        alertErrows: true,
        trowExceptions: false,
        errorMessage: function (ex) {
            if (this.alertErrows)
                alert(ex);
            if (this.trowExceptions)
                throw new Error(ex);
        }
        //write back to input
    };

}(jQuery));