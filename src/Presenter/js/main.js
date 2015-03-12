var world = document.getElementById('world'),
    viewport = document.getElementById('viewport'),
    t = 'translateZ(0)',
    d = 0,
    p = 600;

viewport.style.webkitPerspective = p;
viewport.style.MozPerspective = p;
viewport.style.oPerspective = p;


$(window).mousemove(function( event ) {
    var wrappBox = $("#world");
    wrappBox.css('transform', 'rotateY('+ (event.pageX - 960)/40 +'deg) rotateX('+ (event.pageY - 540)/100 +'deg)');
});


