"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Bookmark,
  Briefcase,
  ChevronDown,
  FileText,
  Home,
  Menu,
  Pencil,
  Plus,
  Search,
  User
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { label: "My Trips", href: "/dashboard", icon: Home },
  { label: "Drafts", href: "/dashboard", icon: FileText },
  { label: "Bookmarks", href: "/dashboard", icon: Bookmark },
  {
    label: "Edit Profile",
    href: "/dashboard/edit-profile",
    icon: User,
    active: true
  }
];

const profilePhoto = "/images/hero/mountain-lake-traveler.png";

export function EditProfilePage() {
  const [name, setName] = useState("Aisha Verma");

  return (
    <main id="main-content" className="dashboard-page dashboard-edit-page">
      <header className="dashboard-topbar" aria-label="Dashboard header">
        <Link className="dashboard-brand" href="/" aria-label="AfterTrip home">
          <Image
            src="/brand/aftertrip-mark.svg"
            alt=""
            width={38}
            height={38}
            priority
            aria-hidden="true"
          />
          <span>AfterTrip</span>
        </Link>
        <nav
          className="dashboard-desktop-nav"
          aria-label="Dashboard navigation"
        >
          <Link href="/explore">Explore</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#footer">About</Link>
        </nav>
        <div className="dashboard-top-actions">
          <Link
            className="dashboard-create-button"
            href="/dashboard/create-trip"
          >
            <Plus aria-hidden="true" size={18} />
            Create Trip
          </Link>
          <button
            className="dashboard-icon-button"
            type="button"
            aria-label="Notifications"
          >
            <Bell aria-hidden="true" size={22} />
          </button>
          <Link
            className="dashboard-profile-button"
            href="/dashboard/edit-profile"
            aria-label="Open edit profile"
          >
            <span
              style={{ backgroundImage: "url(" + profilePhoto + ")" }}
              aria-hidden="true"
            />
            <ChevronDown aria-hidden="true" size={18} />
          </Link>
        </div>
        <div className="dashboard-mobile-actions">
          <button
            className="dashboard-icon-button"
            type="button"
            aria-label="Notifications"
          >
            <Bell aria-hidden="true" size={21} />
          </button>
          <button
            className="dashboard-icon-button"
            type="button"
            aria-label="Open menu"
          >
            <Menu aria-hidden="true" size={25} />
          </button>
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
          <div className="profile-edit-heading">
            <p>Edit Profile</p>
            <h1 id="profile-edit-title">Your profile</h1>
            <span>Update your display name for now.</span>
          </div>

          <form className="profile-edit-card" aria-label="Edit profile form">
            <div className="profile-edit-preview" aria-hidden="true">
              <span style={{ backgroundImage: "url(" + profilePhoto + ")" }} />
              <strong>{name || "Traveler"}</strong>
            </div>
            <label>
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
              />
            </label>
            <div className="profile-edit-actions">
              <Link href="/dashboard">Cancel</Link>
              <button type="button">
                <Pencil aria-hidden="true" size={18} />
                Save changes
              </button>
            </div>
          </form>
        </section>
      </div>

      <nav
        className="dashboard-bottom-nav"
        aria-label="Mobile dashboard navigation"
      >
        <Link href="/explore">
          <Search aria-hidden="true" size={22} />
          Explore
        </Link>
        <button type="button">
          <Bookmark aria-hidden="true" size={22} />
          Bookmarks
        </button>
        <Link className="create" href="/dashboard/create-trip">
          <Plus aria-hidden="true" size={28} />
          <span>Create Trip</span>
        </Link>
        <Link href="/dashboard">
          <Briefcase aria-hidden="true" size={22} />
          My Trips
        </Link>
        <Link className="active" href="/dashboard/edit-profile">
          <User aria-hidden="true" size={22} />
          Profile
        </Link>
      </nav>
    </main>
  );
}
