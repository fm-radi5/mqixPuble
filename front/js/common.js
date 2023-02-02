var MQIX = MQIX || {};
MQIX.UI = MQIX.UI || {};
MQIX.VIEWPORT_WIDTH = null;
MQIX.VIEWPORT_HEIGHT = null;
MQIX.IS_MOBILE = false;
MQIX.IS_VIEWTYPE = null;
MQIX.IS_SIZE = MQIX.IS_SIZE || {};
MQIX.IS_SIZE.MAXMOBILE = 768;
MQIX.IS_SIZE.MAXTABLET = 1023;
MQIX.IS_TABLET = false;
MQIX.FOCUS_ELEM = null;

MQIX.DELAY_FUNC = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

var setViewSize = function(){
    MQIX.VIEWPORT_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    MQIX.VIEWPORT_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
};

var checkMobile = function(){
    var mobileInfo = ["Android", "iPhone", "iPod", "iPad", "BlackBerry", "Windows CE", "SAMSUNG", "LG", "MOT", "SonyEricsson"];
    $.each(mobileInfo, function(index){
        if (navigator.userAgent.match(mobileInfo[index]) != null){
            MQIX.IS_MOBILE = true;
        }
    });
};

var deviceCheck= function() {
    if(MQIX.VIEWPORT_WIDTH < MQIX.IS_SIZE.MAXMOBILE && MQIX.IS_MOBILE){
        MQIX.IS_VIEWTYPE = "mobile";
    } else if(MQIX.VIEWPORT_WIDTH <= MQIX.IS_SIZE.MAXTABLET && MQIX.IS_MOBILE){
        MQIX.IS_VIEWTYPE = "tablet";
    } else {
        if(MQIX.VIEWPORT_WIDTH < MQIX.IS_SIZE.MAXMOBILE ) {
            MQIX.IS_VIEWTYPE = "mobile";
        } else if (MQIX.VIEWPORT_WIDTH <= MQIX.IS_SIZE.MAXTABLET ) {
            MQIX.IS_VIEWTYPE = "tablet";
        } else {
            MQIX.IS_VIEWTYPE = "web";
        }
    }
};

$(window).resize(function(){
    setViewSize();
    checkMobile();
    deviceCheck();
    dotLineFunc();
    headerActive();
});

