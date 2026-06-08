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
import type { Location } from "types/location";
import ikaLogoSrc from "assets/img/brand/IKA-logo-bg.png";

/* ── Color tokens ───────────────────────────────────────────────────────── */
const NAVY   = "#101a3c";
const NAVY6  = "#1B2A5E";
const GOLD   = "#C9A84C";
const WHITE  = "#ffffff";
const SLATE4 = "#94a3b8";
const SLATE5 = "#64748b";
const SLATE1 = "#f1f5f9";
const SLATE2 = "#e2e8f0";
const SLATE8 = "#1e293b";

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null;

const parseLines = (text: string | null | undefined): string[] =>
  (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

/* ── Styles ──────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: WHITE,
    paddingBottom: 72,
  },

  /* ── Cover ── */
  coverTopBar: {
    height: 6,
    backgroundColor: NAVY,
  },
  coverHero: {
    backgroundColor: WHITE,
    paddingTop: 44,
    paddingBottom: 36,
    paddingHorizontal: 56,
    alignItems: "center",
  },
  coverLogo: {
    width: 96,
    height: 96,
    marginBottom: 18,
  },
  coverOrgName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 6,
  },
  coverOrgSub: {
    fontSize: 7.5,
    color: SLATE5,
    textAlign: "center",
    letterSpacing: 1.2,
  },
  coverGoldLine: {
    height: 3,
    width: 56,
    backgroundColor: GOLD,
    marginTop: 20,
  },
  coverInfo: {
    flex: 1,
    paddingHorizontal: 56,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  coverBadge: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 3,
    marginBottom: 18,
  },
  coverTitle: {
    fontSize: 34,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    textAlign: "center",
    lineHeight: 1.25,
    marginBottom: 28,
  },
  coverMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coverMetaDivider: {
    width: 1,
    height: 10,
    backgroundColor: SLATE2,
  },
  coverMetaText: {
    fontSize: 8.5,
    color: SLATE5,
  },
  coverLocationDot: {
    width: 4,
    height: 4,
    borderRadius: 100,
    backgroundColor: GOLD,
    marginRight: 5,
  },
  coverLocationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  coverBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: GOLD,
  },

  /* ── Header (inner pages) ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 36,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: SLATE2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerOrgName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerOrgSub: {
    fontSize: 6.5,
    color: SLATE4,
    letterSpacing: 0.5,
  },
  headerBadge: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 1.5,
    borderWidth: 1,
    borderColor: GOLD,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  /* ── Footer (inner pages) ── */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 36,
    paddingVertical: 10,
    backgroundColor: SLATE1,
    borderTopWidth: 1,
    borderTopColor: SLATE2,
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
    lineHeight: 1.6,
  },
  footerPage: {
    fontSize: 7,
    color: SLATE4,
    textAlign: "center",
  },

  /* ── Content area ── */
  content: {
    paddingHorizontal: 36,
    paddingTop: 20,
  },

  /* ── Page title block ── */
  pageTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 3,
  },
  pageSubtitle: {
    fontSize: 9,
    color: SLATE5,
    marginBottom: 20,
  },

  /* ── Section heading ── */
  sectionLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 10,
    paddingLeft: 9,
    borderLeftWidth: 3,
    borderLeftColor: GOLD,
  },
  sectionLabelText: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: SLATE8,
    letterSpacing: 1.8,
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
    paddingVertical: 10,
    backgroundColor: NAVY6,
    justifyContent: "center",
  },
  tdLabelAlt: {
    backgroundColor: NAVY,
  },
  tdLabelText: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    letterSpacing: 0.3,
  },
  tdValue: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  tdValueAlt: {
    backgroundColor: SLATE1,
  },
  tdValueText: {
    fontSize: 9,
    color: SLATE8,
  },

  /* ── Text ── */
  paragraph: {
    fontSize: 9,
    color: SLATE5,
    lineHeight: 1.7,
    marginBottom: 6,
  },

  /* ── Location cards ── */
  locationSection: {
    paddingHorizontal: 36,
    paddingTop: 24,
    paddingBottom: 20,
  },
  locationSectionTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: SLATE4,
    letterSpacing: 2.5,
    textAlign: "center",
    marginBottom: 14,
  },
  locationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  locationCard: {
    width: "47%",
    backgroundColor: SLATE1,
    borderLeftWidth: 3,
    borderLeftColor: GOLD,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  locationCardName: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 2,
  },
  locationCardCity: {
    fontSize: 7.5,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },
  locationCardAddress: {
    fontSize: 7,
    color: SLATE5,
    lineHeight: 1.55,
  },

  /* ── Bullet list ── */
  bulletRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  bulletDot: {
    width: 14,
    fontSize: 9,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: SLATE5,
    lineHeight: 1.6,
  },
});

/* ── Sub-components ──────────────────────────────────────────────────────── */

