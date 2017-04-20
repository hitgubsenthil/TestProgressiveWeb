$(window).load(function() {
    $("#carousel-brand").css('width', '100%');
    $("#carousel-brand").css('height', '100%');

    $("#carousel-wrapper").carousel({
        visibleItems: 5,
        enableResponsiveBreakpoints: true,
        autoPlay: true,
        animationSpeed: 4000,
        autoPlaySpeed: 3000,
        responsiveBreakpoints: {
            tablet: {
                changePoint: 640,
                visibleItems: 3
            }
        }
    });
});