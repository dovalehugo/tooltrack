'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Wrench,
  ClipboardList,
  Shield,
  LogOut,
} from 'lucide-react';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/employees',
    label: 'Empleados',
    icon: Users,
  },
  {
    href: '/tools',
    label: 'Herramientas',
    icon: Wrench,
  },
  {
    href: '/loans',
    label: 'Préstamos',
    icon: ClipboardList,
  },
  {
    href: '/users',
    label: 'Usuarios',
    icon: Shield,
    adminOnly: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setRole(parsedUser.role || null);
      } catch (error) {
        console.error('Error leyendo usuario del storage', error);
        setRole(null);
      }
    }
  }, []);

  const filteredNavItems = useMemo(() => {
    return navItems.filter((item) => {
      if (item.adminOnly && role !== 'admin') {
        return false;
      }

      return true;
    });
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-slate-800 bg-slate-900 text-white">
      <div className="border-b border-slate-800 px-6 py-6">
        <h1 className="text-2xl font-bold tracking-tight">ToolTrack</h1>
        <p className="mt-1 text-sm text-slate-400">
          Gestión de herramientas
        </p>
      </div>

      <nav className="space-y-2 p-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-800 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}