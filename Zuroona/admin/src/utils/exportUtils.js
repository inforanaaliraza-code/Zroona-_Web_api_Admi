// Export and Print Functions for Admin Tables

// Helper to get translated event types
const getEventTypes = (t) => [
  { value: 'conference', label: t ? t("eventTypes.conference") || 'Conference' : 'Conference' },
  { value: 'workshop', label: t ? t("eventTypes.workshop") || 'Workshop' : 'Workshop' },
  { value: 'exhibition', label: t ? t("eventTypes.exhibition") || 'Exhibition' : 'Exhibition' },
  { value: 'concert', label: t ? t("eventTypes.concert") || 'Concert' : 'Concert' },
  { value: 'festival', label: t ? t("eventTypes.festival") || 'Festival' : 'Festival' },
  { value: 'seminar', label: t ? t("eventTypes.seminar") || 'Seminar' : 'Seminar' },
  { value: 'webinar', label: t ? t("eventTypes.webinar") || 'Webinar' : 'Webinar' },
  { value: 'networking', label: t ? t("eventTypes.networking") || 'Networking Event' : 'Networking Event' },
  { value: 'corporate', label: t ? t("eventTypes.corporate") || 'Corporate Event' : 'Corporate Event' },
  { value: 'privateParty', label: t ? t("eventTypes.privateParty") || 'Private Party' : 'Private Party' },
];

// Helper function to format event types
const formatEventTypes = (eventTypes, t) => {
  const EVENT_TYPES = getEventTypes(t);
  if (!eventTypes || !Array.isArray(eventTypes) || eventTypes.length === 0) {
    return t ? t("common.notAvailable") || "N/A" : "N/A";
  }
  
  // Map event type values to labels
  const typeLabels = eventTypes.map(type => {
    const eventType = EVENT_TYPES.find(et => et.value === type);
    return eventType ? eventType.label : type;
  });
  
  return typeLabels.join(", ");
};

// Helper function to format event categories
const formatEventCategories = (eventCategoryDetails, t) => {
  if (!eventCategoryDetails || !Array.isArray(eventCategoryDetails) || eventCategoryDetails.length === 0) {
    return t ? t("common.notAvailable") || "N/A" : "N/A";
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
    return t ? t("common.notAvailable") || "N/A" : "N/A";
  });
  
  const notAvailable = t ? t("common.notAvailable") || "N/A" : "N/A";
  return categoryNames.filter(name => name !== notAvailable).join(", ") || notAvailable;
};

