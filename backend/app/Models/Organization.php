<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function roles()
    {
        return $this->hasMany(Role::class);
    }

    public function groups()
    {
        return $this->hasMany(UserGroup::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function externalLinks()
    {
        return $this->hasMany(ExternalLink::class);
    }
}

