const Footer = () => {
  return (
    <footer id="footer" className="bg-[#11a0d4] text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} KailvalyaInfotech. All rights
          reserved.
        </p>

        <div className="flex flex-wrap justify-center md:justify-start gap-6">
          {/* Twitter */}
          <a
            href="https://twitter.com/kailvalyainfotech"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-white/80 transition focus:outline-none focus:ring-2 focus:ring-white rounded"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14.86..." />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com/kailvalyainfotech"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-white/80 transition focus:outline-none focus:ring-2 focus:ring-white rounded"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12a10 10 0 10-11.5..." />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/company/kailvalyainfotech"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-white/80 transition focus:outline-none focus:ring-2 focus:ring-white rounded"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.98 3.5C4.98 5.16..." />
            </svg>
          </a>

          {/* Email */}
          <a
            href="mailto:support@kailvalyainfotech.com"
            aria-label="Email"
            className="hover:text-white/80 transition focus:outline-none focus:ring-2 focus:ring-white rounded flex items-center space-x-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4a2 2 0 00..." />
            </svg>
            <span className="hidden sm:inline">Email</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
