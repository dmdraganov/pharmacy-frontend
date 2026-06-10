<?php

namespace App\Modules\Users\Application\UseCases;

use App\Modules\Users\Application\DTO\LoginDTO;
use App\Modules\Users\Domain\User;
use App\Modules\Users\Domain\UserRepositoryContract;
use App\Shared\Application\UseCase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginUseCase implements UseCase
{
    public function __construct(
        private readonly UserRepositoryContract $userRepository
    ) {}

    public function __invoke(LoginDTO $data): User
    {
        $user = $this->userRepository->findByEmail($data->email);

        if (! $user || ! Hash::check($data->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        return $user;
    }
}
