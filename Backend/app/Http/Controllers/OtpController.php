<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;

class OtpController extends Controller
{
    public function sendOtp(Request $request)
    {
        // $email = $request->input('email');
        $email = "nandansingh222001@gmail.com";

        $otp = rand(100000, 999999); 
        Mail::send('emails.otp', ['otp' => $otp], function ($msg) use ($email) {
            $msg->to($email)
                ->subject('Your Payment OTP');
        });

       return response()->json([
            'success' => true,
        ]);
    }

    public function verifyOtp(Request $request)
    {
        // $email = $request->email;
        $email = "nandansingh222001@gmail.com";
        $enteredOtp = $request->otp;

        $cachedOtp = Cache::get("otp_for_{$email}");

        if ($cachedOtp && $enteredOtp == $cachedOtp) {
            Cache::forget("otp_for_{$email}");
            return response()->json(['valid' => true]);
        }

        return response()->json(['valid' => false]);
    }
}