export const exportEventsToCSV = (data, t) => {
    const headers = [
        t ? t("events.eventId") || "Event ID" : "Event ID",
        t ? t("events.eventName") || "Event Name" : "Event Name",
        t ? t("organizers.name") || "Organizer" : "Organizer",
        t ? t("events.eventCategory") || "Event Category" : "Event Category",
        t ? t("events.attendees") || "Attendees" : "Attendees",
        t ? t("common.date") || "Date" : "Date",
        t ? t("common.time") || "Time" : "Time",
        t ? t("events.eventPrice") || "Price" : "Price",
        t ? t("common.city") || "City" : "City",
        t ? t("common.status") || "Status" : "Status"
    ];
    const csvContent = [
        headers.join(","),
        ...data.map(event => [
            event.id || event._id || "N/A",
            `"${event.event_name || "N/A"}"`,
            `"${event?.organizer?.first_name || ""} ${event?.organizer?.last_name || ""}"`.trim() || "N/A",
            `"${formatEventCategories(event.event_category_details, t)}"`,
            event.no_of_attendees || 0,
            event.event_date ? new Date(event.event_date).toLocaleDateString() : "N/A",
            `"${event.event_start_time && event.event_end_time ? `${event.event_start_time} - ${event.event_end_time}` : "N/A"}"`,
            event.event_price || 0,
            `"${event.event_address || ""}"`,
            event.event_status === 1 ? (t ? t("events.pending") || "Pending" : "Pending") : 
            event.event_status === 2 ? (t ? t("events.upcoming") || "Upcoming" : "Upcoming") : 
            event.event_status === 3 ? (t ? t("events.completed") || "Completed" : "Completed") : 
            event.event_status === 4 ? (t ? t("events.rejected") || "Rejected" : "Rejected") : "N/A"
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

export const exportUsersToCSV = (data, t) => {
    const headers = [
        t ? t("users.userId") || "User ID" : "User ID",
        t ? t("users.name") || "Name" : "Name",
        t ? t("users.mobileNo") || "Mobile No." : "Mobile No.",
        t ? t("users.gender") || "Gender" : "Gender",
        t ? t("users.emailId") || "Email ID" : "Email ID",
        t ? t("users.dateOfBirth") || "Date of Birth" : "Date of Birth",
        t ? t("common.city") || "City" : "City",
        t ? t("users.nationality") || "Nationality" : "Nationality",
        t ? t("common.status") || "Status" : "Status"
    ];
    const csvContent = [
        headers.join(","),
        ...data.map(user => [
            user.id,
            `"${user.first_name} ${user.last_name}"`,
            `"${user.country_code} ${user.phone_number}"`,
            user.gender === 1 ? (t ? t("users.male") || "Male" : "Male") : (t ? t("users.female") || "Female" : "Female"),
            user.email,
            user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "N/A",
            `"${user.address || ""}"`,
            `"${user.nationality || "N/A"}"`,
            user.isActive ? (t ? t("users.active") || "Active" : "Active") : (t ? t("users.inactive") || "Inactive" : "Inactive")
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
export const exportEventsToPDF = (data, t) => {
    const headers = [
        t ? t("events.eventId") || "Event ID" : "Event ID",
        t ? t("events.eventName") || "Event Name" : "Event Name",
        t ? t("organizers.name") || "Organizer" : "Organizer",
        t ? t("events.eventCategory") || "Event Category" : "Event Category",
        t ? t("events.attendees") || "Attendees" : "Attendees",
        t ? t("common.date") || "Date" : "Date",
        t ? t("common.time") || "Time" : "Time",
        t ? t("events.eventPrice") || "Price" : "Price",
        t ? t("common.city") || "City" : "City",
        t ? t("common.status") || "Status" : "Status"
    ];
    const title = t ? t("events.eventsExport") || "Events Export" : "Events Export";
    const dataMapper = (event) => [
        event.id || event._id || "N/A",
        event.event_name || "N/A",
        `${event?.organizer?.first_name || ""} ${event?.organizer?.last_name || ""}`.trim() || "N/A",
        formatEventCategories(event.event_category_details, t),
        event.no_of_attendees || 0,
        event.event_date ? new Date(event.event_date).toLocaleDateString() : "N/A",
        event.event_start_time && event.event_end_time ? `${event.event_start_time} - ${event.event_end_time}` : "N/A",
        event.event_price || 0,
        event.event_address || "N/A",
        event.event_status === 1 ? (t ? t("events.pending") || "Pending" : "Pending") : 
        event.event_status === 2 ? (t ? t("events.upcoming") || "Upcoming" : "Upcoming") : 
        event.event_status === 3 ? (t ? t("events.completed") || "Completed" : "Completed") : 
        event.event_status === 4 ? (t ? t("events.rejected") || "Rejected" : "Rejected") : "N/A"
    ];
    exportToPDF(data, headers, "events_export", title, dataMapper);
};

// Enhanced PDF export for users/guests
export const exportUsersToPDF = (data, t) => {
    const headers = [
        t ? t("users.userId") || "User ID" : "User ID",
        t ? t("users.name") || "Name" : "Name",
        t ? t("users.mobileNo") || "Mobile No." : "Mobile No.",
        t ? t("users.gender") || "Gender" : "Gender",
        t ? t("users.emailId") || "Email ID" : "Email ID",
        t ? t("users.dateOfBirth") || "Date of Birth" : "Date of Birth",
        t ? t("common.city") || "City" : "City",
        t ? t("users.nationality") || "Nationality" : "Nationality",
        t ? t("common.status") || "Status" : "Status"
    ];
    const title = t ? t("users.guestsExport") || "Guests Export" : "Guests Export";
    const dataMapper = (user) => [
        user.id || user._id || "N/A",
        `${user.first_name || ""} ${user.last_name || ""}`.trim() || "N/A",
        `${user.country_code || ""} ${user.phone_number || ""}`.trim() || "N/A",
        user.gender === 1 ? (t ? t("users.male") || "Male" : "Male") : (t ? t("users.female") || "Female" : "Female"),
        user.email || "N/A",
        user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "N/A",
        user.address || "N/A",
        user.nationality || "N/A",
        user.isActive ? (t ? t("users.active") || "Active" : "Active") : (t ? t("users.inactive") || "Inactive" : "Inactive")
    ];
    exportToPDF(data, headers, "guests_export", title, dataMapper);
};

// Enhanced PDF export for organizers
export const exportOrganizersToPDF = (data, t) => {
    const headers = [
        t ? t("organizers.organizerId") || "Organizer ID" : "Organizer ID",
        t ? t("organizers.name") || "Name" : "Name",
        t ? t("organizers.mobileNo") || "Mobile No." : "Mobile No.",
        t ? t("organizers.gender") || "Gender" : "Gender",
        t ? t("organizers.emailId") || "Email ID" : "Email ID",
        t ? t("organizers.dateOfBirth") || "Date of Birth" : "Date of Birth",
        t ? t("common.city") || "City" : "City",
        t ? t("common.status") || "Status" : "Status"
    ];
    const title = t ? t("organizers.organizersExport") || "Organizers Export" : "Organizers Export";
    const dataMapper = (org) => [
        org.id || org._id || "N/A",
        `${org.first_name || ""} ${org.last_name || ""}`.trim() || "N/A",
        `${org.country_code || ""} ${org.phone_number || ""}`.trim() || "N/A",
        org.gender === 1 ? (t ? t("organizers.male") || "Male" : "Male") : (t ? t("organizers.female") || "Female" : "Female"),
        org.email || "N/A",
        org.date_of_birth ? new Date(org.date_of_birth).toLocaleDateString() : "N/A",
        org.address || "N/A",
        org.is_approved === 1 ? (t ? t("organizers.pending") || "Pending" : "Pending") : 
        org.is_approved === 2 ? (t ? t("organizers.approved") || "Approved" : "Approved") : 
        (t ? t("organizers.rejected") || "Rejected" : "Rejected")
    ];
    exportToPDF(data, headers, "organizers_export", title, dataMapper);
};

// Enhanced PDF export using jsPDF
export const exportToPDF = (data, headers, filename, title, dataMapper) => {
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
            const tableData = data.map(item => dataMapper(item));
            
            // Add table
            autoTable(doc, {
                head: [headers],
                body: tableData,
                startY: 25,
                theme: 'grid',
                headStyles: {
                    fillColor: [52, 73, 94],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold'
                },
                bodyStyles: {
                    textColor: [0, 0, 0]
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                margin: { top: 30 }
            });
            
            // Save PDF
            doc.save(`${filename || 'export'}.pdf`);
        }).catch((error) => {
            console.error('Error loading jspdf-autotable:', error);
            // Fallback to print if library not available
            window.print();
        });
    }).catch((error) => {
        console.error('Error loading jspdf:', error);
        // Fallback to print if jsPDF not available
        window.print();
    });
};
