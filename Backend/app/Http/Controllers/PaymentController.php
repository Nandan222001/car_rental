<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Razorpay\Api\Api;

class PaymentController extends Controller
{
    public function createOrder(Request $request)
    {
        $api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

        $order = $api->order->create([
            'receipt'         => 'rcptid_' . uniqid(),
            'amount'          => $request->amount * 100, // amount in paise
            'currency'        => 'INR',
        ]);

        return response()->json(['order' => $order]);
    }
}
