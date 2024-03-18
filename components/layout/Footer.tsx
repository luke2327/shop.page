import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="px-4 pt-3 pb-1 text-neutral-400 text-sm flex gap-2 z-10 relative bg-white">
      <Image src="MW-light.svg" width={60} height={40} alt="alt" />
      <p>Copyright(C) 2022 - 2024 fmawo.com All Rights Reserved.</p>
    </footer>
  )
}

export default Footer
