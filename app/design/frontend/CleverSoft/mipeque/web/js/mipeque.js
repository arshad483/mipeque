/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 * Developer Andrew.
 * CleverSoft iOne Theme.
 */

(function($) {
    "use strict";
	
    /* Load page and resize */
    $(window).on('scroll',function(e){
        if($(window).scrollTop() > 0){
            $('body').addClass('menu-fixed');
            $('.header-content').addClass('is-sticky');
            $('.page-header').addClass('is-sticky');
        }else{
            $('body').removeClass('menu-fixed');
            $('.header-content').removeClass('is-sticky');
            $('.page-header').removeClass('is-sticky');
        }
    });
	
})(jQuery);