const Footer = () => {
  const mapUrl =
    "https://www.google.com/maps/place/Dnyaneshwar+Mangal+Karyalay/@19.2203563,73.0846532,17z/data=!4m10!1m2!2m1!1snear+Dnyaneshwar+Mangal+Karyalay!3m6!1s0x3be7be1ff96eee29:0xb49027ecf1ced28e!8m2!3d19.2203563!4d73.0872281!15sCiBuZWFyIERueWFuZXNod2FyIE1hbmdhbCBLYXJ5YWxheVoiIiBuZWFyIGRueWFuZXNod2FyIG1hbmdhbCBrYXJ5YWxheZIBDGJhbnF1ZXRfaGFsbJoBJENoZERTVWhOTUc5blMwVkpRMEZuU1VOV2JXRk1XREZCUlJBQqoBUxABKggiBG5lYXIoADIfEAEiG4DfpoMkCILHudXQbDLA_Shpjdyv_I96v5x9JTIkEAIiIG5lYXIgZG55YW5lc2h3YXIgbWFuZ2FsIGthcnlhbGF54AEA-gEECAAQLw!16s%2Fg%2F1tp0c40p?entry=ttu&g_ep=EgoyMDI1MDcxMy4wIKXMDSoASAFQAw%3D%3D";

  return (
    <footer id="footer" className="bg-main-red text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0 md:items-center">
        {/* Left side: Address and contact */}
        <div className="md:w-1/2 space-y-4">
          <p className="text-sm">
            <strong>Address:</strong> Dnyaneshwar Mangal Karyalay Area, Dombivli
            West, Maharashtra, India
          </p>
          <p className="text-sm">
            <strong>Email:</strong>{" "}
            <a
              href="mailto:support@kailvalyainfotech.com"
              className="underline hover:text-white/80"
            >
              support@kailvalyainfotech.com
            </a>
          </p>
          <p className="text-sm">
            <strong>Phone:</strong> +91 98765 43210
          </p>
          <button
            onClick={() => window.open(mapUrl, "_blank")}
            className="mt-2 bg-white text-main-red font-semibold py-2 px-4 rounded hover:bg-gray-100 transition"
          >
            View on Google Maps
          </button>
        </div>

        {/* Right side: Smaller embedded map */}
        <div className="md:w-1/2 rounded-lg overflow-hidden shadow-lg border border-white/20 h-48 md:h-64">
          <iframe
            title="Kailvalya Infotech Location - Dombivli West near Dnyaneshwar Mangal Karyalay"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.900985678434!2d73.11295451508302!3d19.21100978667185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7972a8968e5a7%3A0x37ebc70391d2a28a!2sDnyaneshwar%20Mangal%20Karyalay%20Area%2C%20Dombivli%20West%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1721167890123"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-0"
          ></iframe>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-8 text-center text-sm text-white/80">
        &copy; {new Date().getFullYear()} KailvalyaInfotech. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
