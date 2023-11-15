<?php
namespace EvolutionCMS\Main\Middleware;

use Carbon\Carbon;
use Closure;
use EvolutionCMS\Models\User;
use Illuminate\Http\Request;

class CheckToken
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->hasHeader('Authorization')) {
            return response()->json(['error' => 'Authorization header not found'], 401);
        }

        $header = $request->header('Authorization');
        $token = str_replace('Bearer ', '', $header);

        $user = User::query()
            ->where('access_token', $token)
            ->where('valid_to', '>', Carbon::now())
            ->first();

        if (is_null($user)) {
            return response()->json(['error' => 'Invalid or expired token'], 401);
        }

        return $next($request);
    }
}
