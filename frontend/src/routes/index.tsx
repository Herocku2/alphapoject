import React from 'react'
import { Route, RouteProps } from 'react-router-dom'

// PrivateRoute
import PrivateRoute from './PrivateRoute'
import Dashboard from './../views/dashboards'
import BinaryTree from '../views/pages/BinaryTree'
import Referrals from '../views/pages/Referrals'
import Payments from '../views/pages/Payments'
import Withdrawals from '../views/pages/Withdrawals'
import InvestmentHistory from '../views/pages/InvestmentHistory'
import Deposits from '../views/pages/Deposits'
import InvestmentDashboard from '../views/pages/investment_panel'
const AdminWithdrawals = React.lazy(() => import('../views/pages/admin_withdrawals'))


// Base UI
const Accordions = React.lazy(() => import('./../views/uielements/base/Accordions'))
const Avatars = React.lazy(() => import('./../views/uielements/base/Avatars'))
const Buttons = React.lazy(() => import('./../views/uielements/base/Buttons'))
const Cards = React.lazy(() => import('./../views/uielements/base/Cards'))
const Carousels = React.lazy(() => import('./../views/uielements/base/Carousels'))
const Dropdowns = React.lazy(() => import('./../views/uielements/base/Dropdowns'))
const Modals = React.lazy(() => import('./../views/uielements/base/Modals'))
const NavTabs = React.lazy(() => import('./../views/uielements/base/NavTabs'))
const Toasts = React.lazy(() => import('./../views/uielements/base/Toasts'))
const Miscellaneous = React.lazy(() => import('./../views/uielements/base/Miscellaneous'))

// Icons
const Flaticon = React.lazy(() => import('./../views/uielements/icons/Flaticon'))
const Feather = React.lazy(() => import('./../views/uielements/icons/Feather'))
const Bootstrap = React.lazy(() => import('./../views/uielements/icons/Bootstrap'))
const BoxIcons = React.lazy(() => import('./../views/uielements/icons/BoxIcons'))
const FontAwesome = React.lazy(() => import('./../views/uielements/icons/FontAwesome'))
const Lucide = React.lazy(() => import('./../views/uielements/icons/Lucide'))
const Tabler = React.lazy(() => import('./../views/uielements/icons/Tabler'))
const Weather = React.lazy(() => import('./../views/uielements/icons/Weather'))

// Tables
const BootstapTable = React.lazy(() => import('./../views/uielements/tables/BootstapTable'))
const ReactTable = React.lazy(() => import('./../views/uielements/tables/ReactTable'))

// Charts
const ApexCharts = React.lazy(() => import('./../views/uielements/charts/ApexCharts'))
const ChartJs = React.lazy(() => import('./../views/uielements/charts/ChartJs'))
const Recharts = React.lazy(() => import('./../views/uielements/charts/Recharts'))
const Progressbar = React.lazy(() => import('./../views/uielements/charts/Progressbar'))

// Forms
const AdvRadio = React.lazy(() => import('./../views/uielements/forms/AdvRadio'))
const AdvCheckbox = React.lazy(() => import('./../views/uielements/forms/AdvCheckbox'))
const AdvSwitch = React.lazy(() => import('./../views/uielements/forms/AdvSwitch'))
const Elements = React.lazy(() => import('./../views/uielements/forms/Elements'))
const Validation = React.lazy(() => import('./../views/uielements/forms/Validation'))
const InputMask = React.lazy(() => import('./../views/uielements/forms/InputMask'))
const NoUiSlider = React.lazy(() => import('./../views/uielements/forms/NoUiSlider'))

// Editors
const EditorQuill = React.lazy(() => import('./../views/uielements/editors/EditorQuill'))
const EditorTinyMCE = React.lazy(() => import('./../views/uielements/editors/EditorTinyMCE'))

// Pickers
const Flatpickr = React.lazy(() => import('./../views/uielements/pickers/Flatpickr'))
const DaterangePicker = React.lazy(() => import('./../views/uielements/pickers/DaterangePicker'))

// Maps
const VectorMaps = React.lazy(() => import('./../views/uielements/maps/VectorMaps'))

// Extended
const ReactSelect = React.lazy(() => import('./../views/uielements/extended/ReactSelect'))
const SweetAlert2 = React.lazy(() => import('./../views/uielements/extended/SweetAlert2'))
const ReactSlick = React.lazy(() => import('./../views/uielements/extended/ReactSlick'))
const Dropzone = React.lazy(() => import('./../views/uielements/extended/Dropzone'))
const HotToast = React.lazy(() => import('./../views/uielements/extended/HotToast'))
const Toastify = React.lazy(() => import('./../views/uielements/extended/Toastify'))

