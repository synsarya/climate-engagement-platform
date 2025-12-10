import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { 
  Bell, 
  Users, 
  BookOpen, 
  Target, 
  MessageCircle, 
  Award,
  TrendingUp,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getNotifications, markNotificationRead } from "../utils/api";

interface Notification {
  id: string;
  type: 'community' | 'learning' | 'action' | 'message' | 'achievement' | 'data';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: any;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export function NotificationsPanel({ isOpen, onClose, onNavigate }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const { notifications: notifs } = await getNotifications();
      
      // Map backend notifications to frontend format
      const mappedNotifications = notifs.map((notif: any) => ({
        id: notif.id,
        type: notif.type || 'message',
        title: getNotificationTitle(notif),
        message: notif.message,
        time: formatTime(notif.createdAt),
        read: notif.read,
        icon: getNotificationIcon(notif.type)
      }));
      
      setNotifications(mappedNotifications);
    } catch (error) {
      console.error('Load notifications error:', error);
      // Fallback to mock data if not authenticated
      setNotifications([
        {
          id: '1',
          type: 'community',
          title: 'Welcome to Your Earth!',
          message: 'Sign in to see your personalized notifications',
          time: 'Just now',
          read: false,
          icon: Users
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationTitle = (notif: any) => {
    switch (notif.type) {
      case 'connection_request':
        return 'New connection request';
      case 'message':
        return 'New message';
      case 'community':
        return 'Community update';
      default:
        return 'Notification';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'connection_request':
        return Users;
      case 'message':
        return MessageCircle;
      case 'community':
        return Users;
      case 'learning':
        return BookOpen;
      case 'action':
        return Target;
      case 'achievement':
        return Award;
      case 'data':
        return TrendingUp;
      default:
        return Bell;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Mark notification read error:', error);
    }
  };



  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'community':
        return 'text-blue-500';
      case 'learning':
        return 'text-green-500';
      case 'action':
        return 'text-orange-500';
      case 'message':
        return 'text-purple-500';
      case 'achievement':
        return 'text-yellow-500';
      case 'data':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-96 bg-background border-l shadow-lg z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <h2 className="text-lg">Notifications</h2>
                    {unreadCount > 0 && (
                      <Badge variant="default" className="rounded-full">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    Mark all as read
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Settings
                  </Button>
                </div>
              </div>

              {/* Notifications List */}
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {notifications.map((notification, index) => {
                    const Icon = notification.icon;
                    return (
                      <div key={notification.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors ${
                            !notification.read ? 'bg-accent/50' : ''
                          }`}
                          onClick={() => {
                            // Mark as read
                            if (!notification.read) {
                              handleMarkAsRead(notification.id);
                            }
                            
                            // Navigate based on notification type
                            if (notification.type === 'community') {
                              onNavigate?.('community');
                            } else if (notification.type === 'learning') {
                              onNavigate?.('learn');
                            } else if (notification.type === 'action') {
                              onNavigate?.('action');
                            }
                            onClose();
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`mt-1 ${getNotificationColor(notification.type)}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-start justify-between">
                                <p className="text-sm">{notification.title}</p>
                                {!notification.read && (
                                  <div className="h-2 w-2 rounded-full bg-primary mt-1" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                        {index < notifications.length - 1 && <Separator className="my-2" />}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="p-4 border-t">
                <Button variant="outline" className="w-full" size="sm">
                  View All Notifications
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
