import { auth, signOut } from '@/auth'
import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default async function ProfilePage() {
  const session = await auth()

  const user = session?.user

  return (
    <div className='flex items-center gap-8'>
      <div>
        <Image
          src={user?.image ? user.image : '/images/default.png'}
          alt={`profile photo of ${user?.name}`}
          width={90}
          height={90}
        />
      </div>
      <div className='mt-3'>
        <p className='mb-3'>ID: {user?.id}</p>
        <p className='mb-3'>Name: {user?.name}</p>
        <p className='mb-3'>Email: {user?.email}</p>
      </div>
      <Link
        href='/api/auth/signout'
        className={buttonVariants({
          className: 'text-white',
          variant: 'outline',
        })}
      >
        Sign out
      </Link>
    </div>
  )
}
