<?php
 
namespace App\Entity;
 
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
 
#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;
 
    // #[ORM\Column(type: 'string', length: 180, unique: true)]
    // private $email;
 
    #[ORM\Column(type: 'string', length: 30,unique:true)]
    private $username;
 
    #[ORM\Column(type: 'json')]
    private $roles = [];
 
    #[ORM\Column(type: 'string', length:255)]
    private $password;
 
    #[ORM\Column(type:'string', length: 50)]
    private $name = null;

    #[ORM\ManyToMany(targetEntity: Posts::class, inversedBy: 'LikedByUsers')]
    private Collection $LikedPosts;

    public function __construct()
    {
        $this->LikedPosts = new ArrayCollection();
    }
     
 
    public function getId(): ?int
    {
        return $this->id;
    }
 
    // public function getEmail(): ?string
    // {
    //     return $this->email;
    // }
 
    // public function setEmail(string $email): self
    // {
    //     $this->email = $email;
 
    //     return $this;
    // }
 
    public function getUsername(): string
    {
        return (string) $this->username;
    }
 
    public function setUsername(string $username): self
    {
        $this->username = $username;
 
        return $this;
    }

    public function getName(): string
    {
        return (string) $this->name;
    }
 
    public function setName(string $name): self
    {
        $this->name = $name;
 
        return $this;
    }
 
    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }
 
    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';
 
        return array_unique($roles);
    }
 
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
 
        return $this;
    }
 
    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }
 
    public function setPassword(string $password): self
    {
        $this->password = $password;
 
        return $this;
    }
 
    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Posts>
     */
    public function getLikedPosts(): Collection
    {
        return $this->LikedPosts;
    }

    public function addLikedPost(Posts $likedPost): static
    {
        if (!$this->LikedPosts->contains($likedPost)) {
            $this->LikedPosts->add($likedPost);
        }

        return $this;
    }

    public function removeLikedPost(Posts $likedPost): static
    {
        $this->LikedPosts->removeElement($likedPost);

        return $this;
    }
 
    
}