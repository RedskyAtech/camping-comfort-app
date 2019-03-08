alert('test');
var url = new URL(window.location.href);
var imgSrc = url.searchParams.get('image');
var imgTag = new Image(200,200);
imgTag.src = imgSrc;