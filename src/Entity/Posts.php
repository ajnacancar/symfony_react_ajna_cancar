<?php

namespace App\Entity;

use App\Repository\PostsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PostsRepository::class)]
class Posts
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $content = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $image = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user_id = null;
    
    /**
     * getId
     *
     * @return int
     */
    public function getId(): ?int
    {
        return $this->id;
    }
    
    /**
     * getTitle
     *
     * @return string
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }
    
    /**
     * setTitle
     *
     * @param  mixed $title
     * @return static
     */
    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }
    
    /**
     * getCreatedAt
     *
     * @return DateTimeImmutable
     */
    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }
    
    /**
     * setCreatedAt
     *
     * @param  mixed $created_at
     * @return static
     */
    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }
    
    /**
     * getContent
     *
     * @return string
     */
    public function getContent(): ?string
    {
        return $this->content;
    }
    
    /**
     * setContent
     *
     * @param  mixed $content
     * @return static
     */
    public function setContent(?string $content): static
    {
        $this->content = $content;

        return $this;
    }
    
    /**
     * getImage
     *
     * @return string
     */
    public function getImage(): ?string
    {
        return $this->image;
    }
    
    /**
     * setImage
     *
     * @param  mixed $image
     * @return static
     */
    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }
    
    /**
     * getUserId
     *
     * @return User
     */
    public function getUserId(): ?User
    {
        return $this->user_id;
    }
    
    /**
     * setUserId
     *
     * @param  mixed $user_id
     * @return static
     */
    public function setUserId(?User $user_id): static
    {
        $this->user_id = $user_id;

        return $this;
    }
}