$(function() {
    setViewSize();
    checkMobile();
    deviceCheck();
    dotLineFunc();
    headerActive();

    $(document).ready(init);

    var $win = $(window),
        $body, $header, $dep1, $dep2, $moveH, $dimed,
        $mobBtn, $gnb,
        $winW = $win.outerWidth(),
        $winH = $win.outerHeight();

    function init() {
        $body = $("body");
        $header = $(".header");
        $dep1 = $(".gnb-list > li");
        $dep2 = $(".gnb-dep2-wrap");
        $dimed = $(".gnb-dimed");
        $moveH = 248; // 높이값
        $mobBtn = $(".mob-gnb-btn");
        $gnb = $(".gnb");

        webGnbFn();
        mobGnbFn();
    }

    $win.on({
        resize : function() {
            var $newWindW = $(this).width();
            $winH = $(this).height();
            if($newWindW !== $winW){
                removeStyleFn($body);
                // removeStyleFn($header);
                removeStyleFn($gnb);
                removeStyleFn($dep1);
                removeStyleFn($dep2);
                removeStyleFn($dimed);
                removeStyleFn($mobBtn);
                $body.removeClass('prevent');
                $winW = $newWindW;
            }
        }
    });

    function webGnbFn() {
        $dep1.find(">a").on({
            mouseenter : function() {
                if(MQIX.IS_VIEWTYPE == "web") {
                    var $this = $(this);
                    $this.parent().siblings().removeClass("active");
                    $this.parent().addClass("active");
                    $header.addClass("active");

                    webAnimateFn($dep2, 1.2, $moveH);
                    webAnimateFn($dimed, 1.2, $moveH);
                }
            }
        });

        $dep2.on({
            mouseenter : function() {
                if(MQIX.IS_VIEWTYPE == "web") {
                    var $this = $(this);
                    $this.parent().siblings().removeClass("active");
                    $this.parent().addClass("active");
                }
            }
        });

        $header.on({
            mouseleave : function() {
                if(MQIX.IS_VIEWTYPE == "web") {
                    if($(this).offset().top == 0){
                        $(this).removeClass('active');
                    }
                    webAnimateFn($dep2, 0.5, 0);
                    webAnimateFn($dimed, 0.5, 0);
                }
            }
        });
        // $('.web_menu_btn').on('click', function(){
        //     if(MQIX.IS_VIEWTYPE == "web") {
        //         $header.addClass('active')
        //         webAnimateFn($dep2, 1.2, $moveH);
        //         webAnimateFn($dimed, 1.2, $moveH);
        //     }
        // })
    }

    function mobGnbFn() {
        $mobBtn.on({
            click: function() {
                if(MQIX.IS_VIEWTYPE == "tablet" || MQIX.IS_VIEWTYPE == "mobile") {
                    var $this = $(this);
                    $this.addClass("active");
                    // $gnb.css("height", $winH-parseInt(65)).stop().slideToggle().toggleClass("active");
                    $gnb.addClass("active")
                    $header.addClass("active");
                    $dimed.addClass("active");
                    removeStyleFn($dep1);
                    $dep2.stop().slideUp().removeClass("active");
                    $body.addClass("prevent");
                    $('.m_gnb_close_btn').addClass("active");
                }
            }
        });
        $('.m_gnb_close_btn').on({
           click: function(){
               var $this = $(this);
               $mobBtn.removeClass('active');
               $header.removeClass("active");
               $dimed.removeClass("active");
               $gnb.removeClass("active")
               removeStyleFn($dep1);
               $dep2.stop().slideUp().removeClass("active");
               $body.removeClass("prevent");
               $this.removeClass("active");
           }
        });

        $dep1.find(">a").on({
            click: function(e) {
                if(MQIX.IS_VIEWTYPE == "tablet" || MQIX.IS_VIEWTYPE == "mobile") {
                    var $this = $(this),
                        $thisParent = $this.parent(),
                        $thisDep2 = $thisParent.find($dep2);
                    e.preventDefault();
                    $thisParent.siblings().removeClass("active");
                    $thisParent.toggleClass("active");
                    $thisParent.siblings().find($dep2).stop().slideUp().removeClass("active");
                    $thisDep2.stop().slideToggle().toggleClass("active");
                }
            }
        });
    }

    function webAnimateFn($target, $speed, $height) {
        TweenMax.killTweensOf($target);
        TweenMax.to($target, $speed, { height: parseInt($height), ease: Expo.easeOut });
    }

    function removeStyleFn($target) {
        $target.removeClass("active").removeAttr("style");
    }

    /* :: top s :: */
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) $('.btn-top-box').addClass('active');
        else $('.btn-top-box').removeClass('active');
    });

    $('.btn-top-box').on('click', function() {
        $('body,html').stop().animate({
            scrollTop: 0
        }, 800);
        return false;
    });
    /* :: top e :: */

    /* :: input_file s :: */
    var fileTarget = $('.filebox .upload-hidden');

    fileTarget.on('change', function(){
        if(window.FileReader){
            var filename = $(this)[0].files[0].name;
            // console.log('111111111')
        } else {
            var filename = $(this).val().split('/').pop().split('\\').pop();
            // console.log('22222222222')
        }

        $(this).siblings('.upload-name').val(filename);
        console.log(filename)
    });
    /* :: input_file e :: */
});

function headerActive(){
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.header').addClass('active');
        }
        else {
            $('.header').removeClass('active');
        }
    });
}


