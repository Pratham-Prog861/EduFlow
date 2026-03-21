"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CertificateDetailPage() {
  const params = useParams();
  const certificateId = params.certificateId as Id<"certificates">;
  const certificate = useQuery(api.certificates.getById, { certificateId });

  if (certificate === undefined) {
    return <div className="h-[70vh] animate-pulse rounded-3xl bg-slate-100" />;
  }

  if (!certificate) {
    return (
      <div className="space-y-4 py-20 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Certificate not found</h1>
        <p className="text-slate-600">You may not have access to this certificate.</p>
        <Link href="/dashboard/student/certificates">
          <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">Go back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard/student/certificates" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Back to certificates
        </Link>

        <div className="flex gap-2">
          <a href={`/api/certificates/${certificate._id}/download?format=png&template=hp-v12`}>
            <Button variant="outline" className="rounded-full">
              <Download className="mr-2 h-4 w-4" /> Download PNG
            </Button>
          </a>
          <a href={`/api/certificates/${certificate._id}/download?format=pdf&template=hp-v12`}>
            <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
        <Image
          src={`/api/certificates/${certificate._id}/download?format=png&inline=1&template=hp-v12`}
          alt={`Certificate for ${certificate.courseName}`}
          width={1600}
          height={1120}
          unoptimized
          className="h-auto w-full rounded-2xl"
        />
      </div>
    </div>
  );
}



