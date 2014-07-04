window.onload = function(){
    $(".niveau").animate({
        left: "0px"
    }, 600).on("click", maximise);
    $( ".formation h3" ).on('click', agrandir_paragraphe);
    $(".formation a, .formation").on('click', function(e){
        e.stopPropagation();
    });
};

function maximise() {
    if ($(this).hasClass("expanded")) {

        $(this).css({
            position: "",
            width: "",
            margin: ""
        })
        var pos = {
            left: this.offsetLeft + 5,
            top: this.offsetTop
        };

        // Fermer les formations a la fermeture des cursus
        $(".action").animate({
            height: '0'
        }, 500).removeClass('action');

        $(this).stop()
        .css({
            position: "absolute",
            width: "100%",
            margin: "0 auto"
        }).animate({
            width: "30%",
            height: "120px",
            left: pos.left,
            top: pos.top
        }, 600, function() {
            $(this).css({
                position: "",
                margin: "",
                left: "0",
                top: "0",
                zIndex: "0"
            }).removeClass("expanded");
            $(".placeholder").remove();
        })
        .find(".formation").animate({
            opacity: 0
        }, 300);
    }
    else {
        var pos = {
            left: this.offsetLeft,
            top: this.offsetTop
        };
        $(this).after('<div class="placeholder"></div>');
        $(this).stop()
        .css({
            position: "absolute",
            zIndex: "1",
            margin: "0 auto",
            left: pos.left,
            top: pos.top
        }).animate({
            width: "100%",
            height: "100%",
            left: "0",
            top: "0"
        }, 600)
        .addClass("expanded")
                .find(".formation").animate({
            opacity: 1
        }, 300);
    }
}

function agrandir_paragraphe() {

    var p = $(this).siblings("p");
    if (p.hasClass('action')) {

        p.stop().animate({
            height: '0'
        }, 500).removeClass('action');

    }
    else {
        $(".action").stop().animate({
            height: '0'
        }, 500).removeClass('action');

        var autoH = p.css({
            height: "auto"
        }).height();

        p.stop().css({
            height: "0"
        }).animate({
            height: autoH
        }, 500).addClass('action');
    }
    return false;
}
