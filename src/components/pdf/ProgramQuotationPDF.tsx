// @ts-nocheck
import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Program } from "types/program";
import ikaLogoSrc from "assets/img/brand/ika-logo.png";

/* ── Brand tokens ───────────────────────────────────────────────────────── */
const NAVY   = "#101a3c";
const NAVY6  = "#1B2A5E";
const GOLD   = "#C9A84C";
const WHITE  = "#ffffff";
const SLATE4 = "#94a3b8";
const SLATE5 = "#64748b";
const SLATE1 = "#f1f5f9";
const SLATE2 = "#e2e8f0";

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null;

const parseLines = (text: string | null | undefined): string[] =>
  (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

/* ── Styles ──────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  /* Page */
  page: {
    fontFamily: "Helvetica",
    backgroundColor: WHITE,
    paddingBottom: 64,
  },

  /* ── Cover ── */
  coverTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: NAVY,
  },
  coverBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: GOLD,
  },
  coverBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 56,
    paddingVertical: 60,
  },
  coverLogo: {
    width: 96,
    height: 96,
    marginBottom: 18,
  },
  coverOrgName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    textAlign: "center",
    letterSpacing: 1.8,
    marginBottom: 5,
  },
  coverOrgSub: {
    fontSize: 8,
    color: SLATE5,
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 44,
  },
  coverDivider: {
    width: 56,
    height: 2,
    backgroundColor: GOLD,
    marginBottom: 44,
  },
  coverLabel: {
    fontSize: 26,
    color: NAVY6,
    textAlign: "center",
    marginBottom: 14,
  },
  coverTitle: {
    fontSize: 44,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    textAlign: "center",
    marginBottom: 28,
  },
  coverDate: {
    fontSize: 9,
    color: SLATE4,
    textAlign: "center",
  },

  /* ── Header (inner pages) ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 36,
    paddingTop: 26,
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: GOLD,
  },
  headerLogo: {
    width: 46,
    height: 46,
    marginRight: 12,
  },
  headerOrgName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  headerOrgSub: {
    fontSize: 7,
    color: SLATE5,
    letterSpacing: 0.6,
  },

  /* ── Footer (inner pages) ── */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderTopColor: GOLD,
    flexDirection: "row",
    paddingHorizontal: 36,
    paddingVertical: 10,
    backgroundColor: WHITE,
  },
  footerCol: {
    flex: 1,
  },
  footerColRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  footerText: {
    fontSize: 6.5,
    color: SLATE5,
    lineHeight: 1.55,
  },

  /* ── Content area ── */
  content: {
    paddingHorizontal: 36,
    paddingTop: 22,
  },

  /* ── Page title block ── */
  pageTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 9,
    color: SLATE5,
    marginBottom: 22,
  },

  /* ── Section heading ── */
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 2,
    marginTop: 20,
    marginBottom: 10,
  },

  /* ── Details table ── */
  table: {
    borderWidth: 1,
    borderColor: SLATE2,
    marginBottom: 18,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: SLATE2,
  },
  tableRowLast: {
    flexDirection: "row",
  },
  tdLabel: {
    width: "34%",
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: NAVY,
    justifyContent: "center",
  },
  tdLabelAlt: {
    backgroundColor: NAVY6,
  },
  tdLabelText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    letterSpacing: 0.4,
  },
  tdValue: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    justifyContent: "center",
  },
  tdValueAlt: {
    backgroundColor: SLATE1,
  },
  tdValueText: {
    fontSize: 9,
    color: NAVY,
  },

  /* ── Text ── */
  paragraph: {
    fontSize: 9,
    color: SLATE5,
    lineHeight: 1.65,
    marginBottom: 6,
  },

  /* ── Bullet list ── */
  bulletRow: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "flex-start",
  },
  bulletDot: {
    width: 14,
    fontSize: 9,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: SLATE5,
    lineHeight: 1.55,
  },
});

/* ── Sub-components ──────────────────────────────────────────────────────── */

const PageHeader = () => (
  <View style={s.header}>
    <Image src={ikaLogoSrc} style={s.headerLogo} />
    <View>
      <Text style={s.headerOrgName}>INTERNATIONAL KNOWLEDGE ACADEMY</Text>
      <Text style={s.headerOrgSub}>FOR TRAINING AND MANAGEMENT DEVELOPMENT</Text>
    </View>
  </View>
);

const PageFooter = () => (
  <View style={s.footer} fixed>
    <View style={s.footerCol}>
      <Text style={s.footerText}>KL Traders Square, 99, Jalan Gombak</Text>
      <Text style={s.footerText}>53000 Kuala Lumpur, Malaysia</Text>
    </View>
    <View style={s.footerCol}>
      <Text style={s.footerText}>Fatih Molla Gürani Mah. Turgut Özal</Text>
      <Text style={s.footerText}>Millet Cd. 84/214, Istanbul, Türkiye</Text>
    </View>
    <View style={s.footerColRight}>
      <Text style={s.footerText}>00601139936766  |  00905345699372</Text>
      <Text style={s.footerText}>info@ika-edu.com  |  www.ika-edu.com</Text>
    </View>
  </View>
);

