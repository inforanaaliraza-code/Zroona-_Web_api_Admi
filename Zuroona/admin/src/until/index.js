export const mapApiKey = "gersgfeshhtbg";

export const config = {
  bucketName: "appsinvo-staging-ys",
  region: "us-west-1",
  accessKeyId: "AKIAVMOPKAV4RPMGAK5M",
  secretAccessKey: "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",
  s3Url: "https://s3.us-west-1.amazonaws.com/appsinvo-staging-ys",
  dirName: "Zuroona",
};

// Auto-select API base URL: prefer env, else dev localhost, else production URL
export const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_BASE ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3434/api/admin/"
    : "https://zapi.mbcloud.space/api/admin/");

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
