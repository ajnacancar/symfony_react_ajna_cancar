Simple Blog Management App


Introduction
The Simple Blog Management App is a web application that allows users to log in, and only authenticated admin users can create, delete, and edit blog posts. The app is built using Symfony 6 for the backend, MySQL as the database, and React integrated with Tailwind CSS for the frontend.


Features
User Authentication: Users can register and log in to the application. Admin users have additional privileges to manage blog posts.
Admin Dashboard: Admin users are provided with a dashboard where they can create, edit, and delete blog posts.
Create Post: Admin users can create new blog posts by providing a title, content, and an optional image.
Edit Post: Admin users can edit existing blog posts, updating their title, content, or image.
Delete Post: Admin users can delete blog posts that are no longer needed.
Responsive Design: The app is designed to be responsive, ensuring a seamless user experience across various devices.


Technologies
The app is built using the following technologies:

Symfony 6: A PHP web application framework for the backend.
MySQL: A relational database management system used to store blog data.
React: A JavaScript library for building user interfaces.
Tailwind CSS: A utility-first CSS framework for styling the frontend.

Prerequisites
Before setting up the Simple Blog Management App on your computer, ensure you have the following prerequisites installed:

MySQL Server 8: Make sure you have MySQL Server version 8 (or higher) installed on your computer. You can download it from the official MySQL website: MySQL Downloads

Composer: Composer is a dependency manager for PHP. You'll need Composer installed to manage the backend dependencies of the app. You can download and install it from the official Composer website: Composer Download

Yarn (or npm): Yarn is a package manager for Node.js, and it's used to manage the frontend dependencies of the app. If you prefer using npm, you can use it as an alternative to Yarn. You can install Yarn by following the instructions on their official website: Yarn Installation

Git: Git is a version control system used to manage the source code of the app. You'll need Git installed on your computer to clone the app repository from GitHub. You can download Git from the official website: Git Downloads

Please make sure all the prerequisites are installed and set up correctly before proceeding with the installation and usage steps mentioned in the README.md file.

Installation and Usage
To run the Simple Blog Management App on your local machine, follow these steps:

1. Clone the repository: `git clone <repository_url>`
2. Install composer dependecies `symfony composer install`
3. Install yarn dependecnies `yarn install`
4. Install npm dependencies `npm install`
5. Configure database in .env file
6. Set up the database: 
          `php bin/console doctrine:database:create`
          `php bin/console doctrine:migrations:migrate`
7. Start server: `symfony server:start`
8. Start encore: `yarn encore dev --watch`

Go to http:localhost:8000/ and explore the app
          

