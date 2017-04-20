$(document).ready(function() {
    $('.footer-sub1 form input[type=submit]').click(function(e) {
        e.preventDefault();
        var form = $(this.form);
        $.ajax({
            type: "GET",
            url: paths.PATH + "/service/subscribe",
            data: form.serialize(),
            dataType: "json",
            success: function(json) {
                //console.log(json.status);
                if (json.status === "success")
                    form.prepend("<p style=\"color:#E21E36\">" + json.result + "</p>");
            }
        });
    });
    
    $('#contacts').submit(function(e) {
        e.preventDefault();
        if (validateContactDetail("#contacts")) {
            $(".ajax").show();
            $("#contacts").append('<input type="hidden" name="cg" value="'+csrfTokenValue+'"/>');
            $.ajax({
                type: "POST",
                url: paths.PATH + "/service/contactus",
                data: $("#contacts").serialize(),
                dataType: "json",
                success: function(json) {
                    $("#delivery-message").html(json.result);

                }
            });
        }
        $(document).ajaxStop(function() {
            $(".ajax").hide();
        });
    });
    

    function validateContactDetail(form) {
        if (($(form).find('#email').val() === "") && ($(form).find('#phone').val() === "")) {
            $("#delivery-message").html('Please enter at least email or phone no');
            return false;
        }
        return true;
    }

});

