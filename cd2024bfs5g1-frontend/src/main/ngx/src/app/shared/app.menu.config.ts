import { MenuRootItem } from 'ontimize-web-ngx';

export const MENU_CONFIG: MenuRootItem[] = [
  { id: 'coworkingsHome', name: 'COWORKINGS', icon: 'home', route: '/main/coworkings' },
  { id: 'coworkingsPublic', name: 'COWORKINGS', icon: 'home', route: '/coworkings' },
  { id: 'eventsHome', name: 'EVENTS', icon: 'event', route: '/main/events' },
  { id: 'myCalendar', name: 'MY_CALENDAR', route: '/main/mycalendar', icon: 'event' },
  {
    id: 'groupCoworkings', name: 'GROUP_COWORKINGS', icon: 'work',
    items: [
      { id: 'coworkings', name: 'ADD_COWORKING', icon: 'playlist_add', route: '/main/coworkings/new' },
      { id: 'MyCoworkings', name: 'MYCOWORKINGS', route: '/main/mycoworkings', icon: 'sort' },
    ]
  },
  {
    id: 'admin', name: 'ADMIN', tooltip: 'ADMIN', icon: 'admin_panel_settings',
    items: [
      { id: 'roles', name: 'ROLES', tooltip: 'ROLES', route: '/main/admin/roles', icon: 'supervisor_account' },
      { id: 'users', name: 'USERS', tooltip: 'USERS', route: '/main/admin/users', icon: 'person' },
    ]
  },
  {
    id: 'groupEvents', name: 'GROUP_EVENTS', icon: 'calendar_month',
    items: [
      { id: 'newEvents', name: 'NEW_EVENT', route: '/main/events/new', icon: 'edit_calendar' },
      { id: 'myEvents', name: 'MYEVENTS', route: '/main/myevents', icon: 'event_note' },
    ]
  },
  { id: 'eventsPublic', name: 'EVENTS', icon: 'event', route: '/events' },
  { id: 'myBookings', name: 'MY_BOOKINGS', route: '/main/bookings', icon: 'bookmark' },
  {
    id: "analytics", name: "ANALYTICS", icon: "query_stats",
    items: [
      { id: "occupation", name: "OCCUPATION", route: "/main/analytics/occupation", icon: "show_chart" },
    ],
  },
  { id: 'logout', name: 'LOGOUT', route: '/login', icon: 'power_settings_new', confirm: 'yes' },
  { id: 'login_public', name: 'LOGIN', route: '/login', icon: 'power_settings_new', confirm: 'no' }

];
