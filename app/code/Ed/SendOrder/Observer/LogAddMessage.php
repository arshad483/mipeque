<?php

namespace Ed\SendOrder\Observer;
use Magento\Framework\Event\ObserverInterface;

class LogAddMessage implements ObserverInterface
{
    protected $messageManager;
    public function __construct(
        \Magento\Framework\Message\ManagerInterface $messageManager
    ) {
        $this->messageManager = $messageManager;
    }

    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        $event    = $observer->getEvent();
        $customer = $event->getCustomer();

        $this->messageManager->addNotice(__('this is EDSENDORDER'));
    }

}
