'use client';

import Link from 'next/link'
import { usePathname, redirect } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import PageTitle from '@/components/ui/page-title'
import { User, Package, HeadphonesIcon, MapPin, Award, Trash2 } from 'lucide-react'
import { useEffect } from 'react'

const accountTabs = [
  {
    name: 'Profile',
    href: '/account',
    icon: User
  },
  {
    name: 'Orders',
    href: '/account/orders',
    icon: Package
  },
  {
    name: 'Addresses',
    href: '/account/addresses',
    icon: MapPin
  },
  {
    name: 'Rewards',
    href: '/account/rewards',
    icon: Award
  },
  {
    name: 'Support',
    href: '/account/support',
    icon: HeadphonesIcon
  },
  {
    name: 'Delete Account',
    href: '/account/delete',
    icon: Trash2,
    className: 'text-red-600 hover:text-red-700'
  }
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = `/auth/login?from=${pathname}`
    }
  }, [loading, user, pathname])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle>My Account</PageTitle>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        
        {/* Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
          <nav className="-mb-px flex space-x-8 min-w-max px-1">
            {accountTabs.map((tab) => {
              const isActive = pathname === tab.href
              const Icon = tab.icon
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`
                    group inline-flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${tab.className || ''}
                    ${isActive
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className={`
                    mr-2 h-5 w-5
                    ${isActive
                      ? 'text-black'
                      : tab.className || 'text-gray-400 group-hover:text-gray-500'
                    }
                  `} />
                  <span className="whitespace-nowrap">{tab.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Add gradient indicators for scroll */}
        <div className="relative md:hidden">
          <div className="absolute left-0 top-[-48px] h-12 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-[-48px] h-12 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="py-6">
          {children}
        </div>
      </div>
    </div>
  )
}
