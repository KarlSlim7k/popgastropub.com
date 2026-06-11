<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class CspReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_csp_report_endpoint_logs_violation_and_returns_204(): void
    {
        Log::shouldReceive('warning')
            ->once()
            ->with('csp_violation_report', \Mockery::on(function ($context) {
                return $context['report']['csp-report']['violated-directive'] === 'script-src';
            }));

        $response = $this->postJson('/api/csp-report', [
            'csp-report' => [
                'document-uri' => 'https://popgastropub.com/',
                'violated-directive' => 'script-src',
                'blocked-uri' => 'https://evil.example/script.js',
            ],
        ], ['Content-Type' => 'application/csp-report']);

        $response->assertNoContent();
    }

    public function test_csp_report_endpoint_is_throttled(): void
    {
        Log::shouldReceive('warning');

        for ($i = 0; $i < 60; $i++) {
            $this->postJson('/api/csp-report', ['csp-report' => []])->assertNoContent();
        }

        $this->postJson('/api/csp-report', ['csp-report' => []])->assertStatus(429);
    }
}
