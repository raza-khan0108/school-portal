import Link from "next/link";
import styles from "../styles/home.module.css";

export default function Home() {
  return (
    <main className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1 className={styles.heading}>Welcome to School Portal</h1>
          <p className={styles.subheading}>
            Manage and explore schools with ease. Add new schools or browse existing ones.
          </p>

          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h2>Add a New School</h2>
              <p>Enter school details, upload an image, and save it to the database.</p>
              <Link href="/addSchool" className={styles.buttonPrimary}>
                Add School
              </Link>
            </div>

            <div className={styles.card}>
              <h2>Browse Schools</h2>
              <p>View all registered schools with their details and images.</p>
              <Link href="/showSchools" className={styles.buttonSecondary}>
                View Schools
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} School Portal. All rights reserved.</p>
      </footer>
    </main>
  );
}
