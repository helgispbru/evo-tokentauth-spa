<?php
namespace EvolutionCMS\Main\Controllers;

use EvolutionCMS\UserManager\Facades\UserManager;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ApiController extends BaseController
{
    public function getHeartBeat(Request $request)
    {
        return response()->json(['message' => 'tuk-tuk']);
    }

    public function doLogin(Request $request)
    {
        try {
            $user = UserManager::login([
                'username' => $request->input('username'),
                'password' => $request->input('password'),
            ]);

            return response()->json([
                'user' => $user,
                //
                'token' => [
                    'access_token' => $user->access_token,
                    'refresh_token' => $user->refresh_token,
                    'valid_to' => $user->valid_to,
                ],
            ]);
        } catch (\EvolutionCMS\Exceptions\ServiceValidationException $e) {
            return response()->json(['errors' => $e->getValidationErrors()], 400);
        } catch (\EvolutionCMS\Exceptions\ServiceActionException $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function doLogout(Request $request)
    {
        try {
            $user = \UserManager::logout();

            return response()->json([
                'user' => null,
            ]);
        } catch (\EvolutionCMS\Exceptions\ServiceValidationException $e) {
            return response()->json(['errors' => $e->getValidationErrors()], 400);
        } catch (\EvolutionCMS\Exceptions\ServiceActionException $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function refreshToken(Request $request)
    {
        try {
            $user = \UserManager::refreshToken([
                'refresh_token' => $request->input('refresh_token'),
            ]);

            return response()->json([
                'user' => $user,
                //
                'token' => [
                    'access_token' => $user->access_token,
                    'refresh_token' => $user->refresh_token,
                    'valid_to' => $user->valid_to,
                ],
            ]);
        } catch (\EvolutionCMS\Exceptions\ServiceValidationException $e) {
            return response()->json(['errors' => $e->getValidationErrors()], 400);
        } catch (\EvolutionCMS\Exceptions\ServiceActionException $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
