$(function () {
    $("#slider").responsiveSlides({
        auto: true,
        nav: true,
        speed: 500,
        namespace: "large-btns"
    });
    $("#slider-mobile").responsiveSlides({
        auto: true,
        nav: true,
        speed: 500,
        namespace: "transparent-btns"
    });

    /* $(".promocarousel").find("#slider li").on("click", function (e) {
        if (!stopRedirect(e)) {
            e.preventDefault()
            return false;
        } else {
            contextRedirect($(this));
        }
    });

    $(".promocarousel").find("#slider-mobile li").on("click", function (e) {
        if (!stopRedirect(e)) {
            e.preventDefault()
            return false;
        } else {
            contextRedirect($(this));
        }
    }); */

    function contextRedirect(dom) {
        var catId = new String($(dom).children('img').attr('class')).split("-")[1];
        if (catId !== "") {
            if (catId === "promo") {
                document.location.replace($("#banner-input-context").val() + "service/faq");
            } else {
                document.location.replace($("#banner-input-context").val() + "cs/" + catId);
            }
        }
    }

    function stopRedirect(event) {
        var loggedIn = $("#loggedIn").val();
        if (loggedIn == 'NO') {
            // $("#trmskymallpa-frame").show();
            $('#login-modal').foundation('reveal', 'open');
            event.preventDefault()
            return false;
        }
        return true;
    }

});
