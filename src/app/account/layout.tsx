'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import PageTitle from '@/components/ui/page-title'
import { User, Package, HeadphonesIcon, MapPin, Award } from 'lucide-react'

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
  }
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle>My Account</PageTitle>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {accountTabs.map((tab) => {
              const isActive = pathname === tab.href
              const Icon = tab.icon
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`
                    group inline-flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
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
                      : 'text-gray-400 group-hover:text-gray-500'
                    }
                  `} />
                  {tab.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="py-6">
          {children}
        </div>
      </div>
    </div>
  )
}
