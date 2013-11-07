csCrop.js
=========

jQuery plugin for client side image croping v0.9.0 beta, based on http://github.com/tapmodo/Jcrop

  - loading and cropping image without uploaded to the server
  - resulting image is in the base64 format

How to use
-----------
Add plagins:

```
<script src="js/jquery.min.js"></script>
<script src="js/jquery.Jcrop.min.js"></script>
<script src="js/jquery.csCrop.js"></script>
<link rel="stylesheet" href="css/jquery.Jcrop.css" type="text/css" />
```
Add markup:
```
<body>
    <div id="imgCropArea"></div>
    <input type="file" id="csCropInput" />
    <button id="crop-btn" value="select picture" />
    <textarea></textarea>
</body>
```
Initialize the plugin
```
<script type="text/javascript">
    $(document).ready(function () {
        var csApi, jcApi, cImg;
        $('#csCropInput').csCrop({
                onImgLoading: function(img) { $('#imgCropArea').append(img); cImg = img; },
                onJcropLoading: function () { jcApi = this }
            },
            function () { csApi = this });
    });
    
    $('#crop-btn').click(function(){
        var base64 = csApi.CropImageToUrl(cImg, jcApi.tellSelect(), { x: 0, y: 0, w: 200, h: 100 });
        $('textarea').text(base64);
    })
    
</script>

```


More
----------
 * No cross-platform
 * Plugin in development

MIT License
===========

**Jcrop is free software under MIT License.** Copyright (c) 2008-2012 Tapmodo Interactive LLC, http://github.com/tapmodo/Jcrop

**csCrop is free software under MIT License.**

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.