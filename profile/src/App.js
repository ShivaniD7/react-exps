import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import './App.css';
ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

export default function ProfileManager() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    bio: "",
    picture: null,
    password: "",
    isPrivate: false,
    category: "",
    tags: "",
    favorite: false
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortOption, setSortOption] = useState("Newest");
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'
  const [darkMode, setDarkMode] = useState(false);
  const [themeColor, setThemeColor] = useState("blue"); // 'blue', 'green', 'pink', etc.
  const [unlockAttempts, setUnlockAttempts] = useState({});
  const [lockTimers, setLockTimers] = useState({});
  const [showPasswords, setShowPasswords] = useState({});

  const [unlockedProfiles, setUnlockedProfiles] = useState({});

  const getAllTags = () => {
    return profiles
      .flatMap(p => (p.tags ? p.tags.split(",").map(tag => tag.trim()) : []))
      .filter(Boolean);
  };

  const tagCounts = getAllTags().reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const categoryData = profiles.reduce((acc, p) => {
    if (p.category) {
      acc[p.category] = (acc[p.category] || 0) + 1;
    }
    return acc;
  }, {});

  const favoriteData = {
    favorite: profiles.filter(p => p.favorite).length,
    normal: profiles.filter(p => !p.favorite).length
  };

  const handleUnlock = (id, inputPassword) => {
    const profile = profiles.find((p) => p.id === id);
    const attempts = unlockAttempts[id] || 0;

    // Check lock timer
    const lockUntil = lockTimers[id];
    if (lockUntil && Date.now() < lockUntil) {
      alert("Profile is temporarily locked. Try again later.");
      return;
    }

    // Check password
    if (profile && profile.password === inputPassword) {
      setUnlockedProfiles((prev) => ({ ...prev, [id]: true }));
      setUnlockAttempts((prev) => ({ ...prev, [id]: 0 })); // Reset on success
    } else {
      const newAttempts = attempts + 1;
      setUnlockAttempts((prev) => ({ ...prev, [id]: newAttempts }));

      if (newAttempts >= 3) {
        const lockTime = Date.now() + 5 * 60 * 1000; // Lock for 5 mins
        setLockTimers((prev) => ({ ...prev, [id]: lockTime }));
        alert("Too many failed attempts. Locked for 5 minutes.");
      } else {
        alert("Incorrect password!");
      }
    }
  };


  // Load profiles from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("profiles");
    if (stored) setProfiles(JSON.parse(stored));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("profiles", JSON.stringify(profiles));
  }, [profiles]);
  useEffect(() => {
    // Set dark or light mode
    document.body.classList.toggle("dark", darkMode);

    // Remove all existing theme classes
    document.body.classList.remove(
      "theme-blue", "theme-green", "theme-pink", "theme-purple",
      "theme-red", "theme-orange", "theme-cyan", "theme-yellow"
    );

    // Add the selected theme class
    document.body.classList.add(`theme-${themeColor}`);
  }, [darkMode, themeColor]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture") {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({ ...prev, picture: reader.result }));
      };
      if (file) reader.readAsDataURL(file);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddProfile = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      alert("Name and Email are required.");
      return;
    }
    const newProfile = {
      ...form,
      id: Date.now(),
      animate: true,
      createdAt: new Date().toISOString(),
    };
    setProfiles([...profiles, newProfile]);
    setForm({
      name: "",
      email: "",
      age: "",
      bio: "",
      picture: null,
      password: "",
      isPrivate: false,
      category: "",
      tags: "",
      favorite: false,
    });

    setTimeout(() => {
      setProfiles((prev) =>
        prev.map((p) => (p.id === newProfile.id ? { ...p, animate: false } : p))
      );
    }, 300);
  };

  const handleRemove = (id) => {
    // Add fade-out animation before deletion
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, animate: true } : p))
    );
    setTimeout(() => {
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    }, 300);
  };
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(profiles, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "profiles.json";
    link.click();
  };
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setProfiles(imported.map((p) => ({ ...p, id: Date.now() + Math.random() })));
        } else {
          alert("Invalid JSON format");
        }
      } catch {
        alert("Error parsing JSON");
      }
    };
    reader.readAsText(file);
  };
  const totalProfiles = profiles.length;
  const averageAge = Math.round(
    profiles.reduce((acc, p) => acc + (parseInt(p.age) || 0), 0) / totalProfiles || 0
  );

  const filteredAndSortedProfiles = profiles
    .filter((profile) => {
      const matchesSearch =
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.tags && profile.tags.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (profile.category && profile.category.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === "All" || profile.category === categoryFilter;
      const matchesFavorite = !showFavoritesOnly || profile.favorite;
      return matchesSearch && matchesCategory && matchesFavorite;
    })
    .sort((a, b) => {
      if (sortOption === "Name") return a.name.localeCompare(b.name);
      if (sortOption === "Age") return (parseInt(a.age) || 0) - (parseInt(b.age) || 0);
      return new Date(b.createdAt) - new Date(a.createdAt); // Newest
    });

  const updateField = (id, field, value) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Create Profile</h2>
        <form onSubmit={handleAddProfile} className="profile-form">
          <fieldset>
            <legend>Basic Information</legend>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
            />
            <textarea
              name="bio"
              placeholder="Short bio"
              value={form.bio}
              onChange={handleChange}
            />
          </fieldset>

          <fieldset>
            <legend>Profile Picture & Security</legend>
            <input
              type="file"
              name="picture"
              accept="image/*"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password (optional)"
              value={form.password}
              onChange={handleChange}
            />
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={form.isPrivate}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isPrivate: e.target.checked }))
                  }
                />
                <span>Mark as Private 🔏</span>
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Organization & Tags</legend>
            <input
              type="text"
              name="category"
              placeholder="Category (e.g. Friend, Work)"
              value={form.category}
              onChange={handleChange}
            />
            <input
              type="text"
              name="tags"
              placeholder="Tags (comma-separated)"
              value={form.tags}
              onChange={handleChange}
            />
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="favorite"
                  checked={form.favorite}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, favorite: e.target.checked }))
                  }
                />
                <span>Mark as Favorite ⭐</span>
              </label>
            </div>
          </fieldset>

          <button type="submit">Create Profile</button>
        </form>

      </div>
      <div className="import-export-buttons">
        <button onClick={handleExportJSON}>Export JSON</button>
        <label className="file-upload-label">
          Import JSON
          <input type="file" accept=".json" onChange={handleImportJSON} hidden />
        </label>
      </div>
      <div className="stats-box">
        <p>Total Profiles: {totalProfiles}</p>
        <p>Average Age: {isNaN(averageAge) ? "-" : averageAge}</p>
      </div>
      <div className="controls-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All Categories</option>
          {[...new Set(profiles.map((p) => p.category).filter(Boolean))].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
          />
          Favorites Only
        </label>

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="Newest">Newest</option>
          <option value="Name">Name</option>
          <option value="Age">Age</option>
        </select>
      </div>
      <div className="view-theme-switcher">
        <button
          className="switch-view-btn"
          onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
        >
          Switch to {viewMode === "card" ? "Table" : "Card"} View
        </button>

        <label className="checkbox-inline">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          Dark Mode
        </label>

        <label className="theme-label">
          Theme&nbsp;
          <select value={themeColor} onChange={(e) => setThemeColor(e.target.value)}>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="pink">Pink</option>
            <option value="purple">Purple</option>
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="cyan">Cyan</option>
            <option value="yellow">Yellow</option>
          </select>
        </label>
      </div>


      {viewMode === "card" ? (
        <div className="profile-grid">
          <div className="tag-cloud">
            {Object.entries(tagCounts).map(([tag, count]) => (
              <span
                key={tag}
                className="tag-cloud-item"
                style={{ fontSize: `${12 + count * 2}px` }}
                onClick={() => setSearchQuery(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="charts-container">
            <div className="chart-box">
              <h4>Profiles by Category</h4>
              <Bar
                data={{
                  labels: Object.keys(categoryData),
                  datasets: [
                    {
                      label: "Profiles",
                      data: Object.values(categoryData),
                      backgroundColor: "rgba(54, 162, 235, 0.6)",
                    },
                  ],
                }}
              />
            </div>

            <div className="chart-box">
              <h4>Favorite vs Normal</h4>
              <Pie
                data={{
                  labels: ["Favorite", "Normal"],
                  datasets: [
                    {
                      label: "Profiles",
                      data: [favoriteData.favorite, favoriteData.normal],
                      backgroundColor: ["#ffc107", "#17a2b8"],
                    },
                  ],
                }}
              />
            </div>
          </div>

          {filteredAndSortedProfiles.map((profile) => (
            <div
              className={`profile-card ${profile.animate ? "fade" : "fade-in"}`}
              key={profile.id}
            >
              <button
                className="remove-button"
                onClick={() => handleRemove(profile.id)}
              >
                ×
              </button>
              {profile.isPrivate && !unlockedProfiles[profile.id] ? (
                <div className="locked-profile">
                  <p><strong>This profile is private 🔒</strong></p>

                  <input
                    type={showPasswords[profile.id] ? "text" : "password"}
                    placeholder="Enter password"
                    value={unlockedProfiles[`${profile.id}-temp`] || ""}
                    onChange={(e) =>
                      setUnlockedProfiles((prev) => ({
                        ...prev,
                        [`${profile.id}-temp`]: e.target.value,
                      }))
                    }
                  />

                  <label style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
                    <input
                      type="checkbox"
                      checked={showPasswords[profile.id] || false}
                      onChange={(e) =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          [profile.id]: e.target.checked,
                        }))
                      }
                    />
                    Show Password
                  </label>

                  <button
                    onClick={() =>
                      handleUnlock(profile.id, unlockedProfiles[`${profile.id}-temp`] || "")
                    }
                  >
                    Unlock
                  </button>

                  {unlockAttempts[profile.id] >= 3 && lockTimers[profile.id] && Date.now() < lockTimers[profile.id] && (
                    <p className="lock-timer">
                      Locked until {new Date(lockTimers[profile.id]).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {profile.picture && (
                    <img
                      src={profile.picture}
                      alt="Profile"
                      className="profile-pic"
                    />
                  )}
                  <h3>{profile.name}</h3>
                  <p>{profile.email}</p>
                  {profile.age && <p>Age: {profile.age}</p>}
                  {profile.bio && <p className="bio">{profile.bio}</p>}
                  {profile.category && <p>Category: {profile.category}</p>}
                  {profile.favorite && <p>⭐ Favorite</p>}
                  {profile.tags && (
                    <p className="tags">
                      {profile.tags.split(",").map((tag, i) => (
                        <span key={i} className="tag">{tag.trim()}</span>
                      ))}
                    </p>
                  )}
                </>
              )}
              {editingProfileId === profile.id ? (
                <>
                  <input
                    value={profile.name}
                    onChange={(e) =>
                      updateField(profile.id, "name", e.target.value)
                    }
                  />
                  <input
                    value={profile.email}
                    onChange={(e) =>
                      updateField(profile.id, "email", e.target.value)
                    }
                  />
                  <button onClick={() => setEditingProfileId(null)}>💾 Save</button>
                </>
              ) : (
                <>
                  <p className="timestamp">
                    Created: {new Date(profile.createdAt).toLocaleString()}
                  </p>
                  <button onClick={() => setEditingProfileId(profile.id)}>✏️ Edit</button>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <table className="profile-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created</th>
              <th>Favorite</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedProfiles.map((profile) => (
              <tr key={profile.id}>
                <td>{profile.name}</td>
                <td>{profile.email}</td>
                <td>{new Date(profile.createdAt).toLocaleString()}</td>
                <td>{profile.favorite ? "⭐" : ""}</td>
                <td>
                  <button onClick={() => handleRemove(profile.id)}>🗑️</button>
                  <button onClick={() => setEditingProfileId(profile.id)}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}