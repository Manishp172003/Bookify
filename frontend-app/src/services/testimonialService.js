const RAW_API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_BASE_URL = `${RAW_API_URL.replace(/\/api\/?$/, "")}/api/testimonials`;

const getUserHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const testimonialService = {
  // Fetch featured testimonials for Home page
  async getFeaturedTestimonials() {
    try {
      const res = await fetch(`${API_BASE_URL}/featured`);
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (err) {
      console.warn("Could not fetch featured testimonials:", err);
    }
    return [];
  },

  // Submit or update a student/author testimonial
  async submitTestimonial({ rating, comment, role }) {
    try {
      const res = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: getUserHeaders(),
        body: JSON.stringify({ rating, comment, role }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to submit testimonial");
      }
      return json;
    } catch (err) {
      console.error("Testimonial submission error:", err);
      throw err;
    }
  },
};
