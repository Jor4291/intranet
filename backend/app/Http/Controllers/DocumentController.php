<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $documents = Document::where('organization_id', $user->organization_id)
            ->where(function ($query) use ($user) {
                $query->where('type', 'company')
                    ->orWhere(function ($q) use ($user) {
                        $q->where('type', 'personal')
                            ->where('user_id', $user->id);
                    });
            })
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($documents);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|max:10240', // 10MB max
            'type' => 'required|in:company,personal',
            'user_group_id' => 'nullable|exists:user_groups,id',
        ]);

        $file = $request->file('file');
        $organizationId = $request->user()->organization_id;
        $filePath = $file->store("documents/organization_{$organizationId}", 'public');

        $document = Document::create([
            'organization_id' => $organizationId,
            'name' => $request->name,
            'description' => $request->description,
            'file_path' => $filePath,
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'type' => $request->type,
            'user_id' => $request->type === 'personal' ? $request->user()->id : null,
            'user_group_id' => $request->user_group_id,
        ]);

        return response()->json($document->load('user'), 201);
    }

    public function destroy(Request $request, $id)
    {
        $document = Document::findOrFail($id);

        // Check permissions
        if ($document->type === 'personal' && $document->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return response()->json(['message' => 'Document deleted']);
    }
}

