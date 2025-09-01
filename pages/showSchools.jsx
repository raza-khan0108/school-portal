// pages/showSchools.jsx
import { useEffect, useState } from "react";
import styles from "../styles/showSchools.module.css";
import Link from "next/link";
import Head from "next/head";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("");

  useEffect(() => {
    async function fetchSchools() {
      try {
        const res = await fetch("/api/getSchools");
        const data = await res.json();
        if (data.success) {
          setSchools(data.schools);
        } else {
          setError("Failed to load schools");
        }
      } catch (err) {
        setError("Error connecting to server");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSchools();
  }, []);

  // Get unique cities for filter
  const cities = [...new Set(schools.map(school => school.city))].sort();

  // Filter schools based on search and filter
  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = filterCity ? school.city === filterCity : true;
    return matchesSearch && matchesCity;
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading schools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Our Schools | School Portal</title>
        <meta name="description" content="Browse all registered schools in our portal" />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backButton}>
            ← Back to Home
          </Link>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Our Schools</h1>
            <p className={styles.subtitle}>
              Discover {schools.length} registered schools in our network
            </p>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Filters and Search */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div className={styles.resultsInfo}>
          <p>
            Showing {filteredSchools.length} of {schools.length} schools
            {filterCity && ` in ${filterCity}`}
          </p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {error}
          </div>
        )}

        {filteredSchools.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>No schools found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <Link href="/addSchool" className={styles.addSchoolButton}>
              Add First School
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredSchools.map((school) => (
              <div key={school.id} className={styles.card}>
                <div className={styles.imageContainer}>
                  <img 
                    src={school.image || "/default-school.jpg"} 
                    alt={school.name}
                    className={styles.image}
                    onError={(e) => {
                      e.target.src = "/default-school.jpg";
                    }}
                  />
                  <div className={styles.cityBadge}>{school.city}</div>
                </div>
                
                <div className={styles.cardContent}>
                  <h2 className={styles.schoolName}>{school.name}</h2>
                  
                  <div className={styles.details}>
                    <div className={styles.detailItem}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M17.657 16.657L13.414 20.9C13.039 21.2746 12.5306 21.485 12.0005 21.485C11.4704 21.485 10.962 21.2746 10.587 20.9L6.343 16.657C5.22422 15.5381 4.46234 14.1127 4.15369 12.5608C3.84504 11.0089 4.00349 9.40047 4.60901 7.93868C5.21452 6.4769 6.2399 5.22741 7.55548 4.34846C8.87107 3.46951 10.4178 3.00024 12 3.00024C13.5822 3.00024 15.1289 3.46951 16.4445 4.34846C17.7601 5.22741 18.7855 6.4769 19.391 7.93868C19.9965 9.40047 20.155 11.0089 19.8463 12.5608C19.5377 14.1127 18.7758 15.5381 17.657 16.657Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{school.address}</span>
                    </div>
                    
                    {school.contact && (
                      <div className={styles.detailItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M5 4H9L11 9L8.5 10.5C9.57096 12.6715 11.3285 14.429 13.5 15.5L15 13L20 15V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21C14.0993 20.763 10.4202 19.1065 7.65683 16.3432C4.8935 13.5798 3.23705 9.90074 3 6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{school.contact}</span>
                      </div>
                    )}
                    
                    {school.email_id && (
                      <div className={styles.detailItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{school.email_id}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} School Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}