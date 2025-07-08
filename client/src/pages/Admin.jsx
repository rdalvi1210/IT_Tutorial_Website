import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast"; // Import toast
import { FaTrash } from "react-icons/fa"; // Importing Lucid React icons
import { MdAdminPanelSettings } from "react-icons/md"; // Importing Admin Panel Icon

const Admin = () => {
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [placements, setPlacements] = useState([]); // State for placements
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false); // State for placement modal visibility

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    duration: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [newCertificate, setNewCertificate] = useState({
    title: "",
    issuer: "",
    description: "",
    issueDate: "",
  });
  const [certificateFile, setCertificateFile] = useState(null);

  const [newPlacement, setNewPlacement] = useState({
    name: "",
    companyName: "",
    postName: "",
    image: null,
  });

  const [searchUsers, setSearchUsers] = useState("");
  const [searchReviews, setSearchReviews] = useState("");
  const [editId, setEditId] = useState(null); // To track the ID of the item being edited
  const [editType, setEditType] = useState(""); // To track the type of item being edited

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, usersRes, reviewsRes, certsRes, placementsRes] =
          await Promise.all([
            axios.get("http://localhost:5000/api/courses"),
            axios.get("http://localhost:5000/api/auth"),
            axios.get("http://localhost:5000/api/reviews"),
            axios.get("http://localhost:5000/api/certificates"),
            axios.get("http://localhost:5000/api/placements"), // Fetch placements
          ]);
        setCourses(coursesRes.data);
        setUsers(usersRes.data);
        setReviews(reviewsRes.data);
        setCertificates(certsRes.data);
        setPlacements(placementsRes.data); // Set placements data
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddOrEditCourse = async (e) => {
    e.preventDefault();
    const { title, description, duration, category } = newCourse;
    if (!title || !description || !duration || !category)
      return toast.error("Please fill all fields."); // Use toast for error

    try {
      const formData = new FormData();
      Object.entries({ title, description, duration, category }).forEach(
        ([key, val]) => formData.append(key, val)
      );
      formData.append("image", imageFile);

      const res = editId
        ? await axios.put(
            `http://localhost:5000/api/courses/editCourse/${editId}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          )
        : await axios.post(
            "http://localhost:5000/api/courses/addCourse",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

      if (editId) {
        setCourses(
          courses.map((course) => (course._id === editId ? res.data : course))
        );
      } else {
        setCourses([...courses, res.data]);
      }

      resetCourseForm();
      toast.success(
        `${editId ? "Course updated" : "Course added"} successfully`
      );
    } catch (err) {
      toast.error("Error adding/updating course"); // Use toast for error
    }
  };

  const handleAddOrEditCertificate = async (e) => {
    e.preventDefault();
    const { title, issuer, description, issueDate } = newCertificate;
    if (!title || !issuer || !description || !issueDate || !certificateFile)
      return toast.error("Please fill all fields."); // Use toast for error

    try {
      const formData = new FormData();
      Object.entries({ title, issuer, description, issueDate }).forEach(
        ([key, val]) => formData.append(key, val)
      );
      formData.append("certificate", certificateFile);

      const res = editId
        ? await axios.put(
            `http://localhost:5000/api/certificates/editCertificate/${editId}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          )
        : await axios.post(
            "http://localhost:5000/api/certificates/addCertificate",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

      if (editId) {
        setCertificates(
          certificates.map((cert) => (cert._id === editId ? res.data : cert))
        );
      } else {
        setCertificates([...certificates, res.data]);
      }

      resetCertificateForm();
      toast.success(
        `${editId ? "Certificate updated" : "Certificate added"} successfully`
      );
    } catch (err) {
      toast.error("Error adding/updating certificate"); // Use toast for error
    }
  };

  const handleAddOrEditPlacement = async (e) => {
    e.preventDefault();
    const { name, companyName, postName, image } = newPlacement;
    if (!name || !companyName || !postName || !image)
      return toast.error("Please fill all fields."); // Use toast for error

    try {
      const formData = new FormData();
      Object.entries({ name, companyName, postName }).forEach(([key, val]) =>
        formData.append(key, val)
      );
      formData.append("image", image);

      const res = editId
        ? await axios.put(
            `http://localhost:5000/api/placements/editPlacement/${editId}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          )
        : await axios.post(
            "http://localhost:5000/api/placements/addPlacement",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

      if (editId) {
        setPlacements(
          placements.map((placement) =>
            placement._id === editId ? res.data : placement
          )
        );
      } else {
        setPlacements([...placements, res.data]);
      }

      resetPlacementForm();
      toast.success(
        `${editId ? "Placement updated" : "Placement added"} successfully`
      );
    } catch (err) {
      toast.error("Error adding/updating placement"); // Use toast for error
    }
  };

  const resetCourseForm = () => {
    setNewCourse({ title: "", description: "", duration: "", category: "" });
    setImageFile(null);
    setIsCourseModalOpen(false);
    setEditId(null);
  };

  const resetCertificateForm = () => {
    setNewCertificate({
      title: "",
      issuer: "",
      description: "",
      issueDate: "",
    });
    setCertificateFile(null);
    setIsCertificateModalOpen(false);
    setEditId(null);
  };

  const resetPlacementForm = () => {
    setNewPlacement({ name: "", companyName: "", postName: "", image: null });
    setIsPlacementModalOpen(false);
    setEditId(null);
  };

  const handleDelete = async (type, id) => {
    const confirmMsg = `Are you sure you want to delete this ${type}?`;
    if (!window.confirm(confirmMsg)) return;
    try {
      await axios.delete(`http://localhost:5000/api/${type}/${id}`);
      if (type === "courses/delete")
        setCourses(courses.filter((c) => c._id !== id));
      if (type === "certificates/delete")
        setCertificates(certificates.filter((c) => c._id !== id));
      if (type === "placements/delete")
        setPlacements(placements.filter((p) => p._id !== id));
      if (type === "auth") setUsers(users.filter((u) => u._id !== id));
      if (type === "reviews") setReviews(reviews.filter((r) => r._id !== id));
      toast.success(`${type} deleted successfully`); // Use toast for success
    } catch {
      toast.error(`Failed to delete ${type}`); // Use toast for error
    }
  };

  const handleMakeAdmin = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/make-admin/${id}`);
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, role: "admin" } : user
        )
      );
      toast.success("User  promoted to admin successfully"); // Use toast for success
    } catch {
      toast.error("Failed to promote user to admin"); // Use toast for error
    }
  };

  const loadEditData = (type, data) => {
    if (type === "course") {
      setNewCourse(data);
      setImageFile(null); // Keep the image file as null to allow re-upload
      setEditId(data._id);
      setIsCourseModalOpen(true);
    } else if (type === "certificate") {
      setNewCertificate(data);
      setCertificateFile(null); // Keep the certificate file as null to allow re-upload
      setEditId(data._id);
      setIsCertificateModalOpen(true);
    } else if (type === "placement") {
      setNewPlacement(data);
      setEditId(data._id);
      setIsPlacementModalOpen(true);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-gray-800 space-y-16">
      <h1 className="text-4xl font-bold text-orange-600">Admin Dashboard</h1>

      {/* Users List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search users"
            value={searchUsers}
            onChange={(e) => setSearchUsers(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 w-full sm:w-1/2"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) =>
                  user.name.toLowerCase().includes(searchUsers.toLowerCase())
                )
                .map((user) => (
                  <tr key={user._id}>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.role || "User "}</td>
                    <td className="border px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleDelete("auth", user._id)}
                        className="text-red-500 text-2xl hover:text-red-700 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleMakeAdmin(user._id)}
                          className="text-green-600 text-2xl cursor-pointer hover:text-green-800"
                        >
                          <MdAdminPanelSettings />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="my-8" />

      {/* Reviews List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search reviews"
            value={searchReviews}
            onChange={(e) => setSearchReviews(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 w-full sm:w-1/2"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Reviewer</th>
                <th className="border px-4 py-2">Review</th>
                <th className="border px-4 py-2">Rating</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews
                .filter((review) =>
                  review.reviewer
                    .toLowerCase()
                    .includes(searchReviews.toLowerCase())
                )
                .map((review) => (
                  <tr key={review._id}>
                    <td className="border px-4 py-2">
                      {review.reviewer || "Anonymous"}
                    </td>
                    <td className="border px-4 py-2">{review.review}</td>
                    <td className="border px-4 py-2">{review.rating}/5</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDelete("reviews", review._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center cursor-pointer"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr />

      {/* Add Course Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>
        <button
          onClick={() => {
            setNewCourse({
              title: "",
              description: "",
              duration: "",
              category: "",
            });
            setImageFile(null);
            setEditId(null);
            setIsCourseModalOpen(true);
          }}
          className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 mb-4 cursor-pointer"
        >
          Add Course
        </button>
        {/* Modal for Adding/Editing Course */}
        {isCourseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
              <h2 className="text-2xl font-semibold mb-4">
                {editId ? "Edit Course" : "Add New Course"}
              </h2>
              <form
                onSubmit={
                  editId ? handleAddOrEditCourse : handleAddOrEditCourse
                }
                className="grid gap-4"
              >
                <input
                  type="text"
                  placeholder="Title"
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <textarea
                  placeholder="Description"
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={newCourse.duration}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, duration: e.target.value })
                  }
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newCourse.category}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, category: e.target.value })
                  }
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setIsCourseModalOpen(false)}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 cursor-pointer">
                    {editId ? "Update Course " : "Add Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* Courses List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Courses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="border p-4 rounded shadow bg-white transition-transform transform hover:scale-105"
            >
              <img
                src={`http://localhost:5000${course.imageUrl}`}
                alt="Course"
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-sm text-gray-500">
                {course.category} | {course.duration}
              </p>
              <div className="flex flex-col sm:flex-row justify-between mt-3">
                <button
                  onClick={() => loadEditData("course", course)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 flex items-center justify-center mb-2 sm:mb-0"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete("courses/delete", course._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 flex items-center justify-center"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-8" />

      {/* Add Certificate Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Add New Certificate</h2>
        <button
          onClick={() => {
            setNewCertificate({
              title: "",
              issuer: "",
              description: "",
              issueDate: "",
            });
            setCertificateFile(null);
            setEditId(null);
            setIsCertificateModalOpen(true);
          }}
          className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 mb-4 cursor-pointer"
        >
          Add Certificate
        </button>
        {/* Modal for Adding/Editing Certificate */}
        {isCertificateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
              <h2 className="text-2xl font-semibold mb-4">
                {editId ? "Edit Certificate" : "Add New Certificate"}
              </h2>
              <form
                onSubmit={
                  editId
                    ? handleAddOrEditCertificate
                    : handleAddOrEditCertificate
                }
                className="grid gap-4"
              >
                <input
                  type="text"
                  placeholder="Title"
                  value={newCertificate.title}
                  onChange={(e) =>
                    setNewCertificate({
                      ...newCertificate,
                      title: e.target.value,
                    })
                  }
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="text"
                  placeholder="Issuer"
                  value={newCertificate.issuer}
                  onChange={(e) =>
                    setNewCertificate({
                      ...newCertificate,
                      issuer: e.target.value,
                    })
                  }
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <textarea
                  placeholder="Description"
                  value={newCertificate.description}
                  onChange={(e) =>
                    setNewCertificate({
                      ...newCertificate,
                      description: e.target.value,
                    })
                  }
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                  rows={3}
                />
                <input
                  type="date"
                  value={newCertificate.issueDate}
                  onChange={(e) =>
                    setNewCertificate({
                      ...newCertificate,
                      issueDate: e.target.value,
                    })
                  }
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCertificateFile(e.target.files[0])}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setIsCertificateModalOpen(false)}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 cursor-pointer">
                    {editId ? "Update Certificate" : "Add Certificate"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* Certificates List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Certificates</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="border p-4 rounded shadow bg-white">
              <img
                src={`http://localhost:5000${
                  cert.certificateUrl || cert.certificate
                }`}
                alt="Certificate"
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="font-semibold text-lg">{cert.title}</h3>
              <p className="text-sm text-gray-500">
                {cert.issuer} | {new Date(cert.issueDate).toLocaleDateString()}
              </p>
              <div className="flex flex-col sm:flex-row justify-between mt-3">
                <button
                  onClick={() => loadEditData("certificate", cert)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 flex items-center justify-center mb-2 sm:mb-0"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete("certificates/delete", cert._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 flex items-center justify-center"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-8" />

      {/* Add Placement Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Add New Placement</h2>
        <button
          onClick={() => {
            setNewPlacement({
              name: "",
              companyName: "",
              postName: "",
              image: null,
            });
            setEditId(null);
            setIsPlacementModalOpen(true);
          }}
          className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 mb-4 cursor-pointer"
        >
          Add Placement
        </button>
        {/* Modal for Adding/Editing Placement */}
        {isPlacementModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
              <h2 className="text-2xl font-semibold mb-4">
                {editId ? "Edit Placement" : "Add New Placement"}
              </h2>
              <form
                onSubmit={
                  editId ? handleAddOrEditPlacement : handleAddOrEditPlacement
                }
                className="grid gap-4"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={newPlacement.name}
                  onChange={(e) =>
                    setNewPlacement({ ...newPlacement, name: e.target.value })
                  }
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={newPlacement.companyName}
                  onChange={(e) =>
                    setNewPlacement({
                      ...newPlacement,
                      companyName: e.target.value,
                    })
                  }
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="text"
                  placeholder="Post Name"
                  value={newPlacement.postName}
                  onChange={(e) =>
                    setNewPlacement({
                      ...newPlacement,
                      postName: e.target.value,
                    })
                  }
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewPlacement({
                      ...newPlacement,
                      image: e.target.files[0],
                    })
                  }
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setIsPlacementModalOpen(false)}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 cursor-pointer">
                    {editId ? "Update Placement" : "Add Placement"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* Placements List */}
      <section>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
          {placements.map((placement) => (
            <div
              key={placement._id}
              className="w-full max-w-xs border p-4 rounded-xl shadow-md bg-white text-center"
            >
              <img
                src={`http://localhost:5000${placement.imageUrl}`}
                alt={placement.name}
                className="w-24 h-24 mx-auto object-cover rounded-full mb-3 border-2 border-[#f88922]"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {placement.name}
              </h3>
              <p className="text-sm text-gray-600">
                {placement.companyName} <br /> {placement.postName}
              </p>
              <div className="flex m-auto justify-evenly">
                <button
                  onClick={() => loadEditData("placement", placement)}
                  className="mt-4 w-[48%] cursor-pointer bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 flex items-center justify-center"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    handleDelete("placements/delete", placement._id)
                  }
                  className="mt-4 w-[48%] cursor-pointer bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 flex items-center justify-center"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-8" />
    </div>
  );
};

export default Admin;
