<?php

namespace Ed\CustomerWelcome\Observer;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\App\Request\DataPersistorInterface;
use Magento\Framework\App\ObjectManager;

class LogAddMessage implements ObserverInterface
{
    // protected $messageManager;
    // protected $_checkoutSession;
    protected $order;

    public function __construct(
        \Magento\Sales\Model\Order $order
    ) {
        $this->order = $order;
    }

    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        $writer = new \Zend\Log\Writer\Stream(BP . '/var/log/bigbuy.log');
        $logger = new \Zend\Log\Logger();
        $logger->addWriter($writer);
        $delivery = array();
        $bigbuy = array();


        $logger->info('function started');
        $order_id = $observer->getEvent()->getOrderIds();

        $bigbuy['order'] = array(
             'internalReference' => $order_id[0],
             'cashOnDelivery' => 0,
             'language' => 'es',
             'paymentMethod' => 'moneybox',
         );

        $order = $this->order->load($order_id[0]);
        $logger->info('Order: ' . json_encode($order));

        $customerId = $order->getCustomerId();
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();

        $customer = $objectManager->create('Magento\Customer\Model\Customer')->load($customerId);
        $customer_data = $customer->getData();
        $logger->info('Customer: ' . json_encode($customer_data));

        $address = $order->getBillingAddress();
        $address_data = $address->getData();
        $logger->info('Address: ' . json_encode($address_data));

        $delivery['order']['delivery'] = array(
           'isoCountry' => 'ES',
           'postcode' => $address->getPostcode(),
        );


        $logger->info('Iterating order');
        $order_number = $order->getIncrementId();
        foreach ($order->getAllItems() as $item) {

                $bigbuy['order']['products'][] = array(
                     'reference' => $item->getSku(),
                     'quantity' => round($item->getQtyOrdered()),
                );

                $delivery['order']['products'][] = array(
                    'reference' => $item->getSku(),
                    'quantity' => $item->getQtyOrdered(),
                );
            }

        $logger->info('Carriers');
        $logger->info(json_encode($delivery));

        // $carrier_name = $helper->bigbuyGetShipping($delivery, $logger);

        $logger->info('Arriving shipping function');
        $shipping_options_cost = array();
        $shipping_options = array();

        $token = 'OTMxMmU1MTQ3MDhhY2IxMmZlMDBiYmFlNjc1YTlhYTBlMTZkYTc1NWYwYzJiZjhiNGJkOGExMzZkYzY5OTAwNA';

        // Bigbug functions
        $ch = curl_init("http://api.sandbox.bigbuy.eu/rest/shipping/orders.json");
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($delivery));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . $token));
        $result = curl_exec($ch);
        $logger->info('Arriving get shipping');
        $logger->info($result);
        $result = json_decode($result);
        foreach ($result->shippingOptions as $key => $value) {
          array_push($shipping_options_cost, $value->cost);
        }

        $min_x =  min($shipping_options_cost);

        foreach ($result->shippingOptions as $key => $value) {
          if($value->cost === $min_x){
            $logger->info('lowest carrier name');
            $logger->info($value->shippingService->name);
            $carrier_name = $value->shippingService->name;
          }
        }

        $logger->info('after carriers');
        $bigbuy['order']['carriers'] = array(
            0 => array(
                    'name' => 'correos',
                    // 'name' => strtolower($carrier_name),
                )
        );

       $logger->info('Street 1');
       $logger->info($address->getStreet(1));
       $logger->info('Street 2');
       $logger->info($address->getStreet(2));
       $logger->info('City');
       $logger->info($address->getCity());
       $street = $address->getStreet();
       $street_full = $street[0] . ',' . $address->getCity();
       $logger->info($street_full);


        $bigbuy['order']['shippingAddress'] = array(
               'firstName' => $address->getFirstname(),
               'lastName' => $address->getLastname(),
               'country' => 'ES',
               'postcode' => $address->getPostcode(),
               'town' => $address->getRegion(),
               'address' => $street_full,
               'phone' => $address->getTelephone(),
               'email' => $address->getEmail(),
               'comment' => '',
            );

       $logger->info('arriving end of function');
       $logger->info(json_encode($bigbuy));
       // $helper->bigbuyAddOrder($bigbuy, $logger);
       $ch = curl_init("http://api.sandbox.bigbuy.eu/rest/order/create.json");
       curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
       curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($bigbuy));
       curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
       curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . $token));
       $result = curl_exec($ch);
       $logger->info('Arriving Add order');
       $logger->info($result);
    }
}
