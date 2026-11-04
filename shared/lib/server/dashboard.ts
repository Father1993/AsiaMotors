import "server-only";
import { z } from "zod";
import { database } from "./db";
import { getAllPostSlugs } from "@/shared/utils/posts";

export const dashboardPeriod = z.enum(["7", "30", "90", "all"]).default("30");
export async function getDashboard(periodInput?: string) {
  const period = dashboardPeriod.parse(periodInput);
  const days = period === "all" ? null : Number(period);
  const { rows } = await database().query(
    `
      WITH bounds AS (
        SELECT CASE WHEN $1::int IS NULL THEN NULL ELSE
          (date_trunc('day',now() AT TIME ZONE 'Asia/Vladivostok')-($1-1)*interval '1 day') AT TIME ZONE 'Asia/Vladivostok' END since,
          now() until
      ), cohort AS (
        SELECT l.id,l.status,l.created_at,l.payload->>'form_name' source,o.status mail_status
          FROM leads l LEFT JOIN mail_outbox o ON o.lead_id=l.id,bounds b
          WHERE (b.since IS NULL OR l.created_at>=b.since) AND l.created_at<=b.until
      ) SELECT
        (SELECT since FROM bounds) since,(SELECT until FROM bounds) until,
        (SELECT jsonb_build_object('total',count(*),'new',count(*) FILTER(WHERE status='new'),
          'processing',count(*) FILTER(WHERE status='processing'),'closed',count(*) FILTER(WHERE status='closed')) FROM cohort) requests,
        (SELECT jsonb_build_object('pending',count(*) FILTER(WHERE mail_status='pending'),
          'sent',count(*) FILTER(WHERE mail_status='sent'),'failed',count(*) FILTER(WHERE mail_status='failed')) FROM cohort) mail,
        (SELECT COALESCE(jsonb_agg(p),'[]'::jsonb) FROM (SELECT source,count(*)::int total FROM cohort GROUP BY source ORDER BY count(*) DESC,source) p) sources,
        (SELECT COALESCE(jsonb_agg(p),'[]'::jsonb) FROM (SELECT to_char(created_at AT TIME ZONE 'Asia/Vladivostok','YYYY-MM-DD') AS "day",count(*)::int total
          FROM cohort GROUP BY 1 ORDER BY 1 DESC) p) daily,
        (SELECT jsonb_build_object('new',count(*) FILTER(WHERE l.status='new'),
          'processing',count(*) FILTER(WHERE l.status='processing'),'pending',count(*) FILTER(WHERE o.status='pending'),
          'failed',count(*) FILTER(WHERE o.status='failed')) FROM leads l LEFT JOIN mail_outbox o ON o.lead_id=l.id) backlog,
        (SELECT jsonb_build_object('total',count(*),'published',count(*) FILTER(WHERE status='published'),
          'draft',count(*) FILTER(WHERE status='draft'),'hidden',count(*) FILTER(WHERE status='hidden'),
          'available',count(*) FILTER(WHERE status='published' AND available),'onOrder',count(*) FILTER(WHERE status='published' AND NOT available)) FROM cars) cars,
        (SELECT jsonb_build_object('total',count(*),'draft',count(*) FILTER(WHERE status='draft'),
          'published',count(*) FILTER(WHERE status='published'),'hidden',count(*) FILTER(WHERE status='hidden'),
          'scheduled',count(*) FILTER(WHERE scheduled_at IS NOT NULL)) FROM posts) articles`,
    [days],
  );
  const result = rows[0];
  return {
    period,
    timezone: "Asia/Vladivostok",
    since: result.since?.toISOString() ?? null,
    until: result.until.toISOString(),
    backlog: result.backlog as {
      new: number;
      processing: number;
      pending: number;
      failed: number;
    },
    requests: result.requests as {
      total: number;
      new: number;
      processing: number;
      closed: number;
    },
    mail: result.mail as { pending: number; sent: number; failed: number },
    cars: result.cars as {
      total: number;
      published: number;
      draft: number;
      hidden: number;
      available: number;
      onOrder: number;
    },
    articles: {
      ...result.articles,
      archive: (await getAllPostSlugs()).length,
    } as {
      total: number;
      draft: number;
      published: number;
      hidden: number;
      scheduled: number;
      archive: number;
    },
    daily: result.daily as { day: string; total: number }[],
    sources: result.sources as { source: string; total: number }[],
    mailDeliveryEnabled: process.env.MAIL_DELIVERY_ENABLED === "true",
  };
}
