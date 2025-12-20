// Export and Print Functions for Admin Tables

// Predefined Event Types (matching organizer side)
const EVENT_TYPES = [
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'exhibition', label: 'Exhibition' },
  { value: 'concert', label: 'Concert' },
  { value: 'festival', label: 'Festival' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'networking', label: 'Networking Event' },
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'privateParty', label: 'Private Party' },
];

// Helper function to format event types
const formatEventTypes = (eventTypes) => {
  if (!eventTypes || !Array.isArray(eventTypes) || eventTypes.length === 0) {
    return "N/A";
  }
  
  // Map event type values to labels
  const typeLabels = eventTypes.map(type => {
    const eventType = EVENT_TYPES.find(et => et.value === type);
    return eventType ? eventType.label : type;
  });
  
  return typeLabels.join(", ");
};

// Helper function to format event categories
const formatEventCategories = (eventCategoryDetails) => {
  if (!eventCategoryDetails || !Array.isArray(eventCategoryDetails) || eventCategoryDetails.length === 0) {
    return "N/A";
  }
  
  // Extract category names (support both en and ar)
  const categoryNames = eventCategoryDetails.map(cat => {
    if (typeof cat === 'string') return cat;
    if (cat?.name) {
      // If name is an object with en/ar, use en (or ar if en not available)
      if (typeof cat.name === 'object') {
        return cat.name.en || cat.name.ar || cat.name;
      }
      return cat.name;
    }
    return "N/A";
  });
  
  return categoryNames.filter(name => name !== "N/A").join(", ") || "N/A";
};

export const exportEventsToCSV = (data) => {
    const headers = ["Event ID", "Event Name", "Organizer", "Event Type", "Event Category", "Attendees", "Date", "Time", "Price", "City", "Status"];
    const csvContent = [
        headers.join(","),
        ...data.map(event => [
            event.id || event._id || "N/A",
            `"${event.event_name || "N/A"}"`,
            `"${event?.organizer?.first_name || ""} ${event?.organizer?.last_name || ""}"`.trim() || "N/A",
            formatEventTypes(event.event_types),
            `"${formatEventCategories(event.event_category_details)}"`,
            event.no_of_attendees || 0,
            event.event_date ? new Date(event.event_date).toLocaleDateString() : "N/A",
            `"${event.event_start_time && event.event_end_time ? `${event.event_start_time} - ${event.event_end_time}` : "N/A"}"`,
            event.event_price || 0,
            `"${event.event_address || ""}"`,
            event.event_status === 1 ? "Pending" : event.event_status === 2 ? "Upcoming" : event.event_status === 3 ? "Completed" : event.event_status === 4 ? "Rejected" : "N/A"
        ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "events_export.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const exportUsersToCSV = (data) => {
    const headers = ["User ID", "Name", "Mobile No.", "Gender", "Email ID", "Date of Birth", "City", "Nationality", "Status"];
    const csvContent = [
        headers.join(","),
        ...data.map(user => [
            user.id,
            `"${user.first_name} ${user.last_name}"`,
            `"${user.country_code} ${user.phone_number}"`,
            user.gender === 1 ? "Male" : "Female",
            user.email,
            user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "N/A",
            `"${user.address || ""}"`,
            `"${user.nationality || "N/A"}"`,
            user.isActive ? "Active" : "Inactive"
        ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "users_export.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const handlePrint = () => {
    window.print();
};

// Enhanced PDF export for events
export const exportEventsToPDF = (data) => {
    const headers = ["Event ID", "Event Name", "Organizer", "Event Type", "Event Category", "Attendees", "Date", "Time", "Price", "City", "Status"];
    const title = "Events Export";
    const dataMapper = (event) => [
        event.id || event._id || "N/A",
        event.event_name || "N/A",
        `${event?.organizer?.first_name || ""} ${event?.organizer?.last_name || ""}`.trim() || "N/A",
        formatEventTypes(event.event_types),
        formatEventCategories(event.event_category_details),
        event.no_of_attendees || 0,
        event.event_date ? new Date(event.event_date).toLocaleDateString() : "N/A",
        event.event_start_time && event.event_end_time ? `${event.event_start_time} - ${event.event_end_time}` : "N/A",
        event.event_price || 0,
        event.event_address || "N/A",
        event.event_status === 1 ? "Pending" : event.event_status === 2 ? "Upcoming" : event.event_status === 3 ? "Completed" : event.event_status === 4 ? "Rejected" : "N/A"
    ];
    exportToPDF(data, headers, "events_export", title, dataMapper);
};

// Enhanced PDF export for users/guests
export const exportUsersToPDF = (data) => {
    const headers = ["User ID", "Name", "Mobile No.", "Gender", "Email ID", "Date of Birth", "City", "Nationality", "Status"];
    const title = "Guests Export";
    const dataMapper = (user) => [
        user.id || user._id || "N/A",
        `${user.first_name || ""} ${user.last_name || ""}`.trim() || "N/A",
        `${user.country_code || ""} ${user.phone_number || ""}`.trim() || "N/A",
        user.gender === 1 ? "Male" : "Female",
        user.email || "N/A",
        user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "N/A",
        user.address || "N/A",
        user.nationality || "N/A",
        user.isActive ? "Active" : "Inactive"
    ];
    exportToPDF(data, headers, "guests_export", title, dataMapper);
};

// Enhanced PDF export for organizers
export const exportOrganizersToPDF = (data) => {
    const headers = ["Organizer ID", "Name", "Mobile No.", "Gender", "Email ID", "Date of Birth", "City", "Status"];
    const title = "Organizers Export";
    const dataMapper = (org) => [
        org.id || org._id || "N/A",
        `${org.first_name || ""} ${org.last_name || ""}`.trim() || "N/A",
        `${org.country_code || ""} ${org.phone_number || ""}`.trim() || "N/A",
        org.gender === 1 ? "Male" : "Female",
        org.email || "N/A",
        org.date_of_birth ? new Date(org.date_of_birth).toLocaleDateString() : "N/A",
        org.address || "N/A",
        org.is_approved === 1 ? "Pending" : org.is_approved === 2 ? "Approved" : "Rejected"
    ];
    exportToPDF(data, headers, "organizers_export", title, dataMapper);
};

// Enhanced PDF export using jsPDF
export const exportToPDF = (data, headers, filename, title) => {
    // Dynamic import for jsPDF
    import('jspdf').then((jsPDFModule) => {
        import('jspdf-autotable').then((autoTableModule) => {
            // Handle both default and named exports for jsPDF v2.x
            const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF || jsPDFModule;
            const JSPDF = jsPDF.jsPDF || jsPDF;
            const doc = new JSPDF();
            
            // Handle autoTable export
            const autoTable = autoTableModule.default || autoTableModule;
            
            // Add title
            doc.setFontSize(16);
            doc.text(title || "Export Data", 14, 15);
            
            // Prepare table data
            const tableData = data.map(item => {
                return headers.map(header => {
                    const key = header.toLowerCase().replace(/\s+/g, '_');
                    return item[key] || item[header] || "N/A";
                });
            });
            
            // Add table
            autoTable(doc, {
                head: [headers],
                body: tableData,
                startY: 25,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [243, 247, 255] }
            });
            
            // Save PDF
            doc.save(`${filename || 'export'}.pdf`);
        }).catch((error) => {
            console.error('Error loading jspdf-autotable:', error);
            // Fallback to print if jsPDF not available
            window.print();
        });
    }).catch((error) => {
        console.error('Error loading jspdf:', error);
        // Fallback to print if jsPDF not available
        window.print();
    });
};
