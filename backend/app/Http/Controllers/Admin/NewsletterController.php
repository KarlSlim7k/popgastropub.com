<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use App\Services\NewsletterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class NewsletterController extends Controller
{
    public function __construct(private NewsletterService $newsletter)
    {
    }

    public function index()
    {
        $active = NewsletterSubscriber::whereNull('unsubscribed_at');

        return response()->json([
            'total_active' => $active->count(),
            'total_unsubscribed' => NewsletterSubscriber::whereNotNull('unsubscribed_at')->count(),
            'by_source' => NewsletterSubscriber::whereNull('unsubscribed_at')
                ->selectRaw('source, count(*) as total')
                ->groupBy('source')
                ->pluck('total', 'source'),
        ]);
    }

    public function subscribers(Request $request)
    {
        $perPage = min((int) $request->input('per_page', 20), 100);
        $search = $request->input('search');
        $source = $request->input('source');
        $status = $request->input('status');

        $query = NewsletterSubscriber::orderByDesc('created_at');

        if ($search) {
            $query->where(fn($q) => $q->where('email', 'like', "%{$search}%")->orWhere('name', 'like', "%{$search}%"));
        }
        if ($source) $query->where('source', $source);
        if ($status === 'active') $query->whereNull('unsubscribed_at');
        if ($status === 'unsubscribed') $query->whereNotNull('unsubscribed_at');

        $paginated = $query->paginate($perPage);

        return response()->json([
            'data' => $paginated->items(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ]);
    }

    public function broadcasts()
    {
        try {
            return response()->json($this->newsletter->listBroadcasts());
        } catch (Throwable $e) {
            Log::error('NEWSLETTER_BROADCASTS_LIST_ERROR', ['error' => $e->getMessage()]);

            return response()->json(['message' => 'No se pudo obtener la lista de campañas de Resend.'], 502);
        }
    }

    public function storeBroadcast(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'subject' => 'required|string|max:255',
            'preview_text' => 'nullable|string|max:150',
            'html' => 'required_without:text|nullable|string',
            'text' => 'required_without:html|nullable|string',
        ]);

        try {
            return response()->json($this->newsletter->createBroadcast($validated), 201);
        } catch (Throwable $e) {
            Log::error('NEWSLETTER_BROADCAST_CREATE_ERROR', ['error' => $e->getMessage()]);

            return response()->json(['message' => 'No se pudo crear la campaña en Resend.'], 502);
        }
    }

    public function showBroadcast(string $id)
    {
        try {
            return response()->json($this->newsletter->getBroadcast($id));
        } catch (Throwable $e) {
            Log::error('NEWSLETTER_BROADCAST_GET_ERROR', ['id' => $id, 'error' => $e->getMessage()]);

            return response()->json(['message' => 'No se pudo obtener la campaña.'], 502);
        }
    }

    public function sendBroadcast(Request $request, string $id)
    {
        try {
            $result = $this->newsletter->sendBroadcast($id);

            Log::info('NEWSLETTER_BROADCAST_SENT', ['id' => $id, 'admin' => $request->user()->id]);

            return response()->json($result);
        } catch (Throwable $e) {
            Log::error('NEWSLETTER_BROADCAST_SEND_ERROR', ['id' => $id, 'error' => $e->getMessage()]);

            return response()->json(['message' => 'No se pudo enviar la campaña.'], 502);
        }
    }

    public function destroyBroadcast(string $id)
    {
        try {
            $this->newsletter->deleteBroadcast($id);

            return response()->json(['message' => 'Campaña eliminada.']);
        } catch (Throwable $e) {
            Log::error('NEWSLETTER_BROADCAST_DELETE_ERROR', ['id' => $id, 'error' => $e->getMessage()]);

            return response()->json(['message' => 'No se pudo eliminar la campaña.'], 502);
        }
    }
}
