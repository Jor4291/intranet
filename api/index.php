<?php

// Vercel serverless function entry point for Laravel
require __DIR__.'/../backend/vendor/autoload.php';

$app = require_once __DIR__.'/../backend/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);