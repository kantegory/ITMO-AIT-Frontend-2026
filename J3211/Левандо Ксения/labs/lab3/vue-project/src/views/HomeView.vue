<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>

<template>
  <div>
    <!-- Content -->
    <!-- Carousel -->
     <div class="carousel-container">
     <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active" data-bs-interval="5000">
                <img src="/assets/img1-1.webp" class="d-block w-100 carousel-img" alt="" aria-hidden="true">
                <div class="carousel-caption">
                    <h2>Find the best events near you</h2>
                    <p>Concerts, theatre, festivals and more</p>
                  <router-link to="/events" class="btn btn-outline-light">
                            <!-- ! add a search icon -->
                            <svg class="icon" width="24" height="24">
                            <use xlink:href="/sprite.svg#icon-magnifying-glass-circle"></use>
                            </svg>
                            Browse events
                  </router-link>
            </div>
                </div>
                <div class="carousel-item" data-bs-interval="5000">
                <img src="/assets/img4.webp" class="d-block w-100 carousel-img" alt="" aria-hidden="true">
                <div class="carousel-caption">
                    <h2>Book tickets in seconds</h2>
                    <p>Secure and simple booking process</p>
                </div>
                </div>

                <div class="carousel-item" data-bs-interval="5000">
                <img src="/assets/img2.webp" class="d-block w-100 carousel-img" alt="" aria-hidden="true">
                <div class="carousel-caption">
                    <h2>Discover new experiences</h2>
                    <p>Your next event is waiting</p>
            </div>
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>
    <main class="container my-5 flex-grow-1">
        <h1 class="mb-4"> 
                    <!-- add an icon -->
                    <svg class="icon" width="24" height="24">
                        <use xlink:href="/sprite.svg#icon-ticket"></use>
                    </svg>
            Welcome to Ticket-Tac!</h1>
    </main>
  </div>
</template>