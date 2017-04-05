<?php
/**
 * @category    CleverSoft
 * @package     CleverBase
 * @copyright   Copyright © 2017 CleverSoft., JSC. All Rights Reserved.
 * @author 		ZooExtension.com
 * @email       magento.cleversoft@gmail.com
 */

namespace CleverSoft\Base\Model\System\Config\Source\Design\Section;


class Sidepadding
{
	public function toOptionArray()
	{
		return [
			//If no value selected, use default side padding of the page
			['value' => '',				'label' => __('Use Default')],
			//No side padding
			['value' => 'expanded',		'label' => __('No Side Padding')],
			//Full-width inner container
			['value' => 'full',			'label' => __('Full Width')],
			//Full-width inner container, no side padding
			['value' => 'full-expanded','label' => __('Full Width, No Side Padding')],
		];
	}
}