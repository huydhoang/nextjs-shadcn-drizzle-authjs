import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function Home() {
  return (
    <div className='flex flex-row flex-wrap justify-between'>
      <Link
        href='/api/auth/signin'
        className={buttonVariants({
          className: 'text-white',
          variant: 'outline',
        })}
      >
        Sign in
      </Link>
      <Link
        href='/profile'
        className={buttonVariants({
          className: 'text-white',
          variant: 'outline',
        })}
      >
        Profile
      </Link>
      <Link
        href='/api/session'
        className={buttonVariants({
          className: 'text-white',
          variant: 'outline',
        })}
      >
        Session API
      </Link>
    </div>
  )
}