// User Profile
const Overview = React.lazy(() => import('../views/pages/user-profile/Overview'))
const Activity = React.lazy(() => import('../views/pages/user-profile/Activity'))
const Followers = React.lazy(() => import('../views/pages/user-profile/Followers'))
const Contacts = React.lazy(() => import('../views/pages/user-profile/Contacts'))
const Projects = React.lazy(() => import('../views/pages/user-profile/Projects'))
const Gallery = React.lazy(() => import('../views/pages/user-profile/Gallery'))

// Account Settings
const Account = React.lazy(() => import('../views/pages/account-settings/Account'))
const Security = React.lazy(() => import('../views/pages/account-settings/Security'))
const Notifications = React.lazy(() => import('../views/pages/account-settings/Notifications'))
const Billing = React.lazy(() => import('../views/pages/account-settings/Billing'))
const Integrations = React.lazy(() => import('../views/pages/account-settings/Integrations'))

// Other Pages
const StarterPage = React.lazy(() => import('../views/pages/other-pages/StarterPage'))
const FAQs = React.lazy(() => import('../views/pages/other-pages/FAQs'))
const Pricing = React.lazy(() => import('../views/pages/other-pages/Pricing'))
const AboutUs = React.lazy(() => import('../views/pages/other-pages/AboutUs'))
const ContactUs = React.lazy(() => import('../views/pages/other-pages/ContactUs'))
const PrivacyPolicy = React.lazy(() => import('../views/pages/other-pages/PrivacyPolicy'))
const TermsServices = React.lazy(() => import('../views/pages/other-pages/TermsServices'))

// Auth {{Minimal}}
import Login from '../views/auth/minimal/Login'
import Register from '../views/auth/minimal/Register'
import ResetPassword from '../views/auth/minimal/ResetPassword'
import ForgotPassword from '../views/auth/minimal/ForgotPassword'
import TwoFactorOTP from '../views/auth/minimal/TwoFactorOTP'
import EmailVerification from '../views/auth/minimal/EmailVerification'
import P2P from '../views/p2p'


// Error
const NotFound = React.lazy(() => import('../views/error/NotFound'))
const ServerError = React.lazy(() => import('../views/error/ServerError'))
const NotAuthorized = React.lazy(() => import('../views/error/NotAuthorized'))
const CommingSoon = React.lazy(() => import('../views/error/CommingSoon'))
const UnderMaintenance = React.lazy(() => import('../views/error/UnderMaintenance'))

// Email Templates
const EmailTemplateConfirmAccount = React.lazy(
  () => import('../views/etemplates/EmailTemplateConfirmAccount'),
)
const EmailTemplateExpiredCard = React.lazy(
  () => import('../views/etemplates/EmailTemplateExpiredCard'),
)
const EmailTemplateResetPassword = React.lazy(
  () => import('../views/etemplates/EmailTemplateResetPassword'),
)
const EmailTemplateWelcomeMessage = React.lazy(
  () => import('../views/etemplates/EmailTemplateWelcomeMessage'),
)
const EmailTemplateCouponSale = React.lazy(
  () => import('../views/etemplates/EmailTemplateCouponSale'),
)
const EmailTemplateLatestUpdate = React.lazy(
  () => import('../views/etemplates/EmailTemplateLatestUpdate'),
)

export interface RoutesProps {
  path: RouteProps['path']
  name?: string
  element?: RouteProps['element']
  route?: any
  exact?: boolean
  icon?: string
  header?: string
  roles?: string[]
  children?: RoutesProps[]
}

// Dashboards
const dashboardRoutes: RoutesProps = {
  path: '/dashboard',
  name: 'Dashboards',
  header: 'Navigation',
  element: <Dashboard />,
 
}

// Apps
const appsRoutes: RoutesProps = {
  path: '',
  name: 'Apps',
  children: [
    {
      path: "/profile",
      name: "Profile",
      element: <Account />,
      route: PrivateRoute
    },
    {
      path: '/security',
      name: 'Security',
      element: <Security />,
      route: PrivateRoute,
    },
    {
      path: '/deposits',
      name: 'Deposits',
      element: <Deposits />,
      route: PrivateRoute,
    },
    {
      path: '/withdrawals',
      name: 'Withdrawals',
      element: <Withdrawals />,
      route: PrivateRoute,
    },
    {
      path: '/network-marketing',
      name: 'Binary Tree',
      element: <BinaryTree />,
      route: PrivateRoute,
    },
    {
      path: '/referrals',
      name: 'Referrals',
      element: <Referrals />,
      route: PrivateRoute,
    },
    {
      path: '/p2p',
      name: 'p2p',
      element: <P2P />,
      route: PrivateRoute,
    },
    {
      path: '/payments',
      name: 'Payments',
      element: <Payments />,
      route: PrivateRoute,
    },
    {
      path: '/investment-history',
      name: 'Investment History',
      element: <InvestmentHistory />,
      route: PrivateRoute,
    },
    {
      path: '/investment-panel',
      name: 'Investment Panel',
      element: <InvestmentDashboard />,
      route: PrivateRoute,
    },
    {
      path: '/admin-withdrawals',
      name: 'Admin Withdrawals',
      element: <AdminWithdrawals />,
      route: PrivateRoute,
    },
  ],
}

