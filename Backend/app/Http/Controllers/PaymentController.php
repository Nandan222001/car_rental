<?php

namespace App\Http\Controllers;
use App\Models\Order;
use Illuminate\Http\Request;
use Razorpay\Api\Api;

class PaymentController extends Controller
{
    public function createOrder(Request $request)
    {
        $api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

        $order = $api->order->create([
            'receipt'   => 'rcptid_' . uniqid(),
            'amount'    => $request->amount,
            'currency'  => 'INR',
        ]);

        Order::create([
            'razorpay_order_id' => $order['id'],
            'receipt'           => $order['receipt'],
            'amount'            => $order['amount'],
            'currency'          => $order['currency'],
            'status'            => $order['status'],
        ]);
        return response()->json(['order' =>$request->amount]);
    }
}
