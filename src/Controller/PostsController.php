<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Posts;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;


#[Route('/api', name: 'api_')]
class PostsController extends AbstractController
{

    private JWTTokenManagerInterface $jwtManager;
    private TokenStorageInterface $tokenStorageInterface;

    public function __construct(TokenStorageInterface $tokenStorageInterface, JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
        $this->tokenStorageInterface = $tokenStorageInterface;
    }


    #[Route('/posts/all', name: 'app_posts',  methods: "GET")]
    /**
     * index
     * author: Ajna Cancar
     * mail: ajna.cancar2019@size.ba
     * 
     * Function returs all posts in datbase
     *
     * @param  mixed $doctrine
     * @return JsonResponse
     */
    public function index(ManagerRegistry $doctrine): JsonResponse
    {
        $posts = $doctrine->getRepository(Posts::class)->findAll();
        $data = [];

        foreach ($posts as $post) {
            $data[] =  [
                'id' => $post->getId(),
                'title' => $post->getTitle(),
                'content' => $post->getContent(),
                'image' => $post->getImage(),
                "category" => $post->getCategoryId(),
                "likes" => $post->getLikedByUsers()->count(),
                "created_at" => $post->getCreatedAt()
            ];
        }

        return $this->json($data);
    }

    #[Route('/posts/liked-posts', name: 'app_liked_posts',  methods: "GET")]
    /**
     * index
     * author: Ajna Cancar
     * mail: ajna.cancar2019@size.ba
     * 
     * Function returs all posts in datbase
     *
     * @param  mixed $doctrine
     * @return JsonResponse
     */
    public function getlikedPostForUser(ManagerRegistry $doctrine): JsonResponse
    {
        $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());
        $user = $doctrine->getRepository(User::class)->findOneBy(["username" =>  $decodedJwtToken['username']]);
        $posts = $user->getLikedPosts();
        $data = [];

        foreach ($posts as $post) {
            $data[] =  [
                'id' => $post->getId(),
                'title' => $post->getTitle(),
                'content' => $post->getContent(),
                'image' => $post->getImage(),
                "category" => $post->getCategoryId(),
                "likes" => $post->getLikedByUsers()->count(),
                "created_at" => $post->getCreatedAt()
            ];
        }

