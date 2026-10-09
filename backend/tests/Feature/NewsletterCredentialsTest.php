<?php

namespace Tests\Feature;

use App\Services\NewsletterService;
use Illuminate\Http\Client\Request;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use ReflectionMethod;
use Tests\TestCase;

class NewsletterCredentialsTest extends TestCase
{
    public function test_contacts_and_segments_use_the_dedicated_newsletter_key(): void
    {
        config([
            'services.resend.api_key' => 'sending-only-fixture',
            'services.resend.newsletter_api_key' => 'newsletter-fixture',
            'services.resend.newsletter_segment_id' => 'segment-fixture',
        ]);
        Http::preventStrayRequests();
        Http::fake(['api.resend.com/*' => Http::response(['id' => 'contact-fixture'])]);

        (new ReflectionMethod(NewsletterService::class, 'upsertContact'))
            ->invoke(new NewsletterService(), 'subscriber@example.test', 'Test');

        Http::assertSentCount(2);
        Http::assertSent(fn (Request $request) => $request->method() === 'PATCH'
            && $request->hasHeader('Authorization', 'Bearer newsletter-fixture'));
        Http::assertSent(fn (Request $request) => $request->method() === 'POST'
            && str_ends_with($request->url(), '/segments/segment-fixture')
            && $request->hasHeader('Authorization', 'Bearer newsletter-fixture'));
        Http::assertNotSent(fn (Request $request) => $request->hasHeader('Authorization', 'Bearer sending-only-fixture'));
    }

    public function test_existing_full_access_key_remains_compatible_when_dedicated_key_is_empty(): void
    {
        config([
            'services.resend.api_key' => 'legacy-fixture',
            'services.resend.newsletter_api_key' => '',
        ]);
        Http::preventStrayRequests();
        Http::fake(['api.resend.com/broadcasts' => Http::response(['data' => []])]);

        $this->assertSame(['data' => []], (new NewsletterService())->listBroadcasts());
        Http::assertSent(fn (Request $request) => $request->hasHeader('Authorization', 'Bearer legacy-fixture'));
    }

    public function test_provider_permission_errors_are_not_hidden(): void
    {
        config(['services.resend.newsletter_api_key' => 'restricted-fixture']);
        Http::preventStrayRequests();
        Http::fake(['api.resend.com/*' => Http::response(['name' => 'restricted_api_key'], 401)]);

        $this->expectException(RequestException::class);
        (new NewsletterService())->listBroadcasts();
    }
}
