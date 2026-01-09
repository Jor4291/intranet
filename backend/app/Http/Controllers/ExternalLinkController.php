<?php

namespace App\Http\Controllers;

use App\Models\ExternalLink;
use Illuminate\Http\Request;

class ExternalLinkController extends Controller
{
    public function index()
    {
        $links = ExternalLink::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json($links);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url',
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $link = ExternalLink::create($request->all());

        return response()->json($link, 201);
    }

    public function update(Request $request, $id)
    {
        $link = ExternalLink::findOrFail($id);
        $link->update($request->all());

        return response()->json($link);
    }

    public function destroy($id)
    {
        $link = ExternalLink::findOrFail($id);
        $link->delete();

        return response()->json(['message' => 'Link deleted']);
    }
}