const PageHeader = ({ label = "TRAINING QUOTATION" }: { label?: string }) => (
  <View style={s.header}>
    <View style={s.headerLeft}>
      <Image src={ikaLogoSrc} style={s.headerLogo} />
      <View>
        <Text style={s.headerOrgName}>INTERNATIONAL KNOWLEDGE ACADEMY</Text>
        <Text style={s.headerOrgSub}>FOR TRAINING AND MANAGEMENT DEVELOPMENT</Text>
      </View>
    </View>
    <Text style={s.headerBadge}>{label}</Text>
  </View>
);

const PageFooter = () => (
  <View style={s.footer} fixed>
    <View style={s.footerCol}>
      <Text style={s.footerText}>KL Traders Square, 99, Jalan Gombak</Text>
      <Text style={s.footerText}>53000 Kuala Lumpur, Malaysia</Text>
    </View>
    <View style={s.footerCol}>
      <Text style={s.footerPage} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
    <View style={s.footerColRight}>
      <Text style={s.footerText}>info@ika-edu.com  |  www.ika-edu.com</Text>
      <Text style={s.footerText}>00601139936766  |  00905345699372</Text>
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
  <View style={s.sectionLabelWrap}>
    <Text style={s.sectionLabelText}>{children.toUpperCase()}</Text>
  </View>
);

const BulletItem = ({ text }: { text: string }) => (
  <View style={s.bulletRow}>
    <Text style={s.bulletDot}>•</Text>
    <Text style={s.bulletText}>{text}</Text>
  </View>
);

/* ── Main document ───────────────────────────────────────────────────────── */

const ProgramQuotationPDF = ({ program, locations = [] }: { program: Program; locations?: Location[] }) => {
  const startDate  = formatDate(program.start_date);
  const endDate    = formatDate(program.end_date);
  const objectives = parseLines(program.objectives);
  const audience   = parseLines(program.target_audience);
  const prereqs    = parseLines(program.prerequisites);

  const dateRange   = [startDate, endDate].filter(Boolean).join(" – ") || null;
  const locationStr = program.location
    ? [program.location.name, program.location.city, program.location.country].filter(Boolean).join(", ")
    : null;
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const tableRows = [
    { label: "Training Title",  value: program.name },
    ...(dateRange               ? [{ label: "Date",          value: dateRange }]                              : []),
    ...(locationStr             ? [{ label: "Location",      value: locationStr }]                            : []),
    ...(program.language        ? [{ label: "Language",      value: program.language }]                       : []),
    ...(program.level           ? [{ label: "Level",         value: program.level_display ?? program.level }] : []),
    ...(program.mode            ? [{ label: "Mode",          value: program.mode_display  ?? program.mode  }] : []),
    ...(program.duration        ? [{ label: "Duration",      value: program.duration }]                       : []),
    ...(program.max_participants ? [{ label: "Seats",        value: String(program.max_participants) }]       : []),
    ...(program.contact_email   ? [{ label: "Contact",       value: program.contact_email }]                  : []),
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

        {/* Navy top bar */}
        <View style={s.coverTopBar} />

        {/* White hero block */}
        <View style={s.coverHero}>
          <Image src={ikaLogoSrc} style={s.coverLogo} />
          <Text style={s.coverOrgName}>INTERNATIONAL KNOWLEDGE ACADEMY</Text>
          <Text style={s.coverOrgSub}>FOR TRAINING AND MANAGEMENT DEVELOPMENT</Text>
          {/* Gold divider */}
          <View style={s.coverGoldLine} />
        </View>

        {/* White info area */}
        <View style={s.coverInfo}>
          <Text style={s.coverBadge}>TRAINING QUOTATION</Text>
          <Text style={s.coverTitle}>{program.name}</Text>

          <View style={s.coverMeta}>
            <Text style={s.coverMetaText}>{today}</Text>
            {locationStr && (
              <>
                <View style={s.coverMetaDivider} />
                <View style={s.coverLocationRow}>
                  <View style={s.coverLocationDot} />
                  <Text style={s.coverMetaText}>{locationStr}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Locations */}
        {locations.length > 0 && (
          <View style={s.locationSection}>
            <Text style={s.locationSectionTitle}>OUR LOCATIONS</Text>
            <View style={s.locationGrid}>
              {locations.map((loc) => (
                <View key={loc.uid} style={s.locationCard}>
                  <Text style={s.locationCardName}>{loc.name}</Text>
                  <Text style={s.locationCardCity}>{[loc.city, loc.country].filter(Boolean).join(", ")}</Text>
                  {loc.address ? (
                    <Text style={s.locationCardAddress}>{loc.address}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={s.coverBottomBar} />
      </Page>

      {/* ── Program Details ──────────────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <PageHeader />

        <View style={s.content}>
          <Text style={s.pageTitle}>Program Details</Text>
          <Text style={s.pageSubtitle}>{program.name}</Text>

          <SectionLabel>Overview</SectionLabel>

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
          <PageHeader label="PROGRAM OUTLINE" />

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
