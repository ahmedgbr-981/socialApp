import { useQuery } from '@tanstack/react-query'
import React from 'react'
import {
  FiBell,
  FiCheck,
  FiHeart,
  FiMessageSquare,
  FiUserPlus,
  FiShare2,
  FiBookmark,
  FiInbox
} from 'react-icons/fi'
import getNotifications from '../../api/getNotifications.api'

function formatTime(dateValue) {
  if (!dateValue) return 'Just now'

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'Just now'

  const diffInMinutes = Math.max(1, Math.round((Date.now() - date.getTime()) / 60000))

  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.round(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.round(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function getNotificationMeta(notification) {
  const type = String(notification?.type || notification?.notificationType || '').toLowerCase()

  if (type.includes('like') || type.includes('love')) {
    return {
      icon: FiHeart,
      label: 'Like',
      color: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
      action: 'liked your post'
    }
  }

  if (type.includes('comment')) {
    return {
      icon: FiMessageSquare,
      label: 'Comment',
      color: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      action: 'commented on your post'
    }
  }

  if (type.includes('follow')) {
    return {
      icon: FiUserPlus,
      label: 'Follow',
      color: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
      action: 'started following you'
    }
  }

  if (type.includes('share')) {
    return {
      icon: FiShare2,
      label: 'Share',
      color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      action: 'shared your post'
    }
  }

  if (type.includes('bookmark')) {
    return {
      icon: FiBookmark,
      label: 'Saved',
      color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      action: 'saved your post'
    }
  }

  return {
    icon: FiBell,
    label: 'Update',
    color: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    action: 'updated something'
  }
}

export default function Notifications() {
  const {
    data = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications
  })

  const unreadCount = data.filter((item) => !item?.read).length

  return (
    <main className="min-h-screen  px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-400">
              Activity
            </p>
            <h1 className="mt-1 text-3xl font-bold text-white">Notifications</h1>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 shadow-lg shadow-slate-950/40">
            <FiInbox className="text-sky-400" />
            <span>{unreadCount} unread</span>
          </div>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
          <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/70 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                <FiBell />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Recent updates</h2>
                <p className="text-sm text-slate-400">Your latest social activity</p>
              </div>
            </div>

            <button
              type="button"
              className="hidden rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-sky-500/60 hover:text-white sm:inline-flex"
            >
              Mark all read
            </button>
          </header>

          {isLoading && (
            <div className="flex min-h-65 items-center justify-center p-8">
              <div className="scale-75">
                <FiBell className="animate-pulse text-4xl text-sky-400" />
              </div>
            </div>
          )}

          {isError && (
            <div className="flex min-h-55 items-center justify-center p-8 text-center">
              <div className="max-w-md rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-rose-200">
                <p className="text-lg font-semibold">Unable to load notifications</p>
                <p className="mt-1 text-sm text-rose-100/80">
                  {error?.message || 'Please try again in a moment.'}
                </p>
              </div>
            </div>
          )}

          {!isLoading && !isError && data.length === 0 && (
            <div className="flex min-h-60 flex-col items-center justify-center px-6 py-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                <FiBell className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-white">No notifications yet</h3>
              <p className="mt-2 max-w-md text-sm text-slate-400">
                When someone likes, follows, or comments on your posts, they will appear here.
              </p>
            </div>
          )}

          {!isLoading && !isError && data.length > 0 && (
            <div className="divide-y divide-slate-800">
              {data.map((notification, index) => {
                const meta = getNotificationMeta(notification)
                const Icon = meta.icon
                const userName =
                  notification?.user?.name ||
                  notification?.from?.name ||
                  notification?.actor?.name ||
                  notification?.sender?.name ||
                  'Someone'

                const userPhoto =
                  notification?.user?.photo ||
                  notification?.from?.photo ||
                  notification?.actor?.photo ||
                  notification?.sender?.photo ||
                  ''

                const message =
                  notification?.message ||
                  notification?.content ||
                  notification?.text ||
                  `${userName} ${meta.action}`

                const initials = userName
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase() || 'U'

                return (
                  <article
                    key={notification?._id || notification?.id || `${userName}-${index}`}
                    className={`group flex items-start gap-4 px-5 py-4 transition hover:bg-slate-800/50 sm:px-6 ${
                      !notification?.read ? 'bg-sky-500/3' : ''
                    }`}
                  >
                    <div className={`mt-0.5 flex h-12 w-12 items-center justify-center rounded-2xl border ${meta.color}`}>
                      <Icon className="text-lg" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-700 text-sm font-semibold text-white">
                            {userPhoto ? (
                              <img src={userPhoto} alt={userName} className="h-full w-full object-cover" />
                            ) : (
                              initials
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm leading-6 text-slate-200">
                              <span className="font-semibold text-white">{userName}</span>{' '}
                              <span className="text-slate-300">{message}</span>
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-2 py-1">
                                {meta.label}
                              </span>
                              <time>{formatTime(notification?.createdAt || notification?.date)}</time>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:justify-end">
                          {!notification?.read && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                              New
                            </span>
                          )}

                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
                          >
                            <FiCheck className="text-xs" />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
