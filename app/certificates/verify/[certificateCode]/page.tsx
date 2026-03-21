import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
}

export default async function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ certificateCode: string }>;
}) {
  const { certificateCode } = await params;
  const certificate = await convex.query(api.certificates.verifyByCode, {
    certificateCode,
  });

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">EduFlow Certificate Verification</p>
        {certificate ? (
          <>
            <h1 className="mt-3 text-3xl font-bold text-emerald-700">Certificate Verified</h1>
            <p className="mt-2 text-slate-600">This certificate is valid and issued by EduFlow.</p>

            <dl className="mt-8 space-y-4 text-slate-900">
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-slate-500">Certificate ID</dt>
                <dd className="text-lg font-semibold">{certificate.certificateCode}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-slate-500">Learner</dt>
                <dd className="text-lg font-semibold">{certificate.studentName}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-slate-500">Course</dt>
                <dd className="text-lg font-semibold">{certificate.courseName}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-slate-500">Instructor</dt>
                <dd className="text-lg font-semibold">{certificate.instructorName}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-slate-500">Completion Date</dt>
                <dd className="text-lg font-semibold">{formatDate(certificate.completedAt)}</dd>
              </div>
            </dl>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-bold text-rose-700">Certificate Not Found</h1>
            <p className="mt-2 text-slate-600">This code is invalid or no longer active.</p>
            <p className="mt-6 text-sm text-slate-500">Code checked: {certificateCode}</p>
          </>
        )}
      </section>
    </main>
  );
}
