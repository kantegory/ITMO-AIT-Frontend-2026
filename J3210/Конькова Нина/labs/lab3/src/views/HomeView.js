export default {
    name: 'HomeView',
    template: `
        <main>
            <nav class="navbar navbar-expand-lg border-bottom sticky-top">
                <div class="container">
                    <RouterLink class="navbar-brand fw-bold text-primary" to="/home">
                        <i class="bi bi-cpu me-2" aria-hidden="true"></i>MLOps Flow
                    </RouterLink>
                    <div class="ms-auto d-flex gap-2">
                        <RouterLink to="/login" class="btn btn-link text-decoration-none text-secondary">Login</RouterLink>
                        <RouterLink to="/register" class="btn btn-primary px-4">Create an account</RouterLink>
                    </div>
                </div>
            </nav>

            <header class="hero-section border-bottom">
                <div class="container py-5 text-center">
                    <h1 class="display-4 fw-bold text-dark mb-3">MLOps Flow</h1>
                    <p class="lead text-muted mx-auto mb-4 hero-copy">
                        Track experiments, version models, and automate deployment in a single workspace.
                    </p>
                    <div class="d-flex flex-wrap justify-content-center gap-3">
                        <RouterLink to="/register" class="btn btn-primary btn-lg px-5">Try for free</RouterLink>
                        <a href="#features" class="btn btn-outline-secondary btn-lg px-5">Capabilities</a>
                    </div>
                </div>
            </header>

            <section id="features" class="py-5">
                <div class="container py-4">
                    <div class="text-center mb-5">
                        <h2 class="fw-bold">Everything for effective MLOps</h2>
                        <p class="text-muted">Tools that save routine work</p>
                    </div>
                    <div class="row g-4">
                        <div class="col-md-4">
                            <article class="card h-100 p-4 border-0 shadow-sm">
                                <div class="stat-icon bg-indigo-light mb-3"><i class="bi bi-bar-chart-line"></i></div>
                                <h3 class="h5 fw-bold">Tracking experiments</h3>
                                <p class="text-muted small">Log parameters, metrics, and results. Compare runs with a single click.</p>
                            </article>
                        </div>
                        <div class="col-md-4">
                            <article class="card h-100 p-4 border-0 shadow-sm">
                                <div class="stat-icon bg-green-light mb-3"><i class="bi bi-box-seam"></i></div>
                                <h3 class="h5 fw-bold">Model registry</h3>
                                <p class="text-muted small">Centralized repository with versioning and stage management.</p>
                            </article>
                        </div>
                        <div class="col-md-4">
                            <article class="card h-100 p-4 border-0 shadow-sm">
                                <div class="stat-icon bg-orange-light mb-3"><i class="bi bi-archive"></i></div>
                                <h3 class="h5 fw-bold">Artifact store</h3>
                                <p class="text-muted small">Storage for weights, configs, and graphs in S3 or locally.</p>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    `
};
