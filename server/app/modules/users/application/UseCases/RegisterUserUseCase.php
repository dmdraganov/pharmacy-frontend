<?php

namespace App\Modules\Users\Application\UseCases;

use App\Modules\Users\Application\DTO\RegisterUserDTO;
use App\Modules\Users\Domain\Role;
use App\Modules\Users\Domain\RoleRepositoryContract;
use App\Modules\Users\Domain\User;
use App\Modules\Users\Domain\UserRepositoryContract;
use App\Shared\Application\UseCase;
use Illuminate\Support\Str;

class RegisterUserUseCase implements UseCase
{
    public function __construct(
        private readonly UserRepositoryContract $userRepository,
        private readonly RoleRepositoryContract $roleRepository
    ) {}

    public function __invoke(RegisterUserDTO $data): User
    {
        // Here we should also dispatch an event, but let's keep it simple for now
        $userRole = $this->roleRepository->findByName(Role::USER);

        $user = new User(
            id: Str::uuid()->toString(),
            firstName: $data->firstName,
            lastName: $data->lastName,
            email: $data->email,
            phone: $data->phone,
            password: $data->password,
            createdAt: new \DateTimeImmutable,
            updatedAt: new \DateTimeImmutable,
            roles: [$userRole]
        );

        $this->userRepository->save($user);

        return $user;
    }
}
