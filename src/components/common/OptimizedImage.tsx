/**
 * OptimizedImage — public alias of SmoothImage with the project's lazy/responsive
 * defaults. Kept as a separate export so call sites read intuitively and we can
 * later swap in a CDN/responsive-srcset implementation without churn.
 */
export { SmoothImage as OptimizedImage } from './SmoothImage';
