<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TOTPController extends Controller
{
    /**
     * Generate a TOTP secret for the user (mock implementation)
     * In production, use a library like spomky-labs/otphp
     */
    public function generateSecret(Request $request)
    {
        $user = $request->user();
        
        // Generate a random secret (in production, use proper TOTP secret generation)
        $secret = bin2hex(random_bytes(20));
        
        $user->update([
            'totp_secret' => Hash::make($secret),
        ]);

        // Return the secret for QR code generation (only shown once)
        return response()->json([
            'secret' => $secret,
            'qr_code_url' => "otpauth://totp/{$user->email}?secret={$secret}&issuer=Intranet",
        ]);
    }

    /**
     * Verify TOTP code (mock implementation)
     * In production, verify against the actual TOTP secret
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();

        if (!$user->totp_secret) {
            return response()->json(['error' => 'TOTP not set up'], 400);
        }

        // Mock verification - accepts any 6-digit code for MVP
        // In production, verify using: $totp = TOTP::create($user->totp_secret);
        // $isValid = $totp->verify($request->code);
        
        $isValid = preg_match('/^\d{6}$/', $request->code);

        if ($isValid) {
            if (!$user->totp_enabled) {
                $user->update(['totp_enabled' => true]);
            }
            return response()->json(['verified' => true]);
        }

        return response()->json(['verified' => false, 'error' => 'Invalid code'], 400);
    }

    public function disable(Request $request)
    {
        $request->user()->update([
            'totp_enabled' => false,
            'totp_secret' => null,
        ]);

        return response()->json(['message' => 'TOTP disabled']);
    }
}

