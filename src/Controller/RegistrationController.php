<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;


#[Route('/api', name: 'api_')]
class RegistrationController extends AbstractController
{

    private JWTTokenManagerInterface $jwtManager;
    private TokenStorageInterface $tokenStorageInterface;

    public function __construct(TokenStorageInterface $tokenStorageInterface, JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
        $this->tokenStorageInterface = $tokenStorageInterface;
    }



    #[Route('/register', name: 'register', methods: "POST")]    
    /**
     * index
     *
     * @param  mixed $doctrine
     * @param  mixed $request
     * @param  mixed $passwordHasher
     * @return Response
     */
    public function index(ManagerRegistry $doctrine, Request $request, UserPasswordHasherInterface $passwordHasher): Response
    {

        $em = $doctrine->getManager();
        $decoded = json_decode($request->getContent());
        $username = $decoded->username;
        $plaintextPassword = $decoded->password;

        $user = new User();
        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $plaintextPassword
        );
        $user->setPassword($hashedPassword);
        $user->setRoles(["ROLE_USER"]);
        $user->setName($username);
        $user->setUsername($username);
        $em->persist($user);
        $em->flush();

        return $this->json(['message' => 'Registered Successfully']);
    }

    #[Route('/current-user', name: 'current_user', methods: "GET")]    
    /**
     * current_user
     *
     * @return JsonResponse
     */
    public function current_user(): JsonResponse
    {
        $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());

        $is_admin = in_array("ROLE_ADMIN", $decodedJwtToken["roles"]);

        return $this->json(["is_admin" => $is_admin]);
    }
}
