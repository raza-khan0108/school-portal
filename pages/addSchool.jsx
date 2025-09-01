// pages/addSchool.jsx
import { useForm } from "react-hook-form";
import { useState } from "react";
import styles from "../styles/addSchool.module.css";
import Link from "next/link";

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData();
    for (let key in data) {
      if (key === "image") {
        formData.append("image", data.image[0]);
      } else {
        formData.append(key, data[key]);
      }
    }

    try {
      const res = await fetch("/api/addSchool", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        setMessage("✅ School added successfully!");
        reset();
      } else {
        setMessage("❌ Error: " + result.error);
      }
    } catch (err) {
      setMessage("❌ Failed to connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back to Home
        </Link>
        <h1 className={styles.title}>Add a New School</h1>
        <p className={styles.subtitle}>Fill in the details below to register a new school</p>
      </header>

      <main className={styles.main}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {message && (
            <div className={`${styles.message} ${message.includes("✅") ? styles.success : styles.error}`}>
              {message}
            </div>
          )}

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                School Name *
              </label>
              <input
                id="name"
                placeholder="Enter school name"
                className={`${styles.input} ${errors.name ? styles.errorInput : ""}`}
                {...register("name", { required: "School name is required" })}
              />
              {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email_id" className={styles.label}>
                Email Address *
              </label>
              <input
                id="email_id"
                type="email"
                placeholder="school@example.com"
                className={`${styles.input} ${errors.email_id ? styles.errorInput : ""}`}
                {...register("email_id", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email_id && <span className={styles.errorText}>{errors.email_id.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contact" className={styles.label}>
                Contact Number *
              </label>
              <input
                id="contact"
                placeholder="+1 (555) 123-4567"
                className={`${styles.input} ${errors.contact ? styles.errorInput : ""}`}
                {...register("contact", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9+\-\s()]{10,}$/,
                    message: "Please enter a valid contact number"
                  }
                })}
              />
              {errors.contact && <span className={styles.errorText}>{errors.contact.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>
                Address *
              </label>
              <input
                id="address"
                placeholder="123 Main Street"
                className={`${styles.input} ${errors.address ? styles.errorInput : ""}`}
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && <span className={styles.errorText}>{errors.address.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="city" className={styles.label}>
                City *
              </label>
              <input
                id="city"
                placeholder="Mumbai"
                className={`${styles.input} ${errors.city ? styles.errorInput : ""}`}
                {...register("city", { required: "City is required" })}
              />
              {errors.city && <span className={styles.errorText}>{errors.city.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="state" className={styles.label}>
                State *
              </label>
              <input
                id="state"
                placeholder="Maharashtra"
                className={`${styles.input} ${errors.state ? styles.errorInput : ""}`}
                {...register("state", { required: "State is required" })}
              />
              {errors.state && <span className={styles.errorText}>{errors.state.message}</span>}
            </div>
          </div>

          <div className={styles.imageUploadSection}>
            <label htmlFor="image" className={styles.label}>
              School Image *
            </label>
            <div className={styles.imageUploadContainer}>
              <input
                id="image"
                type="file"
                accept="image/*"
                className={styles.fileInput}
                {...register("image", {
                  required: "School image is required",
                  validate: {
                    isImage: (files) => {
                      if (!files[0]) return true;
                      return files[0].type.startsWith('image/') || "Please select an image file";
                    }
                  }
                })}
              />
              <label htmlFor="image" className={styles.chooseImageButton}>
                Choose Image
              </label>
            </div>
            {errors.image && <span className={styles.errorText}>{errors.image.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${styles.submitButton} ${isSubmitting ? styles.loading : ""}`}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Adding School...
              </>
            ) : (
              "Add School"
            )}
          </button>
        </form>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} School Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}