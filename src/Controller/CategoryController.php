<?php

namespace App\Controller;

use App\Entity\Category;
use Doctrine\Persistence\ManagerRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api', name: 'api_')]
class CategoryController extends AbstractController
{
    private JWTTokenManagerInterface $jwtManager;
    private TokenStorageInterface $tokenStorageInterface;

    public function __construct(TokenStorageInterface $tokenStorageInterface, JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
        $this->tokenStorageInterface = $tokenStorageInterface;
    }


    #[Route('/category/all', name: 'app_categories',  methods: "GET")]        
    /**
     * all
     * 
     *  author: Ajna Cancar
     * mail: ajna.cancar2019@size.ba
     * 
     * Function to areturn all categories in database
     *
     * @param  mixed $doctrine
     * @return JsonResponse
     */
    public function all(ManagerRegistry  $doctrine): JsonResponse
    {
        $categories = $doctrine->getRepository(Category::class)->findAll();
        $data = [];

        foreach ($categories as $category) {
            $data[] =  [
                'id' => $category->getId(),
                'name' => $category->getName(),
            ];
        }

        return $this->json($data);
    }




    #[Route('/category/new', name: 'app_category_new',  methods: "POST")]        
    /**
     * new
     * 
     * author: Ajna Cancar
     * mail: ajna.cancar2019@size.ba
     * 
     * Function to add new category to blog managment system
     * This route is protected and only admin can access -----> refer to /config/packages/security.yaml file
     *
     * @param  mixed $doctrine
     * @param  mixed $request
     * @param  mixed $slugger
     * @return JsonResponse
     */
    public function new(ManagerRegistry $doctrine, Request $request, SluggerInterface $slugger): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $decoded = json_decode($request->getContent());

        $category = new Category();
     
            $category->setName($decoded->name);
        

        $entityManager->persist($category);
        $entityManager->flush();


        return $this->json(['message' => 'Category Added Succesuffuly']);
    }


 

}
