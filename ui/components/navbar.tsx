"use client";

import {
  BookOpen,
  Compass,
  Folder,
  Home,
  Bell,
  Plus,
  ChevronDown,
} from "lucide-react";

import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <BookOpen size={22} strokeWidth={2.5} />
        </div>

        <span>Banca de Materiais</span>
      </div>

      {/* Navegação */}
      <nav className={styles.navigation}>
        <a href="#" className={`${styles.navItem} ${styles.active}`}>
          <Home size={16} />
          <span>Início</span>
        </a>

        <a href="#" className={styles.navItem}>
          <Compass size={17} />
          <span>Explorar</span>
        </a>

        <a href="#" className={styles.navItem}>
          <Folder size={17} />
          <span>Meus materiais</span>
        </a>
      </nav>

      {/* Área direita */}
      <div className={styles.actions}>
        <button className={styles.publishButton}>
          <Plus size={16} />
          <span>Publicar material</span>
        </button>

        <button className={styles.notificationButton}>
          <Bell size={17} />
        </button>

        <button className={styles.profile}>
          <div className={styles.avatar}>G</div>

          <span className={styles.username}>Gilberto</span>

          <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}