        return $this->json($data);
    }

    #[Route('/posts/new', name: 'app_posts_new',  methods: "POST")]
    /**
     * new
     * author: Ajna Cancar
     * mail: ajna.cancar2019@size.ba
     * 
     * Function to add new posts to blog managment system
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
        // $decoded = json_decode($request->getContent());
        $post = new Posts();

        $post->setTitle($request->request->get('title'));
        $post->setCreatedAt(new DateTimeImmutable());
        $post->setContent($request->request->get('content'));
        $categoryId = $request->request->get("category_id");
        $image = $request->files->get('image');

        if ($image) {

            $newFilename = $this->uploadImage($image, $slugger);

            $post->setImage($newFilename);
        }

        $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());

        // $criteria = new Criteria();
        // $criteria->andWhere(Criteria::expr()->eq('username', $decodedJwtToken['username']));
        $adminUser = $doctrine->getRepository(User::class)->findOneBy(["username" =>  $decodedJwtToken['username']]);
        $category = $doctrine->getRepository(Category::class)->find($categoryId);


        $post->setCategoryId($category);


        $post->setUserId($adminUser);

        $entityManager->persist($post);
        $entityManager->flush();


        return $this->json(['message' => 'Post Added Succesuffuly']);
    }

    #[Route('/posts/show/{id}', name: 'app_posts_show_one',  methods: "GET")]
    /**
     * showOne
     *  author: Ajna Cancar
     * mail: ajna.cancar2019@size.ba
     * 
     * Function to return data about only one post
     *
     * @param  mixed $doctrine
     * @param  mixed $id
     * @return JsonResponse
     */
    public function showOne(ManagerRegistry $doctrine, int $id): JsonResponse
    {

        $post = $doctrine->getRepository(Posts::class)->find($id);


        if (!$post) {

            return $this->json('No post found for id ' . $id, 404);
        }

       
        $is_liked = false;
        if($this->tokenStorageInterface->getToken() !== null){
            $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());
            $user = $doctrine->getRepository(User::class)->findOneBy(["username" =>  $decodedJwtToken['username']]);


            $is_liked = $post->getLikedByUsers()->contains($user);
        }

        $data =  [
            'id' => $post->getId(),
            'title' => $post->getTitle(),
            'content' => $post->getContent(),
            'image' => $post->getImage(),
            'category' => $post->getCategoryId(),
            "likes" => $post->getLikedByUsers()->count(),
            "is_liked" => $is_liked,
            "created_at" => $post->getCreatedAt()
        ];

        return $this->json($data);
    }

    #[Route('/posts/category/{id}', name: 'app_posts_filter_category',  methods: "GET")]
    /**
     * filterByCategory
     * 
     * author: Ajna Cancar
     * mail: ajna.cancar2019@size.ba
     * 
     * Function to return posts filtered by category
     *
     * @param  mixed $doctrine
     * @param  mixed $id
     * @return JsonResponse
     */
    public function filterByCategory(ManagerRegistry $doctrine, int $id): JsonResponse
    {
        $posts = $doctrine->getRepository(Posts::class)->findAll();
        $data = [];

        foreach ($posts as $post) {
            if ($post->getCategoryId()->getId() == $id) {
                $data[] =  [
                    'id' => $post->getId(),
                    'title' => $post->getTitle(),
                    'content' => $post->getContent(),
                    'image' => $post->getImage(),
                    "category" => $post->getCategoryId(),
                    "created_at" => $post->getCreatedAt()
                ];
            }
        }

        return $this->json($data);
    }


    #[Route('/posts/edit/{id}', name: 'app_posts_edit',  methods: "POST")]
    /**
     * edit
     *  author: Ajna Cancar
     * mail: ajna.cancar2019@size.ba
     * 
     * Function to edit existing post in system
     * This route is protected and only admin can access -----> refer to /config/packages/security.yaml file
     *
     * @param  mixed $doctrine
     * @param  mixed $request
     * @param  mixed $slugger
     * @param  mixed $id
     * @return JsonResponse
     */
    public function edit(ManagerRegistry $doctrine, Request $request, SluggerInterface $slugger, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $post = $entityManager->getRepository(Posts::class)->find($id);

        if (!$post) {
            return $this->json('No post found for id ' . $id, 404);
        }

        $post->setTitle($request->request->get('title'));
        $post->setContent($request->request->get('content'));
        $image = $request->files->get('image');
        $categoryid = $request->request->get("category_id");

        if ($image) {

            if (file_exists($this->getParameter('image_directory') . '/' . $post->getImage()) && $post->getImage() !== null) {
                unlink($this->getParameter('image_directory') . '/' . $post->getImage());
            }

            $newFilename = $this->uploadImage($image, $slugger);

            $post->setImage($newFilename);
        }
        $category = $doctrine->getRepository(Category::class)->find($categoryid);
        $post->setCategoryId($category);

        $entityManager->flush();

        $data =  [
            'id' => $post->getId(),
            'title' => $post->getTitle(),
            'content' => $post->getContent(),
            'image' => $post->getImage(),
            "created_at" => $post->getCreatedAt()
        ];

        return $this->json($data);
    }

    

    #[Route('/posts/like/{id}', name: 'app_posts_like',  methods: "GET")]    
    /**
     * likePost
     * 
     * author: Ajna Cancar
     * mail: ajna.cancar2019@size.ba
     * 
     * Function to like post by user
     *
     * @param  mixed $doctrine
     * @param  mixed $id
     * @return JsonResponse
     */
    public function likePost(ManagerRegistry $doctrine, int $id): JsonResponse
    {
        $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());
        $user = $doctrine->getRepository(User::class)->findOneBy(["username" =>  $decodedJwtToken['username']]);
        $entityManager = $doctrine->getManager();
        $post = $entityManager->getRepository(Posts::class)->find($id);

        $post->addLikedByUser($user);

        $entityManager->persist($post);
        $entityManager->flush();


        return $this->json(['message' => 'Liked Post Succesuffuly']);
    }


    #[Route('/posts/dislike/{id}', name: 'app_posts_dislike',  methods: "GET")]    

    public function dislikePost(ManagerRegistry $doctrine, int $id): JsonResponse
    {
        $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());
        $user = $doctrine->getRepository(User::class)->findOneBy(["username" =>  $decodedJwtToken['username']]);
        $entityManager = $doctrine->getManager();
        $post = $entityManager->getRepository(Posts::class)->find($id);

        $post->removeLikedByUser($user);

        $entityManager->persist($post);
        $entityManager->flush();


        return $this->json(['message' => 'Disliked Post Succesuffuly']);
    }





    #[Route('/posts/delete/{id}', name: 'app_posts_delete',  methods: "DELETE")]
    /**
     * delete
     *  author: Ajna Cancar
     * mail: ajna.cancar2019@size.ba
     * 
     * Function to delete existing post in system
     * Before remove a post, check if post image exist and delete it
     * This route is protected and only admin can access -----> refer to /config/packages/security.yaml file
     *
     * @param  mixed $doctrine
     * @param  mixed $id
     * @return JsonResponse
     */
    public function delete(ManagerRegistry $doctrine, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $post = $entityManager->getRepository(Posts::class)->find($id);

        if (!$post) {
            return $this->json('No project found for id' . $id, 404);
        }


        if (file_exists($this->getParameter('image_directory') . '/' . $post->getImage()) && $post->getImage() !== null) {
            unlink($this->getParameter('image_directory') . '/' . $post->getImage());
        }


        $entityManager->remove($post);
        $entityManager->flush();

        return $this->json('Deleted a project successfully with id ' . $id);
    }




    /**
     * uploadImage
     * author: Ajna Cancar
     * mail: ajna.cancar2019@size.ba
     * 
     * Function to upload and save post image. 
     * 
     * @param  mixed $image
     * @param  mixed $slugger
     * @return string
     */
    private function uploadImage(UploadedFile  $image, SluggerInterface $slugger): string
    {
        $originalFilename = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $image->guessExtension();


        try {
            $image->move(
                $this->getParameter('image_directory'),
                $newFilename
            );
        } catch (FileException $e) {
            // ... handle exception if something happens during file upload
        }

        return $newFilename;
    }
}
