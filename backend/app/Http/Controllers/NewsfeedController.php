<?php

namespace App\Http\Controllers;

use App\Models\NewsfeedPost;
use App\Models\NewsfeedComment;
use App\Models\NewsfeedLike;
use App\Models\CommentLike;
use Illuminate\Http\Request;

class NewsfeedController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $userGroupIds = $user->groups()->pluck('user_groups.id');

        $posts = NewsfeedPost::with(['user', 'group', 'comments.user', 'comments.likes', 'likes'])
            ->where(function ($query) use ($user, $userGroupIds) {
                $query->whereNull('user_group_id')
                    ->orWhereIn('user_group_id', $userGroupIds)
                    ->orWhere('user_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        // Add is_liked and likes_count to comments
        $posts->getCollection()->transform(function ($post) use ($user) {
            $post->comments->transform(function ($comment) use ($user) {
                $comment->is_liked = $comment->likes->contains('user_id', $user->id);
                $comment->likes_count = $comment->likes->count();
                return $comment;
            });
            return $post;
        });

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'user_group_id' => 'nullable|exists:user_groups,id',
        ]);

        $post = NewsfeedPost::create([
            'user_id' => $request->user()->id,
            'user_group_id' => $request->user_group_id,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($post->load('user', 'group'), 201);
    }

    public function comment(Request $request, $postId)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $comment = NewsfeedComment::create([
            'post_id' => $postId,
            'user_id' => $request->user()->id,
            'content' => $request->content,
        ]);

        $post = NewsfeedPost::findOrFail($postId);
        $post->increment('comments_count');

        return response()->json($comment->load('user'), 201);
    }

    public function like(Request $request, $postId)
    {
        $userId = $request->user()->id;

        $like = NewsfeedLike::firstOrCreate([
            'post_id' => $postId,
            'user_id' => $userId,
        ]);

        $post = NewsfeedPost::findOrFail($postId);
        $post->increment('likes_count');

        return response()->json(['liked' => true]);
    }

    public function unlike(Request $request, $postId)
    {
        $userId = $request->user()->id;

        NewsfeedLike::where('post_id', $postId)
            ->where('user_id', $userId)
            ->delete();

        $post = NewsfeedPost::findOrFail($postId);
        $post->decrement('likes_count');

        return response()->json(['liked' => false]);
    }

    public function likeComment(Request $request, $commentId)
    {
        $userId = $request->user()->id;

        $like = CommentLike::firstOrCreate([
            'comment_id' => $commentId,
            'user_id' => $userId,
        ]);

        $comment = NewsfeedComment::findOrFail($commentId);
        $comment->increment('likes_count');

        return response()->json(['liked' => true]);
    }

    public function unlikeComment(Request $request, $commentId)
    {
        $userId = $request->user()->id;

        CommentLike::where('comment_id', $commentId)
            ->where('user_id', $userId)
            ->delete();

        $comment = NewsfeedComment::findOrFail($commentId);
        $comment->decrement('likes_count');

        return response()->json(['liked' => false]);
    }
}

