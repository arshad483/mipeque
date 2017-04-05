/**
 * @category    CleverSoft
 * @package     CleverSlider
 * @copyright   Copyright © 2017 CleverSoft., JSC. All Rights Reserved.
 * @author 		ZooExtension.com
 * @email       magento.cleversoft@gmail.com
 */

var config = {
    map: {
        '*': {
            flexsliderJS: 'CleverSoft_CleverSlideShow/js/jquery.flexslider',
            froogaLoop: 'CleverSoft_CleverSlideShow/js/froogaloop2.min'
        }
    },
    shim:{
        "CleverSoft_CleverSlideShow/js/jquery.flexslider": ["jquery"],
        "CleverSoft_CleverSlideShow/js/froogaloop2.min": ["jquery"]
    }
};
