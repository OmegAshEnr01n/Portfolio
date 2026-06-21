import { useEffect, useRef } from "react";

/*
 * Adds the "is-revealed" class to any element carrying "rd-reveal" once it
 * scrolls into view. Children can stagger via the --rd-delay CSS variable.
 */
export default function useScrollReveal() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current || document;
    const nodes = root.querySelectorAll(".rd-reveal");

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return rootRef;
}
