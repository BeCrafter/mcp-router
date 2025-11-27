import { createRouter, createWebHistory } from 'vue-router';
import Settings from './pages/Settings.vue';
import Servers from './pages/Servers.vue';
import Workspaces from './pages/Workspaces.vue';
import Projects from './pages/Projects.vue';
import Logs from './pages/Logs.vue';
import Clients from './pages/Clients.vue';
import Workflows from './pages/Workflows.vue';

const routes = [
  {
    path: '/',
    redirect: '/servers',
  },
  {
    path: '/servers',
    name: 'Servers',
    component: Servers,
  },
  {
    path: '/workspaces',
    name: 'Workspaces',
    component: Workspaces,
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
  },
  {
    path: '/logs',
    name: 'Logs',
    component: Logs,
  },
  {
    path: '/clients',
    name: 'Clients',
    component: Clients,
  },
  {
    path: '/workflows',
    name: 'Workflows',
    component: Workflows,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