const TableRow = ({
  label,
  value,
  isLast = false,
  isAlt = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
  isAlt?: boolean;
}) => (
  <View style={isLast ? s.tableRowLast : s.tableRow}>
    <View style={[s.tdLabel, isAlt && s.tdLabelAlt]}>
      <Text style={s.tdLabelText}>{label}</Text>
    </View>
    <View style={[s.tdValue, isAlt && s.tdValueAlt]}>
      <Text style={s.tdValueText}>{value || "—"}</Text>
    </View>
  </View>
);

const SectionLabel = ({ children }: { children: string }) => (
  <Text style={s.sectionLabel}>{children.toUpperCase()}</Text>
);

const BulletItem = ({ text }: { text: string }) => (
  <View style={s.bulletRow}>
    <Text style={s.bulletDot}>•</Text>
    <Text style={s.bulletText}>{text}</Text>
  </View>
);

/* ── Main document ───────────────────────────────────────────────────────── */

const ProgramQuotationPDF = ({ program }: { program: Program }) => {
  const startDate  = formatDate(program.start_date);
  const endDate    = formatDate(program.end_date);
  const objectives = parseLines(program.objectives);
  const audience   = parseLines(program.target_audience);
  const prereqs    = parseLines(program.prerequisites);

  const dateRange   = [startDate, endDate].filter(Boolean).join(" – ") || "—";
  const locationStr = program.location
    ? [program.location.name, program.location.city, program.location.country].filter(Boolean).join(", ")
    : null;
  const priceStr = program.price
    ? `${program.currency ?? "$"}${program.price} per person`
    : null;

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const tableRows = [
    { label: "Training Title", value: program.name },
    ...(dateRange !== "—"    ? [{ label: "Date & Time",   value: dateRange }]                           : []),
    ...(locationStr          ? [{ label: "Location",      value: locationStr }]                         : []),
    ...(program.language     ? [{ label: "Language",      value: program.language }]                    : []),
    ...(program.level        ? [{ label: "Level",         value: program.level_display ?? program.level }] : []),
    ...(program.mode         ? [{ label: "Mode",          value: program.mode_display  ?? program.mode  }] : []),
    ...(program.duration     ? [{ label: "Duration",      value: program.duration }]                    : []),
    ...(program.max_participants ? [{ label: "Seats",     value: String(program.max_participants) }]    : []),
    ...(priceStr             ? [{ label: "Price",         value: priceStr }]                            : []),
    ...(program.contact_email ? [{ label: "Contact",      value: program.contact_email }]               : []),
  ];

  const hasContent =
    !!program.description || objectives.length > 0 || audience.length > 0 || prereqs.length > 0;

  return (
    <Document
      title={`Training Quotation – ${program.name}`}
      author="International Knowledge Academy"
      subject="Training Quotation"
    >
      {/* ── Cover ───────────────────────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <View style={s.coverTopBar} />

        <View style={s.coverBody}>
          <Image src={ikaLogoSrc} style={s.coverLogo} />
          <Text style={s.coverOrgName}>INTERNATIONAL KNOWLEDGE ACADEMY</Text>
          <Text style={s.coverOrgSub}>FOR TRAINING AND MANAGEMENT DEVELOPMENT</Text>
          <View style={s.coverDivider} />
          <Text style={s.coverLabel}>Training Quotation</Text>
          <Text style={s.coverTitle}>{program.name}</Text>
          <Text style={s.coverDate}>{today}</Text>
        </View>

        <View style={s.coverBottomBar} />
      </Page>

      {/* ── Program Details ──────────────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <PageHeader />

        <View style={s.content}>
          <Text style={s.pageTitle}>Training Quotation</Text>
          <Text style={s.pageSubtitle}>{program.name}</Text>

          <SectionLabel>Program Details</SectionLabel>

          <View style={s.table}>
            {tableRows.map((row, i) => (
              <TableRow
                key={row.label}
                label={row.label}
                value={row.value}
                isLast={i === tableRows.length - 1}
                isAlt={i % 2 !== 0}
              />
            ))}
          </View>
        </View>

        <PageFooter />
      </Page>

      {/* ── Program Outline ──────────────────────────────────────────────── */}
      {hasContent && (
        <Page size="A4" style={s.page}>
          <PageHeader />

          <View style={s.content}>
            <Text style={s.pageTitle}>{program.name}</Text>
            <Text style={s.pageSubtitle}>Program Outline</Text>

            {program.description && (
              <>
                <SectionLabel>About This Program</SectionLabel>
                <Text style={s.paragraph}>{program.description}</Text>
              </>
            )}

            {objectives.length > 0 && (
              <>
                <SectionLabel>Program Objectives</SectionLabel>
                {objectives.map((obj, i) => (
                  <BulletItem key={i} text={obj} />
                ))}
              </>
            )}

            {audience.length > 0 && (
              <>
                <SectionLabel>Target Audience</SectionLabel>
                {audience.map((line, i) => (
                  <BulletItem key={i} text={line} />
                ))}
              </>
            )}

            {prereqs.length > 0 && (
              <>
                <SectionLabel>Prerequisites</SectionLabel>
                {prereqs.map((line, i) => (
                  <BulletItem key={i} text={line} />
                ))}
              </>
            )}
          </View>

          <PageFooter />
        </Page>
      )}
    </Document>
  );
};

export default ProgramQuotationPDF;
