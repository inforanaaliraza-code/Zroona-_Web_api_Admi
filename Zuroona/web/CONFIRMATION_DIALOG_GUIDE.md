# Universal Confirmation Dialog - Implementation Guide

## 📋 Overview

This guide shows how to add "Are you sure?" confirmation dialogs to ALL actions across the Zuroona project using Shadcn-inspired components.

---

## 🎯 Components Created

1. **`ConfirmDialog.jsx`** - Universal confirmation dialog component
2. **`useConfirm.js`** - Custom React hook for easy state management
3. **Translations** - Added in both English and Arabic

---

## 🚀 Quick Start

### Method 1: Using the Hook (Recommended)

```jsx
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useConfirm } from "@/hooks/useConfirm";
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  const { confirmProps, openConfirm } = useConfirm();

  const handleDelete = async () => {
    // Your delete logic here
    await deleteEvent(eventId);
  };

  const onDeleteClick = () => {
    openConfirm({
      title: t("confirm.deleteTitle"),
      description: t("confirm.deleteDescription"),
      confirmText: t("confirm.deleteButton"),
      cancelText: t("confirm.cancel"),
      variant: "danger",
      onConfirm: handleDelete,
    });
  };

  return (
    <>
      <button onClick={onDeleteClick}>Delete Event</button>
      <ConfirmDialog {...confirmProps} />
    </>
  );
}
```

### Method 2: Direct Component Usage

```jsx
import { useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

function MyComponent() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = async () => {
    // Your action here
    await performAction();
    setShowConfirm(false);
  };

  return (
    <>
      <button onClick={() => setShowConfirm(true)}>Action</button>
      
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Are you sure?"
        description="This action cannot be undone."
        confirmText="Yes, Continue"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
}
```

---

## 🎨 Variants

The dialog supports 4 variants with different colors and icons:

| Variant   | Color  | Use Case                          | Icon             |
|-----------|--------|-----------------------------------|------------------|
| `danger`  | Red    | Delete, Remove, Cancel actions    | ⚠️ Alert Triangle |
| `warning` | Yellow | Warnings, confirmations           | ⚠️ Alert Circle  |
| `info`    | Blue   | Information, general actions      | ℹ️ Info          |
| `success` | Green  | Approve, Accept, Enable actions   | ✅ Check Circle  |

---

## 📝 Common Action Examples

### 1. Delete Event

```jsx
openConfirm({
  title: t("confirm.deleteTitle") || "Delete Event?",
  description: "This event will be permanently deleted and cannot be recovered.",
  confirmText: t("confirm.deleteButton") || "Yes, Delete",
  variant: "danger",
  onConfirm: async () => {
    await deleteEvent(eventId);
    toast.success("Event deleted successfully");
  },
});
```

### 2. Cancel Booking

```jsx
openConfirm({
  title: t("confirm.cancelTitle") || "Cancel Booking?",
  description: "Are you sure you want to cancel this booking?",
  confirmText: t("confirm.cancelButton") || "Yes, Cancel",
  variant: "warning",
  onConfirm: async () => {
    await cancelBooking(bookingId);
    toast.success("Booking cancelled");
  },
});
```

### 3. Approve Event/Booking

```jsx
openConfirm({
  title: t("confirm.approveTitle") || "Approve Request?",
  description: "Do you want to approve this booking request?",
  confirmText: t("confirm.approveButton") || "Yes, Approve",
  variant: "success",
  onConfirm: async () => {
    await approveBooking(bookingId);
    toast.success("Booking approved");
  },
});
```

### 4. Reject Event/Booking

```jsx
openConfirm({
  title: t("confirm.rejectTitle") || "Reject Request?",
  description: "Are you sure you want to reject this request?",
  confirmText: t("confirm.rejectButton") || "Yes, Reject",
  variant: "danger",
  onConfirm: async () => {
    await rejectBooking(bookingId);
    toast.success("Request rejected");
  },
});
```

### 5. Logout

