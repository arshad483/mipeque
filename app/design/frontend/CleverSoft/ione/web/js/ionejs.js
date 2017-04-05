/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 * Developer Andrew.
 * CleverSoft iOne Theme.
 */

(function($) {
    "use strict";
/* Show-hide search. */
    $(document).ready(function() {
        $('.page-wrapper .block-search .action.search').click(function(){
            $('.page-wrapper .page-header .header-content .block.block-search .block-content .minisearch .control').toggle('slow');
            $('.page-wrapper .page-header .header-content .block.block-search').toggleClass('active');
        });
        /* Click tools setup */
        $('#tool-setup i').on('click', function() {
            $('#tool-setup').toggleClass('active');
        })
        $('#tool-setup .content-setup .content .show-hide-background-img button').on('click', function() {
            $('body').toggleClass('background-img');
        })
        $('#tool-setup .content-setup .content .show-hide-slider button').on('click', function() {
            $('.main-content .main-slide').toggleClass('none');
        })
        $('#tool-setup .content-setup .content .show-hide-box-img button').on('click', function() {
            $('.main-content .box-content').toggleClass('none');
        })
        $('#tool-setup .content-setup .content .show-hide-new-arrivals button').on('click', function() {
            $('.main-content .carousel-product .products-grid').toggleClass('none');
        })
        $('#tool-setup .content-setup .content .show-hide-instagram button').on('click', function() {
            $('.main-content .our-collections').toggleClass('none');
        })
        $('#header-layout-search a').on('click', function() {
            $('.page-header .full-sc-search').toggleClass('active');
            /* $('.page-header .full-sc-search .block-content #search_mini_form .input-text').attr('autofocus', 'autofocus'); */
            setTimeout(function(){
                $('.page-header .full-sc-search .block-content #search').focus()
            }, 100);
            /* $('.page-header .full-sc-search .block-content #search_mini_form .input-text').autofocus; */
        })
        $('.page-header .full-sc-search .clever-icon-close').on('click', function() {
            $('.page-header .full-sc-search').removeClass('active');
        })
        $(document).ready(function($){
            var slider = $.fn.fsvs({
                autoPlay            : false,
                speed               : 1000,
                bodyID              : 'fsvs-body',
                selector            : '> .slide',
                mouseSwipeDisance   : 40,
                afterSlide          : function(){},
                beforeSlide         : function(){},
                endSlide            : function(){},
                mouseWheelEvents    : true,
                mouseWheelDelay     : false,
                mouseDragEvents     : false, /* Click body scroll up. */
                touchEvents         : true,
                arrowKeyEvents      : true,
                pagination          : true,
                nthClasses          : 2,
                detectHash          : false /* Hash id url brower */
            });
        });
        $('.page-header .full-sc-search .block-content #search_mini_form .input-text').blur(function() {
            $('.page-header .full-sc-search .block-search .block-content .minisearch .field.search .control').removeClass("focus");
          })
        .focus(function() {
            $('.page-header .full-sc-search .block-search .block-content .minisearch .field.search .control').addClass("focus")
        });
    });

    /* Load page and resize */
    $(window).on('load',function() {
        var heightimg = $( window ).height() - 50;
        $('.main-slide-lookbook').height(heightimg);
        $('.main-slide-lookbook .img-left-slider').height(heightimg);
        $('.main-slide-lookbook .lookbook').height(heightimg);
        $('#fsvs-body').parent().height(heightimg);
    }).on('resize',function() {
        var heightimgr = $( window ).height() - 50;
        $('.main-slide-lookbook').height(heightimgr);
        $('.main-slide-lookbook .img-left-slider').height(heightimgr);
        $('.main-slide-lookbook .lookbook').height(heightimgr);
        $('#fsvs-body').parent().height(heightimgr);
        /* Cart right sidebar.*/
        var height = $(window).height() - 297;
        $('#minicart-content-wrapper .block-content .minicart-items-wrapper').height(height);
        /*// Resize ione 06
        var heightione6 = $(window).height();
        $('.ione06 .clever-slider').height(heightione6);
        $('.ione06 .clever-slider ul.slides li img').height(heightione6);*/
    }).on('scroll',function(e){
        if($(window).scrollTop() > 0){
            $('body.sticky').addClass('menu-fixed');
            $('.header-content').addClass('is-sticky');
            $('.page-header').addClass('is-sticky');
        }else{
            $('body.sticky').removeClass('menu-fixed');
            $('.header-content').removeClass('is-sticky');
            $('.page-header').removeClass('is-sticky');
        }
    });
})(jQuery);