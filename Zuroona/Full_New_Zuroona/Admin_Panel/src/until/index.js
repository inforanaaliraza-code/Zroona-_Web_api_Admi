export const mapApiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY || "";

// Client should not embed secrets. Keep only non-sensitive storage config.
export const config = {
  bucketName: process.env.NEXT_PUBLIC_S3_BUCKET || "",
  region: process.env.NEXT_PUBLIC_S3_REGION || "",
  s3Url: process.env.NEXT_PUBLIC_S3_URL || "",
  dirName: process.env.NEXT_PUBLIC_S3_DIR || "Zuroona",
};

// Build a robust admin API base URL that stays in sync with the main API
// This allows sharing the same NEXT_PUBLIC_API_BASE_URL between web and admin.
const getAdminApiBaseUrl = () => {
  // 1) Highest priority: explicit admin base
  if (process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL;
  }

  // 2) Re-use generic API base and normalize it to /api/admin/
  const genericBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    "";

  if (genericBase) {
    // Ensure we always end up with .../api/admin/
    let base = genericBase.trim();

    // Remove trailing slashes for easier checks
    if (base.endsWith("/")) base = base.slice(0, -1);

    // If it already points to /api/admin, just ensure trailing slash
    if (base.endsWith("/api/admin")) {
      return base + "/";
    }

    // If it points to /api, append /admin
    if (base.endsWith("/api")) {
      return base + "/admin/";
    }

    // If it is just a bare domain, append /api/admin/
    return base + "/api/admin/";
  }

  // 3) Fallbacks based on environment and hostname (similar to web)
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (
      hostname === "zuroona.sa" ||
      hostname === "www.zuroona.sa" ||
      hostname.includes("zuroona.sa")
    ) {
      return "https://api.zuroona.sa/api/admin/";
    }
  }

  // 4) NODE_ENV-based default
  if (process.env.NODE_ENV === "production") {
    return "https://api.zuroona.sa/api/admin/";
  }

  // 5) Development default
  return "http://localhost:3434/api/admin/";
};

// Auto-select API base URL for admin
export const BASE_API_URL = getAdminApiBaseUrl();

export const TOKEN_NAME = "ZuroonaToken";

export const ThreeSlideSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  initialSlide: 1,
  className: "settings",
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 590,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        arrows: false,
      },
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        arrows: false,
      },
    },
    {
      breakpoint: 400,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        arrows: false,
      },
    },
  ],
};
export const TwoSlideSettings = {
  dots: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
  slidesToShow: 2,
  slidesToScroll: 1,
  initialSlide: 0,
  className: "Carouselsettings",
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 590,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        arrows: false,
      },
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        arrows: false,
      },
    },
    {
      breakpoint: 400,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        arrows: false,
      },
    },
  ],
};
export const FourSlideSettings = {
  dots: true,
  infinite: true,
  autoplay: false,
  autoplaySpeed: 5000,
  arrows: true,
  slidesToShow: 4,
  slidesToScroll: 2,
  initialSlide: 0,
  className: "FourSlideSettings",
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 590,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 1,
        arrows: false,
      },
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 1,
        arrows: false,
      },
    },
    {
      breakpoint: 450,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        arrows: false,
      },
    },
  ],
};
export const SingleSlideSettings = {
  dots: true,
  infinite: false,
  autoplay: true,
  autoplaySpeed: 5000,
  arrows: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0,
  className: "Carouselsettings",
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        dots: true,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 590,
      settings: {
        slidesToShow: 1,
        arrows: false,
      },
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
        arrows: false,
      },
    },
    {
      breakpoint: 400,
      settings: {
        slidesToShow: 1,
        arrows: false,
      },
    },
  ],
};
export const FiveSlideSettings = {
  dots: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 5000,
  arrows: true,
  slidesToShow: 5,
  slidesToScroll: 5,
  initialSlide: 1,
  className: "FiveSlideSettings",
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 590,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 1,
        arrows: false,
      },
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 1,
        arrows: false,
      },
    },
    {
      breakpoint: 450,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        arrows: false,
      },
    },
  ],
};

export const menuGroups = [
  {
    menuItems: [
      {
        icon: "/assets/images/menu/event-org.png",
        label: "Manage Hosts",
        translationKey: "sidebar.manageHosts",
        route: "/organizer",
      },
      {
        icon: "/assets/images/menu/user.png",
        label: "Guests Management",
        translationKey: "sidebar.guestsManagement",
        route: "/user",
      },
      {
        icon: "/assets/images/menu/event.png",
        label: "Manage Events",
        translationKey: "sidebar.manageEvents",
        route: "/events",
      },
      {
        icon: "/assets/images/menu/cms.png",
        label: "Manage CMS",
        translationKey: "sidebar.manageCMS",
        route: "/cms",
      },
      {
        icon: "/assets/images/menu/settings-line.png",
        hoverIcon: "/assets/images/menu/settings-line.png",
        label: "Settings",
        translationKey: "sidebar.settings",
        route: "/setting",
      },
      {
        icon: "/assets/images/menu/user.png",
        label: "Admin Management",
        translationKey: "sidebar.adminManagement",
        route: "/admin-management",
      },
      {
        icon: "/assets/images/menu/wallet.png",
        label: "Wallet",
        translationKey: "sidebar.wallet",
        route: "/wallet",
      },
      {
        icon: "/assets/images/menu/withdrawal.png",
        label: "Host Withdrawal Requests",
        translationKey: "sidebar.hostWithdrawalRequests",
        route: "/withdrawal-requests",
      },
      {
        icon: "/assets/images/menu/wallet.png",
        label: "Guest Invoices",
        translationKey: "sidebar.guestInvoices",
        route: "/guest-invoices",
      },
      {
        icon: "/assets/images/menu/wallet.png",
        label: "Refund Requests",
        translationKey: "sidebar.refundRequests",
        route: "/refund-requests",
      },
    ],
  },

];
