<?php

namespace Ed\CustomerWelcome\Helper;

use Magento\Framework\App\Helper\AbstractHelper;

class bigbuy extends AbstractHelper
{

  function bigbuyGetShipping($delivery, $logger){
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
        $logger->info(json_encode($result));

        foreach ($result->shippingOptions as $key => $value) {
          array_push($shipping_options_cost, $value->cost);
          array_push($shipping_options, $value);
        }

        $min_x =  min($shipping_options_cost);

        foreach ($shipping_options as $key => $value) {
          if($value->cost === $min_x){
            return $value->name;
          }
        }
        return 'no shipping options found';
    }

    function bigbuyAddOrder($bigbuy, $logger){

        $token = 'OTMxMmU1MTQ3MDhhY2IxMmZlMDBiYmFlNjc1YTlhYTBlMTZkYTc1NWYwYzJiZjhiNGJkOGExMzZkYzY5OTAwNA';

        // Bigbug functions
        $ch = curl_init("http://api.sandbox.bigbuy.eu/rest/order/create.json");
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($bigbuy));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . $token));
        $result = curl_exec($ch);
        $logger->info('Arriving Add order');
        $logger->info(json_encode($result));
        return $result;
    }

}



