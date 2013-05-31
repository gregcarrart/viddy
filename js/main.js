function appendSvg() {
    var ie10 = /MSIE 10.0/;
    var ua = navigator.userAgent;
    var ie10matched = ua.match(ie10);
    
    if (ie10matched) {
        $('#svg-container').append('<svg id="svg-fun" xmlns="http://www.w3.org/2000/svg"></svg>');
        $('#blocker').remove();
   } else {

   }
};

appendSvg();