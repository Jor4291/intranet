<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->string('username');
            $table->string('email');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('avatar')->nullable();
            $table->enum('status', ['online', 'away', 'offline'])->default('offline');
            $table->timestamp('last_seen_at')->nullable();
            $table->string('totp_secret')->nullable();
            $table->boolean('totp_enabled')->default(false);
            $table->rememberToken();
            $table->timestamps();
            
            $table->unique(['organization_id', 'username']);
            $table->unique(['organization_id', 'email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