/* :: main scroll s :: */
(function($) {
    $(document).ready(init);
    function init() {

        var $win, $winH;
        var $content, $btn, $wrap, $top;

        function scrollinit() {
            $win = $(window);
            $content = $('.js_main_cont');
            $btn = $('.js_main_control_btn');
            $wrap = $('.js_main_scroll');
            $top = $('.js_top_btn');

            // passive 수정을 위해 순수 스크립트로 변경
            window.addEventListener('mousewheel', moveScreenFunc, {passive: false});
            window.addEventListener('DOMMouseScroll', moveScreenFunc,  {passive: false});
            window.addEventListener('resize', resetFunc);
            window.addEventListener('beforeunload', function() { // 리로드 시에 스크롤 리셋되는 버그 수정
                $(this).scrollTop(0);
            });

            $btn.on('click', indicatorClickFunc);
            $top.on('click', moveTopFunc);
            $('.js_main_scroll_info').on('click', function() {
                $btn.not($btn.eq(1)).removeClass('active');
                $btn.eq(1).addClass('active');
                $content.not($content.eq(1)).removeClass('active');
                $content.eq(1).addClass('active');
                moveAnimateFunc($content.eq(1));
            });
            heightFunc();
        }

        function heightFunc() {
            if(MQIX.IS_VIEWTYPE == 'web') {
                if($('.main_body').length > 0) $('body').css('overflow',  'hidden'); // 메인일 때 body scroll 삭제
                else return false;
                $winH = $win.outerHeight();

                $btn.not($btn.eq(0)).removeClass('active');
                $btn.eq(0).addClass('active');
                $content.not($content.eq(0)).removeClass('active');
                $content.eq(0).addClass('active');
                moveAnimateFunc($content.eq(0));

                $content.each(function(i,e) {
                    var $this = $(this);
                    if(!$this.hasClass('js_banner')) $this.css('height', $winH);
                });
            }
        }

        function moveScreenFunc(e) {
            if($('.sub_body').length > 0) return false;
            if(MQIX.IS_VIEWTYPE == 'web') {
                var wheel = e.wheelDelta ? e.wheelDelta : -e.detail,
                    idx = $btn.siblings(".active").index();

                if ($wrap.hasClass('scrolling')) return false;

                if (wheel > 0) { // up
                    e.preventDefault();
                    idx -= 1;
                    if (idx < 0) {
                        idx = 0;
                        return false;
                    }
                } else if (wheel < 0) { // down
                    e.preventDefault();
                    idx += 1;
                    if (idx > $content.length - 1) {
                        idx = $content.length - 1;
                        return false;
                    }
                }

                $btn.not($btn.eq(idx)).removeClass('active');
                $btn.eq(idx).addClass('active');
                moveAnimateFunc($content.eq(idx));

                $content.not($content.eq(idx)).removeClass('active');
                $content.eq(idx).addClass('active');
            }
        }

        function moveAnimateFunc($target) {
            if(MQIX.IS_VIEWTYPE == 'web') {
                $wrap.addClass("scrolling");
                $('html, body').stop().animate({
                    scrollTop: $target.offset().top
                }, 500, function () {
                    $wrap.removeClass('scrolling');
                    return false;
                });
            }
        }

        function indicatorClickFunc() {
            if(MQIX.IS_VIEWTYPE == 'web') {
                var $this = $(this),
                    $thisidx = $this.index();
                console.log($thisidx)
                if ($this.hasClass('active')) return false;
                moveAnimateFunc($content.eq($thisidx));
                $btn.not($btn.eq($thisidx)).removeClass('active');
                $btn.eq($thisidx).addClass('active');
                $content.not($content.eq($thisidx)).removeClass('active');
                $content.eq($thisidx).addClass('active');
            }
        }

        function moveTopFunc() {
            /*moveAnimateFunc($content.eq(0));*/
            $btn.not($btn.eq(0)).removeClass('active');
            $btn.eq(0).addClass('active');
            $content.not($content.eq(0)).removeClass('active');
            $content.eq(0).addClass('active');
        }

        function resetFunc() {

            if(MQIX.IS_VIEWTYPE == 'web') heightFunc();
            else {
                removeStyleFn($btn);
                removeStyleFn($content);
                removeStyleFn($wrap);
                removeStyleFn($('html'));
                removeStyleFn($('body'));
                $wrap.removeClass('scrolling');
            }
        }

        function removeStyleFn($target) {
            $target.removeClass("active").removeAttr("style");
        }

        scrollinit();
    }
})(jQuery);
/* :: main scroll e :: */
/* :: 말줄임표 s :: */
function dotLineFunc() {
    if($('.js-dotline').length){
        var $dotline = $('.js-dotline');
        $dotline.dotdotdot({
            watch:true,
            wrap : 'word'
        });
    }
}
/* :: 말줄임표 e :: */
