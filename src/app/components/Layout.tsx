import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Bell, LogOut, User, Menu } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';
import type { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentUser, switchRole, logout } = useAuth();
  const { notifications, markNotificationRead } = useData();

  const userNotifications = notifications.filter((n) => n.userId === currentUser?.id);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const roleLabels: Record<UserRole, string> = {
    author: 'Author',
    editor: 'Editor',
    reviewer: 'Reviewer',
    layout_artist: 'Layout Artist',
    admin: 'Administrator',
    editor_in_chief: 'Editor-in-Chief',
    twg_coordinator: 'TWG Coordinator',
    twg_copyeditor: 'TWG Copyeditor',
    twg_layout: 'TWG Layout',
    twg_production_coordinator: 'TWG Production Coordinator',
    twg_print_coordinator: 'TWG Print Coordinator',
    twg_distribution: 'TWG Distribution',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Manuscript Management System
              </h1>
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                Demo Mode
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
                    sideOffset={5}
                  >
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {userNotifications.length === 0 ? (
                        <p className="text-sm text-gray-500">No notifications</p>
                      ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {userNotifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3 rounded-lg border ${
                                notif.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                              }`}
                              onClick={() => markNotificationRead(notif.id)}
                            >
                              <p className="text-sm text-gray-900">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notif.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    <span>{currentUser?.name}</span>
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">
                      {currentUser?.role ? roleLabels[currentUser.role] : ''}
                    </span>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50"
                    sideOffset={5}
                  >
                    <div className="px-3 py-2 border-b border-gray-200 mb-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Switch Role</p>
                    </div>
                    {(['author', 'editor', 'editor_in_chief', 'reviewer', 'layout_artist', 'twg_coordinator', 'twg_copyeditor', 'admin'] as UserRole[]).map(
                      (role) => (
                        <DropdownMenu.Item
                          key={role}
                          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer outline-none"
                          onClick={() => switchRole(role)}
                        >
                          {roleLabels[role]}
                        </DropdownMenu.Item>
                      )
                    )}
                    <DropdownMenu.Separator className="h-px bg-gray-200 my-2" />
                    <DropdownMenu.Item
                      className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer outline-none flex items-center gap-2"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
