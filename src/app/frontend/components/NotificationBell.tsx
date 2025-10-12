// src\app\frontend\components\NotificationBell.tsx
import React, { useState, useEffect } from 'react';
import {
  IconBell,
  IconBellFilled,
  IconCheck,
  IconTrash,
  IconMail,
  IconMailOpened
} from '@tabler/icons-react';
import {
  Menu,
  Button,
  Text,
  ScrollArea,
  Badge,
  ActionIcon,
  Group,
  Stack,
  Divider,
  Alert,
  Loader,
  Center
} from '@mantine/core';

interface Notification {
  notification_id: number;
  notification_title: string;
  notification_message: string;
  notification_type: 'info' | 'success' | 'warning' | 'error' | 'system';
  is_read: boolean;
  created_at: string;
}

interface NotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
    unread_count: number;
  };
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications?limit=10');
      const data: NotificationResponse = await response.json();
      
      if (data.success) {
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.notification_id === notificationId 
              ? { ...notif, is_read: true }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const deletedNotif = notifications.find(n => n.notification_id === notificationId);
        setNotifications(prev => 
          prev.filter(notif => notif.notification_id !== notificationId)
        );
        
        if (deletedNotif && !deletedNotif.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Get notification color by type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'green';
      case 'warning': return 'yellow';
      case 'error': return 'red';
      case 'system': return 'purple';
      default: return 'blue';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    
    return date.toLocaleDateString('id-ID');
  };

  useEffect(() => {
    fetchNotifications();
    
    // Polling untuk notifikasi baru setiap 30 detik
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      width={400}
      shadow="lg"
    >
      <Menu.Target>
        <Button
          variant="subtle"
          size="sm"
          onClick={() => {
            if (!opened) fetchNotifications();
          }}
          style={{ position: 'relative' }}
        >
          {unreadCount > 0 ? <IconBellFilled size={20} /> : <IconBell size={20} />}
          {unreadCount > 0 && (
            <Badge
              size="xs"
              color="red"
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                minWidth: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </Menu.Target>

      <Menu.Dropdown p={0}>
        <Group justify="space-between" p="md" style={{ borderBottom: '1px solid #e9ecef' }}>
          <Text fw={600}>Notifikasi</Text>
          {unreadCount > 0 && (
            <Button variant="subtle" size="xs" onClick={markAllAsRead}>
              <IconCheck size={14} style={{ marginRight: 4 }} />
              Tandai Semua
            </Button>
          )}
        </Group>

        <ScrollArea h={400}>
          {loading ? (
            <Center p="xl">
              <Loader size="sm" />
            </Center>
          ) : notifications.length === 0 ? (
            <Center p="xl">
              <Stack align="center" gap="xs">
                <IconBell size={48} color="#adb5bd" />
                <Text c="dimmed" size="sm">Belum ada notifikasi</Text>
              </Stack>
            </Center>
          ) : (
            <Stack gap={0}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.notification_id}>
                  <Group
                    align="flex-start"
                    p="md"
                    style={{
                      backgroundColor: notification.is_read ? 'transparent' : '#f8f9fa',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification.notification_id);
                      }
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Group justify="space-between" mb="xs">
                        <Text fw={500} size="sm" lineClamp={1}>
                          {notification.notification_title}
                        </Text>
                        <Group gap="xs">
                          {!notification.is_read && (
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              color={getNotificationColor(notification.notification_type)}
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.notification_id);
                              }}
                            >
                              {notification.is_read ? <IconMailOpened size={14} /> : <IconMail size={14} />}
                            </ActionIcon>
                          )}
                          <ActionIcon
                            size="sm"
                            variant="subtle"
                            color="red"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.notification_id);
                            }}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Group>
                      </Group>
                      
                      <Text size="xs" c="dimmed" lineClamp={2} mb="xs">
                        {notification.notification_message}
                      </Text>
                      
                      <Group justify="space-between">
                        <Badge
                          size="xs"
                          color={getNotificationColor(notification.notification_type)}
                          variant="light"
                        >
                          {notification.notification_type}
                        </Badge>
                        <Text size="xs" c="dimmed">
                          {formatDate(notification.created_at)}
                        </Text>
                      </Group>
                    </div>
                  </Group>
                  
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Stack>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Divider />
            <Group justify="center" p="md">
              <Button variant="subtle" size="sm" onClick={fetchNotifications}>
                Lihat Semua Notifikasi
              </Button>
            </Group>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default NotificationBell;