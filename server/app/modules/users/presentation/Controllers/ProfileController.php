<?php

namespace App\Modules\Users\Presentation\Controllers;

use App\Modules\Users\Application\DTO\UpdateProfileDTO;
use App\Modules\Users\Application\UseCases\UpdateProfileUseCase;
use App\Modules\Users\Domain\Role;
use App\Modules\Users\Domain\User;
use App\Modules\Users\Presentation\Requests\UpdateProfileRequest;
use App\Modules\Users\Presentation\Resources\UserResource;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ProfileController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly UpdateProfileUseCase $updateProfileUseCase) {}

    public function show(Request $request): JsonResponse
    {
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

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $dto = new UpdateProfileDTO(
            userId: $request->user()->id,
            firstName: $request->input('first_name'),
            lastName: $request->input('last_name'),
            phone: $request->input('phone')
        );

        $user = ($this->updateProfileUseCase)($dto);

        return $this->ok(new UserResource($user));
    }
}
