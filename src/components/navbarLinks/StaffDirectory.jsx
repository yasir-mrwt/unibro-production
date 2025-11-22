import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Mail,
  MapPin,
  Clock,
  BookOpen,
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Loader,
  Filter,
  Award,
  Briefcase,
  ChevronDown,
  Star,
  Users,
  TrendingUp,
  X,
  Check,
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import { getStoredUser } from "../../services/authService";
import AddEditStaffModal from "./AddEditStaffModal";

const StaffDirectory = () => {
  const { darkMode } = useTheme();
  const [staff, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);

  const observer = useRef();
  const loadingRef = useRef(false);

  useEffect(() => {
    const user = getStoredUser();
    setIsAdmin(user?.role === "admin");
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    setStaff([]);
    setPage(1);
    setHasMore(true);
    fetchStaff(1, true);
  }, [searchQuery, selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/staff/departments",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setDepartments(data.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchStaff = async (pageNum = page, reset = false) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: 2,
        search: searchQuery,
        department: selectedDepartment,
      });

      const response = await fetch(
        import.meta.env.VITE_API_URL + `/api/staff?${params}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.success) {
        setStaff((prev) => {
          if (reset) {
            return data.data;
          }

          const existingIds = new Set(prev.map((s) => s._id));
          const newStaff = data.data.filter((s) => !existingIds.has(s._id));
          return [...prev, ...newStaff];
        });
        setHasMore(data.pagination.hasMore);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
      loadingRef.current = false;
    }
  };

  const lastStaffElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchStaff(nextPage);
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleDelete = async (staffMember) => {
    setDeleteConfirm(staffMember);
    setDeleteStatus("confirm");
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    setDeleteStatus("deleting");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login as admin to delete staff");
      }

      const response = await fetch(
        import.meta.env.VITE_API_URL + `/api/staff/${deleteConfirm._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ ADD THIS
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setStaff((prev) => prev.filter((s) => s._id !== deleteConfirm._id));
        setDeleteStatus("success");

        setTimeout(() => {
          setDeleteConfirm(null);
          setDeleteStatus(null);
        }, 2000);
      } else {
        setDeleteStatus("confirm");
        alert(data.message || "Failed to delete staff member");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      setDeleteStatus("confirm");
      alert("Failed to delete staff member: " + error.message);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
    setDeleteStatus(null);
  };

  const handleAddEdit = () => {
    setStaff([]);
    setPage(1);
    setHasMore(true);
    fetchStaff(1, true);
    setShowModal(false);
    setEditingStaff(null);
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        darkMode ? "bg-gray-950" : "bg-white"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            darkMode ? "bg-blue-600" : "bg-blue-400"
          }`}
        ></div>
        <div
          className={`absolute top-1/3 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            darkMode ? "bg-purple-600" : "bg-purple-400"
          }`}
        ></div>
        <div
          className={`absolute -bottom-40 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            darkMode ? "bg-pink-600" : "bg-pink-400"
          }`}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-12 sm:pb-20">
        {/* Hero Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 backdrop-blur-sm mb-4">
            <Star className="w-4 h-4 text-blue-500" />
            <span
              className={`text-sm font-semibold ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              World-Class Education
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
            <span className={darkMode ? "text-white" : "text-gray-900"}>
              Meet Our{" "}
            </span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Expert Faculty
            </span>
          </h1>

          <p
            className={`text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Learn from distinguished professors and industry leaders who are
            passionate about your success
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  darkMode ? "bg-blue-500/10" : "bg-blue-50"
                }`}
              >
                <Users
                  className={`w-6 h-6 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
              <div className="text-left">
                <p
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  200+
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Faculty Members
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  darkMode ? "bg-purple-500/10" : "bg-purple-50"
                }`}
              >
                <TrendingUp
                  className={`w-6 h-6 ${
                    darkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                />
              </div>
              <div className="text-left">
                <p
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  25+
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Years Average Experience
                </p>
              </div>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setEditingStaff(null);
                setShowModal(true);
              }}
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-semibold shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Add New Faculty
            </button>
          )}
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <div
                className={`relative group ${
                  darkMode
                    ? "bg-gray-900/50 border border-gray-800"
                    : "bg-white border border-gray-200 shadow-lg"
                } rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 hover:shadow-2xl`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Search
                  className={`absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                    darkMode
                      ? "text-gray-500 group-hover:text-blue-400"
                      : "text-gray-400 group-hover:text-blue-600"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search by name, qualification, or course..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`relative z-10 w-full pl-14 pr-5 py-5 outline-none bg-transparent transition-all ${
                    darkMode
                      ? "text-white placeholder-gray-500"
                      : "text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>
            </div>

            <div
              className={`relative group ${
                darkMode
                  ? "bg-gray-900/50 border border-gray-800"
                  : "bg-white border border-gray-200 shadow-lg"
              } rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 hover:shadow-2xl`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Filter
                className={`absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors ${
                  darkMode
                    ? "text-gray-500 group-hover:text-purple-400"
                    : "text-gray-400 group-hover:text-purple-600"
                }`}
              />
              <ChevronDown
                className={`absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors ${
                  darkMode
                    ? "text-gray-500 group-hover:text-purple-400"
                    : "text-gray-400 group-hover:text-purple-600"
                }`}
              />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className={`relative z-10 w-full pl-14 pr-12 py-5 outline-none appearance-none bg-transparent cursor-pointer ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {initialLoad && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
              <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-t-blue-600 border-r-purple-600 border-b-pink-600 border-l-transparent animate-spin"></div>
            </div>
            <p
              className={`mt-6 text-lg font-medium ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Loading exceptional faculty...
            </p>
          </div>
        )}

        {/* Faculty Grid */}
        {!initialLoad && (
          <>
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {staff.map((prof, index) => (
                <div
                  key={prof._id}
                  ref={index === staff.length - 1 ? lastStaffElementRef : null}
                  className={`group relative ${
                    darkMode
                      ? "bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800"
                      : "bg-white border border-gray-200 shadow-xl"
                  } rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-pink-600/10 transition-all duration-500 rounded-3xl"></div>

                  <div className="relative p-8">
                    <div className="flex gap-6 mb-6">
                      <div className="relative flex-shrink-0">
                        <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-opacity"></div>
                        <img
                          src={prof.image}
                          alt={prof.name}
                          className="relative w-28 h-28 rounded-2xl object-cover"
                        />
                        {prof.yearsOfExperience &&
                          prof.yearsOfExperience > 15 && (
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                              <Star className="w-4 h-4 text-white fill-white" />
                            </div>
                          )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h3
                              className={`text-2xl font-bold mb-1 ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {prof.name}
                            </h3>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                              <span className="text-xs font-semibold text-white">
                                {prof.department}
                              </span>
                            </div>
                          </div>

                          {isAdmin && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingStaff(prof);
                                  setShowModal(true);
                                }}
                                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(prof)}
                                className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <GraduationCap
                            className={`w-4 h-4 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {prof.qualification}
                          </p>
                        </div>

                        {prof.yearsOfExperience && (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20">
                            <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                            <span
                              className={`text-xs font-semibold ${
                                darkMode
                                  ? "text-emerald-400"
                                  : "text-emerald-600"
                              }`}
                            >
                              {prof.yearsOfExperience}+ Years Experience
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {prof.bio && (
                      <p
                        className={`text-sm leading-relaxed mb-6 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {prof.bio}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div
                        className={`p-3 rounded-xl ${
                          darkMode ? "bg-gray-800/50" : "bg-gray-50"
                        } group/item hover:scale-105 transition-transform`}
                      >
                        <Mail
                          className={`w-4 h-4 mb-1.5 ${
                            darkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        />
                        <p
                          className={`text-xs font-medium mb-0.5 ${
                            darkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          Email
                        </p>
                        <a
                          href={`mailto:${prof.email}`}
                          className={`text-xs truncate block ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          } hover:text-blue-600`}
                        >
                          {prof.email}
                        </a>
                      </div>

                      <div
                        className={`p-3 rounded-xl ${
                          darkMode ? "bg-gray-800/50" : "bg-gray-50"
                        } group/item hover:scale-105 transition-transform`}
                      >
                        <MapPin
                          className={`w-4 h-4 mb-1.5 ${
                            darkMode ? "text-purple-400" : "text-purple-600"
                          }`}
                        />
                        <p
                          className={`text-xs font-medium mb-0.5 ${
                            darkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          Office
                        </p>
                        <p
                          className={`text-xs truncate ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {prof.office}
                        </p>
                      </div>

                      <div
                        className={`p-3 rounded-xl col-span-2 ${
                          darkMode ? "bg-gray-800/50" : "bg-gray-50"
                        } group/item hover:scale-105 transition-transform`}
                      >
                        <Clock
                          className={`w-4 h-4 mb-1.5 ${
                            darkMode ? "text-green-400" : "text-green-600"
                          }`}
                        />
                        <p
                          className={`text-xs font-medium mb-0.5 ${
                            darkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          Office Hours
                        </p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {prof.counsellingHours}
                        </p>
                      </div>
                    </div>

                    {prof.courses && prof.courses.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className={`p-1.5 rounded-lg ${
                              darkMode ? "bg-blue-500/10" : "bg-blue-50"
                            }`}
                          >
                            <BookOpen
                              className={`w-3.5 h-3.5 ${
                                darkMode ? "text-blue-400" : "text-blue-600"
                              }`}
                            />
                          </div>
                          <h4
                            className={`text-sm font-bold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Teaching
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {prof.courses.map((course, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                                darkMode
                                  ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                              }`}
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {prof.specialization && prof.specialization.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className={`p-1.5 rounded-lg ${
                              darkMode ? "bg-purple-500/10" : "bg-purple-50"
                            }`}
                          >
                            <Award
                              className={`w-3.5 h-3.5 ${
                                darkMode ? "text-purple-400" : "text-purple-600"
                              }`}
                            />
                          </div>
                          <h4
                            className={`text-sm font-bold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Expertise
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {prof.specialization.map((spec, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                                darkMode
                                  ? "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                                  : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                              }`}
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <a
                      href={`mailto:${prof.email}`}
                      className="relative group/btn flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                      <Mail className="relative w-5 h-5 text-white" />
                      <span className="relative text-white">
                        Schedule a Meeting
                      </span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {loading && !initialLoad && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-blue-600 border-r-purple-600 border-b-pink-600 border-l-transparent animate-spin"></div>
                </div>
                <p
                  className={`mt-4 text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Loading more faculty...
                </p>
              </div>
            )}

            {!hasMore && staff.length > 0 && (
              <div className="text-center py-16">
                <div
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${
                    darkMode
                      ? "bg-gray-900 border border-gray-800"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"></div>
                  <p
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    You've met all our amazing faculty members
                  </p>
                </div>
              </div>
            )}

            {staff.length === 0 && !loading && (
              <div className="text-center py-24">
                <Search
                  className={`w-12 h-12 mx-auto mb-6 ${
                    darkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <p
                  className={`text-2xl font-bold mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  No faculty members found
                </p>
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Professional Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className={`max-w-md w-full rounded-2xl shadow-2xl ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3
                  className={`text-xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {deleteStatus === "success"
                    ? "Deleted Successfully"
                    : deleteStatus === "deleting"
                    ? "Deleting..."
                    : "Delete Staff Member"}
                </h3>
                {deleteStatus === "confirm" && (
                  <button
                    onClick={cancelDelete}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "hover:bg-gray-800 text-gray-400"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {deleteStatus === "confirm" && (
                <>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <img
                        src={deleteConfirm.image}
                        alt={deleteConfirm.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold mb-1 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {deleteConfirm.name}
                      </p>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {deleteConfirm.department}
                      </p>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {deleteConfirm.email}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`text-sm mb-6 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Are you sure you want to delete this faculty member? This
                    action cannot be undone.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={cancelDelete}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                        darkMode
                          ? "bg-gray-800 text-white hover:bg-gray-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}

              {deleteStatus === "deleting" && (
                <div className="flex flex-col items-center py-8">
                  <Loader className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                  <p
                    className={`text-center ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Deleting staff member...
                  </p>
                </div>
              )}

              {deleteStatus === "success" && (
                <div className="flex flex-col items-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p
                    className={`text-center font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Staff member deleted successfully
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <AddEditStaffModal
          staff={editingStaff}
          onClose={() => {
            setShowModal(false);
            setEditingStaff(null);
          }}
          onSuccess={handleAddEdit}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default StaffDirectory;
