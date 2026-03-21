import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import sharp from "sharp";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { buildSinglePagePdfFromJpeg } from "@/lib/certificates/pdf";
import {
  buildCertificateSvg,
  certificateDownloadFileName,
} from "@/lib/certificates/template";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function buildQrDataUrl(url: string): Promise<string | null> {
  try {
    const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(url)}`;
    const response = await fetch(qrApi, {
      headers: {
        Accept: "image/png",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    return `data:image/png;base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> },
) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = await getToken({ template: "convex" });
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  convex.setAuth(token);

  const { certificateId } = await params;
  const format = req.nextUrl.searchParams.get("format") === "pdf" ? "pdf" : "png";
  const inline = req.nextUrl.searchParams.get("inline") === "1";

  const certificate = await convex.query(api.certificates.getDownloadPayload, {
    certificateId: certificateId as Id<"certificates">,
  });

  if (!certificate) {
    return new Response("Not found", { status: 404 });
  }

  const verificationUrl = `${req.nextUrl.origin}/certificates/verify/${certificate.certificateCode}`;
  const qrCodeDataUrl = await buildQrDataUrl(verificationUrl);

  const svg = buildCertificateSvg({
    studentName: certificate.studentName,
    courseName: certificate.courseName,
    instructorName: certificate.instructorName,
    completedAt: certificate.completedAt,
    certificateCode: certificate.certificateCode,
    verificationUrl,
    qrCodeDataUrl,
  });

  if (format === "png") {
    const png = await sharp(Buffer.from(svg)).png({ quality: 100 }).toBuffer();
    const fileName = certificateDownloadFileName(
      certificate.courseName,
      certificate.certificateCode,
      "png",
    );

    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${fileName}"`,
        "Cache-Control": "private, max-age=300",
      },
    });
  }

  const jpeg = await sharp(Buffer.from(svg)).jpeg({ quality: 92 }).toBuffer();
  const metadata = await sharp(jpeg).metadata();
  const imageWidth = metadata.width ?? 1600;
  const imageHeight = metadata.height ?? 1120;
  const pdf = buildSinglePagePdfFromJpeg({
    jpegBytes: jpeg,
    imageWidth,
    imageHeight,
  });
  const fileName = certificateDownloadFileName(
    certificate.courseName,
    certificate.certificateCode,
    "pdf",
  );

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${fileName}"`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
