import React, { useState } from 'react';
import AppModal from './AppModal';
import AppInput from './AppInput';
import Link from 'next/link';
import { RiLinkedinBoxFill, RiTwitterXFill } from 'react-icons/ri';
import { FaFacebook, FaFacebookF, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import klowqLogo from '@assets/logo.png';
import { IoMdClose } from 'react-icons/io';

interface WaitListProps {
  showWaitModal: boolean;
  setshowWaitModal: (value: boolean) => void;
}

export default function WaitList({ showWaitModal, setshowWaitModal }: WaitListProps) {
  const joinWaitList = (e: React.FormEvent) => {
    e.preventDefault();
    setshowWaitModal(false);
  };

  return (
    <div>
      <AppModal mode={showWaitModal}>
        <div onClick={() => setshowWaitModal(false)} className="absolute top-0 right-0 w-screen h-screen" />
        <div className="max-w-lg relative z-50 p-4 space-y-3 h-screen flex flex-col items-center justify-center scrollbar-hide overflow-y-auto py-6 mx-auto">
          <div>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-11 h-11 bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-md border border-slate-200/50 flex items-center justify-center">
                <Image src={klowqLogo} alt="KLOWQ" className="w-7 h-7" />
              </div>
              <span className="text-2xl font-semibold text-primary tracking-tight">KLOWQ</span>
            </div>
          </div>
          <div className="p-4 py-7 relative text-center space-y-4 rounded-2xl bg-white">
            <div onClick={() => setshowWaitModal(false)} className="w-8 h-8 cursor-pointer absolute top-3 right-3 rounded-full border border-black/40 flex items-center justify-center">
              <IoMdClose />
            </div>
            <div className="flex font-bold text-lg gap-1 justify-center">Hi <div className="text-primary">Welcome!</div></div>
            <div className="space-y-3">
              <div className="text-sm text-gray-500 max-w-sm mx-auto px-3">Join the waitlist and be the first to know when we launch access to expert answers, discreet products, and AI-powered support — all with zero awkwardness.</div>
            </div>
            <form onSubmit={joinWaitList} className="text-left space-y-4">
              <AppInput label="Email" required type="email" placeholder="Enter your Email" />
              <AppInput label="Nickname" required placeholder="Enter what you would like to be called" />
              <div className="flex justify-center">
                <button type="submit" className="bg-primary cursor-pointer text-white font-semibold py-3 rounded-full w-full">Join Our Wait-list</button>
              </div>
            </form>
            <div className="flex items-center text-white justify-center gap-3">
              <Link target="_blank" href="https://x.com/klowqapp">
                <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-primary"><RiTwitterXFill /></div>
              </Link>
              <Link target="_blank" href="https://web.facebook.com/profile.php?id=61579475548168">
                <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-primary"><FaFacebookF /></div>
              </Link>
              <Link target="_blank" href="https://www.linkedin.com/in/klowq-app-84192337a/">
                <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-primary"><RiLinkedinBoxFill /></div>
              </Link>
            </div>
          </div>
        </div>
      </AppModal>
    </div>
  );
}
