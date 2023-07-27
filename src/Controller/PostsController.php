<?php

namespace App\Controller;

use App\Entity\Posts;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\Common\Collections\Criteria;
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
                "created_at"=> $post->getCreatedAt()
            ];
        }

        return $this->json($data);
    }

    #[Route('/posts/new', name: 'app_posts_new',  methods: "POST")]    
    /**
     * new
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
        $image = $request->files->get('image');

        if ($image) {

            $newFilename = $this->uploadImage($image, $slugger);

            $post->setImage($newFilename);
        }

        $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());

        $criteria = new Criteria();
        $criteria->andWhere(Criteria::expr()->eq('username', $decodedJwtToken['username']));
        $adminUser = $doctrine->getRepository(User::class)->findOneBy(["username" =>  $decodedJwtToken['username']]);

        $post->setUserId($adminUser);

        $entityManager->persist($post);
        $entityManager->flush();


        return $this->json(['message' => 'Post Added Succesuffuly']);
    }

    #[Route('/posts/show/{id}', name: 'app_posts_show_one',  methods: "GET")]    
    /**
     * showOne
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

        $data =  [
            'id' => $post->getId(),
            'title' => $post->getTitle(),
            'content' => $post->getContent(),
            'image' => $post->getImage(),
            "created_at"=> $post->getCreatedAt()
        ];

        return $this->json($data);
    }


    #[Route('/posts/edit/{id}', name: 'app_posts_edit',  methods: "POST")]    
    /**
     * edit
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

        if ($image) {

            if(file_exists($this->getParameter('image_directory').'/'.$post->getImage()) && $post->getImage() !== null){
                unlink($this->getParameter('image_directory').'/'.$post->getImage());
            }

            $newFilename = $this->uploadImage($image, $slugger);

            $post->setImage($newFilename);
        }


        $entityManager->flush();

        $data =  [
            'id' => $post->getId(),
            'title' => $post->getTitle(),
            'content' => $post->getContent(),
            'image' => $post->getImage(),
            "created_at"=> $post->getCreatedAt()
        ];

        return $this->json($data);
    }



    #[Route('/posts/delete/{id}', name: 'app_posts_delete',  methods: "DELETE")]    
    /**
     * delete
     *
     * @param  mixed $doctrine
     * @param  mixed $id
     * @return JsonResponse
     */
    public function delete(ManagerRegistry $doctrine, int $id): JsonResponse{
        $entityManager = $doctrine->getManager();
        $post = $entityManager->getRepository(Posts::class)->find($id);
   
        if (!$post) {
            return $this->json('No project found for id' . $id, 404);
        }


        if(file_exists($this->getParameter('image_directory').'/'.$post->getImage()) && $post->getImage() !== null){
            unlink($this->getParameter('image_directory').'/'.$post->getImage());
        }
       
   
        $entityManager->remove($post);
        $entityManager->flush();
   
        return $this->json('Deleted a project successfully with id ' . $id);
    }
    
    /**
     * uploadImage
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
