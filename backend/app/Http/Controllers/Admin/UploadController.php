<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,gif|max:4096',
            'folder' => 'nullable|string|in:menu,promociones,recompensas',
        ]);

        $folder = $request->input('folder', 'uploads');
        $file = $request->file('file');
        $name = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs($folder, $name, 'public');

        return response()->json([
            'url' => 'https://api.popgastropub.com/storage/' . $path,
            'path' => $path,
        ], 201);
    }
}
