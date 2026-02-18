'use client'
import { DashboardLayout } from '@/components/dashboard-layout'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BsClock } from 'react-icons/bs'
import { LuUser } from 'react-icons/lu'

const ARTICLE_IMG = "https://images.unsplash.com/photo-1659353886114-9aa119aef5aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWxlbWVkaWNpbmUlMjBkb2N0b3IlMjBjb25zdWx0YXRpb258ZW58MXx8fHwxNzU1ODA3MTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"

export default function InsightPage() {
  return (
    <DashboardLayout>
       <div className="md:flex mx-auto p-3 py-6">
        <div className="flex-auto p-3">
          <article className="max-w-3xl mx-auto overflow-hidden">
            <div className="relative bg-black/10 overflow-hidden rounded-lg h-72 w-full">
              <Image src={ARTICLE_IMG} alt="Future of Web Development" fill className="object-cover h-full w-full" />
            </div>
            <div className="py-6">
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">Technology</span>
                <div className="flex items-center space-x-1">
                  <BsClock className="w-4 h-4" />
                  <span>5 min read</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">The Future of Web Development: Trends to Watch in 2025</h1>
              <p className="text-lg text-gray-600 mb-4">
                Explore the latest trends shaping the web development landscape, from AI integration to new frameworks that are revolutionizing how we build applications.
              </p>
              <div className="flex border-b pb-4 items-center space-x-3 text-sm text-gray-500 mb-6">
                <LuUser className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-800">Sarah Johnson</span>
                <span>•</span>
                <span>Jan 15, 2025</span>
              </div>
              <div className="prose space-y-3 prose-lg text-gray-700">
                <p>
                  The web development landscape is evolving at an unprecedented pace, with 2025 promising to be a transformative year for developers and businesses alike. As we navigate through this exciting period of technological advancement, several key trends are emerging that will shape the way we build and interact with applications
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, nam dolorem? Exercitationem, autem nihil hic non repellendus soluta voluptatibus inventore doloremque dolorum, ullam quos natus! Consectetur deserunt eveniet facilis sed commodi aliquam optio dicta, eius repellendus cupiditate eum quod, rerum deleniti officia asperiores atque earum ipsum, debitis expedita reprehenderit reiciendis provident dolor? Voluptatibus et accusantium aspernatur repellat? Iure dignissimos ad nesciunt! Recusandae error veritatis eum rerum. Adipisci, illo eius nam atque ab nisi molestiae blanditiis voluptatum earum repellendus alias, impedit, nulla nobis eligendi ea placeat excepturi sed modi! Laudantium architecto amet quis mollitia sunt beatae repudiandae deserunt placeat sint atque dolores possimus consectetur ipsam eos consequatur, ratione explicabo obcaecati corrupti. Quaerat, sed error minima, et harum aperiam facere iusto, quae alias natus quos ex esse pariatur eveniet aliquam dolore! Voluptatem eaque molestias aut veritatis commodi tempore repellat culpa
                </p>
                <p>
                  The web development landscape is evolving at an unprecedented pace, with 2025 promising to be a transformative year for developers and businesses alike. As we navigate through this exciting period of technological advancement, several key trends are emerging that will shape the way we build and interact with applications
                </p>
                <p>
                  The web development landscape is evolving at an unprecedented pace, with 2025 promising to be a transformative year for developers and businesses alike. As we navigate through this exciting period of technological advancement, several key trends are emerging that will shape the way we build and interact with applications
                </p>
              </div>
            </div>
          </article>
        </div>
        <div className="sm:w-[400px]">
          <div className="sticky top-5 space-y-3 p-3">
            <div className="font-bold text-lg md:text-2xl">Related Insights</div>
            {Array.from({ length: 3 }).map((_, i) => (
              <Link key={i} href="/blogs/The-Future-of-Anonymous-Healthcare">
                <div className="flex items-center justify-between rounded">
                  <div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">Technology</span>
                      <div className="flex text-xs items-center space-x-1">
                        <BsClock className="w-4 h-4" />
                        <span>5 min read</span>
                      </div>
                    </div>
                    <h2 className="font-bold text-sm line-clamp-1 text-gray-900 mb-2">The Future of Web Development: Trends to Watch in 2025</h2>
                    <p className="text-sm line-clamp-2 text-gray-600 mb-4">
                      Explore the latest trends shaping the web development landscape, from AI integration to new frameworks that are revolutionizing how we build applications.
                    </p>
                    <div className="flex text-xs border-b pb-4 items-center space-x-3 text-gray-500 mb-6">
                      <LuUser className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-800">Sarah Johnson</span>
                      <span>•</span>
                      <span>Jan 15, 2025</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
