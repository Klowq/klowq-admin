import React from "react";
import { BsCalendar, BsClock } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { LuStethoscope } from "react-icons/lu";
import { Badge } from "@/components/organisms/Badge";
import { Card, CardContent } from "@/components/organisms/Card";
import Link from "next/link";

export default function InsightChip() {
  return (
    <Link href="/blogs/The-Future-of-Anonymous-Healthcare">
      <div className="md:col-span-2 lg:col-span-1 group">
        <Card className="border-0 shadow-xl hover:shadow-3xl transition-all duration-500 bg-white h-full group-hover:-translate-y-2 rounded-3xl overflow-hidden">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1659353886114-9aa119aef5aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWxlbWVkaWNpbmUlMjBkb2N0b3IlMjBjb25zdWx0YXRpb258ZW58MXx8fHwxNzU1ODA3MTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Healthcare Technology"
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-white border-0 shadow-lg">
                Featured
              </Badge>
            </div>
          </div>

          <CardContent className="py-8 px-4">
            <div className="flex items-center space-x-4 mt-4 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <BsCalendar className="w-4 h-4" />
                <span>Jan 15, 2025</span>
              </div>
              <div className="flex items-center space-x-2">
                <BsClock className="w-4 h-4" />
                <span>8 min read</span>
              </div>
            </div>
            <div className="py-3 gap-2 flex flex-wrap">
              <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
                Fitness
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
                Healthcare
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
                Skin Care
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
                Mental Health
              </span>
            </div>
            <h3 className="text-2xl line-clamp-2 font-bold text-slate-900 mb-4 leading-tight tracking-tight group-hover:text-primary transition-colors">
              The Future of Anonymous Healthcare: Privacy Revolution
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3">
              Discover how anonymous healthcare platforms are transforming
              patient care by eliminating privacy barriers and creating more
              accessible medical consultations for sensitive health concerns.
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
                  <LuStethoscope className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    Dr. Sarah Chen
                  </div>
                  <div className="text-xs text-slate-500">
                    Digital Health Expert
                  </div>
                </div>
              </div>
              <FaArrowRightLong className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
