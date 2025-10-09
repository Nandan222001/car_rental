<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator; // Added for input validation

class OtpController extends Controller
{
    /**
     * Sends an OTP to the provided email and stores it in the cache for 5 minutes.
     */
    public function sendOtp(Request $request)
    {
        // 1. Basic input validation
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Invalid email format.'], 400);
        }

        $email = $request->input('email');
        $otp = rand(100000, 999999); 
        $cacheKey = "otp_for_{$email}";
        $otpLifetimeMinutes = 5;

        // 2. CRITICAL FIX: Store the OTP in the cache with a 5-minute expiry
        // This makes the OTP available for the subsequent verifyOtp call.
        Cache::put($cacheKey, $otp, now()->addMinutes($otpLifetimeMinutes));

        try {
            // 3. Send the email
            Mail::send('emails.otp', ['otp' => $otp], function ($msg) use ($email) {
                $msg->to($email)
                    ->subject('Your Payment OTP');
            });
        } catch (\Exception $e) {
            // Log the error and return a failure response if mailing fails
            \Log::error("Failed to send OTP to {$email}: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send OTP. Please try again.',
            ], 500);
        }


        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully. It is valid for 5 minutes.',
        ]);
    }

    /**
     * Verifies the provided OTP against the one stored in the cache.
     */
    public function verifyOtp(Request $request)
    {
        // 1. Basic input validation
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|numeric|digits:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['valid' => false, 'message' => 'Invalid input.'], 400);
        }
        // $email = "nandansingh222001@gmail.com";

        $email = $request->email;
        $enteredOtp = $request->otp;
        $cacheKey = "otp_for_{$email}";
        // $email = "nandansingh222001@gmail.com";

        // 2. Retrieve the cached OTP
        $cachedOtp = Cache::get($cacheKey);

        // 3. Compare and validate
        if ($cachedOtp && $enteredOtp == $cachedOtp) {
            // Verification successful, remove the OTP from the cache
            Cache::forget($cacheKey);
            return response()->json(['valid' => true, 'message' => 'OTP verified successfully.']);
        }

        // 4. Verification failed
        return response()->json(['valid' => false, 'message' => 'Invalid or expired OTP.']);
    }
}
