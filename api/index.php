<?php

// Vercel serverless function entry point for Laravel API

// Set up the Laravel environment
require __DIR__ . '/../backend/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/../backend/bootstrap/app.php';

// Create a kernel instance
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Get the request from Vercel
$request = Illuminate\Http\Request::createFromGlobals();

// Handle the request
$response = $kernel->handle($request);

// Send the response
$response->send();

$kernel->terminate($request, $response);
