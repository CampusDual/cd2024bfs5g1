import { MenuRootItem } from 'ontimize-web-ngx';

export const MENU_CONFIG: MenuRootItem[] = [
  { id: 'home', name: 'HOME', icon: 'home', route: '/main/home' },
  {
    id: 'admin', name: 'ADMIN', tooltip: 'ADMIN', icon: 'admin_panel_settings',
    items: [
      { id: 'roles', name: 'ROLES', tooltip: 'ROLES', route: '/main/admin/roles', icon: 'supervisor_account' },
      { id: 'users', name: 'USERS', tooltip: 'USERS', route: '/main/admin/users', icon: 'person' },
    ]
  },
  { id: 'MyCoworkings', name: 'Mis Coworkings', tooltip:'MyCoworkings', route: '/main/mycoworkings', icon: 'filter_list' },
  // Cuando se haga la funcionalidad de mostrar la tabla de eventos, habría que cambiar el route por '/main/events'.
  { id: 'newEvents', name: 'NEW_EVENT', tooltip: 'NEW_EVENT', route: '/main/events/new', icon: 'event' },
  { id: 'logout', name: 'LOGOUT', route: '/login', icon: 'power_settings_new', confirm: 'yes' }
];
