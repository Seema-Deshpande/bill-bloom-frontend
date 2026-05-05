import "../../App.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer-tagline">Bill Bloom — Split smarter, stress less.</p>
      <p className="footer-copy">&copy; {year} Bill Bloom. All rights reserved.</p>
    </footer>
  );
}
