<template>
  <header class="header">
    <div class="header-container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <img class="logo-image" src="@/assets/logo-movies.png" alt="Logo O Que Ver" />
          <span class="logo-text">OQV</span>
        </router-link>

        <!-- Navegação Desktop -->
        <nav class="nav-desktop">
          <router-link to="/search" class="nav-link">
            <i class="pi pi-search nav-icon"></i>
            Buscar
          </router-link>
        </nav>

        <!-- Buscar Mobile -->
        <router-link to="/search" class="nav-mobile-search">
          <i class="pi pi-search nav-icon"></i>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Componente simplificado - apenas navegação direta
</script>

<style scoped>
/* Header */
.header {
  background: var(--color-surface);
  color: var(--color-text);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 700;
  font-size: 1.25rem;
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 1.75rem;
  color: var(--color-primary);
}

.logo-text {
  font-size: 1.125rem;
  font-weight: 700;
}

/* Custom logo image */
.logo-image {
  height: 28px;
  width: auto;
  display: block;
}

/* Navegação Desktop */
.nav-desktop {
  display: flex;
  gap: 32px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 600;
  font-size: 1rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  background: var(--color-surface-hover);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background: var(--color-primary);
  color: white;
}

.nav-icon {
  font-size: 1.125rem;
}

/* Buscar Mobile */
.nav-mobile-search {
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  text-decoration: none;
  color: var(--color-text);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-mobile-search:hover {
  background: var(--color-surface-hover);
  transform: translateY(-1px);
}

.nav-mobile-search.router-link-active {
  background: var(--color-primary);
  color: white;
}

/* Responsividade */
@media (max-width: 768px) {
  .nav-desktop {
    display: none;
  }

  .nav-mobile-search {
    display: flex;
  }

  .header-content {
    height: 56px;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  .logo-image {
    height: 24px;
  }
}

@media (max-width: 480px) {
  .header-content {
    height: 56px;
  }

  .logo-text {
    font-size: 1.125rem;
  }
}
</style>
