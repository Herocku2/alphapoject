export interface MenuItemTypes {
  key: string
  label: string
  isTitle?: boolean
  icon?: string
  url?: string
  parentKey?: string
  target?: string
  children?: MenuItemTypes[]
  isExternal?: boolean
  onlyAdmin?: boolean
}

const MENU_ITEMS: MenuItemTypes[] = [
  //Navigation
  {
    key: 'main',
    label: 'Principal',
    isTitle: true,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    isTitle: false,
    icon: 'fi fi-rr-dashboard',
    url: "/dashboard"
  },
  {
    key: 'withdrawals',
    label: 'Withdrawals',
    isTitle: false,
    icon: 'fi fi-rr-sack-dollar',
    url: "/withdrawals"
  },
  
 
  {
    key: 'profile',
    label: 'Profile',
    isTitle: false,
    icon: 'fi fi-rr-user',
    url: "/profile"
  },
  
  {
    key: 'binarytree',
    label: 'Unilevel Tree',
    isTitle: false,
    icon: 'fi fi-tr-sitemap',
    url: "/unilevel-tree"
  },
  {
    key: 'referrals',
    label: 'Referrals',
    isTitle: false,
    icon: 'fi fi-rr-users-alt',
    url: "/referrals"
  },
  {
    key: 'payments',
    label: 'Payments',
    isTitle: false,
    icon: 'fi fi-rr-checklist-task-budget',
    url: "/payments"
  },
  
 
]
export { MENU_ITEMS }
