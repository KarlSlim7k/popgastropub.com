<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class CspReportController extends Controller
{
    public function store(Request $request): Response
    {
        $payload = json_decode((string) $request->getContent(), true);

        Log::warning('csp_violation_report', [
            'report' => is_array($payload) ? $payload : ['raw' => $request->getContent()],
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->noContent();
    }
}
