"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Award, CalendarDays, Download, Eye, Hash, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatDate(value: number) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function CertificatesPage() {
  const certificates = useQuery(api.certificates.listMine);

  return (
    <div className="space-y-10 pb-16">
      <section className="relative overflow-hidden rounded-[2.75rem] border border-slate-200/70 bg-gradient-to-br from-amber-50 via-white to-blue-50 p-8 md:p-10">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="relative flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Achievements</p>
          <h1 className="text-4xl font-semibold text-slate-900">My Certificates</h1>
          <p className="max-w-2xl text-slate-600">
            Certificates are issued automatically when your course reaches 100% completion. Download as PNG or one-page PDF.
          </p>
        </div>
      </section>

      {certificates === undefined ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {[1, 2, 3].map((value) => (
            <Card key={value} className="h-44 animate-pulse rounded-3xl border-slate-200/70 bg-slate-100" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <Card className="rounded-3xl border-dashed border-slate-300 bg-white/80 p-12 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-slate-100 p-4">
            <Award className="h-7 w-7 text-slate-600" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-900">No certificates yet</h3>
          <p className="mx-auto mt-2 max-w-lg text-slate-600">
            Complete all lectures in an enrolled course to unlock your certificate.
          </p>
          <Link href="/dashboard/student/courses" className="mt-6 inline-flex">
            <Button className="h-10 rounded-full bg-slate-900 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-slate-800">
              Continue Learning
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {certificates.map((certificate) => (
            <Card key={certificate._id} className="overflow-hidden rounded-3xl border-slate-200/80 bg-white">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Certificate of Completion</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">{certificate.courseName}</h2>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <p className="inline-flex items-center gap-2"><UserRound className="h-4 w-4" /> {certificate.instructorName}</p>
                  <p className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {formatDate(certificate.completedAt)}</p>
                  <p className="inline-flex items-center gap-2 sm:col-span-2"><Hash className="h-4 w-4" /> Code: {certificate.certificateCode}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`/dashboard/student/certificates/${certificate._id}`}>
                    <Button variant="outline" className="rounded-full">
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Button>
                  </Link>
                  <a href={`/api/certificates/${certificate._id}/download?format=png&template=hp-v12`}>
                    <Button variant="outline" className="rounded-full">
                      <Download className="mr-2 h-4 w-4" /> PNG
                    </Button>
                  </a>
                  <a href={`/api/certificates/${certificate._id}/download?format=pdf&template=hp-v12`}>
                    <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                      <Download className="mr-2 h-4 w-4" /> PDF
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
