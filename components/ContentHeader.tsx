import React from 'react'
import logo from "@/public/logo.png"
import Image from 'next/image'
import { IconChevronDown } from '@tabler/icons-react'


function ContentHeader() {
  return (
    <div className='flex items-center'>
      <Image src={logo} alt='logo' className='h-12 w-12 object-contain' />

      <div className='flex items-center ml-auto'>
        <span style={{
          fontSize: 'calc(var(--p4) * 0.9)'
        }} className='font-bold h-6 w-6 flex items-center justify-center rounded-[0.35rem] bg-white mr-2'>L</span>
        <span className='font-p4'>Leandra</span>
        <IconChevronDown className='h-4 w-4 opacity-65 ml-2' />
      </div>
    </div>
  )
}

export default ContentHeader