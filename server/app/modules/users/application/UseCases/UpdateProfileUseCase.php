<?php

namespace App\Modules\Users\Application\UseCases;

use App\Modules\Users\Application\DTO\UpdateProfileDTO;
use App\Modules\Users\Domain\User;
use App\Modules\Users\Domain\UserRepositoryContract;
use App\Shared\Application\UseCase;

class UpdateProfileUseCase implements UseCase
{
    public function __construct(
        private readonly UserRepositoryContract $userRepository
    ) {}

    public function __invoke(UpdateProfileDTO $data): User
    {
        $user = $this->userRepository->find($data->userId);

        $user->firstName = $data->firstName;
        $user->lastName = $data->lastName;
        $user->phone = $data->phone;
        $user->updatedAt = new \DateTimeImmutable;

        $this->userRepository->save($user);

        return $user;
    }
}
