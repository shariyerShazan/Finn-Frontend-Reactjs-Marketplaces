# 🧪 Chat System Testing Guide

## Quick Start

### 1. **Environment Setup**

```bash
# Make sure .env has:
VITE_SOCKET_URL=http://localhost:3000  # Or your backend URL
```

### 2. **Start Backend**

```bash
cd your-backend-project
npm install  # Make sure socket.io is installed
npm run start
```

### 3. **Start Frontend**

```bash
cd Finn-frontend
npm run dev
```

---

## 🧪 Test Scenarios

### **Test 1: Real-Time Messaging**

**What to test:** Messages appear instantly without page refresh

**Steps:**

1. Open browser with 2 tabs (or 2 browsers)
2. Login with 2 different user accounts in each tab
3. Tab A: Start/Open a chat
4. Tab B: Open the same chat
5. Tab A: Type a message and send
6. **Expected:** Message appears instantly in Tab B (no refresh needed)

**How to verify:**

- No network lag
- Message appears with timestamp
- Sender's profile picture is correct

---

### **Test 2: Online Status**

**What to test:** Users show as "Active Now" when online

**Steps:**

1. Login with User A in Tab 1
2. Login with User B in Tab 2
3. Tab A: Look at conversation list
4. **Expected:** User B has green "Active" badge next to their name
5. Close Tab 2
6. **Expected:** After ~3 seconds, "Active" badge disappears

**How to verify:**

- Green dot appears on avatar
- "Active" text shows next to user name
- Goes away when user goes offline

---

### **Test 3: Search Functionality**

**What to test:** Conversations filter by user name in real-time

**Steps:**

1. Have at least 3 conversations
2. Click on the search box in chat section
3. Type a partial name (e.g., "John")
4. **Expected:** Only matching conversations appear
5. Clear the search
6. **Expected:** All conversations reappear

**How to verify:**

- Search is case-insensitive
- Partial matches work
- Clears quickly without lag

---

### **Test 4: Active Now Section**

**What to test:** Online users appear in horizontal scrollable section

**Steps:**

1. Have 5+ conversations with different people
2. Make 3 of those people online
3. Open chat
4. **Expected:** "Active Now" section shows 3 online users in horizontal scroll
5. Hover over online user
6. **Expected:** Avatar shows blue border and green online dot

---

### **Test 5: Auto-Scroll**

**What to test:** Chat automatically scrolls to latest message

**Steps:**

1. Open a conversation with many messages
2. Scroll up to see old messages
3. Other person sends a new message
4. **Expected:** Chat automatically scrolls down to show new message
5. **Expected:** Scroll is smooth (not instant jump)

---

### **Test 6: Image Sharing**

**What to test:** Users can send and receive images

**Steps:**

1. Open chat between 2 users
2. User A: Click image icon
3. User A: Select an image file
4. User A: See image preview with X button
5. User A: Click send
6. **Expected:** Image appears in chat bubble
7. **Expected:** Image appears instantly in User B's chat
8. User B: Click image to open in new tab

**How to verify:**

- Image preview shows before sending
- X button removes image
- Image is properly displayed in chat
- Image is clickable

---

### **Test 7: Block/Unblock**

**What to test:** Users can block/unblock conversations

**Steps:**

1. Open chat with User B
2. Click three dots menu (⋮)
3. Click "Block User"
4. **Expected:** Message input becomes disabled (grayed out)
5. **Expected:** Placeholder says "You cannot reply to this conversation"
6. Click three dots again
7. Click "Unblock User"
8. **Expected:** Input becomes enabled again

---

### **Test 8: Delete Conversation**

**What to test:** Users can delete conversations

**Steps:**

1. Count conversations (e.g., 5)
2. Open a chat
3. Click three dots menu
4. Click "Delete Conversation"
5. **Expected:** Conversation disappears from list
6. **Expected:** Conversation count reduces (4 left)

---

### **Test 9: Multiple Devices**

**What to test:** Same user on multiple devices receives updates

**Steps:**

1. Login with User A on Phone
2. Login with User A on Laptop
3. User B sends a message
4. **Expected:** Message appears on both devices instantly
5. Close app on phone
6. User B sends another message
7. **Expected:** Message appears on laptop but not phone

---

### **Test 10: Connection Recovery**

**What to test:** Chat reconnects after network interruption

**Steps:**

1. Open chat
2. Disconnect internet (or restart backend)
3. **Expected:** Socket tries to reconnect (up to 5 times)
4. Reconnect internet
5. **Expected:** Socket reconnects automatically
6. Other user sends message
7. **Expected:** New message appears (without page refresh)

---

## 🐛 Debugging

### **Check if Socket is Connected**

Open browser console:

```javascript
// In browser console, type:
console.log("Socket connected:", socketService.getSocket()?.connected);
```

**Expected:** `Socket connected: true`

### **Monitor Socket Events**

```javascript
// In browser console:
const socket = socketService.getSocket();
socket.on("message.send", (msg) => console.log("📨 New message:", msg));
socket.on("onlineUsers.list", (users) =>
  console.log("👥 Online users:", users),
);
```

### **Check Redux Cache**

Open Redux DevTools (if installed):

1. Look for `chatApi/getMyConversations`
2. Check `status` is "fulfilled"
3. Check `data.conversations` has correct data

### **Network Tab**

1. Open DevTools → Network tab
2. Filter by "chat"
3. Check `/chat/conversations` request
4. Check `/chat/online-users` request

---

## ✅ Common Issues & Solutions

| Issue                        | Solution                                                    |
| ---------------------------- | ----------------------------------------------------------- |
| Messages don't appear        | Check socket is connected, verify backend is running        |
| Online status doesn't update | Increase polling interval or check `onlineUsers.list` event |
| Search doesn't work          | Clear search box, type slowly, check console for errors     |
| Images don't upload          | Check Cloudinary config, verify CORS settings               |
| Auto-scroll not smooth       | Clear browser cache, restart dev server                     |
| Chat freezes                 | Reduce polling interval, check memory usage                 |

---

## 📊 Performance Tips

1. **Reduce Polling Interval (if needed)**
   - Currently: 3000ms (3 seconds)
   - In `SearchChatSection.tsx` and `Chats.tsx`
   - Lower = more frequent updates (uses more data)
   - Higher = less frequent updates (appears slower)

2. **Message Limit**
   - Consider pagination for old messages
   - Load only last 50 messages initially
   - Load more when user scrolls up

3. **Optimize Images**
   - Compress images before upload
   - Set image size limits
   - Use thumbnail preview

---

## 🎯 Success Criteria

All tests pass? You're done! ✅

- [ ] Real-time messaging works
- [ ] Online status updates
- [ ] Search filters correctly
- [ ] Auto-scroll works smoothly
- [ ] Images upload/display
- [ ] Block/unblock works
- [ ] Delete conversation works
- [ ] Multiple devices sync
- [ ] Connection recovers after disconnect
- [ ] No console errors

---

## 📞 Need Help?

If tests fail:

1. Check `CHAT_SETUP.md` for setup instructions
2. Verify backend is running and healthy
3. Check browser console for errors
4. Check Network tab for failed requests
5. Restart dev server and try again

---

**Happy testing! 🚀**