```jsx
openConfirm({
  title: t("confirm.logoutTitle") || "Logout?",
  description: "Are you sure you want to logout?",
  confirmText: t("confirm.logoutButton") || "Yes, Logout",
  variant: "info",
  onConfirm: async () => {
    await logout();
    router.push("/login");
  },
});
```

### 6. Withdraw Money

```jsx
openConfirm({
  title: t("confirm.withdrawTitle") || "Withdraw Amount?",
  description: `Are you sure you want to withdraw ${amount} SAR?`,
  confirmText: t("confirm.withdrawButton") || "Yes, Withdraw",
  variant: "warning",
  onConfirm: async () => {
    await withdrawAmount(amount);
    toast.success("Withdrawal requested");
  },
});
```

### 7. Submit Form

```jsx
openConfirm({
  title: t("confirm.submitTitle") || "Submit Form?",
  description: "Are you sure all information is correct?",
  confirmText: t("confirm.submitButton") || "Yes, Submit",
  variant: "info",
  onConfirm: async () => {
    await submitForm(formData);
    toast.success("Form submitted successfully");
  },
});
```

---

## 🔄 Where to Implement

Add confirmation dialogs to these actions:

### Guest Actions
- ✅ Cancel Booking
- ✅ Delete Review
- ✅ Edit Profile (before save)
- ✅ Logout

### Host/Organizer Actions
- ✅ Delete Event
- ✅ Cancel Event
- ✅ Approve Booking
- ✅ Reject Booking
- ✅ Withdraw Earnings
- ✅ Delete Review
- ✅ Edit Profile (before save)
- ✅ Logout

### Admin Actions
- ✅ Delete User
- ✅ Delete Event
- ✅ Ban User
- ✅ Approve/Reject Host Application
- ✅ Delete Review

---

## 🌐 Available Translations

### English
```javascript
"confirm.areYouSure"
"confirm.actionCannotBeUndone"
"confirm.yes"
"confirm.cancel"
"confirm.processing"
"confirm.deleteTitle"
"confirm.deleteButton"
"confirm.cancelTitle"
"confirm.cancelButton"
"confirm.approveTitle"
"confirm.approveButton"
"confirm.rejectTitle"
"confirm.rejectButton"
"confirm.logoutTitle"
"confirm.logoutButton"
"confirm.withdrawTitle"
"confirm.withdrawButton"
```

### Arabic
All translations are available in Arabic as well.

---

## 🎯 Implementation Checklist

For each action in your project:

1. [ ] Import `ConfirmDialog` and `useConfirm`
2. [ ] Initialize the hook: `const { confirmProps, openConfirm } = useConfirm()`
3. [ ] Add `<ConfirmDialog {...confirmProps} />` to your component
4. [ ] Wrap your action handler with `openConfirm()`
5. [ ] Configure variant, title, description based on action type
6. [ ] Test with both English and Arabic

---

## 💡 Tips

1. **Always use translations** - Use `t("confirm.xxx")` for all texts
2. **Choose correct variant** - Match the severity of the action
3. **Be specific** - Clearly describe what will happen
4. **Show loading state** - The dialog handles loading automatically
5. **Handle errors** - Wrap async actions in try-catch

---

## 🚨 Important Notes

- The dialog automatically shows a loading spinner during async operations
- Users cannot close the dialog while loading
- The dialog is RTL-aware for Arabic language support
- All buttons have proper hover states and transitions
- The dialog is mobile-responsive

---

## 📦 Files Modified/Created

1. ✅ `web/src/components/ui/ConfirmDialog.jsx` - Main component
2. ✅ `web/src/hooks/useConfirm.js` - Custom hook
3. ✅ `web/src/i18n/locales/en/translation.json` - English translations
4. ✅ `web/src/i18n/locales/ar/translation.json` - Arabic translations

---

## 🎉 You're All Set!

Now you can add beautiful confirmation dialogs to every action in your project with just a few lines of code!

