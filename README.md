# 📚 SmartMark: Real-time Bookmark Manager

SmartMark is a high-performance, real-time bookmarking dashboard built with **Next.js** and **Supabase**. It focuses on seamless data synchronization and advanced session management across multiple browser tabs, ensuring a secure and "smart" user experience.

---

## 🚀 Quick Start: Local Setup

Follow these steps to get the project running on your local machine:

### 1. Clone & Install

```bash
git clone https://github.com/M0HiT27/supa-bookmark
cd smart-bookmarks
npm install
npm run dev
```

#### 🧠 Technical Challenges & Solutions

Developing a robust, real-time application requires handling edge cases that standard CRUD tutorials often overlook. Below are the key architectural hurdles encountered during development and the strategies used to solve them.

---

## 1. The "Ghost Session" Multi-Tab Problem

### The Challenge

A significant security and UX flaw was identified: when a user logged out in **Tab A**, **Tab B** would remain visually "logged in." This allowed users to interact with stale data and attempt operations on a session that had already been destroyed on the server.

### The Solution: "Global Auth Sync" Strategy

To ensure a consistent security state across the browser, I implemented a three-layered synchronization approach:

- **Storage Event Listener:** Added a listener for the browser’s `storage` event. When Tab A clears the authentication token (at sign-out), Tab B detects the change in `localStorage` and triggers an immediate redirect.
- **Window Focus Re-verification:** Implemented a listener that executes `supabase.auth.getSession()` whenever a user switches back to a tab. This ensures "asleep" tabs are forced to the login page if the session expired while the tab was out of focus.
- **Pre-flight Operation Guard:** As a final fail-safe, a session check was added inside the `handleSubmit` function. This blocks any attempt to add data on the client side before the API call is even made, even if the UI hasn't redirected yet.

---

## 2. Silent Real-time Deletes

### The Challenge

While `INSERT` events updated across tabs perfectly, `DELETE` events were "silent." The database would remove the item, but other active tabs wouldn't reflect the change until a manual page refresh. This occurred because PostgreSQL does not broadcast the ID of a deleted row by default.

### The Solution: Replica Identity Adjustment

I identified that for the frontend to filter out a deleted item in real-time, the broadcast payload must contain the primary key of the removed row.

1.  **Database Level:** I updated the table configuration using the following SQL:
    ```sql
    ALTER TABLE bookmarks REPLICA IDENTITY FULL;
    ```
2.  **Frontend Level:** By forcing the database to include the full row data in the broadcast payload, the frontend `.filter()` logic was able to successfully match `payload.old.id` and remove the deleted item from the state instantly.

---

## 🛠️ Key Takeaways

- **State Integrity:** Client-side state must always be synchronized with the browser's storage to prevent unauthorized "ghost" actions.
- **Real-time Payloads:** Standard database configurations often optimize for speed over data verbosity; enabling `REPLICA IDENTITY FULL` is essential for seamless real-time UI updates.

```

```