// Components
const componentsRoutes: RoutesProps = {
  path: '/components',
  name: 'Components',
  header: 'UI Elements',
  children: [
    {
      path: '/components/base',
      name: 'Base UI',
      children: [
        {
          path: '/components/base/accordions',
          name: 'Accordions',
          element: <Accordions />,
          route: PrivateRoute,
        },
        {
          path: '/components/base/avatars',
          name: 'Avatars',
          element: <Avatars />,
          route: PrivateRoute,
        },
        {
          path: '/components/base/buttons',
          name: 'Buttons',
          element: <Buttons />,
          route: PrivateRoute,
        },
        {
          path: '/components/base/cards',
          name: 'Cards',
          element: <Cards />,
          route: PrivateRoute,
        },
        {
          path: '/components/base/carousel',
          name: 'Carousels',
          element: <Carousels />,
          route: PrivateRoute,
        },
        {
          path: '/components/base/dropdowns',
          name: 'Dropdowns',
          element: <Dropdowns />,
          route: PrivateRoute,
        },
        {
          path: '/components/base/modals',
          name: 'Modals',
          element: <Modals />,
          route: PrivateRoute,
        },
        {
          path: '/components/base/navtabs',
          name: 'NavTabs',
          element: <NavTabs />,
          route: PrivateRoute,
        },
        {
          path: '/components/base/toasts',
          name: 'Toasts',
          element: <Toasts />,
          route: PrivateRoute,
        },
        {
          path: '/components/base/miscellaneous',
          name: 'Miscellaneous',
          element: <Miscellaneous />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: '/components/icons',
      name: 'Icons',
      children: [
        {
          path: '/components/icons/flaticon',
          name: 'Flaticon',
          element: <Flaticon />,
          route: PrivateRoute,
        },
        {
          path: '/components/icons/feather',
          name: 'Feather',
          element: <Feather />,
          route: PrivateRoute,
        },
        {
          path: '/components/icons/bootstrap',
          name: 'Bootstrap',
          element: <Bootstrap />,
          route: PrivateRoute,
        },
        {
          path: '/components/icons/boxicons',
          name: 'BoxIcons',
          element: <BoxIcons />,
          route: PrivateRoute,
        },
        {
          path: '/components/icons/fontawesome',
          name: 'FontAwesome',
          element: <FontAwesome />,
          route: PrivateRoute,
        },
        {
          path: '/components/icons/lucide',
          name: 'Lucide',
          element: <Lucide />,
          route: PrivateRoute,
        },
        {
          path: '/components/icons/tabler',
          name: 'Tabler',
          element: <Tabler />,
          route: PrivateRoute,
        },
        {
          path: '/components/icons/weather',
          name: 'Weather',
          element: <Weather />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: '/components/tables',
      name: 'Tables',
      children: [
        {
          path: '/components/tables/bootstap-table',
          name: 'Bootstap',
          element: <BootstapTable />,
          route: PrivateRoute,
        },
        {
          path: '/components/tables/react-table',
          name: 'ReactTable',
          element: <ReactTable />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: '/components/charts',
      name: 'Charts',
      children: [
        {
          path: '/components/charts/apexcharts',
          name: 'ApexCharts',
          element: <ApexCharts />,
          route: PrivateRoute,
        },
        {
          path: '/components/charts/chartjs',
          name: 'ChartJS',
          element: <ChartJs />,
          route: PrivateRoute,
        },
        {
          path: '/components/charts/recharts',
          name: 'Recharts',
          element: <Recharts />,
          route: PrivateRoute,
        },
        {
          path: '/components/charts/progressbar',
          name: 'Progressbar',
          element: <Progressbar />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: '/components/forms',
      name: 'Forms',
      children: [
        {
          path: '/components/forms/adv-radio',
          name: 'Radios',
          element: <AdvRadio />,
          route: PrivateRoute,
        },
        {
          path: '/components/forms/adv-checkbox',
          name: 'Checkboxs',
          element: <AdvCheckbox />,
          route: PrivateRoute,
        },
        {
          path: '/components/forms/adv-switch',
          name: 'Switchs',
          element: <AdvSwitch />,
          route: PrivateRoute,
        },
        {
          path: '/components/forms/elements',
          name: 'Elements',
          element: <Elements />,
          route: PrivateRoute,
        },
        {
          path: '/components/forms/validation',
          name: 'Validation',
          element: <Validation />,
          route: PrivateRoute,
        },
        {
          path: '/components/forms/inputmask',
          name: 'InputMask',
          element: <InputMask />,
          route: PrivateRoute,
        },
        {
          path: '/components/forms/nouislider',
          name: 'noUiSlider',
          element: <NoUiSlider />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: '/components/editors',
      name: 'Editors',
      children: [
        {
          path: '/components/editors/quill',
          name: 'Quill',
          element: <EditorQuill />,
          route: PrivateRoute,
        },
        {
          path: '/components/editors/tinymce',
          name: 'TinyMCE',
          element: <EditorTinyMCE />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: '/components/pickers',
      name: 'Pickers',
      children: [
        {
          path: '/components/pickers/flatpickr',
          name: 'Flatpickr',
          element: <Flatpickr />,
          route: PrivateRoute,
        },
        {
          path: '/components/pickers/daterangepicker',
          name: 'Daterange',
          element: <DaterangePicker />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: '/components/maps',
      name: 'Maps',
      children: [
        {
          path: '/components/maps/vector-maps',
          name: 'Vector Maps',
          element: <VectorMaps />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: '/components/extended',
      name: 'Extended',
      children: [
        {
          path: '/components/extended/select2',
          name: 'React2',
          element: <ReactSelect />,
          route: PrivateRoute,
        },
        {
          path: '/components/extended/sweetalert2',
          name: 'SweetAlert2',
          element: <SweetAlert2 />,
          route: PrivateRoute,
        },
        {
          path: '/components/extended/react-slick',
          name: 'React Slick',
          element: <ReactSlick />,
          route: PrivateRoute,
        },
        {
          path: '/components/extended/dropzone',
          name: 'Dropzone',
          element: <Dropzone />,
          route: PrivateRoute,
        },
        {
          path: '/components/extended/hottoast',
          name: 'HotToast',
          element: <HotToast />,
          route: PrivateRoute,
        },
        {
          path: '/components/extended/toastify',
          name: 'Toastify',
          element: <Toastify />,
          route: PrivateRoute,
        },
      ],
    },
  ],
}

// Pages
const pagesRoutes = {
  path: '/pages',
  name: 'Pages',
  header: 'Custom',
  children: [
    {
      path: '/pages/user-profile',
      name: 'User Profile',
      children: [
        {
          path: '/user-profile/overview',
          name: 'Overview',
          element: <Overview />,
          route: PrivateRoute,
        },
        {
          path: '/user-profile/activity',
          name: 'Activity',
          element: <Activity />,
          route: PrivateRoute,
        },
        {
          path: '/user-profile/followers',
          name: 'Followers',
          element: <Followers />,
          route: PrivateRoute,
        },
        {
          path: '/user-profile/contacts',
          name: 'Contacts',
          element: <Contacts />,
          route: PrivateRoute,
        },
        {
          path: '/user-profile/projects',
          name: 'Projects',
          element: <Projects />,
          route: PrivateRoute,
        },
        {
          path: '/user-profile/gallery',
          name: 'Gallery',
          element: <Gallery />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: '/pages/account-settings',
      name: 'Account Settings',
      children: [
        {
          path: '/account-settings/account',
          name: 'Account',
          element: <Account />,
          route: PrivateRoute,
        },
        {
          path: '/account-settings/security',
          name: 'Security',
          element: <Security />,
          route: PrivateRoute,
        },
        {
          path: '/account-settings/notifications',
          name: 'Notifications',
          element: <Notifications />,
          route: PrivateRoute,
        },
        {
          path: '/account-settings/billing',
          name: 'Plan & Billing',
          element: <Billing />,
          route: PrivateRoute,
        },
        {
          path: '/account-settings/integrations',
          name: 'Integrations',
          element: <Integrations />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: '/pages/other-pages',
      name: 'Other Pages',
      children: [
        {
          path: '/other-pages/starter',
          name: 'Starter',
          element: <StarterPage />,
          route: PrivateRoute,
        },
        {
          path: '/other-pages/faqs',
          name: 'FAQs',
          element: <FAQs />,
          route: PrivateRoute,
        },
        {
          path: '/other-pages/pricing',
          name: 'Pricing',
          element: <Pricing />,
          route: PrivateRoute,
        },
        {
          path: '/other-pages/about-us',
          name: 'About Us',
          element: <AboutUs />,
          route: PrivateRoute,
        },
        {
          path: '/other-pages/contact-us',
          name: 'Contact Us',
          element: <ContactUs />,
          route: PrivateRoute,
        },
        {
          path: '/other-pages/privacy-policy',
          name: 'Privacy & Policy',
          element: <PrivacyPolicy />,
          route: PrivateRoute,
        },
        {
          path: '/other-pages/terms-services',
          name: 'Terms of Services',
          element: <TermsServices />,
          route: PrivateRoute,
        },
      ],
    },
  ],
}

// Auth
const authRoutes: RoutesProps[] = [
  {
    path: '/',
    name: 'Login',
    header: 'Custom',
    children: [
      {
        path: '/auth/login',
        name: 'Login',
        element: <Login />,
        route: Route,
      },
      {
        path: '/auth/verify-email/:verificationCode',
        name: 'Verification Email',
        element: <EmailVerification />,
        route: Route,

      },
      {
        path: '/auth/register/:ref_code',
        name: 'Register',
        element: <Register />,
        route: Route,
      },
      {
        path: '/auth/reset-password',
        name: 'Reset Password',
        element: <ResetPassword />,
        route: Route,
      },
      {
        path: '/auth/forgot-password',
        name: 'Forgot Password',
        element: <ForgotPassword />,
        route: Route,
      },
      {
        path: '/auth/otp',
        name: 'Two-facafor (OTP)',
        element: <TwoFactorOTP />,
        route: Route,
      },

    ],
  },
]

// Error
const errorRoutes: RoutesProps[] = [
  {
    path: '*',
    name: 'Not Found',
    element: <NotFound />,
    route: Route,
  },
  {
    path: '/error-pages/server-error',
    name: 'Server Error',
    element: <ServerError />,
    route: Route,
  },
  {
    path: '/error-pages/not-authorized',
    name: 'Not Authorized',
    element: <NotAuthorized />,
    route: Route,
  },
  {
    path: '/error-pages/comming-soon',
    name: 'Comming Soon',
    element: <CommingSoon />,
    route: Route,
  },
  {
    path: '/error-pages/under-maintenance',
    name: 'Under Maintenance',
    element: <UnderMaintenance />,
    route: Route,
  },
]

// Email Templates
const emailRoutes: RoutesProps[] = [
  {
    path: '/email-template/et-welcome-message',
    name: 'Welcome Message',
    element: <EmailTemplateWelcomeMessage />,
    route: Route,
  },
  {
    path: '/email-template/et-confirm-account',
    name: 'Confirm Account',
    element: <EmailTemplateConfirmAccount />,
    route: Route,
  },
  {
    path: '/email-template/et-reset-password',
    name: 'Reset Password',
    element: <EmailTemplateResetPassword />,
    route: Route,
  },
  {
    path: '/email-template/et-expired-card',
    name: 'Expired Card',
    element: <EmailTemplateExpiredCard />,
    route: Route,
  },
  {
    path: '/email-template/et-coupon-sale',
    name: 'Coupon Sale',
    element: <EmailTemplateCouponSale />,
    route: Route,
  },
  {
    path: '/email-template/et-latest-update',
    name: 'Latest Update',
    element: <EmailTemplateLatestUpdate />,
    route: Route,
  },
]

// Docs
const docsRoutes: RoutesProps[] = [
  {
    path: '../docs/support.html',
    name: 'Support',
  },
  {
    path: '../docs/changelog.html',
    name: 'Changelog',
  },
  {
    path: '../docs/documentation.html',
    name: 'Documentation',
  },
]

// flatten the list of all nested routes
const flattenRoutes = (routes: RoutesProps[]) => {
  let flatRoutes: RoutesProps[] = []

  routes = routes || []
  routes.forEach((item: RoutesProps) => {
    flatRoutes.push(item)
    if (typeof item.children !== 'undefined') {
      flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)]
    }
  })
  return flatRoutes
}

// All routes
const authProtectedRoutes = [dashboardRoutes, appsRoutes, pagesRoutes, componentsRoutes]
const publicRoutes = [...authRoutes, ...errorRoutes, ...emailRoutes, ...docsRoutes]

const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes])
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes])
export {
  authProtectedFlattenRoutes,
  authProtectedRoutes,
  publicProtectedFlattenRoutes,
  publicRoutes,
}
