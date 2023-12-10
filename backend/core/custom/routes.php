<?php
use EvolutionCMS\Main\Controllers\ApiController;
use EvolutionCMS\Main\Middleware\CheckToken;
use Illuminate\Support\Facades\Route;

// -- группы api
Route::group(['prefix' => 'api'], function () {
    Route::group(['prefix' => 'auth'], function () {
        // без проверки
        Route::post('login', [ApiController::class, 'doLogin']);
        Route::get('logout', [ApiController::class, 'doLogout']);
        Route::put('refreshtoken', [ApiController::class, 'refreshToken']);
    });

    // с проверкой
    Route::get('heartbeat', [ApiController::class, 'getHeartBeat'])
        ->middleware(CheckToken::class);
});
