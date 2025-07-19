import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

const Admin = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Courses
  const [courses, setCourses] = useState([]);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    duration: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);

  // Certificates
  const [certificates, setCertificates] = useState([]);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [newCertificate, setNewCertificate] = useState({
    title: "",
    issuer: "",
    description: "",
    issueDate: "",
  });
  const [certificateFile, setCertificateFile] = useState(null);

  // Placements
  const [placements, setPlacements] = useState([]);
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
  const [newPlacement, setNewPlacement] = useState({
    name: "",
    companyName: "",
    postName: "",
  });
  const [placementImageFile, setPlacementImageFile] = useState(null);

  // Users & Reviews
  const [users, setUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState("");

  const [reviews, setReviews] = useState([]);
  const [searchReviews, setSearchReviews] = useState("");

  // Banners
  const [banners, setBanners] = useState([]);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerImageFile, setBannerImageFile] = useState(null);

  // Edit tracking
  const [editId, setEditId] = useState(null);
  const [editType, setEditType] = useState(""); // 'course', 'certificate', 'placement', 'banner'

  // Fetch all data once on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          coursesRes,
          certsRes,
          placementsRes,
          usersRes,
          reviewsRes,
          bannersRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/courses", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/certificates", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/placements", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/auth/users", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/reviews", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/banners", {
            withCredentials: true,
          }),
        ]);
        setCourses(coursesRes.data);
        setCertificates(certsRes.data);
        setPlacements(placementsRes.data);
        setUsers(usersRes.data);
        setReviews(reviewsRes.data);
        setBanners(bannersRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Reset forms
  const resetForm = () => {
    setNewCourse({ title: "", description: "", duration: "", category: "" });
    setImageFile(null);

    setNewCertificate({
      title: "",
      issuer: "",
      description: "",
      issueDate: "",
    });
    setCertificateFile(null);

    setNewPlacement({ name: "", companyName: "", postName: "" });
    setPlacementImageFile(null);

    setBannerImageFile(null);

    setEditId(null);
    setEditType("");
  };

  // Open modal for add/edit
  const openModal = (type, data = null) => {
    setEditType(type);
    if (data) {
      setEditId(data._id);
      if (type === "course") setNewCourse(data);
      else if (type === "certificate") setNewCertificate(data);
      else if (type === "placement") setNewPlacement(data);
    } else {
      resetForm();
    }

    if (type === "course") setIsCourseModalOpen(true);
    else if (type === "certificate") setIsCertificateModalOpen(true);
    else if (type === "placement") setIsPlacementModalOpen(true);
    else if (type === "banner") setIsBannerModalOpen(true);
  };

  // Close all modals
  const closeModal = () => {
    setIsCourseModalOpen(false);
    setIsCertificateModalOpen(false);
    setIsPlacementModalOpen(false);
    setIsBannerModalOpen(false);
    resetForm();
  };

  // Add/Edit handlers
  const handleAddEdit = async (type) => {
    let url = "";
    let dataToSend;
    let isEdit = Boolean(editId);
    try {
      if (type === "course") {
        url = isEdit
          ? `http://localhost:5000/api/courses/editCourse/${editId}`
          : "http://localhost:5000/api/courses/addCourse";
        dataToSend = new FormData();
        dataToSend.append("title", newCourse.title);
        dataToSend.append("description", newCourse.description);
        dataToSend.append("duration", newCourse.duration);
        dataToSend.append("category", newCourse.category);
        if (imageFile) dataToSend.append("image", imageFile);
      } else if (type === "certificate") {
        url = isEdit
          ? `http://localhost:5000/api/certificates/editCertificate/${editId}`
          : "http://localhost:5000/api/certificates/addCertificate";
        dataToSend = new FormData();
        dataToSend.append("title", newCertificate.title);
        dataToSend.append("issuer", newCertificate.issuer);
        dataToSend.append("description", newCertificate.description);
        dataToSend.append("issueDate", newCertificate.issueDate);
        if (certificateFile) dataToSend.append("image", certificateFile);
      } else if (type === "placement") {
        url = isEdit
          ? `http://localhost:5000/api/placements/editPlacement/${editId}`
          : "http://localhost:5000/api/placements/addPlacement";
        dataToSend = new FormData();
        dataToSend.append("name", newPlacement.name);
        dataToSend.append("companyName", newPlacement.companyName);
        dataToSend.append("postName", newPlacement.postName);
        if (placementImageFile) dataToSend.append("image", placementImageFile);
      } else if (type === "banner") {
        url = isEdit
          ? `http://localhost:5000/api/banners/editBanner/${editId}`
          : "http://localhost:5000/api/banners/addBanner";
        dataToSend = new FormData();
        if (bannerImageFile) dataToSend.append("image", bannerImageFile);
      }

      const res = await axios({
        method: isEdit ? "put" : "post",
        url,
        data: dataToSend,
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // Update state based on type
      if (type === "course") {
        if (isEdit) {
          setCourses(courses.map((c) => (c._id === editId ? res.data : c)));
        } else {
          setCourses([...courses, res.data]);
        }
        setIsCourseModalOpen(false);
      } else if (type === "certificate") {
        if (isEdit) {
          setCertificates(
            certificates.map((c) => (c._id === editId ? res.data : c))
          );
        } else {
          setCertificates([...certificates, res.data]);
        }
        setIsCertificateModalOpen(false);
      } else if (type === "placement") {
        if (isEdit) {
          setPlacements(
            placements.map((p) => (p._id === editId ? res.data : p))
          );
        } else {
          setPlacements([...placements, res.data]);
        }
        setIsPlacementModalOpen(false);
      } else if (type === "banner") {
        if (isEdit) {
          setBanners(banners.map((b) => (b._id === editId ? res.data : b)));
        } else {
          setBanners([...banners, res.data]);
        }
        setIsBannerModalOpen(false);
      }
      toast.success(`${isEdit ? "Updated" : "Added"} successfully`);
      resetForm();
    } catch (err) {
      toast.error(`Failed to ${isEdit ? "update" : "add"} ${type}`);
    }
  };

  // Delete handler
  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;
    try {
      let apiUrl = "";
      if (type === "course")
        apiUrl = `http://localhost:5000/api/courses/delete/${id}`;
      else if (type === "certificate")
        apiUrl = `http://localhost:5000/api/certificates/delete/${id}`;
      else if (type === "placement")
        apiUrl = `http://localhost:5000/api/placements/delete/${id}`;
      else if (type === "banner")
        apiUrl = `http://localhost:5000/api/banners/delete/${id}`;
      else if (type === "user")
        apiUrl = `http://localhost:5000/api/auth/users/${id}`;
      else if (type === "review")
        apiUrl = `http://localhost:5000/api/reviews/${id}`;

      await axios.delete(apiUrl, { withCredentials: true });

      if (type === "course") setCourses(courses.filter((c) => c._id !== id));
      else if (type === "certificate")
        setCertificates(certificates.filter((c) => c._id !== id));
      else if (type === "placement")
        setPlacements(placements.filter((p) => p._id !== id));
      else if (type === "banner")
        setBanners(banners.filter((b) => b._id !== id));
      else if (type === "user") setUsers(users.filter((u) => u._id !== id));
      else if (type === "review")
        setReviews(reviews.filter((r) => r._id !== id));

      toast.success(`${type} deleted successfully`);
    } catch {
      toast.error(`Failed to delete ${type}`);
    }
  };

  // Promote user to admin
  const handleMakeAdmin = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/make-admin/${id}`, null, {
        withCredentials: true,
      });
      setUsers(users.map((u) => (u._id === id ? { ...u, role: "admin" } : u)));
      toast.success("User  promoted to admin");
    } catch {
      toast.error("Failed to promote user");
    }
  };

  // UI loaders
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
      <h1 className="text-4xl font-bold text-orange-600 mb-10">
        Admin Dashboard
      </h1>

      {/* USERS */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={searchUsers}
          onChange={(e) => setSearchUsers(e.target.value)}
          className="border p-2 rounded w-full max-w-md mb-4"
        />
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full bg-white">
            <thead className="bg-orange-600 text-white">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((u) =>
                  u.name.toLowerCase().includes(searchUsers.toLowerCase())
                )
                .map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-100">
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.role || "User "}</td>
                    <td className="py-2 px-4 flex gap-3">
                      <button
                        onClick={() => handleDelete("user", user._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete user"
                      >
                        <FaTrash size={18} />
                      </button>
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleMakeAdmin(user._id)}
                          className="text-green-600 hover:text-green-800"
                          title="Promote to admin"
                        >
                          <MdAdminPanelSettings size={20} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* REVIEWS */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        <input
          type="text"
          placeholder="Search reviews..."
          value={searchReviews}
          onChange={(e) => setSearchReviews(e.target.value)}
          className="border p-2 rounded w-full max-w-md mb-4"
        />
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full bg-white">
            <thead className="bg-orange-600 text-white">
              <tr>
                <th className="py-2 px-4">Reviewer</th>
                <th className="py-2 px-4">Review</th>
                <th className="py-2 px-4">Rating</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews
                .filter((r) =>
                  r.reviewer
                    ?.toLowerCase()
                    .includes(searchReviews.toLowerCase())
                )
                .map((review) => (
                  <tr key={review._id} className="border-t hover:bg-gray-100">
                    <td className="py-2 px-4">
                      {review.reviewer || "Anonymous"}
                    </td>
                    <td className="py-2 px-4">{review.review}</td>
                    <td className="py-2 px-4">{review.rating}/5</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleDelete("review", review._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete review"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* COURSES */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
          Courses
          <button
            onClick={() => openModal("course")}
            className="bg-orange-600 text-white py-1 px-4 rounded hover:bg-orange-700"
          >
            Add Course
          </button>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="border p-4 rounded shadow hover:shadow-lg relative"
            >
              <img
                src={`http://localhost:5000${course.imageUrl}`}
                alt={course.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
              <p className="text-sm mb-1">{course.description}</p>
              <p className="text-sm mb-1">
                <b>Duration:</b> {course.duration}
              </p>
              <p className="text-sm mb-3">
                <b>Category:</b> {course.category}
              </p>
              <div className="flex gap-2 absolute top-2 right-2">
                <button
                  onClick={() => openModal("course", course)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete("course", course._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CERTIFICATES */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
          Certificates
          <button
            onClick={() => openModal("certificate")}
            className="bg-orange-600 text-white py-1 px-4 rounded hover:bg-orange-700"
          >
            Add Certificate
          </button>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="border p-4 rounded shadow hover:shadow-lg relative"
            >
              <img
                src={`http://localhost:5000${cert.certificate}`}
                alt={cert.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="text-xl font-semibold mb-1">{cert.title}</h3>
              <p className="text-sm mb-1">{cert.description}</p>
              <p className="text-sm mb-1">
                <b>Issuer:</b> {cert.issuer}
              </p>
              <p className="text-sm mb-3">
                <b>Issue Date:</b> {cert.issueDate}
              </p>
              <div className="flex gap-2 absolute top-2 right-2">
                <button
                  onClick={() => openModal("certificate", cert)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete("certificate", cert._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PLACEMENTS */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
          Placements
          <button
            onClick={() => openModal("placement")}
            className="bg-orange-600 text-white py-1 px-4 rounded hover:bg-orange-700"
          >
            Add Placement
          </button>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placements.map((place) => (
            <div
              key={place._id}
              className="border p-4 rounded shadow hover:shadow-lg relative"
            >
              <img
                src={`http://localhost:5000${place.imageUrl}`}
                alt={place.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="text-xl font-semibold mb-1">{place.name}</h3>
              <p className="text-sm mb-1">
                <b>Company:</b> {place.companyName}
              </p>
              <p className="text-sm mb-3">
                <b>Post:</b> {place.postName}
              </p>
              <div className="flex gap-2 absolute top-2 right-2">
                <button
                  onClick={() => openModal("placement", place)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete("placement", place._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BANNERS */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
          Banners
          <button
            onClick={() => openModal("banner")}
            className="bg-orange-600 text-white py-1 px-4 rounded hover:bg-orange-700"
          >
            Add Banner
          </button>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="border p-4 rounded shadow hover:shadow-lg relative"
            >
              {banner.imageUrl && (
                <img
                  src={`http://localhost:5000${banner.imageUrl}`}
                  alt={banner._id}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <div className="flex gap-2 absolute top-2 right-2">
                <button
                  onClick={() => openModal("banner", banner)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete("banner", banner._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODALS */}
      {(isCourseModalOpen ||
        isCertificateModalOpen ||
        isPlacementModalOpen ||
        isBannerModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-lg">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            {/* COURSE MODAL */}
            {isCourseModalOpen && (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  {editId ? "Edit Course" : "Add Course"}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddEdit("course");
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Title"
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, title: e.target.value })
                    }
                    required
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <textarea
                    placeholder="Description"
                    value={newCourse.description}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        description: e.target.value,
                      })
                    }
                    required
                    className="border p-2 rounded w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={newCourse.duration}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, duration: e.target.value })
                    }
                    required
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newCourse.category}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, category: e.target.value })
                    }
                    required
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                    {...(!editId ? { required: true } : {})}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 cursor-pointer"
                    >
                      {editId ? "Update Course" : "Add Course"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* CERTIFICATE MODAL */}
            {isCertificateModalOpen && (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  {editId ? "Edit Certificate" : "Add Certificate"}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddEdit("certificate");
                  }}
                  className="space-y-4"
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
                    required
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                    required
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                    required
                    className="border p-2 rounded w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                    {...(!editId ? { required: true } : {})}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCertificateFile(e.target.files[0])}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                    {...(!editId ? { required: true } : {})}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 cursor-pointer"
                    >
                      {editId ? "Update Certificate" : "Add Certificate"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* PLACEMENT MODAL */}
            {isPlacementModalOpen && (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  {editId ? "Edit Placement" : "Add Placement"}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddEdit("placement");
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Name"
                    value={newPlacement.name}
                    onChange={(e) =>
                      setNewPlacement({ ...newPlacement, name: e.target.value })
                    }
                    required
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                    required
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                    required
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPlacementImageFile(e.target.files[0])}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                    {...(!editId ? { required: true } : {})}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 cursor-pointer"
                    >
                      {editId ? "Update Placement" : "Add Placement"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* BANNER MODAL */}
            {isBannerModalOpen && (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  {editId ? "Edit Banner" : "Add Banner"}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddEdit("banner");
                  }}
                  className="space-y-4"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBannerImageFile(e.target.files[0])}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                    {...(!editId ? { required: true } : {})}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 cursor-pointer"
                    >
                      {editId ? "Update Banner" : "Add Banner"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
