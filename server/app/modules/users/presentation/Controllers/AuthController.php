<?php

namespace App\Modules\Users\Presentation\Controllers;

use App\Modules\Users\Application\DTO\LoginDTO;
use App\Modules\Users\Application\DTO\RegisterUserDTO;
use App\Modules\Users\Application\UseCases\LoginUseCase;
use App\Modules\Users\Application\UseCases\RegisterUserUseCase;
use App\Modules\Users\Domain\Role;
use App\Modules\Users\Domain\User;
use App\Modules\Users\Infrastructure\Persistence\Eloquent\UserModel;
use App\Modules\Users\Presentation\Requests\LoginRequest;
use App\Modules\Users\Presentation\Requests\RegisterRequest;
use App\Modules\Users\Presentation\Resources\UserResource;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly RegisterUserUseCase $registerUserUseCase,
        private readonly LoginUseCase $loginUseCase
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $dto = new RegisterUserDTO(
            firstName: $request->input('first_name'),
            lastName: $request->input('last_name'),
            email: $request->input('email'),
            phone: $request->input('phone'),
            password: $request->input('password')
        );

        $user = ($this->registerUserUseCase)($dto);

        // This is a bridge between domain and infrastructure for the sake of the framework
        $userModel = UserModel::find($user->id);
        $this->startSession($request, $userModel);

        return $this->created([
            'user' => new UserResource($user),
        ], 'User registered successfully');
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $dto = new LoginDTO(
            email: mb_strtolower(trim($request->input('email'))),
            password: $request->input('password')
        );

        $user = ($this->loginUseCase)($dto);

        $userModel = UserModel::find($user->id);
        $this->startSession($request, $userModel);

        return $this->ok([
            'user' => new UserResource($user),
        ], null, 'User logged in successfully');
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return $this->noContent();
    }

    public function me(Request $request): JsonResponse
    {
        // We need to convert the Eloquent user to our domain user
        // This is a shortcut for now. In a real app, we would have a proper way to get the domain user.
        $userModel = $request->user();
        $roles = collect();

        if (method_exists($userModel, 'loadMissing')) {
            $userModel->loadMissing('roles');
            $roles = $userModel->roles ?? collect();
        }

        $user = new User(
            id: $userModel->id,
            firstName: $userModel->first_name,
            lastName: $userModel->last_name,
            email: $userModel->email,
            phone: $userModel->phone,
            password: $userModel->password,
            createdAt: \DateTimeImmutable::createFromInterface($userModel->created_at),
            updatedAt: \DateTimeImmutable::createFromInterface($userModel->updated_at),
            roles: $roles->map(fn ($roleModel) => new Role($roleModel->id, $roleModel->name))->all()
        );

        return $this->ok(new UserResource($user));
    }

    private function startSession(Request $request, UserModel $userModel): void
    {
        if (! $request->hasSession()) {
            return;
        }

        Auth::login($userModel);
        $request->session()->regenerate();
    }
}
