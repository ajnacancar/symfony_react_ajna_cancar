<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SpaController extends AbstractController
{
    #[Route('/{reactRouting}', name: 'app_home', requirements: ["reactRouting" => "^(?!api).+"], defaults: ["reactRouting" => null])]    
    /**
     * index
     *  author: Ajna Cancar
     * mail: ajna.cancar2019@size.ba
     * 
     * Function to render html code and routing react app
     *
     * @return void
     */
    public function index()
    {
        return $this->render('spa/index.html.twig');
    }
}
