<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ExternalAPIController;
use App\Http\Controllers\ExternalLinkController;
use App\Http\Controllers\NewsfeedController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SSEController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TOTPController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserGroupController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile/change-password', [AuthController::class, 'changePassword']);

    // Newsfeed
    Route::get('/newsfeed', [NewsfeedController::class, 'index']);
    Route::post('/newsfeed', [NewsfeedController::class, 'store']);
    Route::post('/newsfeed/{postId}/comment', [NewsfeedController::class, 'comment']);
    Route::post('/newsfeed/{postId}/like', [NewsfeedController::class, 'like']);
    Route::delete('/newsfeed/{postId}/like', [NewsfeedController::class, 'unlike']);
    Route::post('/newsfeed/comments/{commentId}/like', [NewsfeedController::class, 'likeComment']);
    Route::delete('/newsfeed/comments/{commentId}/like', [NewsfeedController::class, 'unlikeComment']);

    // Chat
    Route::get('/chat/contacts', [ChatController::class, 'getContacts']);
    Route::get('/chat/messages/{userId}', [ChatController::class, 'getMessages']);
    Route::post('/chat/messages', [ChatController::class, 'sendMessage']);

    // Tasks
    Route::apiResource('tasks', TaskController::class);

    // Users
    Route::apiResource('users', UserController::class);

    // Documents
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);

    // User Groups
    Route::get('/user-groups', [UserGroupController::class, 'index']);
    Route::post('/user-groups', [UserGroupController::class, 'store']);
    Route::post('/user-groups/{groupId}/members', [UserGroupController::class, 'addMember']);
    Route::delete('/user-groups/{groupId}/members/{userId}', [UserGroupController::class, 'removeMember']);

    // Roles (Admin only)
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::post('/users/{userId}/roles', [RoleController::class, 'assignRole']);

    // External Links
    Route::get('/external-links', [ExternalLinkController::class, 'index']);
    Route::post('/external-links', [ExternalLinkController::class, 'store']);
    Route::put('/external-links/{id}', [ExternalLinkController::class, 'update']);
    Route::delete('/external-links/{id}', [ExternalLinkController::class, 'destroy']);

    // SSE for real-time updates
    Route::get('/sse/stream', [SSEController::class, 'stream']);
    Route::post('/sse/status', [SSEController::class, 'updateStatus']);

    // TOTP
    Route::post('/totp/generate', [TOTPController::class, 'generateSecret']);
    Route::post('/totp/verify', [TOTPController::class, 'verify']);
    Route::post('/totp/disable', [TOTPController::class, 'disable']);

    // External API integrations (placeholders)
    Route::get('/external/weather', [ExternalAPIController::class, 'weather']);
    Route::get('/external/{service}', [ExternalAPIController::class, 'proxy']);
});

