const About = () => {
  return (
    // Add padding-top to avoid fixed navbar overlap if needed (e.g., pt-20)
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-md shadow-md">
      {/* Owner Photo and Name */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <img
          src="https://via.placeholder.com/150" // Replace with actual photo URL
          alt="Owner"
          className="w-36 h-36 rounded-full object-cover border-4 border-indigo-600"
        />
        <div>
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">XYZ</h1>
          <p className="text-gray-700 dark:text-gray-300 max-w-xl">
            Founder and CEO of Kailvalya Infotech. Passionate about IT
            education, software development, and building innovative digital
            solutions.
          </p>
        </div>
      </div>

      {/* Qualifications */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
          Qualifications
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          <li>Bachelor of Science in Information Technology (BSc IT)</li>
          <li>Certified React Developer</li>
          <li>Certified Full Stack Web Developer</li>
          <li>Advanced JavaScript and TypeScript Courses</li>
        </ul>
      </section>

      {/* Certificates */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
          Certificates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-indigo-300 rounded shadow-sm bg-indigo-50 dark:bg-gray-800">
            <h3 className="font-semibold">React JS Certification</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Issued by ABC Institute, 2024
            </p>
          </div>
          <div className="p-4 border border-indigo-300 rounded shadow-sm bg-indigo-50 dark:bg-gray-800">
            <h3 className="font-semibold">Full Stack Developer Certificate</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Issued by XYZ Academy, 2023
            </p>
          </div>
          {/* Add more certificates here */}
        </div>
      </section>

      {/* Other Details */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
          Other Details
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          Email:{" "}
          <a
            href="mailto:ramchandra@example.com"
            className="text-indigo-600 hover:underline"
          >
            ramchandra@example.com
          </a>
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          Phone: +91 12345 67890
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Location: Mumbai, India
        </p>
      </section>
    </div>
  );
};

export default About;
