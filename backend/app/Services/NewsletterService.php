<?php

namespace App\Services;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class NewsletterService
{
    private function client(): PendingRequest
    {
        return Http::baseUrl('https://api.resend.com')
            ->withToken(config('services.resend.api_key'))
            ->acceptJson();
    }

    public function recordSubscription(string $email, ?string $name, ?int $userId, string $source): void
    {
        NewsletterSubscriber::updateOrCreate(
            ['email' => $email],
            ['name' => $name, 'user_id' => $userId, 'source' => $source, 'unsubscribed_at' => null]
        );

        try {
            $this->upsertContact($email, $name);
        } catch (Throwable $e) {
            Log::error('NEWSLETTER_RESEND_ERROR', ['action' => 'subscribe', 'email' => $email, 'error' => $e->getMessage()]);
        }
    }

    public function recordUnsubscription(string $email): void
    {
        NewsletterSubscriber::where('email', $email)->update(['unsubscribed_at' => now()]);

        try {
            $response = $this->client()->patch("/contacts/{$email}", ['unsubscribed' => true]);
            if ($response->status() !== 404 && $response->failed()) {
                $response->throw();
            }
        } catch (Throwable $e) {
            Log::error('NEWSLETTER_RESEND_ERROR', ['action' => 'unsubscribe', 'email' => $email, 'error' => $e->getMessage()]);
        }
    }

    private function upsertContact(string $email, ?string $name): void
    {
        $segmentId = config('services.resend.newsletter_segment_id');

        $update = $this->client()->patch("/contacts/{$email}", [
            'unsubscribed' => false,
            'first_name' => $name,
        ]);

        if ($update->status() === 404) {
            $this->client()->post('/contacts', [
                'email' => $email,
                'first_name' => $name,
                'unsubscribed' => false,
                'segments' => $segmentId ? [['id' => $segmentId]] : [],
            ])->throw();

            return;
        }

        $update->throw();

        if ($segmentId) {
            $this->client()->post("/contacts/{$email}/segments/{$segmentId}")->throw();
        }
    }

    public function listBroadcasts(): array
    {
        return $this->client()->get('/broadcasts')->throw()->json();
    }

    public function getBroadcast(string $id): array
    {
        return $this->client()->get("/broadcasts/{$id}")->throw()->json();
    }

    public function createBroadcast(array $data): array
    {
        $payload = array_filter([
            'name' => $data['name'] ?? null,
            'segment_id' => config('services.resend.newsletter_segment_id'),
            'from' => sprintf('%s <%s>', config('services.resend.from_name'), config('services.resend.from_address')),
            'subject' => $data['subject'],
            'html' => $data['html'] ?? null,
            'text' => $data['text'] ?? null,
            'preview_text' => $data['preview_text'] ?? null,
        ], fn ($value) => $value !== null);

        return $this->client()->post('/broadcasts', $payload)->throw()->json();
    }

    public function sendBroadcast(string $id): array
    {
        return $this->client()->post("/broadcasts/{$id}/send")->throw()->json();
    }

    public function deleteBroadcast(string $id): void
    {
        $this->client()->delete("/broadcasts/{$id}")->throw();
    }
}
