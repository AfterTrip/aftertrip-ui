"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Home,
  ImageUp,
  Map,
  Pencil,
  Plus,
  User
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import {
  getOwnProfile,
  publicMediaUrl,
  updateOwnProfile,
  uploadMedia
} from "@/lib/aftertrip-api";
import { useAuthenticatedPage } from "@/lib/use-authenticated-page";
import { AccountMenu } from "@/components/layout/account-menu";
import { DashboardBottomNavigation } from "@/components/dashboard/dashboard-bottom-navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const sidebarItems = [
  { label: "My Trips", href: "/dashboard", icon: Home },
  { label: "Travel Footprint", href: "/dashboard/travel-footprint", icon: Map },
  { label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  {
    label: "Edit Profile",
    href: "/dashboard/edit-profile",
    icon: User,
    active: true
  }
];

export function EditProfilePage() {
  const authenticated = useAuthenticatedPage();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [tagline, setTagline] = useState("");
  const [avatarMediaId, setAvatarMediaId] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authenticated) return;
    getOwnProfile()
      .then((profile) => {
        setName(profile.displayName);
        setLocation(profile.location ?? "");
        setTagline(profile.tagline ?? "");
        setAvatarMediaId(profile.avatarMediaId ?? null);
        setProfilePhoto(
          publicMediaUrl(profile.avatarMediaId) ??
            profile.avatarUrl ??
            ""
        );
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Could not load your profile."));
  }, [authenticated]);

  const changePhoto = async (file?: File) => {
    if (!file) return;
    setMessage("");
    setUploadingPhoto(true);
    try {
      const media = await uploadMedia(file, "PROFILE_AVATAR");
      setAvatarMediaId(media.id);
      setProfilePhoto(URL.createObjectURL(file));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not upload that photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setMessage("Name is required.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await updateOwnProfile({
        displayName: name.trim(),
        location: location.trim() || null,
        tagline: tagline.trim() || null,
        avatarMediaId
      });
      setMessage("Profile saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main id="main-content" className="dashboard-page dashboard-edit-page">
      <header className="dashboard-topbar" aria-label="Dashboard header">
        <Link className="dashboard-brand" href="/" aria-label="AfterTrip home">
          <Image
            src="/brand/aftertrip-logo-green.png"
            alt=""
            width={160}
            height={53}
            priority
            aria-hidden="true"
          />
        </Link>
        <nav
          className="dashboard-desktop-nav"
          aria-label="Dashboard navigation"
        >
          <Link href="/explore">Explore</Link>
          <Link href="/#reviews">Reviews</Link>
          <Link href="/#how-it-works">How it works</Link>
        </nav>
        <div className="dashboard-top-actions">
          <ThemeToggle />
          <Link
            className="dashboard-create-button"
            href="/dashboard/create-trip"
          >
            <Plus aria-hidden="true" size={18} />
            Publish Trip
          </Link>
          <AccountMenu variant="dashboard" />
        </div>
        <div className="dashboard-mobile-actions">
          <ThemeToggle />
        </div>
      </header>

      <div className="dashboard-shell">
        <aside className="dashboard-sidebar" aria-label="Dashboard sections">
          <nav className="dashboard-side-nav">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  className={item.active ? "active" : undefined}
                  href={item.href}
                  key={item.label}
                >
                  <Icon aria-hidden="true" size={22} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section
          className="dashboard-content profile-edit-content"
          aria-labelledby="profile-edit-title"
        >
          <form className="profile-edit-card" aria-label="Edit profile form" onSubmit={saveProfile}>
            <div className="profile-edit-preview">
              <span
                className={profilePhoto ? "has-photo" : "profile-initials"}
                style={profilePhoto ? { backgroundImage: "url(" + profilePhoto + ")" } : undefined}
              >
                {profilePhoto ? null : (name || "Traveler").slice(0, 1).toUpperCase()}
              </span>
              <div>
                <strong>{name || "Traveler"}</strong>
                {location ? <small>{location}</small> : null}
                {tagline ? <p>{tagline}</p> : null}
              </div>
              <label className="profile-photo-control">
                <ImageUp aria-hidden="true" size={19} />
                <span>
                  <strong>{uploadingPhoto ? "Uploading..." : "Change photo"}</strong>
                  <small>JPG, PNG or WebP</small>
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={uploadingPhoto}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    void changePhoto(file);
                  }}
                />
              </label>
            </div>
            <label>
              <span>Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
              />
            </label>
            <label>
              <span>
                Location <em>(optional)</em>
              </span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. Kochi, Kerala, India"
              />
            </label>
            <label>
              <span>
                Tagline <em>(optional)</em>
              </span>
              <input
                value={tagline}
                onChange={(event) => setTagline(event.target.value)}
                placeholder="A short line about how you travel"
                maxLength={90}
              />
            </label>
            <div className="profile-edit-actions">
              <Link href="/dashboard">Cancel</Link>
              <button type="submit" disabled={saving}>
                <Pencil aria-hidden="true" size={18} />
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
            {message ? <p className="profile-edit-message" role="status">{message}</p> : null}
          </form>
        </section>
      </div>

      <DashboardBottomNavigation />
    </main>
  );
}
