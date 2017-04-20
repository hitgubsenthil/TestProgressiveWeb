
$(document).ready(function() {

    $("#quickview-addcart").click(function(e) {
        e.preventDefault();
        var add = true;
        $("#quickview-specs select").each(function() {
            if ($(this).is(":required") && $(this).val() === "") {
                add = false;
            }
        });
        $("#quickview-specs textarea").each(function() {
            if ($(this).is(":required") && $(this).val() === "") {
                add = false;
            }
        });
        if (add) {
            ajaxCall("/cart/add/");
        }
    });

    $("#quickview-addwishlist").click(function(e) {
        e.preventDefault();
        ajaxCall("/secure/wishlist/add/");
    });

});

function ajaxCall(context) {
    $.ajax({
        type: "GET",
        data: $("#quickviewform").serialize(),
        url: paths.PATH + context + $('#quickview-id').val(),
        success: function(d) {
            $("#quickview").foundation("reveal", "close");
        }
    }).done(function(m) {
        document.location.reload();
    });
}


function doQuickView(p) {
    $.ajax({
        type: "GET",
        url: p,
        data: {},
        success: function(d) {
            $("#quickview-addcart").show();
            $("#quickview-addwishlist").show();
            $.each(d.result, function(k, v) {
                if (k === "id") {
                    $("#quickview-" + k).val(v);
                } else if (k === "variants") {
                    $("#quickview-addcart").hide();
                    $("#quickview-addwishlist").hide();
                    $("#quickview-" + k).html(v);
                } else {
                    $("#quickview-" + k).html(v);
                }
            });
        }
    }).done(function(m) {
        $("#quickview").foundation("reveal", "open");

        $("#variant").on('change', function(e) {
            e.preventDefault();
            doQuickView(paths.PATH + "/quickview/" + $(this).val());
        });
    });
}
