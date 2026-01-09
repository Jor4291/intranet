<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsfeedPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_group_id',
        'title',
        'content',
        'attachments',
    ];

    protected $casts = [
        'attachments' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function group()
    {
        return $this->belongsTo(UserGroup::class, 'user_group_id');
    }

    public function comments()
    {
        return $this->hasMany(NewsfeedComment::class, 'post_id');
    }

    public function likes()
    {
        return $this->hasMany(NewsfeedLike::class, 'post_id');
    }

    public function isLikedBy($userId)
    {
        return $this->likes()->where('user_id', $userId)->exists();
    }
}

