<?php
/**
 * @category    CleverSoft
 * @package     CleverBase
 * @copyright   Copyright © 2017 CleverSoft., JSC. All Rights Reserved.
 * @author 		ZooExtension.com
 * @email       magento.cleversoft@gmail.com
 */

namespace CleverSoft\Base\Model\System\Config\Header;
class LayoutMobile implements \Magento\Framework\Option\ArrayInterface {
    public function toOptionArray()
    {

        $types = [
            ['value' => 'header_layout_1', 'label' => __('Minimal')],
            ['value' => 'header_layout_2', 'label' => __('Standard')]
        ];

        return $types;
    }
}